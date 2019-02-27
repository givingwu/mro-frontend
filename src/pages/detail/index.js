import $ from 'jquery'
import '../../common'
import '../../assets/style/detail.scss'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/Tab'
import '../../includes/mixins/Cascader'
import '../../utils/ArtTemplate'

window.$ = $
const API = window.__YZW__API__ || {}

// initialize
$(() => {
  $('.J_Tab').initTab({
    currentIndex: 0,
    indicator: '.J_TabActiveIndicator',
    callback: function callback (idx) {
      $.getJSON(API.SALES_RECORD,)
    }
  })

  $('.J_Preview').previewSwitcher({
    itemGap: 18,
    callback: function callback (item) {
      console.log(item)
    }
  })

  $('.J_Cascader').initAddressCascader({
    data: ['四川', '成都', '高新区', '华阳镇街道'],
    callback: (val, vis) => console.log(val, vis)
  })
})
