import $ from 'jquery'
import { debounce } from 'throttle-debounce'
import ScrollObserver from '../../../utils/ScrollObserver'

// const noop = $.noop
const extend = $.extend
// const isFunction = $.isFunction
const defaults = {
  el: '.J_SideBar',
  gap: 30,
  go2top: '.J_BackTop',
  qrcode: '.J_QRCode',
  scrollWrapper: '.J_HomeContent',
  debounceTime: 300,
  durationTime: 300,
  containerWidth: 1200
}

export default class SideBar {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, go2top, qrcode } = this.options

    this.$win = $(window)
    this.$el = $(el)
    this.$go2top = $(el).find(go2top)
    this.$qrcode = $(el).find(qrcode)

    this.initScrollObserver()
    this.initLayout()
    this.bindEvents()
  }

  initScrollObserver () {
    const { scrollWrapper } = this.options

    this.so = new ScrollObserver({
      el: this.$el,
      always: true,
      throttle: 50,
      relative: scrollWrapper,
      callback: (instance) => {
        const { offset: { y }, eh, rh } = instance
        const maxTop = rh - eh - 40 /* padding-bottom */ - 20 /* top */ - 2 /* border */

        if (y >= -20) {
          if (y < maxTop) {
            this.$el.css({
              position: 'fixed',
              top: 20
            })
          } else {
            this.$el.css({
              position: 'absolute',
              top: maxTop
            })
          }
        } else {
          this.$el.css({
            position: 'absolute',
            top: 20,
            bottom: 'auto'
          })
        }
      }
    })
  }

  initLayout () {
    const winWidth = this.$win.width()
    const eleWidth = this.$el.width()
    const containerWidth = this.options.containerWidth

    if (winWidth <= containerWidth + eleWidth + this.options.gap) {
      const left = winWidth / 2 - eleWidth

      this.$el.css({
        marginLeft: left
      })
    } else {
      this.$el.removeAttr('style')
    }
  }

  bindEvents () {
    const { debounceTime } = this.options

    this.$win.on('resize', debounce(debounceTime, this.initLayout).bind(this))
    this.$go2top.click(() => {
      this.go2topWithAnimate()
    })
  }

  go2topWithAnimate () {
    $('html').animate({ scrollTop: 0 }, this.options.durationTime)
  }
}

$.fn.initSideBar = function $initSideBar (options = {}) {
  return this.each(function () {
    return new SideBar({
      ...options,
      el: this
    })
  })
}
