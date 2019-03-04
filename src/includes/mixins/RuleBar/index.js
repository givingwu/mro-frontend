import $ from 'jquery'
import { getItemData, filterLinkData, setFieldAndRefresh } from '../SpecSelector'
import '../CheckBox'

// const noop = $.noop
const extend = $.extend
// const isFunction = $.isFunction
const defaults = {
  ele: '.J_RuleBar',
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
  const { ele } = extend({}, defaults, options)
  const $ele = $(ele)

  $ele.find('.checkbox').each(function () {
    const $checkbox = $(this)

    $checkbox.checkBox(function (state, instance) {
      const $anchor = instance.$ele.parent('a')

      if (state) {
        setFieldAndRefresh.call(self, getItemData($anchor))
      } else {
        filterLinkData($anchor)
      }
    })
  })
}
