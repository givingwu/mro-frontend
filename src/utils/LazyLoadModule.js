import $, { noop, extend, isEmptyObject } from 'jquery'
import '../plugins/jquery.inview'
import './ArtTemplate'
import Templates from '../template'

var adBanner = require('assets/image/ad-banner.png')
const config = window.pageConfig || {}
const geneChildren = i =>
  new Array(7)
    .fill(0)
    .map((_, ii) => ({ title: `${i}/${ii}`, desc: `${i}/${ii}` }))

config.tabDataSet = new Array(3)
  .fill(0)
  .map((_, i) => ({ title: i, children: geneChildren(i) }))
config.adBanner = [
  { img: adBanner, title: '云筑智能仓库', href: './ads/iStorage' }
]
config.brands = [
  {
    title: 'Nike/耐克',
    href:
      '//img.alicdn.com/i2/2/TB1t.e1m2DH8KJjy1XcXXcpdXXa?abtest=&pos=1&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.56634.100200300000000_165x5000q100.jpg_.webp'
  },
  {
    title: 'Philips/飞利浦',
    href:
      '//img.alicdn.com/i2/2/TB1hkk0RXXXXXXgXXXXXXXXXXXX?abtest=&pos=2&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.56634.100200300000000_165x5000q100.jpg_.webp'
  },
  {
    title: 'A21',
    href:
      '//img.alicdn.com/i2/2/TB18F9pb29TBuNjy1zbXXXpepXa?abtest=&pos=3&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.56634.100200300000000_165x5000q100.jpg_.webp'
  },
  {
    title: 'T',
    href: '//img.alicdn.com/i2/2/T1tzyoXnd3XXb1upjX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'belulu',
    href:
      '//img.alicdn.com/i2/2/TB1D0sLnHSYBuNjSspiXXXNzpXa?abtest=&pos=5&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.56634.100200300000000_165x5000q100.jpg_.webp'
  },
  {
    title: 'Sefon/臣枫',
    href:
      '//img.alicdn.com/i2/2/TB1lL6xPVXXXXcTXpXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'EVE‘NY/伊芙心悦',
    href:
      '//img.alicdn.com/i2/2/TB1B.inJVXXXXcfXVXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'SUSONGETH/首尚格释',
    href:
      '//img.alicdn.com/i2/2/TB1KFgvIVXXXXX_apXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: '喜马拉雅好声音',
    href:
      '//img.alicdn.com/i2/2/TB1VcxuJVXXXXXEXpXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'SchneiderElectric/施耐德',
    href:
      '//img.alicdn.com/i2/2/TB1ilbUHpXXXXb8XXXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'Crystaluxe',
    href:
      '//img.alicdn.com/i2/2/TB1R08RJFXXXXbFXFXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'aspire（烟具）',
    href:
      '//img.alicdn.com/i2/2/TB1iDgRJpXXXXXbXVXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: 'ENFINITAS/蓝臻',
    href:
      '//img.alicdn.com/i2/2/TB1TJNTPXXXXXcqXVXXSutbFXXX.jpg_165x5000q100.jpg_.webp'
  },
  {
    title: '奔富酒园',
    href:
      '//img.alicdn.com/i2/2/T1X8OBXwhcXXal8NYH_!!0.JPG_165x5000q100.jpg_.webp'
  },
  {
    title: 'UNIVERSITYOFOXFORD',
    href:
      '//img.alicdn.com/i2/2/TB1o7kCcZyYBuNkSnfoXXcWgVXa?abtest=&pos=15&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.56634.100200300000000_165x5000q100.jpg_.webp'
  },
  {
    title: '布朗天使',
    href:
      '//img.alicdn.com/i2/2/TB1FgqknYGYBuNjy0FoXXciBFXa?abtest=&pos=16&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.56634.100200300000000_165x5000q100.jpg_.webp'
  }
]

const defaults = {
  el: '.J_LazyModule',
  activeCls: 'active',
  disabledCls: 'yzw-shell',
  soOpts: {},
  dataKey: '',
  template: '',
  dom: false,
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
    const config = window.pageConfig || {}

    if (!isEmptyObject(config)) {
      return config[this.getDataKey()]
    }

    return null
  }

  getDataKey () {
    const key =
      this.options.dataKey || this.$el.data('key') || this.$el.attr('data-key')

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
