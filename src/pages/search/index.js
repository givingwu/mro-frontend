import $ from 'jquery'
import '../../assets/style/search.scss'
import '../../common'
import '../../includes/mixins/CheckBox'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/Cascader'

// initialize
$(() => {
  $('.J_Preview').previewSwitcher({
    itemGap: 6,
    callback: function callback (item) {
      console.log(item)
    }
  })

  $('.J_Cascader').initCascader({
    data: ['四川', '成都', '高新区', '华阳镇街道'],
    callback: (val, vis) => console.log(val, vis)
  })
})
