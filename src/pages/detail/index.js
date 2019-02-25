import $ from 'jquery'
import '../../common'
import '../../assets/style/detail.scss'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/Tab'
import '../../includes/mixins/Cascader'

// initialize
$(() => {
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

