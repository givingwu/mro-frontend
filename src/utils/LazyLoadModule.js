import $, { noop, extend, isEmptyObject } from 'jquery'
import '../plugins/jquery.inview'
import './ArtTemplate'
import Templates from '../template'
import { getData } from './DataUtil'

const defaults = {
  el: '.J_LazyModule',
  activeCls: 'yzw-loaded',
  disabledCls: 'yzw-shell',
  dataKey: '',
  template: '',
  callback: noop
}

/* .J_LazyModule */
export default class LazyLoadModule {
  constructor (options) {
    this.options = extend({}, defaults, options)
    this.$el = $(this.options.el)
    this.data = this.getData()

    const template = this.getTemplate()

    if (typeof template === 'string') {
      this.template = template
    } else {
      this.template = template.template
      this.initialize = template.initialize
    }

    this.bindEvents()
  }

  bindEvents () {
    this.$el.one('inview', () => {
      this.install()
    })
  }

  install () {
    const { activeCls, disabledCls, callback } = this.options

    try {
      let html =
        window.template &&
        window.template.render(this.template, {
          data: this.data || {}
        })

      if (html) {
        this.$el
          .html(html)
          .removeClass(disabledCls)
          .addClass(activeCls)
        this.initialize && this.initialize()
        // eslint-disable-next-line
        callback && callback(this)
      }
    } catch (e) {
      throw new Error(e)
    } finally {
      // clean memory on JS heap
      this.lazyLoaded = true
    }
  }

  getTemplate () {
    return Templates[this.getTplKey()]
  }

  getData () {
    const DATA = getData('PAGE')
    console.log('DATA: ', DATA)
    const index = this.options.index ||
      this.$el.data('index') ||
      this.$el.attr('data-index')

    if (!isEmptyObject(DATA)) {
      let data = DATA[this.getDataKey()]

      if (index !== undefined && !isNaN(index)) {
        data = data[index]
      }

      return data
    }

    return null
  }

  getDataKey () {
    const key = this.options.dataKey ||
      this.$el.data('key') ||
      this.$el.attr('data-key')

    if (!key) {
      throw new ReferenceError(`key cannot be type like ${typeof key}`)
    }

    return key
  }

  getTplKey () {
    const tpl =
      this.options.template ||
      this.$el.data('template') ||
      this.$el.attr('data-template')

    if (!tpl) {
      throw new ReferenceError(
        `template cannot be type like ${typeof template}`
      )
    }

    return tpl
  }
}

$.fn.initLazyModule = function $initLazyModule (options = {}) {
  return this.each(function () {
    return new LazyLoadModule({
      ...options,
      el: this
    })
  })
}
