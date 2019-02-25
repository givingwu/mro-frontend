import $, { extend, isString, isArray, isNumeric, isFunction, isEmptyObject, noop } from 'jquery'
import { getMapDataSet, getValByStr } from './utils'
import Tab from '../Tab'

const defaults = {
  el: '.J_Cascader',
  parentItem: '.J_TabItem',
  childrenItem: '.J_TabCont',
  panel: '.J_CascaderPanel',
  data: [], // address data ['北京'?, '东城区'?, '主城区'?] or [11?, 1101?, 110101?]

  hideCls: 'hide',
  activeCls: 'active',
  disabledCls: 'active',
  childPanelCls: 'panel',

  panelHeadItemTpl: `<a class="J_TabItem" title=""></a>`,
  panelBodyTpl: `<div class="panel"></div>`,
  panelBodyItemTpl: `<a></a>`,

  mapDataSet: [],
  callback: noop
}

const PANEL_INDEX = {
  PROVINCE: 0,
  CITY: 1,
  AREA: 2
}

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
// const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

class AddressCascader {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, data, parentItem, childrenItem } = this.options

    this.$doc = $(document)
    this.$el = $(el)
    this.$parentItems = this.$el.find(parentItem)
    this.$childrenItems = this.$el.find(childrenItem)
    this._cachedElements = {}

    this.$tab = new Tab({
      ele: '.J_CascaderTab',
      currentIndex: data.length ? data.length - 1 : 0
      //, callback: (index) => { this.currentIndex = index }
    })

    getMapDataSet()
      .then(({ default: data }) => {
        this.options.mapDataSet = data
        const { data: val } = this.options

        if (val.length >= 3) {
          this.val = val.slice(0, 3)
        }

        this.currentValue = isNaN(+this.val.join(' ')) ? getValByStr(data, this.val) : this.val || []
        this.checkState(this.currentValue)
        this.bindEvents()

        console.log(this)
      }).catch(
        console.error
      )
  }

  checkState (value) {
    const [ province, city, area ] = value
    if (province) {
      this.province = province.children
    }

    province && this.updatePanelByType(province, PANEL_INDEX.PROVINCE, true)
    city && this.updatePanelByType(city, PANEL_INDEX.CITY, true)
    area && this.updatePanelByType(area, PANEL_INDEX.AREA, true)
    this.$tab.updateActiveByIndex(value.length - 1)
  }

  bindEvents () {
    // FIXME: event listener be triggered twice
    this.$childrenItems.parent().click((e) => {
      let $target = $(e.target)
      const tagName = this.getTagName($target)
      const isAnchor = tagName === 'A'

      if (isAnchor) {
        const id = +$target.attr('data-id')
        const index = this.getIndex($target)
        const text = $target.text().trim()

        /* Make sure index has been changed to update Panel */
        if (id !== undefined) {
          this.updatePanelByIndex(index, id, text, true)
        }
      }
    })
  }

  updatePanelByIndex (index, id, text) {
    const { activeCls, hideCls } = this.options
    let [ province, city, area ] = this.currentValue

    switch (index) {
      case PANEL_INDEX.PROVINCE:
        // 根节点变更
        if (province) {
          if (text !== province.label) {
            // 更新数据源根节点 active state & 当前根节点的子节点
            province = getValByStr(province.data, text, true)[0]
            console.log(province)
            city = province.children

            this.updatePanelByType(province, PANEL_INDEX.PROVINCE, true)
            this.updatePanelByType({
              data: city,
              value: province.value
            }, PANEL_INDEX.CITY, true)
            this.$tab.updateActiveByIndex(PANEL_INDEX.CITY)
          }

          this.$parentItems.eq(index).text(text).addClass(activeCls).siblings().removeClass(hideCls)
        }
        break
      case PANEL_INDEX.CITY:
        this.$parentItems.eq(PANEL_INDEX.AREA)
        this.updatePanelByType(area, PANEL_INDEX.AREA, true)
        this.$tab.updateActiveByIndex(PANEL_INDEX.AREA)
        break
      case PANEL_INDEX.AREA:
        // this.$parentItems.eq(PANEL_INDEX.AREA).hide()
        // const currentArea = getValByStr(city)
        break
      default:
        break
    }
  }

  updatePanelByType (panel, index, visible) {
    let { value: id } = panel
    const { data } = panel

    // 如果是省级选择器，不需要缓存 DOM, ID 全部设为 0
    if (index === PANEL_INDEX.PROVINCE) {
      id = 0
    }

    const panelCls = this.getElementClass(id)
    let $panel = this.getCachedElement(panelCls)

    const $item = this.$childrenItems.eq(index)
    const { activeCls } = this.options

    if (visible) {
      if (!$panel) {
        $panel = this.setCachedElement(panelCls, this.installPanel(data, panelCls, index))
        $item.append($panel)
      } else {
        if ($panel.is(':visible')) return
      }

      $panel && $panel.show().siblings().hide()
      $item.addClass(activeCls).siblings().removeClass(activeCls)

      /* if ($panel && $item) {
        this.onEvents($panel, $item)
      } */
    } else {
      $panel && $panel.hide()
      $item.removeClass(activeCls)
    }
  }

  getIndex ($el) {
    const attrIdx = +$el.attr('data-index')
    const index = isNaN(attrIdx) ? $el.parent().parent().index() : attrIdx

    return index
  }

  getTagName ($el) {
    return $el.prop('tagName')
  }

  getElementClass (id) {
    return this.options.childPanelCls + '-' + id
  }

  setCachedElement (key, ele) {
    // eslint-disable-next-line
    return this._cachedElements[key] = ele
  }

  getCachedElement (key) {
    return this._cachedElements[key]
  }

  installPanel (data, className, index) {
    if (!isArray(data) || !data.length) return
    const { activeCls, disabledCls, panelBodyTpl, panelBodyItemTpl } = this.options
    const $panelBody = $(panelBodyTpl)

    for (let i = 0, l = data.length; i < l; i++) {
      if (isEmptyObject(data[i])) break
      const { label, value, active, disabled } = (data[i] || {})
      const $item = $(panelBodyItemTpl)

      $item.attr('title', label)
      $item.attr('data-label', label)
      $item.attr('data-id', value)
      $item.attr('data-index', index)
      $item.text(label)

      if (active) $item.addClass(activeCls)
      if (disabled) $item.addClass(disabledCls)

      $panelBody.append($item)
      $panelBody.addClass(className)
    }

    return $panelBody
  }
}

$.fn.initAddressCascader = function $AddressCascader (options = {}) {
  return this.each(function () {
    return new AddressCascader(
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

export default AddressCascader
