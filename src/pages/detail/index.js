import $ from 'jquery'
import '../../common'
import '../../assets/style/detail.scss'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/Tab'

$('.J_Preview').previewSwitcher({
  itemGap: 18,
  callback: function callback (item) {
    console.log(item)
  }
})
