import { useSettingStore } from '@/store'
import LRUCache from '@/utils/lru'

// measureText 缓存
const textWidthCache = new LRUCache<string, number>(10000)
export function getTextWidth(ctx: CanvasRenderingContext2D, text: string): number {
  const font = ctx.font
  const key = font + '::' + text
  const cached = textWidthCache.get(key)
  if (cached !== undefined) {
    return cached
  }
  const width = ctx.measureText(text).width
  textWidthCache.set(key, width)
  return width
}

// 优化后的 fitText，使用二分法截断，支持多行
export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  multiline: boolean = false
): string | string[] {
  // console.debug('fitText', text, maxWidth, maxHeight, multiline)
  // 如果不启用多行模式，保持原有的单行逻辑
  if (!multiline) {
    if (getTextWidth(ctx, text) <= maxWidth) {
      return text
    }
    const ellipsis = '...'
    let left = 0
    let right = text.length
    let res = ellipsis
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      const sub = text.slice(0, mid) + ellipsis
      if (getTextWidth(ctx, sub) <= maxWidth) {
        res = sub
        left = mid + 1
      } else {
        right = mid
      }
    }
    return res
  }

  // 多行模式
  const settingStore = useSettingStore()
  const lineHeight = settingStore.lineHeight
  const maxLines = Math.floor(maxHeight / lineHeight)
  if (maxLines <= 0) {
    return []
  }

  if (maxLines === 1) {
    // 只能显示一行，回退到单行截断逻辑
    return fitText(ctx, text, maxWidth, maxHeight, false) as string
  }
  // 安全的简单情况检查：如果文本很短且能放在一行内，直接返回
  if (text.length <= 50) {
    // 只对短文本进行这个优化
    const totalWidth = getTextWidth(ctx, text)
    if (totalWidth <= maxWidth) {
      return [text]
    }
  }

  const lines: string[] = []
  let currentLine = ''

  // 逐字符处理，支持中英文混合
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const testLine = currentLine + char
    const w = getTextWidth(ctx, testLine)
    if (w <= maxWidth) {
      currentLine = testLine
    } else {
      // 当前行已满，换行
      if (currentLine) {
        lines.push(currentLine)
        currentLine = char
      } else {
        // 单个字符就超宽，强制添加
        lines.push(char)
        currentLine = ''
      }

      // 检查是否已达到最大行数限制
      if (lines.length >= maxLines) {
        break
      }
    }
  }

  // 添加最后一行（如果有内容且未超过行数限制）
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }
  // 如果文字被截断（行数达到限制但还有剩余文字），在最后一行添加省略号
  if (lines.length === maxLines && (currentLine || lines.length * maxWidth < getTextWidth(ctx, text))) {
    const lastLineIndex = lines.length - 1
    const lastLine = lines[lastLineIndex]
    const ellipsis = '...'

    const lastLineWithEllipsis = lastLine + ellipsis
    if (getTextWidth(ctx, lastLine) <= maxWidth) {
      lines[lastLineIndex] = lastLine
    } else if (getTextWidth(ctx, lastLineWithEllipsis) <= maxWidth) {
      // 检查最后一行加上省略号是否超宽
      lines[lastLineIndex] = lastLineWithEllipsis
    } else {
      // 需要截断最后一行来腾出省略号的空间
      let left = 0
      let right = lastLine.length
      let result = ellipsis

      while (left < right) {
        const mid = Math.floor((left + right) / 2)
        const sub = lastLine.slice(0, mid) + ellipsis
        if (getTextWidth(ctx, sub) <= maxWidth) {
          result = sub
          left = mid + 1
        } else {
          right = mid
        }
      }
      lines[lastLineIndex] = result
    }
  }
  return lines
}

// 绘制圆角矩形
export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const minSize = Math.min(w, h)
  if (r > minSize / 2) {
    r = minSize / 2
  }
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// 绘制左侧圆角矩形（右侧直角）
export function roundRectLeft(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const minSize = Math.min(w, h)
  if (r > minSize / 2) {
    r = minSize / 2
  }
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w, y) // 右上角直角
  ctx.lineTo(x + w, y + h) // 右下角直角
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r) // 左下角圆角
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r) // 左上角圆角
  ctx.closePath()
}

