import $ from 'jquery'

const noop = $.noop
const extend = $.extend
const defaults = {
  ele: '.J_More',
  wrapper: '.J_MoreCont',
  // wrapperChild: '.J_MoreContItem',
  maxHeight: 0,
  iconHeight: 18,
  animate: true, /* 对于内部存在展开情况的元素无法使用动画，因为内部展开后高度变化。 */
  state: false, /* boolean */
  template: `
    <div class="show-more J_ShowMore" title="点击展开">
      <div class="show-more-icon">
        <i class="icon yzwfont icon-arrow-down"></i>
      </div>
    </div>
  `,
  callback: noop
}
const MODE = {
  HEIGHT: 0x1,
  VISIBLE: 0x2
}

// 仅支持一个页面单个 ShowMore
export default class ShowMore {
  constructor (options) {
    this.options = extend({}, defaults, options)
    const { ele, wrapper, state } = this.options

    this.$ele = $(ele)
    this.$wrapper = this.$ele.find(wrapper)

    if (!this.$wrapper.length) return {}
    const visible = this.$wrapper.is(':visible')
    const mode = this.checkMode(visible)

    if (mode === MODE.HEIGHT) {
      this.state = state || false
      this.install(mode)
    }

    if (mode === MODE.VISIBLE) {
      this.state = visible || state
      this.install(mode)
    }
  }

  checkMode (visible) {
    /* 必须传入 maxHeight */
    const eleHeight = this.$ele.outerHeight()
    const maxHeight = this.getMaxHeight(this.$ele)
    if (maxHeight && maxHeight > 0 && eleHeight > maxHeight) {
      this.gap = eleHeight - maxHeight
      this.maxHeight = maxHeight

      return MODE.HEIGHT
    }

    /* 元素初始不可见 */
    if (!visible) {
      return MODE.VISIBLE
    }
  }

  install (mode) {
    const mb = this.$ele.css('margin-bottom').replace(/px/, '')

    if (mode === MODE.HEIGHT) {
      this.$showMore = $(this.options.template)
      this.$wrapper.height(this.maxHeight)

      this.$ele.append(this.$showMore).css({
        // https://stackoverflow.com/questions/7420434/jquery-how-to-get-elements-margin-and-padding/7420530
        'margin-bottom': (+mb || 0) + this.options.iconHeight
      })
    }

    if (mode === MODE.VISIBLE) {
      this.$showMore = $(this.options.template)
      this.gap = this.$wrapper.height()
      this.$ele.append(this.$showMore).css({
        // https://stackoverflow.com/questions/7420434/jquery-how-to-get-elements-margin-and-padding/7420530
        'margin-bottom': (+mb || 0) + this.options.iconHeight
      })
    }

    this.bindEvents(mode)
  }

  bindEvents (mode) {
    const { animate } = this.options

    if (mode === MODE.HEIGHT) {
      this.$showMore && this.$showMore.click(() => {
        this.state = !this.state

        $.when(
          this.$wrapper.animate({
            height: `${this.state ? '-' : '+'}=${this.gap}`
          }),
          this.toggleIconClass()
        ).then().done(() => {
          console.log('animation done!')
        })
      })
    }

    if (mode === MODE.VISIBLE) {
      /* this.$wrapper.click(e => {
        console.log('e: ', e);
        let height = 0

        $.when(
          this.$wrapper.find(this.options.wrapperChild).each(function () {
            height += $(this).height()
          })
        ).done(
          this.$wrapper.animate({
            height: height > this.gap ? '+=' + (height - this.gap) : '-=' + (this.gap - height)
          })
        )
      }) */

      this.$showMore && this.$showMore.click(() => {
        this.state = !this.state

        $.when(
          this.state && this.$wrapper.show().css(
            animate ? { height: 0 } : {}
          )
        ).done(() => {
          if (animate) {
            this.$wrapper.animate({
              height: `${this.state ? '+' : '-'}=${this.gap}`
            }, () => {
              if (!this.state) {
                this.$wrapper.hide()
              }
            })
          } else {
            !this.state && this.$wrapper.hide()
          }
        }).done(
          () => this.toggleIconClass()
        )
      })
    }
  }

  toggleIconClass () {
    this.$showMore && this.$showMore
      .attr('title', this.state ? '点击收起' : '点击展开')
      .toggleClass('expanded', this.state)
      .find('.icon')
      .toggleClass('icon-arrow-up', this.state)
  }

  getMaxHeight ($ele) {
    return ($ele || this.$ele).data('max-height') ||
      $ele.attr('data-max-height') ||
      this.options.maxHeight ||
      null
  }
}

$.fn.initShowMore = function $initShowMore (options = {}) {
  return this.each(function () {
    return new ShowMore({
      ...options,
      ele: this
    })
  })
}
