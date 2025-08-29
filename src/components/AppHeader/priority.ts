const priorityMeta = [
  { color: '#FF7F0A', text: '高', key: 1 },
  { color: '#1BA784', text: '正常', key: 0 },
  { color: '#FFC300', text: '低', key: -1 }
]

export const priorityOptions = priorityMeta.map((item) => ({
  label: () =>
    h('div', { class: 'flex items-center' }, [
      h('span', { style: `background:${item.color};width:10px;height:10px;border-radius:50%;margin-right:4px;` }),
      item.text
    ]),
  key: item.key
}))

export const priorityTagColorConfig: Record<string, { color: string; textColor: string; borderColor: string }> = {
  1: {
    color: `color-mix(in srgb, ${priorityMeta[0].color} 50%, transparent)`,
    textColor: priorityMeta[0].color,
    borderColor: `color-mix(in srgb, ${priorityMeta[0].color} 50%, transparent)`
  },
  0: {
    color: `color-mix(in srgb, ${priorityMeta[1].color} 50%, transparent)`,
    textColor: priorityMeta[1].color,
    borderColor: `color-mix(in srgb, ${priorityMeta[1].color} 50%, transparent)`
  },
  '-1': {
    color: `color-mix(in srgb, ${priorityMeta[2].color} 50%, transparent)`,
    textColor: priorityMeta[2].color,
    borderColor: `color-mix(in srgb, ${priorityMeta[2].color} 50%, transparent)`
  }
}
