import { callRpc, type TorrentAddArgs } from './rpc'

export const trpc = {
  // 获取会话信息
  sessionGet: () => callRpc('session-get'),
  // 设置会话参数
  sessionSet: (args: object) => callRpc('session-set', args),
  // 获取种子列表/详情
  torrentGet: (fields: string[] = [], ids?: number[] | number) =>
    callRpc('torrent-get', {
      fields,
      ...(ids ? { ids } : {})
    }),
  // 添加种子
  torrentAdd: (args: TorrentAddArgs) => callRpc('torrent-add', args),
  // 删除种子
  torrentRemove: (ids: number[] | number, deleteData = false) =>
    callRpc('torrent-remove', {
      ids,
      'delete-local-data': deleteData
    }),
  // 开始下载
  torrentStart: (ids: number[] | number) => callRpc('torrent-start', { ids }),
  // 暂停下载
  torrentStop: (ids: number[] | number) => callRpc('torrent-stop', { ids }),
  // 修改种子属性
  torrentSet: (args: object) => callRpc('torrent-set', args),
  // 强制重新 announce
  torrentReannounce: (ids: number[] | number) => callRpc('torrent-reannounce', { ids }),
  // 查询剩余空间
  freeSpace: (path: string) => callRpc('free-space', { path }),
  // 更新 blocklist
  blocklistUpdate: () => callRpc('blocklist-update'),
  // 全局状态统计
  sessionStats: () => callRpc('session-stats')
}
