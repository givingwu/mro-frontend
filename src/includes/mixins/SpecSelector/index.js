import $ from 'jquery'
import { parse, stringify } from 'querystring'
import '../CheckBox'

const isArray = $.isArray
const extend = $.extend
const noop = $.noop
const isFunction = $.isFunction
const isEmptyObject = $.isEmptyObject
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

export default class Selector {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele, selectBtn, expandBtn } = this.options

    this.$ele = $(ele)
    this.$selectBtn = this.$ele.find(selectBtn)
    this.$expandBtn = this.$ele.find(expandBtn)
    this.$selector = this.$ele.find('.J_SelectorMultiWrapper')

    this.prevMultiSelectIdx = -1
    this.expandState = {}
    this.cachedElements = []

    this.bindEvents()
  }

  bindEvents () {
    const self = this
    const { selectCls } = this.options

    this.$selector.children('a').click(function (e) {
      e.stopPropagation()

      const $anchor = $(this)
      if ($anchor.hasClass('active')) {
        $anchor.children('.icon-close').click(function (e) {
          e.stopPropagation()
          $anchor.removeClass('active')
          /* self. */
          filterLinkData.call(self, $anchor)
        })
      }
    })

    this.$expandBtn.click(function handleExpandClick (e) {
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      let isAnchor = tagName === 'A'

      if (!isAnchor) {
        $target = $target.parent()
      }

      const $item = $target.parent().parent()
      const index = $item.index()

      self.toggleExpandStatus($item, self.expandState[index] = !self.expandState[index])
    })

    this.$selectBtn.click(function handleSelect (e) {
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      let isAnchor = tagName === 'A'
      if (!isAnchor) {
        $target = $target.parent()
      }

      const $item = $target.parent().parent()
      const index = $item.index()

      if (self.expandState[index]) {
        self.toggleExpandStatus($item, false)
      }

      const $ele = self.getCachedElement(index)

      $item.addClass(selectCls).siblings().removeClass(selectCls)

      // 遍历已缓存的同级元素，隐藏它们
      self.cachedElements.forEach((children, currIndex) => {
        currIndex !== index && children && children.length && children.each(function () {
          $(this).children('.checkbox').hide()
        })
      })

      // 如果此前已经被缓存过，即已生成过DOM
      // 无需再 insert DOM，直接显示即可
      if ($ele) {
        const children = self.getCachedElement(index)

        children && children.length && children.each(function () {
          $(this).children('.checkbox').show()
        })
      } else {
        // 未缓存过元素，需要生成 DOM，且 push 到集合中
        self.insertDOMElements($item, index)
      }

      self.prevMultiSelectIdx = index
    })
  }

  toggleExpandStatus ($item, state) {
    const { expandCls, expandBtn, geneStatusText } = this.options

    $item
      .toggleClass(expandCls, state)
      .find(expandBtn)
      .children('.icon')
      .toggleClass('icon-arrow-up', state)
      .parent()
      .children('.text')
      .text(geneStatusText(state))
  }

  insertDOMElements ($item, id) {
    const $buttons = $(`
      <div class="ss-bd-btn">
        <a href="javascript:void(0)" class="tag tag-primary confirm">确定</a>
        <a href="javascript:void(0)" class="tag tag-default cancel">取消</a>
      </div>
    `)

    this.bindBtnEvents($item, $buttons)
    this.setCachedElement(
      id,
      $item
        .children('.J_SelectorMultiWrapper')
        .append($buttons)
        .children('a')
        .prepend('<i class="icon yzwfont checkbox"></i>')
        .children('.checkbox')
        .checkBox({
          stopPropagation: true,
          callback: noop
        })
        .parent()
        .click(function () {
          const $checkBox = $(this).children('.checkbox')
          const checkbox = $checkBox.get(0)._checkbox

          checkbox.toggle()
        })
    )
  }

  bindBtnEvents ($item, $buttons) {
    const self = this
    const { selectCls, expandCls } = this.options
    const $confirm = $buttons.children('.confirm')
    const $cancel = $buttons.children('.cancel')

    $confirm.click(() => {
      const values = self.getSelectedValues($item)

      if (values && values.length) {
        setFieldAndRefresh.call(self, values)
      } else {
        $cancel.click()
      }
    })

    $cancel.click(() => {
      $item
        .removeClass(selectCls)
        .removeClass(expandCls)
        .find('.checkbox:visible')
        .hide()
    })
  }

  setCachedElement (index, element) {
    // eslint-disable-next-line
    return this.cachedElements[index] = element
  }

  getCachedElement (index) {
    return this.cachedElements[index]
  }

  getSelectedValues ($item) {
    const values = []

    $item
      .find('.checkbox')
      .each(function () {
        const value = $(this).hasClass('checked') && getItemData(this)
        value && values.push(value)
      })

    return values
  }
}

$.fn.initSelector = function $selector (options = {}) {
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

export function filterLinkData ($anchor) {
  const self = this
  const data = getItemData($anchor) || {}
  const dataKeys = Object.keys(data)
  const qsData = parse(location.search.replace(/\?/g, '')) || {}
  const qsKeys = Object.keys(qsData)

  if (!isEmptyObject(data) && !isEmptyObject(qsData)) {
    let modified = false

    /* compare per key between link data and QueryString data */
    dataKeys.forEach(function (key) {
      if (qsKeys.includes(key)) {
        const val = data[key]
        let qsVal = qsData[key]

        qsVal = qsVal.includes(',') ? qsVal.split(',') : qsVal

        if (isArray(qsVal) && qsVal.length > 1) {
          qsData[key] = qsVal.filter(v => {
            if (v === val) {
              modified = true
              return false
            }

            return true
          }).join(',')
        } else {
          if (val !== qsVal) return
          else {
            modified = true
            delete qsData[key]
          }
        }
      }
    })

    modified && setFieldAndRefresh.call(self, qsData)
  }
}

export function setFieldAndRefresh (value) {
  let qsData = parse(location.search.replace(/\?/g, '')) || {}

  if (isArray(value) && value.length) {
    value = value.reduce((accu, curr) => {
      const keys = Object.keys(curr)

      keys.forEach(key => {
        const val = curr[key]
        const prevVal = accu[key]

        if (val) {
          if (!isArray(val)) {
            if (!prevVal) {
              accu[key] = val
            } else {
              accu[key] = [prevVal, val].join(',')
            }
          } else {
            if (!prevVal) {
              accu[key] = prevVal.join(',')
            } else {
              accu[key] = [prevVal, ...val].join(',')
            }
          }
        }
      })

      return accu
    }, {})
  }

  if (
    value && typeof value === 'object'
  ) {
    qsData = {
      ...qsData,
      ...value
    }
  }

  if (!isEmptyObject(qsData)) {
    location.href = [location.origin, location.pathname, '?', stringify(qsData)].join('')
  }
}

export function getItemData ($ele) {
  $ele = $($ele)
  const isCheckbox = $ele.hasClass('checkbox')
  let $anchor = !isCheckbox && $ele.prop('tagName') === 'A' && $ele

  if (isCheckbox) {
    $anchor = $ele.parent('a')
  }

  let param = ''

  try {
    param = $anchor.data('param')

    if (
      !param ||
      isEmptyObject(param)
    ) {
      param = JSON.parse($anchor.attr('data-param'))
    }
  } catch (e) {
    console.error(e)
  }

  return param
}
