import $, { extend, isFunction, noop } from 'jquery'

const defaults = {
  ele: '.J_OpacityBanner',
  item: '.J_OpacityBannerItem',
  nav: '.J_OpacityBannerNav',
  activeCls: 'active',
  disabledCls: 'disabled',
  currentIndex: 0,
  getItemColor: ($currentItem) => $currentItem.attr('data-background-color') || 'pink',
  triggerEvents: 'click',
  duration: 3000,
  toggleDuration: 300,
  callback: noop
}

class OpacityBanner {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele, item, currentIndex, nav } = this.options

    this.$ele = $(ele)
    this.$items = this.$ele.find(item)
    this.$navs = this.$ele.find(nav)
    this.currentIndex = currentIndex || 0

    this.checkState()
    this.bindEvents()
    this.updateActiveByIndex(this.currentIndex)
  }

  checkState () {}

  bindEvents () {
    const { triggerEvents, item } = this.options
    const itemCls = item.replace(/^(\.|#)/, '')

    this.$items.parent().bind(triggerEvents, (e) => {
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      const isSpan = tagName === 'SPAN'
      const isAnchor = tagName === 'A'
      const isLi = tagName === 'LI'
      let isItem = !isSpan && (isAnchor || isLi) && $target.hasClass(itemCls)

      if (isSpan) {
        $target = $target.parent()
        isItem = $target.hasClass(itemCls)
      }

      if (isItem) {
        this.updateActiveByIndex(this.getIndex($target))
      }
    })
  }

  updateActiveByIndex (nextIndex) {
    if (isNaN(+nextIndex) || nextIndex < 0) return

    const { activeCls, duration, toggleDuration } = this.options
    const $currentItem = this.$items.eq(nextIndex)
    const $currentNav = this.$navs.eq(nextIndex)

    $currentItem.animate({
      opacity: 1,
      display: 'block',
    }, toggleDuration, function () {
      $currentItem.addClass(activeCls).siblings().removeClass(activeCls)
      $currentNav.addClass(activeCls).siblings().removeClass(activeCls)
    })

    // this.updateNavigator($currentItem)
    this.execute(nextIndex)
  }

  updateNavigator ($item) {
    const left = $item.position().left
    const width = $item.outerWidth()

    this.$indicator && this.$indicator.animate({
      left,
      width
    }, 'fast')
  }

  getIndex($item) {
    return $item && $item.attr('data-index') || $item.index() || -1
  }

  execute (nextIndex) {
    if (this.currentIndex !== nextIndex) {
      this.currentIndex = nextIndex
      this.options.callback(nextIndex)
    }
  }
}

$.fn.tab = function $tab (options = {}) {
  return this.each(function () {
    return new Tab(
      isFunction(options) ? {
        ...options,
        callback: options,
        ele: this
      } : {
        ...options,
        ele: this
      }
    )
  })
}

// Initialize .J_Preview with callback function
export default OpacityBanner
