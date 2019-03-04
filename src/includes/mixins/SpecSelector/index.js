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
        $anchor.children('.icon').click(function (e) {
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
      // let isIcon = tagName === 'I'
      // const $icon = isIcon ? $target : isAnchor ? $target.children('.icon') : $target.siblings('.icon')

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
          stopPropagation: true
        })
        .parent()
        .click(function () {
          const $checkBox = $(this).children('.checkbox')
          const checkbox = $checkBox.get(0)._checkbox

          checkbox.toggle()
        })
    )
  }

  /* filterLinkData ($anchor) {
    const self = this
    const data = getItemData.call(self, $anchor) || {}
    const qsData = parse(location.search.replace(/\?/g, '')) || {}
    const qsKeys = Object.keys(qsData)
    let key = ''
    let val = ''

    if (!isEmptyObject(data) && !isEmptyObject(qsData)) {
      key = data.key
      val = data.val

      if (qsKeys.includes(key)) {
        let qsVal = qsData[key]
        const qsHasArrVal = qsVal.includes(':')
        qsVal = qsHasArrVal ? qsVal.split(':') : qsVal

        if (qsHasArrVal && qsVal.length > 1) {
          val = qsVal.filter(v => v !== val).join(':')
        } else {
          if (val !== qsVal) return
          else {
            delete qsData[key]
            val = ''
            qsVal = null
          }
        }
      }

      key && self.setFieldAndRefresh({
        key,
        val
      })
    }
  } */

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

  /* getItemData ($ele) {
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
  } */

  /* setFieldAndRefresh (value) {
    const $form = this.$ele
    const $field = $('.J_InputText')
    let key = ''
    let val = ''

    if (isArray(value) && value.length) {
      if (value.length === 1) {
        key = value[0] && value[0].key
        val = value[0] && value[0].val
      } else {
        key = value[0] && value[0].key
        val = value.map(v => v && v.val).filter(Boolean).join(':')
      }
    } else if (
      value && typeof value === 'object'
    ) {
      key = value.key
      val = value.val
    }

    if (key) {
      const qsData = parse(location.search.replace(/\?/g, '')) || {}
      const qsKeys = Object.keys(qsData)

      if (qsKeys.length === 1 && $field.length) {
        $field && $field.attr('name', key).attr('value', val)
        $form && $form.submit()
      } else {
        qsData[key] = val
        location.href = [location.origin, location.pathname, '?', stringify(qsData)].join('')
      }
    }
  } */
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
  const qsData = parse(location.search.replace(/\?/g, '')) || {}
  const qsKeys = Object.keys(qsData)
  let key = ''
  let val = ''

  if (!isEmptyObject(data) && !isEmptyObject(qsData)) {
    key = data.key
    val = data.val

    if (qsKeys.includes(key)) {
      let qsVal = qsData[key]
      const qsHasArrVal = qsVal.includes(':')
      qsVal = qsHasArrVal ? qsVal.split(':') : qsVal

      if (qsHasArrVal && qsVal.length > 1) {
        val = qsVal.filter(v => v !== val).join(':')
      } else {
        if (val !== qsVal) return
        else {
          delete qsData[key]
          val = ''
          qsVal = null
        }
      }
    }

    key && setFieldAndRefresh.call(self, {
      key,
      val
    })
  }
}

export function getItemData ($ele) {
  $ele = $($ele)
  console.log('$ele: ', $ele);
  const isCheckbox = $ele.hasClass('checkbox')
  let $anchor = !isCheckbox && $ele.prop('tagName') === 'A' && $ele

  if (isCheckbox) {
    $anchor = $ele.parent('a')
  }

  let param = ''

  try {
    param = $anchor.data('param')

    /* 先取 $.data 后取 attr */
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

export function  setFieldAndRefresh (value) {
  const $form = this && this.$ele
  const $field = $('.J_InputText')
  let key = ''
  let val = ''

  if (isArray(value) && value.length) {
    if (value.length === 1) {
      key = value[0] && value[0].key
      val = value[0] && value[0].val
    } else {
      key = value[0] && value[0].key
      val = value.map(v => v && v.val).filter(Boolean).join(':')
    }
  } else if (
    value && typeof value === 'object'
  ) {
    key = value.key
    val = value.val
  }

  if (key) {
    const qsData = parse(location.search.replace(/\?/g, '')) || {}
    const qsKeys = Object.keys(qsData)

    if (qsKeys.length === 1 && $field.length) {
      $field && $field.attr('name', key).attr('value', val)
      $form && $form.submit()
    } else {
      qsData[key] = val
      location.href = [location.origin, location.pathname, '?', stringify(qsData)].join('')
    }
  }
}
