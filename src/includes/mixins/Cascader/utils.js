/* eslint-disable */
export async function getMapDataSet() {
  let mapDataSet = (window.config || {}).mapDataSet || []

  if (!mapDataSet || !mapDataSet.length) {
    mapDataSet = await import('./data')
    return mapDataSet
  } else {
    return {
      default: mapDataSet
    }
  }
}


/**
 * filterRegionsByStr
 * @param  {Array}  [area=regions]
 * @param  {Array<String> | String} str
 * @param  {Array}  [values=[]]
 * @return {Array}
 * @example
 *  getValByStr(regions, ["北京", "县", "密云"])  // ["11", "1102", "110228"]
 */
export const getValByStr = function filterAreaByStr(area = [], str = '') {
  if (!area.length || !str) return
  const keys = (Array.isArray(str) ? str : str.split(/\s/)).slice(0, 3)

  if (!keys.length) return
  const vals = []

  let i = 0, j = 0
  while (vals.length < keys.length && j < keys.length) {
    if (i >= area.length) break
    let { label, value, children = [] } = (area[i] || {})
    let key = keys[j]
    const isSameLabel = label && key && key === label

    if (isSameLabel) {
      vals.push({
        data: area,
        label,
        value,
        index: i
      })
    }

    if (isSameLabel) {
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


/**
 * filterRegionsByCode
 * @param  {Array}  [area=regions]
 * @param  {Array<Number> | String} val
 * @param  {Array}  [values=[]]
 * @return {Array}
 * @example
 *  getStrByVal(regions, '110228')   // ["北京", "县", "密云"]
 */
export const getStrByVal = function filterRegionsByCode(area = [], val = '') {
  if (!area.length || !val) return
  const vals = (Array.isArray(val) ? val : val.split(/\s/)).slice(0, 3)

  if (!vals.length) return
  const keys = []

  let i = 0, j = 0
  while (keys.length < vals.length && j < vals.length) {
    if (i >= area.length) break
    let { label, value, children = [] } = (area[i] || {})
    let key = vals[j]
    const isSameValue = label && key && key === label

    if (isSameValue) {
      keys.push({
        data: area,
        label,
        value,
        index: i
      })
    }

    if (isSameValue) {
      area = children
      j++
      i = 0
    } else {
      i++
    }
  }

  return keys
}
