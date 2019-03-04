import $ from 'jquery'
import { getItemData, filterLinkData, setFieldAndRefresh } from '../SpecSelector'
import '../CheckBox'

const noop = $.noop
const extend = $.extend
const isFunction = $.isFunction
const defaults = {
  ele: '.J_RuleBar',
  activeCls: 'active',
}

const SORTS_STAUS = {
  0: 'NORMAL',
  1: 'UP',
  2: 'DOWN'
}

const SORTS_TYPE = {
  NORMAL: 'icon-sort',
  UP: 'icon-sort-up',
  DOWN: 'icon-sort-down'
}

$.fn.initRuleBar = function $ruleBar (options = {}) {
  const { ele } = extend({}, defaults, options)
  const $ele = $(ele)
  /* const self = {
    $ele
  } */

  $ele.find('.checkbox').each(function () {
    const self = this
    $(this).checkBox(function () {
      setFieldAndRefresh.call(self, getItemData(self))
    })
  })
}
