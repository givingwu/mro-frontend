import '../../assets/style/search.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/CheckBox'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/Cascader/interface/Cascader'

window.$ = $

// initialize
$(() => {
  $('.J_Preview').previewSwitcher({
    itemGap: 6,
    callback: function callback (item) {
      console.log(item)
    }
  })

  $('.J_Cascader').initAddressCascader({
    data: ['四川', '成都', '高新区', '华阳镇街道'],
    callback: (val, vis) => console.log(val, vis)
  })
})
