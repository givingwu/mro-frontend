import $, { extend } from 'jquery'
import { debounce } from 'throttle-debounce'

const defaults = {
  el: '.J_FloatBar',
  gap: 40,
  debounce: 300,
  containerWidth: 1200
}

export default class FloatBar {
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
    const { gap, containerWidth } = this.options
    const winWidth = this.$win.width()
    const eleWidth = this.$el.width()

    if (winWidth <= containerWidth + eleWidth + gap) {
      this.$el.css({
        marginLeft: -(winWidth / 2)
      })
    } else {
      this.$el.removeAttr('style')
    }
  }

  bindEvents () {
    this.$win.on('resize', debounce(this.options.debounce, this.initLayout).bind(this))
  }
}
