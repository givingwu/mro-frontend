import $, { extend, noop, isFunction } from 'jquery'

const defaults = {
  ele: '.J_Selector',
  selectBtn: '.J_MultiSelectBtn',
  expandBtn: '.J_ShowMoreBtn',
  expandCls: 'expanded',
  callback: noop,
  geneStatusText: (expanded) => expanded ? '收起' : '展开'
}

class Selector {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele, selectBtn, expandBtn } = this.options

    this.$ele = $(ele)
    this.$selectBtn = this.$ele.find(selectBtn)
    this.$expandBtn = this.$ele.find(expandBtn)
    this.expanded = false
    this.bindEvents()
  }

  bindEvents () {
    const self = this
    const { geneStatusText, expandCls, callback } = this.options

    this.$expandBtn.click(function handleSelectClick (e) {
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      let isAnchor = tagName === 'A'
      let isIcon = tagName === 'I'
      const $icon = isIcon ? $target : isAnchor ? $target.children('.icon') : $target.siblings('.icon')

      if (!isAnchor) {
        $target = $target.parent()
      }

      self.expanded = !self.expanded

      const $item = $target.parent().parent()

      self.toggleClass($icon, 'icon-arrow-up')
      self.toggleClass($item, expandCls)/* .siblings().removeClass(expandCls) */
      $target.children('span').text(geneStatusText(self.expanded))

      callback(self.expanded)
    })
  }

  toggleClass ($ele, cls) {
    $ele.toggleClass(cls, this.expanded)
    return $ele
  }
}

$.fn.selector = function $selector (options = {}) {
  return this.each(function () {
    return new Selector(
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

// Initialize .J_InputNumber with callback function
export default $(() => {
  return $('.J_Selector').selector(function callback (value) {
    console.log(value)
  })
})
