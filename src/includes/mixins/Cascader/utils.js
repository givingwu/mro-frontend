/* eslint-disable */
let dataSet = []
export async function queryAddress (id, index, compareKey = 'value') {
  if (!id) return
  if (!dataSet.length) {
    const lazy = await import('./data')
    dataSet = lazy.default
  }

  const vals = []
  let data = [ ...dataSet ]
  let i = 0
  let isSame = false

  while (data && data.length && i < data.length && !isSame) {
    const item = (data[i] || {})
    const { label, value, children = [] } = item
    const similar = String(id).startsWith(item[compareKey])
    isSame = +id === +(item[compareKey])

    if (similar) {
      vals.push({
        data: [ ...data.map(item => ({
          ...item,
          children: null
        }))],
        label,
        value,
        index: i
      })

      data = children
      i = 0
    } else {
      i++
    }
  }

  console.log('vals: ', vals, 'index: ', index)
  return vals
}

/**
 * filterRegionsByStr
 * @param  {Array<Region<T>>}  [area=regions]
 * @param  {Array<string> | Array<number> | string} str
 * @param  {Array}  [values=[]]
 * @param  {Array<'label' | 'value'>}
 * @return {Array}
 * @example
 *  getValByStr(regions, "北京 县 县"])
 *  getValByStr(regions, ["北京", "县"])
 *  getValByStr(regions, ["北京", "县", "密云"]) // [{ Region<Province> }, { Region<City> }, { Region<Area> }]
 *  getValByStr(regions, ["11 1101 110101"])
 *  getValByStr(regions, ["11"])
 *  getValByStr(regions, ["11", "1101", "110101"]) // [{ Region<Province> }, { Region<City> }, { Region<Area> }]
 */
export const getValByStr = function filterAreaByStr(
  area = [],
  str = '',
  compareKey = 'label'
) {
  if (!area.length || !str) return
  const keys = (Array.isArray(str) ? str : str.split(/\s/)).slice(0, 3)

  if (!keys.length) return
  const vals = []

  let i = 0, j = 0
  while (vals.length < keys.length && j < keys.length) {
    if (i >= area.length) break
    const item = (area[i] || {})
    const { label, value, children = [] } = item
    const key = keys[j]
    const isSame = item[compareKey] && key && key === item[compareKey]

    if (isSame) {
      vals.push({
        children: children,
        data: area,
        label,
        value,
        index: i
      })
    }

    if (isSame) {
      area[i].active = true
      area = children
      j++
      i = 0
    } else {
      area[i].active = false
      i++
    }
  }

  return vals
}

