import '../../assets/style/search.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/CheckBox'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/SpecSelector'
// import '../../includes/mixins/RuleBar'
import '../../includes/mixins/Cascader/interface/Cascader'

window.$ = $

// initialize
$(() => {
  $('.J_Selector').initSelector()
  // $('.J_RuleBar').initRuleBar()

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
