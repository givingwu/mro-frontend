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

$(function() {
  $('.J_SideBar').initSideBar()
  $('.J_FloatBar').initFloatBar()
  const sideBarSO = new ScrollObserver({
    ele: '.J_SideBar',
    debounce: 100
  })

  console.log(sideBarSO);
})