// 绘制直线
export function drawLine(ctx: CanvasRenderingContext2D, color: string, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

export const fillText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  align: CanvasTextAlign = 'start',
  baseline: CanvasTextBaseline = 'middle'
) => {
  const settingStore = useSettingStore()
  const theme = settingStore.themeVars
  ctx.font = `${theme.fontSize} ${theme.fontFamily}`
  ctx.fillStyle = theme.textColorBase
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.fillText(text, x, y)
}

// 绘制文本
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string | string[],
  x: number,
  y: number,
  width: number,
  height: number,
  align: CanvasTextAlign = 'start',
  baseline: CanvasTextBaseline = 'middle'
) {
  // 如果是多行文本数组，调用多行绘制函数
  if (Array.isArray(text)) {
    drawMultilineText(ctx, text, x, y, width, height, align, baseline)
    return
  }

  // 单行文本绘制
  fillText(ctx, text, x, y + height / 2, align, baseline)
}

// 绘制多行文本指定行数，超出就...
export function drawMultilineText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  align: CanvasTextAlign = 'start',
  baseline: CanvasTextBaseline = 'middle'
) {
  if (lines.length === 0) {
    return
  }
  const settingStore = useSettingStore()
  const lineHeight = settingStore.lineHeight
  const totalTextHeight = lines.length * lineHeight
  // 计算垂直对齐
  let startY: number
  if (baseline === 'top') {
    startY = y
  } else if (baseline === 'bottom') {
    startY = y + height - totalTextHeight
  } else {
    // middle or default
    startY = y + (height - totalTextHeight) / 2
  }

  // 绘制每一行
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight + lineHeight / 2
    fillText(ctx, line, x, lineY, align, 'middle')
  })
}

const cache = new Map<string, HTMLImageElement>()
export function getIconImg(svgContent: string, name: string, color: string): HTMLImageElement {
  const colorRaw = svgContent.replace(/fill="currentColor"/g, `fill="${color}"`)
  const url = `data:image/svg+xml,${encodeURIComponent(colorRaw)}`
  const key = `${name}-${color}`
  if (cache.has(key)) {
    return cache.get(key)!
  }
  const img = new window.Image()
  img.src = url
  cache.set(key, img)
  return img
}

export function drawIcon(ctx: CanvasRenderingContext2D, icon: HTMLImageElement, x: number, y: number, size: number) {
  if (icon.complete) {
    ctx.drawImage(icon, x, y, size, size)
    return
  }
  useEventListener(
    icon,
    'load',
    () => {
      ctx.save()
      const dpr = window.devicePixelRatio || 1
      ctx.scale(dpr, dpr)
      ctx.drawImage(icon, x, y, size, size)
      ctx.restore()
    },
    { once: true }
  )
}

// ========== 移动端专用工具函数 ==========

// 绘制进度条
export function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  progress: number,
  x: number,
  y: number,
  width: number,
  height: number,
  theme: any
) {
  // 背景
  ctx.fillStyle = theme.borderColor
  ctx.fillRect(x, y, width, height)

  // 进度
  if (progress > 0) {
    ctx.fillStyle = theme.primaryColor
    ctx.fillRect(x, y, width * progress, height)
  }

  // 进度百分比文字
  ctx.fillStyle = theme.textColorBase
  ctx.font = `${parseInt(theme.fontSize) - 2}px ${theme.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const progressText = `${(progress * 100).toFixed(1)}%`
  ctx.fillText(progressText, x + width / 2, y + height / 2)
  ctx.textAlign = 'start'
  ctx.textBaseline = 'top'
}

// 设置文本样式
export function setTextStyle(ctx: CanvasRenderingContext2D, theme: any, fontSize: number = 0, color?: string) {
  const actualFontSize = fontSize || parseInt(theme.fontSize)
  ctx.font = `${actualFontSize}px ${theme.fontFamily}`
  ctx.fillStyle = color || theme.textColorBase
  ctx.textBaseline = 'top'
}
