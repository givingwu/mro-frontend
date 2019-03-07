import $ from 'jquery'

// cached object
const DATA = {}

const SELECTORS_MAP = {
  'HEAD': '#J_HeadData',
  'PAGE': '#J_PageData'
}

export const DATA_KEY_MAP = {
  'HEAD': 'HEAD',
  'PAGE': 'PAGE'
}

export const readData = (key) => {
  // eslint-disable-next-line
  const selector = SELECTORS_MAP[key]

  if (!selector) {
    throw new ReferenceError(`No any selector key: ${key} in SELECTORS_MAP.`)
  } else {
    const $ele = $(selector)
    const text = $ele.text()
    let json = {}

    try {
      json = $.parseJSON(text)
    } catch (e) {
      console.log(key, selector)
      console.error(e)
    } finally {
      $ele.remove()
    }

    DATA[key] = json
  }

  return DATA[key]
}

readData(DATA_KEY_MAP.HEAD)
readData(DATA_KEY_MAP.PAGE)

export const getData = (key = DATA_KEY_MAP.PAGE) => {
  if (DATA[key]) {
    return DATA[key] || {}
  } else {
    return readData(key)
  }
}
