import $, { extend, noop, isFunction } from 'jquery'
import '../CheckBox/index'
import { stringify, parse } from 'querystring'

const defaults = {
  ele: '.J_Selector',
  selectBtn: '.J_MultiSelectBtn',
  expandBtn: '.J_ShowMoreBtn',
  item: '.J_SelectorItem',
  expandCls: 'expanded',
  selectCls: 'multi-select',
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
    this.prevMultiSelectIdx = -1
    this.cachedElements = []
    this.bindEvents()
  }

  bindEvents () {
    const self = this
    const { item, geneStatusText, expandCls, callback, selectCls } = this.options

    this.$expandBtn.click(function handleExpandClick (e) {
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

      self.toggleClass($icon, 'icon-arrow-up', self.expanded)
      self.toggleClass($item, expandCls, self.expanded)
      $target.children('span').text(geneStatusText(self.expanded))

      callback(self.expanded)
    })

    const $selectBtn = this.$selectBtn

    $selectBtn.click(function handleSelect (e) {
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      let isAnchor = tagName === 'A'
      if (!isAnchor) {
        $target = $target.parent()
      }

      const $item = $target.parent().parent()
      const index = $item.index()
      const $ele = self.getCachedElement(index)

      $item
        .toggleClass(selectCls, self.prevMultiSelectIdx !== index)
        .siblings()
        .removeClass(selectCls)

      self.cachedElements.forEach((children, currIndex) => {
        currIndex !== index && children && children.length && children.each(function () {
          $(this).children('.checkbox').hide()
        })
      })

      // 如果此前已经被缓存过，即已生成过DOM
      if ($ele) {
        const children = self.getCachedElement(index)

        children && children.length && children.each(function () {
          $(this).children('.checkbox').show()
        })
      } else {
        // 未缓存过元素，需要生成 DOM，且 push 到集合中
        const $buttons = $(`
          <div class="ss-bd-btn">
            <a href="javascript:void(0)" class="tag tag-primary">确定</a>
            <a href="javascript:void(0)" class="tag tag-default">取消</a>
          </div>
        `)

        self.bindBtnEvents($item, $buttons)
        self.setCachedElement(
          index,
          $item
            .children('.J_SelectorMultiWrapper')
            .append($buttons)
            .children('a')
            .prepend('<i class="icon yzwfont checkbox"></i>')
            .children('.checkbox')
            .checkBox()
            .parent()
            .click(function () {
              const $checkBox = $(this).children('.checkbox')
              const checkbox = $checkBox.get(0)._checkbox

              checkbox.toggle()
            })
        )
      }

      self.prevMultiSelectIdx = index
    })
  }

  bindBtnEvents ($item, $buttons) {
    const { selectCls, expandCls } = this
    const self = this

    $buttons
      .first()
      .click(() => {
        const values = []

        $item
          .find('.checkbox')
          .each(function () {
            const $item = $(this)

            if ($item.hasClass('checked')) {
              let param = ''
              try {
                param = $item.parent('a').attr('data-param')
                param = JSON.parse(param)
              } catch (e) {
                console.log(e);
              }

              values.push(param)
            }
          })

        if (values.length) {
          if (values.length > 1) {
          } else {
            const { key, val } = values[0]
            $('.J_InputText').attr('name', key).attr('value', val)
          }
        }

        self.$ele.submit()
      })
      .last()
      .click(() => {
        $item
          .toggleClass(selectCls)
          .toggleClass(expandCls)
          .find('.checkbox').toggle()
    })
  }

  setCachedElement (index, element) {
    // eslint-disable-next-line
    return this.cachedElements[index] = element
  }

  getCachedElement (index) {
    return this.cachedElements[index]
  }

  toggleClass ($ele, cls, state) {
    $ele.toggleClass(cls, state)
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
