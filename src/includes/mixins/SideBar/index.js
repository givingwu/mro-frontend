import $, { extend } from 'jquery'
import { debounce } from 'throttle-debounce'

const defaults = {
  el: '.J_SideBar',
  gap: 30,
  go2top: '.J_BackTop',
  qrcode: '.J_QRCode',
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

    this.initLayout()
    this.bindEvents()
    console.log(this);
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
    const { durationTime, debounceTime } = this.options

    this.$win.on('resize', debounce(debounceTime, this.initLayout).bind(this))
    this.$go2top.click(() => {
      this.go2topWithAnimate()
    })
  }

  go2topWithAnimate () {
    $('html').animate({ scrollTop: 0 }, durationTime)
  }
}

$.fn.initSideBar = function $initSideBar (options = {}) {
  return this.each(function () {
    return new SideBar({
      ...options,
      ele: this
    })
  })
}
