import $, { extend, isEmptyObject } from 'jquery'
import ScrollObserver from './ScrollObserver'
// It does not support ES6 module.
// but it registers a global env variable `template`
import './ArtTemplate'
import templates from './templates'

const defaults = {
  el: '.J_LazyModule',
  relative: '',
  soOpts: {},
  dataKey: '',
  template: ''
}
const config = window.pageConfig || {}
config.tabDataSet = [{
  title: '1',
  children: [{
    title: 1,
    desc: 1
  }]
}]

/* .J_LazyModule */
export default class LazyLoadModule {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, soOpts } = this.options

    this.$el = $(el)
    this.relative = this.getRelative()
    this.dom = this.geneTplDOM()

    // eslint-disable-next-line
    this.so = new ScrollObserver({
      ...soOpts,
      always: false,
      el: this.$el,
      relative: this.relative,
      callback: this.callLazyInstall.bind(this)
    })

    console.log(this)
  }

  callLazyInstall (instance) {
    const { state } = instance
    console.log(state)

    if (state > 0) {
      try {
        this.$el.html(window.template && window.template.render(this.dom, this.getData()))
      } catch (e) {
        console.log(e)
      } finally {
        this.so.unobserve()
        this.dom.remove()
      }
    }
  }

  geneTplDOM () {
    const key = this.getTplKey()
    const tpl = templates[key]
    const DOM = document.createElement('script')

    DOM.id = key
    DOM.innerHTML = tpl
    DOM.setAttribute('type', 'text/html')
    document.body.appendChild(DOM)

    return DOM
  }

  getRelative () {
    const base = this.options.relative || this.$el.attr('data-relative')

    if (!base) {
      throw new ReferenceError(`base cannot be type like ${typeof base}`)
    }

    return base
  }

  getData () {
    const config = window.pageConfig || {}

    if (!isEmptyObject(config)) {
      return config[this.getDataKey()]
    }

    return null
  }

  getDataKey () {
    const key = this.options.dataKey || this.$el.attr('data-key')

    if (!key) {
      throw new ReferenceError(`key cannot be type like ${typeof key}`)
    }

    return key
  }

  getTplKey () {
    const tpl = this.options.template || this.$el.attr('data-template')

    if (!tpl) {
      throw new ReferenceError(`template cannot be type like ${typeof template}`)
    }

    return tpl
  }
}
