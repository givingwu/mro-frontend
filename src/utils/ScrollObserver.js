import $, { extend, isEmptyObject, isNumeric, noop } from 'jquery'
import { debounce, throttle } from 'throttle-debounce'

let uid = 0
const defaults = {
  debounce: 0,
  throttle: 0,
  el: null, /* .J_ScrollObserver */
  base: window,
  /* true: 一旦滚动，就会触发
     false: 仅通过 滚动触发器 TRIGGERS 触发回调 */
  always: false,
  trigger: 0,
  init: true,
  pos: null, // Object<{ x: Number!, y: Number! }>
  manual: false, /// observe manually
  callback: noop // Function
}

const TRIGGERS = {
  SCROLL_OUT: -1,
  DEFAULT: 0,
  SCROLL_IN: 1
}

export default class ScrollObserver {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, pos, base, manual, init } = this.options

    if (!el) {
      throw new ReferenceError(`options.el cannot be ${el}!`)
    }

    this.$el = $(el)
    this.$base = $(base)

    this.w = this.$el.width()
    this.h = this.$el.height()

    this.state = TRIGGERS.DEFAULT // default state: 0
    this.pos = this._geneEleBounding(this.$el, pos)
    this.eventName = this._geneEventName()

    // 初始化节点就开始坚持滚动状态
    init && this.checkState(this.$base)
    // 是否自行手动开启 $base 元素的 scroll 监听
    !manual && this.observe()
  }

  checkState ($target) {
    const { x: posX, y: posY, trigger } = this.pos
    const x = $target.scrollLeft()
    const y = $target.scrollTop()
    let state = TRIGGERS.DEFAULT
    let offset = {
      x: 0,
      y: 0
    }

    if (x >= posX || y >= posY) {
      state = TRIGGERS.SCROLL_IN
      offset = {
        x: x - posX,
        y: y - posY
      }
    } else if (x < posX || y < posY) {
      state = TRIGGERS.SCROLL_OUT
      offset = {
        x: x - posX,
        y: y - posY
      }
    }

    if (this.options.always || !trigger) {
      this.options.callback.call(this, offset, state)
    } else {
      if (state && this.state !== state) {
        this.state = state

        if (trigger) {
          if (state === trigger) {
            this.options.callback.call(this, offset, state)
          }
        } else {
          this.options.callback.call(this, offset, state)
        }
      }
    }
  }

  observe () {
    const { debounce: debounceTime, throttle: throttleTime } = this.options
    let handleScroll = this._handleScroll.bind(this)

    if (debounceTime) {
      handleScroll = debounce(debounceTime, true, handleScroll)
    } else if (throttle) {
      handleScroll = throttle(throttleTime, handleScroll)
    }

    this.$base.on(this.eventName, handleScroll)
  }

  unobserve () {
    if (this.eventName) {
      this.$base.off(this.eventName)
    }
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
    }

    if (!isNumeric(x) || !x) {
      x = $el.offset().left
    }

    if (!isNumeric(y) || !y) {
      y = $el.offset().top
    }

    return { x, y }
  }

  _handleScroll (e) {
    this.checkState($(e.target))
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
