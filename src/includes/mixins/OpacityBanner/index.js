import $, { extend, isFunction, noop } from 'jquery'

const defaults = {
  ele: '.J_OpacityBanner',
  item: '.J_OpacityBannerItem',
  nav: '.J_OpacityBannerNav',
  activeCls: 'active',
  disabledCls: 'disabled',
  currentIndex: 0,
  defaultBackgroundColor: 'yellow',
  triggerEvents: 'mouseover click',
  duration: 3000,
  toggleDuration: 1000,
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

  checkState () {
    const self = this

    this.$items.each(function () {
      const $item = $(this)

      $item.css({
        backgroundColor: self.getColor($item)
      })
    })
  }

  bindEvents () {
    const { triggerEvents, item } = this.options
    const itemCls = item.replace(/^(\.|#)/, '')

    this.$navs.parent().bind(triggerEvents, e => {
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      console.log('tagName: ', tagName)
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
    nextIndex = nextIndex > this.$items.length - 1 ? 0 : nextIndex

    const { toggleDuration } = this.options
    const $currentItem = this.$items.eq(nextIndex)
    const $currentNav = this.$navs.eq(nextIndex)

    $currentItem.show()
    $currentItem.animate({
      zIndex: 1,
      opacity: 1
    },
    toggleDuration,
    () => {
      this.handleComplete($currentItem, $currentNav, nextIndex)
    })
  }

  handleComplete ($currentItem, $currentNav, nextIndex) {
    const { options: { activeCls, duration } } = this

    $currentItem
      .addClass(activeCls)
      .siblings()
      .hide()
      .removeClass(activeCls)
    $currentNav
      .addClass(activeCls)
      .siblings()
      .removeClass(activeCls)

    this.timeoutId = setTimeout(() => {
      clearTimeout(this.timeoutId)
      this.updateActiveByIndex(++nextIndex)
    }, duration)
    this.execute(nextIndex)
  }

  updateNavigator ($item) {
    const left = $item.position().left
    const width = $item.outerWidth()

    this.$indicator &&
      this.$indicator.animate(
        {
          left,
          width
        },
        'fast'
      )
  }

  getIndex ($item) {
    return ($item && $item.attr('data-index')) || $item.index() || -1
  }

  getColor ($item) {
    return $item.attr('data-background-color') || this.options.defaultBackgroundColor
  }

  execute (nextIndex) {
    if (this.currentIndex !== nextIndex) {
      this.currentIndex = nextIndex
      this.options.callback(nextIndex)
    }
  }
}

$.fn.initOpacityBanner = function $initOpacityBanner (options = {}) {
  return this.each(function () {
    return new OpacityBanner(
      isFunction(options)
        ? {
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

// Initialize .J_OpacityBanner with callback function
$('.J_OpacityBanner').initOpacityBanner(
  (v) => console.log(v)
)

export default OpacityBanner
