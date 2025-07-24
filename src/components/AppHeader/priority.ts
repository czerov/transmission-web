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
