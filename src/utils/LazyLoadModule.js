import $, { noop, extend, isEmptyObject } from 'jquery'
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
  template: '',
  dom: false,
  callback: noop
}

const config = window.pageConfig || {}
const geneChildren = (i) => new Array(7).fill(0).map((_, ii) => ({ title: `${i}/${ii}`, desc: `${i}/${ii}` }))
config.tabDataSet = new Array(3).fill(0).map((_, i) => ({ title: i, children: geneChildren(i) }))

/* .J_LazyModule */
export default class LazyLoadModule {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, soOpts } = this.options

    this.$el = $(el)
    this.relative = this.getRelative()
    this.lazyComponent = templates[this.getTplKey()]

    // eslint-disable-next-line
    this.so = new ScrollObserver({
      ...soOpts,
      always: false,
      el: this.$el,
      relative: this.relative,
      callback: this.callLazyInstall.bind(this)
    })
  }

  callLazyInstall (instance) {
    const { state } = instance

    if (state > 0) {
      try {
        let html = window.template && window.template.render(
          this.lazyComponent.template, {
            data: this.getData()
          }
        )

        if (html) {
          this.$el.html(html)
          this.lazyComponent.initialize()
          this.options.callback(this.$el)
        }
      } catch (e) {
        throw new Error(e)
      } finally {
        // clean memory on JS heap
        this.so && this.so.unobserve()
        this.dom && this.dom.remove()

        this.dom = null
        this.so = null
        this.data = null
      }
    }
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

  /* geneTplDOM () {
    const key = this.getTplKey()
    const tpl = templates[key]
    const DOM = document.createElement('script')

    DOM.id = key
    DOM.innerHTML = tpl
    DOM.setAttribute('type', 'text/html')
    document.body.appendChild(DOM)

    return DOM
  } */
}
