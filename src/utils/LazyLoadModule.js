import $, { extend } from 'jquery'
import ScrollObserver from './ScrollObserver'
import template from './ArtTemplate'

const defaults = {
  el: '.J_LazyModule'
}

/* .J_LazyModule */
export default class LazyLoadModule {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, soOpts, template } = this.options

    this.$el = $(el)
    this.data = (window.pageConfig || {})[this.getDataKey()]
    this.template = template

    // eslint-disable-next-line
    this.so = new ScrollObserver({
      ...soOpts,
      el: this.$el,
      trigger: 1, /* scroll-in */
      callback: this.callLazyInstall
    })
  }

  getDataKey () {
    return this.options.dataKey || this.$el.attr('data-key')
  }

  callLazyInstall () {
    try {
      this.$el.html(this.template, this.data)
    } catch (e) {

    }
  }
}
