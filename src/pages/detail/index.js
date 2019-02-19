import $ from 'jquery'
import '../../includes/mixins/SearchTab'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/Tab'
import '../../assets/style/common.scss'
import '../../assets/style/detail.scss'

$('.J_Preview').previewSwitcher({
  itemGap: 18,
  callback: function callback (item) {
    console.log(item)
  }
})
