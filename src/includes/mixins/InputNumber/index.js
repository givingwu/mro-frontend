import $, { extend, isFunction } from 'jquery'

const defaults = {
  item: '.J_InputNumber',
  input: '.J_NumberInput',
  plusBtn: '.J_NumberPlus',
  minusBtn: '.J_NumberMinus',
  disabledClass: 'disabled',
  float: false,
  max: 999999999,
  min: 0,
  callback: (v) => {},
  currentValue: 0
}

const ACTIONS = {
  PLUS: 1,
  CHANGE: 0,
  MINUS: -1
}

class InputNumber {
  constructor (options) {
    this.options = extend(defaults, options)
    const { item, plusBtn, input, minusBtn, currentValue } = this.options
    this.$item = $(item)
    this.$input = this.$item.children(input)
    this.$plusBtn = this.$item.children(plusBtn)
    this.$minusBtn = this.$item.children(minusBtn)
    this.currentValue = +this.$input.val() || currentValue

    this.checkStatus()
    this.bindEvents()
  }

  checkStatus (nextValue) {
    nextValue = nextValue !== undefined ? nextValue : this.currentValue
    const { min, max, disabledClass } = this.options
    const gtMax = nextValue > max
    const ltMin = nextValue <= min
    const disabledPlus = this.$plusBtn.hasClass(disabledClass)
    const disabledMinus = this.$minusBtn.hasClass(disabledClass)

    if (gtMax) {
      if (!disabledPlus) {
        this.$plusBtn.addClass(disabledClass)
      }
    } else {
      if (disabledPlus) {
        this.$plusBtn.removeClass(disabledClass)
      }
    }

    if (ltMin) {
      if (!disabledMinus) {
        this.$minusBtn.addClass(disabledClass)
      }
    } else {
      if (disabledMinus) {
        this.$minusBtn.removeClass(disabledClass)
      }
    }
  }

  bindEvents () {
    const self = this
    const { float } = this.options

    self.$plusBtn.on('click', function () {
      let value = self.getNextVal(ACTIONS.PLUS)

      self.$input.val(value)
      self.$input.attr('value', value)
    })

    self.$minusBtn.on('click', function () {
      let value = self.getNextVal(ACTIONS.MINUS)

      self.$input.val(value)
      self.$input.attr('value', value)
    })

    self.$input.on('change input', function (e) {
      let nextValue = e.target.value
      let isNumber = /^\d*$/.test(nextValue)

      if (isNumber) {
        if (!float) {
          if (!Number.isInteger(nextValue)) {
            nextValue = parseInt(nextValue)
          }
        }
      } else {
        nextValue = +nextValue.replace(/[^0-9]/g, '')
      }

      let value = self.getNextVal(ACTIONS.CHANGE, nextValue)

      self.$input.val(value)
      self.$input.attr('value', value)
    })
  }

  getNextVal (action, nextValue) {
    nextValue = nextValue !== undefined ? nextValue : this.currentValue
    const { min, max } = this.options

    if (Number.isNaN(nextValue)) {
      return 0
    }

    if (action === ACTIONS.PLUS) {
      nextValue = ++nextValue
    } else if (action === ACTIONS.MINUS) {
      nextValue = --nextValue
    }

    const gtMax = nextValue > max
    const ltMin = nextValue <= min

    if (gtMax) {
      nextValue = max - 1
    }

    if (ltMin) {
      nextValue = min
    }

    this.currentValue = nextValue
    this.checkStatus(nextValue)
    this.options.callback(nextValue)

    return nextValue
  }
}

$.fn.inputNumber = function (options = {}) {
  this.each(function () {
    return new InputNumber(
      isFunction(options) ? {
        callback: options,
        item: this
      } : {
        item: this
      }
    )
  })

  return this
}

export default $.fn.inputNumber
