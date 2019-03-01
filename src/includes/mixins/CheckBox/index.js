import $ from 'jquery'

const noop = $.noop
const extend = $.extend
const isFunction = $.isFunction
const defaults = {
  ele: '.checkbox',
  hoverCls: 'hover',
  activeCls: 'active',
  checkedCls: 'checked',
  disabledCls: 'disabled',
  stopPropagation: false,
  callback: noop
}

const ACTIONS = {
  DEFAULT: 0x00,
  ENTER: 0x01,
  LEAVE: 0x05,
  PRESS: 0x02,
  DISABLED: 0x03,
  CHECKED: 0x04
}

export default class CheckBox {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele } = this.options

    this.$ele = $(ele)
    if (this.$ele[0]._initialized) return

    this.$ele[0]._initialized = true
    this.$ele.get(0)._checkbox = this
    this.bindEvents()
  }

  checkState (state) {
    const { hoverCls, activeCls, checkedCls, disabledCls, callback } = this.options

    switch (state) {
      case ACTIONS.ENTER:
        this.$ele.addClass(hoverCls).removeClass([activeCls, disabledCls].join(' '))
        break
      case ACTIONS.LEAVE:
        this.$ele.removeClass([hoverCls, hoverCls].join(' '))
        break
      case ACTIONS.PRESS:
        this.$ele.addClass(activeCls).removeClass([hoverCls, disabledCls].join(' '))
        break
      case ACTIONS.CHECKED:
        this.$ele.addClass(checkedCls).removeClass([activeCls, hoverCls, disabledCls].join(' '))
        // eslint-disable-next-line
        callback && callback(true)
        break
      case ACTIONS.DISABLED:
        this.$ele.addClass(disabledCls).removeClass([hoverCls, activeCls].join(' '))
        break
      default:
        this.$ele.removeClass([hoverCls, activeCls, disabledCls, checkedCls].join(' '))
        // eslint-disable-next-line
        callback && callback(false)
    }
  }

  bindEvents () {
    const { stopPropagation } = this.options

    this.$ele.on('mousedown', () => {
      if (this.isDisabled()) return
      this.checkState(ACTIONS.PRESS)
    })

    this.$ele.on('mouseenter', () => {
      if (this.isDisabled()) return
      this.checkState(ACTIONS.ENTER)
    })

    this.$ele.on('mouseleave', () => {
      if (this.isDisabled()) return
      this.checkState(ACTIONS.LEAVE)
    })

    this.$ele.on('click', (e) => {
      stopPropagation && e.stopPropagation()

      this.toggle()
    })
  }

  toggle () {
    if (this.isDisabled()) return
    this.state = !this.state

    if (this.state) {
      this.checkState(ACTIONS.CHECKED)
    } else {
      this.checkState(ACTIONS.DEFAULT)
    }
  }

  isDisabled () {
    return this.$ele.hasClass(this.options.disabledCls)
  }
}

$.fn.checkBox = function $checkBox (options = {}) {
  return this.each(function () {
    return new CheckBox(
      isFunction(options) ? {
        ...options,
        callback: options,
        ele: this
      } : {
        ...options,
        ele: this
      }
    )
  })
}

/* $(() => {
  return $('.checkbox').checkBox()
})
 */
