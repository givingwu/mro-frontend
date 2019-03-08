import $, { extend } from 'jquery'
import { debounce } from 'throttle-debounce'
import ScrollObserver from '../../../utils/ScrollObserver'

const defaults = {
  el: '.J_FloorBar',
  gap: 40,
  debounce: 300,
  containerWidth: 1200,
  scrollWrapper: '.J_Floors'
}

export default class FloorBar {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el } = this.options

    this.$win = $(window)
    this.$el = $(el)

    this.initScrollObserver()
    this.initLayout()
    this.bindEvents()
    console.log(this)
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
        const maxTop = rh - eh - 40 /* padding-bottom */ - 90 /* top */ - 0 /* border */

        if (y >= 0) {
          if (y < maxTop) {
            this.$el.css({
              position: 'fixed',
              top: 90
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
            top: 90,
            bottom: 'auto'
          })
        }
      }
    })
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

$.fn.initFloorBar = function $floorBar (options = {}) {
  return this.each(function () {
    return new FloorBar({
      ...options,
      el: this
    })
  })
}
