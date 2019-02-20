import '../../assets/style/search.scss'
import $ from 'jquery'
import '../../includes/mixins/SearchTab'
import '../../includes/mixins/CheckBox'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/SpecSelector'

$('.J_Preview').previewSwitcher({
  itemGap: 6,
  callback: function callback (item) {
    console.log(item)
  }
})
