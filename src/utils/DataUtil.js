import $ from 'jquery'

// cached object
export const DATA = {}

export const SELECTORS_MAP = {
  'HEAD': '#J_HeadData',
  'PAGE': '#J_PageData'
}

export const readData = (key) => {
  // eslint-disable-next-line
  const selector = SELECTORS_MAP[key]

  if (!selector) {
    throw new ReferenceError(`No any selector key: ${key} in SELECTORS_MAP.`)
  }

  // eslint-disable-next-line
  return DATA[key] = $.parseJSON($(selector).text())
}

export const getData = (key = 'PAGE') => {
  if (DATA[key]) {
    return DATA[key] || {}
  } else {
    return readData(key)
  }
}
