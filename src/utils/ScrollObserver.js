import $, { extend, isEmptyObject, isNumeric, noop } from 'jquery'
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

    if (!isEmptyObject(pos)) {
      x = pos.x
      y = pos.y
    } else if (isNumeric(pos)) {
      x = pos
    }

    if (!isNumeric(x)) {
      x = $el.offset().left
    }

    if (!isNumeric(y)) {
      y = $el.offset().top
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

  destroy () {
    if (this.eventName) {
      this.$base.off(this.eventName)
    }
  }

  _handleScroll (e) {
    const { trigger, callback } = this.options
    const $target = $(e.target)
    const x = $target.scrollLeft()
    const y = $target.scrollTop()
    let call = false

    if (trigger === TRIGGERS.ALWAYS) {
      call = true
    } else if (trigger === TRIGGERS.SCROLL_IN) {
      if (x >= this.pos.x || y >= this.pos.y) {
        call = true
      }
    } else if (trigger === TRIGGERS.SCROLL_OUT) {
      if (x < this.pos.x || y < this.pos.y) {
        call = true
      }
    }

    // eslint-disable-next-line
    call && callback({ x, y }, this.$el, e)
  }

  _geneEventName () {
    return ['scroll', ++uid].join('.')
  }
}

$.fn.ScrollObserver = function $ScrollObserver (options) {
  return this.each(function () {
    return new ScrollObserver({
      ...options,
      el: this
    })
  })
}
