import $ from 'jquery'
import { getData, DATA_KEY_MAP } from '../../../utils/DataUtil'

const noop = $.noop
const extend = $.extend
const isArray = $.isArray
const isFunction = $.isFunction
const isEmptyObject = $.isEmptyObject
const defaults = {
  el: '.J_CategoryMenu',
  list: '.J_CategoryList',
  item: '.J_CategoryMenuItem',
  head: '.J_CategoryMenuHead',
  body: '.J_CategoryMenuBody',
  hideCls: 'hide-category-menu',

  panelWrapper: '.J_CategoryPanelWrapper',
  panel: '.J_CategoryPanel',
  panelTitle: '.J_CategoryPanelTitle',
  panelList: '.J_CategoryPanelList',

  childPanelCls: 'panel-child',
  activeCls: 'active',

  panelWrapTpl: `
    <div class="category-panel J_CategoryPanel">
    </div>
  `,
  panelItemTpl: `
    <div class="category-panel-item">
      <div class="category-panel-title J_CategoryPanelTitle"></div>
      <div class="category-panel-list J_CategoryPanelList"></div>
    </div>
  `,

  callback: noop,
  dataSet: [],
  triggerEvents: 'mouseenter'
}

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
// const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

class CategoryMenu {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, list, item, panelWrapper } = this.options

    this.$doc = $(document)
    this.$el = $(el)
    this.$list = this.$el.find(list)
    this.$items = this.$list.children(item)
    this.$panelWrapper = this.$el.find(panelWrapper)
    this.currentIndex = -1
    this._cachedElements = {}

    this.bindEvents()
  }

  bindEvents () {
    const { triggerEvents, hideCls, head, body } = this.options

    if (this.$el.hasClass(hideCls)) {
      const $head = this.$el.children(head)
      const $body = this.$el.children(body)

      $head.mouseover(() => {
        $body.show()

        this.$doc.on('mouseover.hd.contained', e => {
          const t = e.target
          let contained = [this.$el].some($el => $el.is(t) || $el.has(t).length)
          //

          if (!contained) {
            this.$doc.off('mouseover.hd.contained')
            $body.hide()
          }
        })
      })
    }

    // FIXME: event listener be triggered twice
    this.$items.on(triggerEvents, (e) => {
      let $target = $(e.target)
      const tagName = this.getTagName($target)
      const isAnchor = tagName === 'A'
      const isItem = !isAnchor && tagName === 'LI'

      if (isAnchor) {
        $target = $target.parent()
      }

      if (isItem) {
        const attrIdx = +$target.attr('data-index')
        const index = isNaN(attrIdx) ? $target.index() : attrIdx

        /* Make sure index has been changed to update Panel */
        if (index >= 0) {
          this.offEvents() // clean before document event listener
          this.updatePanelByIndex(index, true)
        }
      }
    })
  }

  onEvents ($panel, $item) {
    // https://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it
    this.$doc.on('mouseover.cm.contained', e => {
      const t = e.target
      let contained = [$item, $panel].some($el => $el.is(t) || $el.has(t).length)

      if (!contained) {
        this.offEvents()
        this.updatePanelByIndex(this.currentIndex, false)
      }
    })
  }

  offEvents () {
    this.$doc.off('mouseover.cm.contained')
  }

  updatePanelByIndex (index, visible) {
    const panelCls = this.getElementClass(index)
    let $panel = this.getCachedElement(panelCls)

    const $item = this.$items.eq(index)
    const { activeCls } = this.options

    this.options.callback(this.currentIndex = +index, visible)

    if (visible) {
      if (!$panel) {
        $panel = this.setCachedElement(panelCls, this.installPanel(index))
      } else {
        if ($panel.is(':visible')) return
      }

      $panel && $panel.show().siblings().hide()
      $item.addClass(activeCls).siblings().removeClass(activeCls)

      if ($panel && $item) {
        this.onEvents($panel, $item)
      }
    } else {
      $panel && $panel.hide()
      $item.removeClass(activeCls)
    }
  }

  getTagName ($el) {
    return $el.prop('tagName')
  }

  getElementClass (index) {
    return this.options.childPanelCls + '-' + index
  }

  setCachedElement (key, ele) {
    // eslint-disable-next-line
    return this._cachedElements[key] = ele
  }

  getCachedElement (key) {
    return this._cachedElements[key]
  }

  installPanel (index) {
    const { panelWrapTpl, panelTitle, panelList, panelItemTpl, dataSet } = this.options
    const data = dataSet[index]

    if (!isArray(data) || !data.length) return

    const $panelWrap = $(panelWrapTpl)

    for (let i = 0, l = data.length; i < l; i++) {
      const item = data[i]
      if (item && isEmptyObject(item)) break

      const { title, link, children } = item
      const $panelItem = $(panelItemTpl)
      const $panelTitle = $panelItem.children(panelTitle)
      const $panelList = $panelItem.children(panelList)

      title && $panelTitle.html(`<a href="${link}" title="${title}">${title}</a>`)

      if (children && children.length) {
        for (let j = 0, k = children.length; j < k; j++) {
          const child = children[j]
          if (isEmptyObject(child)) break

          $panelList.append(
            `<a href="${child.link}" title="${child.title}">${child.title}</a>`
          )
        }
      }

      $panelWrap.append($panelItem)
      $panelWrap.addClass(this.getElementClass(index))
    }

    this.$panelWrapper.append($panelWrap)

    return $panelWrap
  }
}

$.fn.initCategoryMenu = function $CategoryMenu (options = {}) {
  return this.each(function () {
    return new CategoryMenu(
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

const data = getData(DATA_KEY_MAP.HEAD)/* .map(item => item && item.children && item.children.length ? item.children : []) */
console.log('data: ', data)

if (isArray(data) && data.length) {
  $(() => {
    // initialize CategoryMenu plugin with callback function
    $('.J_CategoryMenu').initCategoryMenu({
      dataSet: (data || []).map(t => t && t.children && t.children.length && t.children)
    })
  })
}

export default CategoryMenu
