import $ from 'jquery'
import { getItemData, filterLinkData, setFieldAndRefresh } from '../SpecSelector'
import '../CheckBox'

// const noop = $.noop
const extend = $.extend
const defaults = {
  ele: '.J_RuleBar',
  min: '.J_MinPriceInput',
  max: '.J_MaxPriceInput',
  button: '.J_PriceConfirm',
  activeCls: 'active',
}

/* const SORTS_STAUS = {
  0: 'NORMAL',
  1: 'UP',
  2: 'DOWN'
}

const SORTS_TYPE = {
  NORMAL: 'icon-sort',
  UP: 'icon-sort-up',
  DOWN: 'icon-sort-down'
} */

$.fn.initRuleBar = function $ruleBar (options = {}) {
  const { ele, min, max, button } = extend({}, defaults, options)
  const $ele = $(ele)
  const $minInput = $ele.find(min)
  const $maxInput = $ele.find(max)
  const $btn = $ele.find(button)

  $ele.find('.checkbox').each(function () {
    const $checkbox = $(this)

    $checkbox.checkBox(function (state, instance) {
      const $anchor = instance.$ele.parent('a')
      const data = getItemData($anchor)

      if (state) {
        setFieldAndRefresh.call(self, data)
      } else {
        filterLinkData($anchor)
      }
    })
  })

  $minInput.on('change input', (e) => {
    const value = covert2number(e.target.value)

    $minInput.val(value)
    $minInput.attr('value', value)
  })

  $maxInput.on('change input', function (e) {
    const value = covert2number(e.target.value)

    $maxInput.val(value)
    $maxInput.attr('value', value)
  })

  $btn.on('click', () => {
    const query = {}
    const minField = $minInput.data('field') || 'minPrice'
    const maxField = $maxInput.data('field') || 'maxPrice'
    const min = $minInput.val()
    const max = $maxInput.val()

    if (min || max) {
      if (min > 0) {
        query[minField] = min
      }

      if (max > 0) {
        query[maxField] = max
      }
    }

    if (query[minField] || query[maxField]) {
      setFieldAndRefresh.call(self, query)
    }
  })
}

const onlyKeepNumberReg = /([^0-9|^\.])|$/g
const onlyMoneyNumberReg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/

function covert2number (value) {
  value = value.replace(onlyKeepNumberReg, '')

  if (!onlyMoneyNumberReg.test(value)) return
  else {
    return +value
  }
}
