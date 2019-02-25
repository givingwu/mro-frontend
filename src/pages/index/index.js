import $ from 'jquery'
import '../../assets/style/index.scss'
import '../../common'
import '../../includes/mixins/SearchTab'
import '../../includes/mixins/CategoryMenu'
import '../../includes/mixins/OpacityBanner'
import '../../includes/mixins/Tab'
import '../../includes/mixins/SideBar'
import '../../includes/mixins/FloatBar'
import ScrollObserver from '../../utils/ScrollObserver'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()
  $('.J_FloatBar').initFloatBar()

  const SideBarScrollObserver = new ScrollObserver({
    el: '.J_SideBar',
    always: true,
    throttle: 50,
    callback (offset) {
      const elH = this.$el.height()
      const maxWrapperHeight = $('.J_HomeContent').height()
      const maxTop = maxWrapperHeight - elH - 40 /* padding-bottom */ - 20 /* top */ - 2 /* border */

      if (offset.y >= -20) {
        if (offset.y < maxTop) {
          this.$el.css({
            position: 'fixed',
            top: 20
          })
        } else {
          this.$el.css({
            position: 'absolute',
            top: maxTop
          })
        }
      } else {
        this.$el.css({
          position: 'absolute',
          top: 20,
          bottom: 'auto'
        })
      }
    }
  })

  console.log(SideBarScrollObserver)
})
