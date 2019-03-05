import '../../assets/style/office-jd.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/CheckBox'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/RuleBar'
import '../../includes/mixins/Cascader/interface/Cascader'
import '../../includes/mixins/SideBar'

window.$ = $

$(function () {
  $('.J_SideBar').initSideBar()

  $('.J_Preview').previewSwitcher({
    itemGap: 6,
    callback: function callback (item) {
      console.log(item)
    }
  })

  $('.J_Cascader').initCascader({
    value: '510199', // id: 510199
    callback: (ele) => console.log(ele)
  })
})
