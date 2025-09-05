export function getSelectIds(ids?: number[], selectedKeys?: number[]) {
  let idsResult: number[] = []
  if (ids?.length && selectedKeys?.length) {
    if (ids.length === 1 && selectedKeys.includes(ids[0])) {
      idsResult = selectedKeys
    } else {
      idsResult = ids
    }
  } else if (ids?.length && !selectedKeys?.length) {
    idsResult = ids
  } else if (!ids?.length && selectedKeys?.length) {
    idsResult = selectedKeys
  }
  // console.debug('select IDs: ', idsResult)
  return idsResult
}
