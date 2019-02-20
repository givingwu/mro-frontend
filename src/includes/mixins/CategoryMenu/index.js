import $, { extend, isArray, isFunction, isEmptyObject, noop } from 'jquery'
import menuDataSet from './menu'

const config = window.config = window.config || {}
const defaults = {
  el: '.J_CategoryMenu',
  list: '.J_CategoryList',

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

  menuDataSet: config.menuDataSet || (menuDataSet && menuDataSet.length ? menuDataSet : []),
  callback: noop,
  triggerEvents: 'mouseenter'
}

class CategoryMenu {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { el, list, panelWrapper } = this.options

    this.$doc = $(document)
    this.$el = $(el)
    this.$list = this.$el.find(list)
    this.$items = this.$list.children()
    this.$panelWrapper = this.$el.find(panelWrapper)
    this.currentIndex = -1
    this._cachedElements = {}

    this.initEvents()
  }

  initEvents () {
    const { triggerEvents } = this.options

    this.$list.on(triggerEvents, (e) => {
      let $target = $(e.target)
      const tagName = this.getTagName($target)
      const isAnchor = tagName === 'A'
      const isItem = !isAnchor && tagName === 'LI'

      if (isAnchor) {
        $target = $target.parent()
      }

      if (isItem) {
        this.updatePanelByIndex(
          $target.attr('data-index') || $target.index(),
          true
        )
      }
    })
  }

  onEvents () {
    console.trace('onEvents')
    const $containers = [this.$item, this.$panel].filter(Boolean)

    // https://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it
    this.$doc.on('mouseup.cm.mouseup', e => {
      const t = e.target
      // let $target = $(t)
      let contained = $containers.some($el => $el.is(t) || $el.has(t))

      console.log(contained)

      if (!contained) {
        this.updatePanelByIndex(this.currentIndex, false)
      }
    })
  }

  offEvents () {
    this.$doc.off('mouseup.cm.mouseup')
  }

  updatePanelByIndex (index, visible) {
    console.trace('index: ', index)
    index = +index

    if (isNaN(index) || index < 0) return
    if (visible && this.currentIndex === index) return
    this.currentIndex = index

    const panelCls = this.getElementClass(index)
    let $panel = this.getCachedElement(panelCls)

    const $items = this.$list.children()
    const $item = $items.eq(index)
    const { activeCls } = this.options

    if (visible) {
      if (!$panel) {
        $panel = this.setCachedElement(panelCls, this.installPanel())
      }

      $panel && $panel.show && $panel.show().siblings().hide()
      $item.addClass(activeCls).siblings().removeClass(activeCls)
    } else {
      if ($panel) {
        $panel.hide()
      }

      $item.removeClass(activeCls)
    }

    if (this.$panel || this.$item) {
      this.offEvents()
    }

    if (visible) {
      this.$panel = $panel
      this.$item = $item
      this.onEvents()
    }

    this.options.callback(this.currentIndex)
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

  installPanel () {
    const { panelWrapTpl, panelTitle, panelList, panelItemTpl, menuDataSet } = this.options
    const data = menuDataSet[this.currentIndex]
    if (!isArray(data) || !data.length) return

    const $panelWrap = $(panelWrapTpl)

    for (let i = 0, l = data.length; i < l; i++) {
      const item = data[i]
      if (isEmptyObject(item)) break

      const { title, children } = item
      if (!children || !children.length) break

      const $panelItem = $(panelItemTpl)
      const $panelTitle = $panelItem.children(panelTitle)
      const $panelList = $panelItem.children(panelList)

      title && $panelTitle.html(`<span>${title}</span>`)

      for (let j = 0, k = children.length; j < k; j++) {
        const child = children[j]
        if (isEmptyObject(child)) break

        $panelList.append(
          `<a href="${child.href}" title="${child.title}">${child.title}</a>`
        )
      }

      $panelWrap.append($panelItem)
      $panelWrap.addClass(this.getElementClass(this.currentIndex))
    }

    this.$panelWrapper.append($panelWrap)

    return $panelWrap
  }
}

$.fn.CategoryMenu = function $CategoryMenu (options = {}) {
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

export default CategoryMenu
