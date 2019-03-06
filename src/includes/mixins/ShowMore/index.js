import $ from 'jquery'

const noop = $.noop
const extend = $.extend
const defaults = {
  ele: '.J_SlideEle',
  wrapper: '.J_SlideWrapper',
  maxHeight: 200,
  iconHeight: 18,
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

$.fn.initShowMore = function $showMore (options = {}) {
  options = extend({}, defaults, options)

  const { ele, wrapper, template, state, iconHeight } = options
  const $ele = $((this instanceof HTMLElement || this instanceof $) ? this : ele)
  if (!$ele.length) return

  const $wrapper = $ele.find(wrapper)
  const eleHeight = $ele.outerHeight()
  const maxHeight = getMaxHeight($ele)
  let toggleState = state || false

  if (eleHeight > maxHeight) {
    const gap = eleHeight - maxHeight
    const $showMore = $(template)
    const mb = $ele.css('margin-bottom').replace(/px/, '')
    const toggleIconClass = () => {
      $showMore
        .attr('title', toggleState ? '点击收起' : '点击展开')
        .toggleClass('expanded', toggleState)
        .find('.icon')
        .toggleClass('icon-arrow-up', toggleState)
    }

    $wrapper.height(maxHeight)
    $ele.append($showMore).css({
      // https://stackoverflow.com/questions/7420434/jquery-how-to-get-elements-margin-and-padding/7420530
      'margin-bottom': (+mb || 0) + iconHeight
    })

    $showMore.click(() => {
      toggleState = !toggleState

      $.when(
        $wrapper.animate({
          height: toggleState ? '+=' + gap : '-=' + gap
        }),
        toggleIconClass()
      ).then().done(() => {
        console.log('animation done!')
      })
    })
  }

  function getMaxHeight ($ele) {
    return $ele.data('max-height') || $ele.attr('data-max-height') || options.maxHeight || 200
  }
}
