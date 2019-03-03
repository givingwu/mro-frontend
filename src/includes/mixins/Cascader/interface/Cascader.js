import $ from 'jquery'
import CacheStack from './CacheStack'
import Tab from '../../Tab'
import { queryAddress } from '../utils'
import TreePanel from './TreePanel'
import API from '../../../../utils/api'

const noop = $.noop
const extend = $.extend
const isFunction = $.isFunction

$.fn.initCascader = function $Cascader (options = {}) {
  return this.each(function () {
    return new Cascader(
      isFunction(options) ? {
        ...options,
        callback: options,
        el: this
      } : {
        ...options,
        el: this
      }
    )
  })
}

const defaults = {
  el: '.J_Cascader',
  value: '',
  panelHd: '.cascader-panel-hd',
  panelBd: '.cascader-panel-bd',
  apiMethod: '', // 'get /api/query/address queryAddress',

  hideCls: 'hide',
  activeCls: 'active',
  disabledCls: 'active',

  panelHdTpl: `<a class="J_TabItem" title=""></a>`,
  callback: noop
}

export default class Cascader {
  constructor (options) {
    this.options = extend({}, defaults, options)

    const {
      el,
      panelHd,
      panelBd,
      value = '',
      cachePoolLength = 10
    } = this.options

    this.$el = $(el)
    this.$panelHd = this.$el.find(panelHd)
    this.$panelBd = this.$el.find(panelBd)

    this.state = {
      visible: false,
      value,
      data: [],
      activeIndex: -1
    }
    this.cachedPool = new CacheStack(cachePoolLength)
    this.panels = []
    value && this.loadData(value, -1)
  }

  setState (state) {
    this.state = {
      ...this.state,
      ...state
    }
  }

  loadData (id, index) {
    console.log('loadData (id, index): ', id, index)
    const { apiMethod } = this.options
    const request = apiMethod ? API[apiMethod] : queryAddress

    id && request && request(id, index)
      .then(data => {
        /* 👨‍ 初始状态，index 为 -1 */
        this.setState({
          data: this.state.data.slice(0, index + 1).concat(data),
          activeIndex: data.length - 1
        })
        this.updatePanels(data)
        // this.updateLayout(this.state, id, index)
      })
      .catch(console.error)
  }

  updatePanels (data) {
    const { panelHdTpl } = this.options

    data.forEach(({
      data: children, /* rename data to children */
      ...activeItem /* { label: activeItem.label, value: activeItem.value, index: activeItem.index } */
    }, index) => {
      const panel = new TreePanel({
        tabIndex: index,
        lazyload: this.loadData,
        state: {
          ...activeItem,
          children
        }
      })

      this.panels.push(panel)
      this.$panelHd.append($(panelHdTpl).text(panel.state.label))
      this.$panelBd.append(panel.render())
    })

    this.updateTab()
  }

  updateTab () {
    // initialize tab toggle events within this.$panelHd
    this.$tab = new Tab({
      ele: this.$el,
      currentIndex: this.state.activeIndex || 0
    })
  }
}
