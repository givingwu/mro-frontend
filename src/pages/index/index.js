import $ from 'jquery'
import '../../assets/style/index.scss'
import '../../common'
import '../../includes/mixins/SearchTab'
import '../../includes/mixins/CategoryMenu'
import '../../includes/mixins/OpacityBanner'
import '../../includes/mixins/Tab'
import '../../includes/mixins/SideBar'
import '../../includes/mixins/FloatBar'
import LazyLoadModule from '../../utils/LazyLoadModule'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()
  $('.J_FloatBar').initFloatBar()

  // eslint-disable-next-line
  new LazyLoadModule({

  })
})
