import $, { extend } from 'jquery'
import { debounce } from 'throttle-debounce'

const defaults = {
  el: '.J_SideBar',
  gap: 30,
  go2top: '.J_BackTop',
  debounce: 300,
  containerWidth: 1200
}

export default class SideBar {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el } = this.options

    this.$win = $(window)
    this.$el = $(el)

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
    this.$win.on('resize', debounce(this.options.debounce, this.initLayout).bind(this))
  }
}
