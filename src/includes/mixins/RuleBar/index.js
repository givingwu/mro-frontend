import $ from 'jquery'
import { parse } from 'querystring'
import { getItemData, isUndefined, setFieldAndRefresh } from '../SpecSelector'
import '../CheckBox'

// const noop = $.noop
const extend = $.extend
const defaults = {
  ele: '.J_RuleBar',
  min: '.J_MinPriceInput',
  max: '.J_MaxPriceInput',
  button: '.J_PriceConfirm',
  activeCls: 'active'
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
      const dataKeys = Object.keys(data)
      const qsData = parse(location.search.replace(/\?/g, '')) || {}
      // const qsKeys = Object.keys(qsData)

      dataKeys.forEach(key => {
        const val = isUndefined(data[key]) ? '' : '' + data[key]
        const qsVal = isUndefined(qsData[key]) ? '' : String(qsData[key]).split(',')

        // 如果当前 QS 中包含了该 key
        if (state) {
          if (!qsVal.includes(val)) {
            if (qsVal && qsVal.length) {
              qsData[key] = [...qsVal, val].join(',')
            } else {
              qsData[key] = val
            }
          }
        } else {
          if (qsVal.includes(val)) {
            qsData[key] = qsVal.filter(v => v !== val).join(',')
          }
        }
      })

      setFieldAndRefresh(qsData, true)
      return false
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
    const val1 = +$minInput.val()
    const val2 = +$maxInput.val()

    if (val1 && val2) {
      let min = Math.min(val1, val2)
      let max = Math.max(val1, val2)

      query[minField] = min
      query[maxField] = max
    } else if (val1 && !val2) {
      query[minField] = val1
    } else if (val2 && !val1) {
      query[maxField] = val2
    }

    setFieldAndRefresh.call(self, query)
    return false
  })
}

// eslint-disable-next-line
const onlyKeepNumberReg = /([^0-9|^\.])|$/g
const onlyMoneyNumberReg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/

function covert2number (value) {
  value = value.replace(onlyKeepNumberReg, '')

  if (onlyMoneyNumberReg.test(value)) {
    return +value
  }
}
