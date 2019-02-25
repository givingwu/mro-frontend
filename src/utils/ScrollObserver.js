import $, { extend, isObject, isNumeric, noop } from 'jquery'
import { debounce, throttle } from 'throttle-debounce'

let uid = 0
const defaults = {
  debounce: 0,
  throttle: 0,
  el: '.J_ScrollObserver',
  base: window,
  trigger: 'always', // String<'always' | 'scroll-in' | 'scroll-out'>
  pos: null, // Object<{ x: Number!, y: Number! }>
  manual: false, /// observe manually
  callback: noop // Function
}

const TRIGGERS = {
  ALWAYS: 0x00,
  SCROLL_IN: 0x01,
  SCROLL_OUT: 0x02
}

export default class ScrollObserver {
  constructor (options) {
    // super()
    this.options = extend({}, defaults, options)
    const { el, pos, base, manual } = this.options

    this.$el = $(el)
    this.$base = $(base)

    this.pos = this._geneEleBounding(this.$el, pos)
    this.eventName = this._geneEventName()
    !manual && this.observe()
  }

  /**
   * 注册 Observer 的 Listener
   * @param {JQuery!} $el
   * @param {Function!}
   * @param {Object<{x: 0, y: 0}> | Number}?> pos
   */
  _geneEleBounding ($el, pos) {
    /* eslint-disable-next-line */
    let x = 0, y = 0

    if (isObject(pos)) {
      x = pos.x
      y = pos.y
    } else if (isNumeric(pos)) {
      x = pos
    }

    if (!isNumeric(x)) {
      x = $el.offset().top
    }

    if (!isNumeric(y)) {
      y = $el.offset().left
    }

    return { x, y }
  }

  observe () {
    const { debounce: debounceTime, throttle: throttleTime } = this.options
    let handleScroll = this._handleScroll.bind(this)

    if (debounceTime) {
      handleScroll = debounce(debounceTime, handleScroll)
    } else if (throttle) {
      handleScroll = throttle(throttleTime, handleScroll)
    }

    this.$base.on(this.eventName, handleScroll)
  }

  destroy() {
    if (this.eventName) {
      this.$base.off(this.eventName)
    }
  }

  _geneEventName () {
    return ['scroll', ++uid].join('.')
  }

  _handleScroll(e) {
    const { trigger, callback } = this.options
    const $target = $(e.target)
    const x = $target.scrollTop()
    const y = $target.scrollLeft()

    if (trigger === TRIGGERS.ALWAYS) {
      callback({ x, y }, this.$el, e)
    } else if (trigger === TRIGGERS.SCROLL_IN) {
      if (x >= x || y >= y) {
        callback({ x, y }, this.$el, e)
      }
    } else if (trigger === TRIGGERS.SCROLL_OUT) {
      if (x < x || y < y) {
        callback({ x, y }, this.$el, e)
      }
    }
  }
}

$.fn.ScrollObserver = function $ScrollObserver (options) {
  return this.each(function () {
    return new FloatBar({
      ...options,
      ele: this
    })
  })
}
