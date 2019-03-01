import $ from 'jquery'

const noop = $.noop
const extend = $.extend
const isFunction = $.isFunction
const defaults = {
  ele: '.J_SortList',
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

$(function initSortList (options = {}) {
  const $list = $('')
})
