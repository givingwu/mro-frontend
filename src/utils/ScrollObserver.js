import $, { extend, isEmptyObject, isNumeric, noop } from 'jquery'
import { debounce, throttle } from 'throttle-debounce'

let uid = 0
const defaults = {
  debounce: 0,
  throttle: 0,
  el: null, /* .J_ScrollObserver */
  base: window,
  relative: null,
  /* true: 一旦滚动，就会触发
     false: 仅通过 滚动触发器 TRIGGERS 触发回调 */
  always: false,
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
    const { el, pos = {}, base, relative, manual, init } = this.options

    if (!el) {
      throw new ReferenceError(`options.el cannot be ${el}!`)
    }

    this.$el = $(el)
    this.$base = $(base)
    this.ew = this.$el.width()
    this.eh = this.$el.height()
    this.eventName = this._geneEventName()

    if (relative) {
      this.$relative = $(relative)
      this.rw = this.$relative.width()
      this.rh = this.$relative.height()
    }

    this.state = TRIGGERS.DEFAULT // default state: 0
    this.pos = this._geneEleBounding(relative ? this.$relative : this.$el, pos) || {}

    let offsetReady = false
    if (this.pos.x || this.pos.y) {
      offsetReady = true
    }

    // 初始化节点就开始监听滚动状态
    init && this.checkState(relative ? this.$relative : this.$base)
    // 是否自行手动开启 $base 元素的 scroll 监听
    !manual && offsetReady && this.observe()
  }

  checkState ($target) {
    const { callback, always } = this.options
    const { x: posX, y: posY } = this.pos
    const x = $target.scrollLeft()
    const y = $target.scrollTop()
    let state = TRIGGERS.DEFAULT

    if ((x && x >= posX) || (y && y >= posY)) {
      state = TRIGGERS.SCROLL_IN
    } else if ((x && x < posX) || (y && y < posY)) {
      state = TRIGGERS.SCROLL_OUT
    }

    this.offset = {
      x: x - posX,
      y: y - posY
    }

    // console.log(this.eventName, 'always: ', always, x, posX, y, posY)

    if (always) {
      /* 对于 always 的滚动回调来说，offset 更常用  */
      // eslint-disable-next-line
      callback(this, this.state = state)
    } else {
      /* 对于 scroll-in/out 的滚动回调来说，state of scroll-in/out 更常用  */
      if (this.state !== state) {
        // eslint-disable-next-line
        callback(this, this.state = state)
      }
    }
  }

  /**
   * 注册 Observer 的 Listener
   * @param {JQuery!} $el
   * @param {Function!}
   * @param {Object<{x: 0, y: 0}> | Number}?> pos
   */
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

  _inView ($el) {}

  _geneEleBounding ($el, pos) {
    /* eslint-disable-next-line */
    let x = 0, y = 0

    if (!isEmptyObject(pos) && (pos.x || pos.y)) {
      return pos
    }

    if ($el && $el.length) {
      if (!isNumeric(x) || !x) {
        x = $el.offset().left
      }

      if (!isNumeric(y) || !y) {
        y = $el.offset().top
      }
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
