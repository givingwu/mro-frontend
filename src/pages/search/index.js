import '../../assets/style/search.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/CheckBox'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/SpecSelector'
import '../../includes/mixins/ShowMore'
import '../../includes/mixins/RuleBar'
import '../../includes/mixins/BlockPagination'
import '../../includes/mixins/Cascader/interface/Cascader'

window.$ = $

$('.J_Selector')
  .initSelector()
  .initShowMore({
    maxHeight: $('.J_SelectorItem').outerHeight() * 3,
    wrapper: '.J_SlideWrapper'
  })

$('.J_Preview').previewSwitcher({
  itemGap: 6,
  callback: function callback (item) {
    console.log(item)
  }
})

$('.J_RuleBar').initRuleBar()

$('.J_Cascader').initCascader({
  value: '510199', // id: 510199
  callback: (ele) => console.log(ele)
})

$('.J_BlockPager').initBlockPagination()
