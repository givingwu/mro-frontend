import $, { extend, isFunction, noop } from 'jquery'

const defaults = {
  ele: '.J_Tab',
  list: '.J_TabList',
  item: '.J_TabListItem',
  content: '.J_TabCont',
  currentIndex: 0,
  callback: noop
}

class Tab {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele, list, item } = this.options

    this.$ele = $(ele)
    this.$list = this.$ele.children(list)
    this.$item = this.$ele.children(item)
  }
}
