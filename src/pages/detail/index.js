import $ from 'jquery'
import '../../common'
import '../../assets/style/detail.scss'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/Tab'
import '../../includes/mixins/Cascader'
import API from '../../utils/api'
import SaleRecordsList from '../../template/SaleRecordsList'

window.$ = $

// initialize
$(() => {
  $('.J_Tab').initTab({
    currentIndex: 0,
    indicator: '.J_TabActiveIndicator',
    callback: function callback (i) {
      const $current = this.$contents.eq(+i)

      if (+i === 1) {
        API['getSaleRecords'](JSON.stringify({
          supplierSkuId: 200,
          sysStatus: 1
        }))
          .done((...args) => {
            console.log(args)
            $current.html(SaleRecordsList.install(args[0]))
          })
          .fail((...args) => {
            console.log(args)
            $current.html(SaleRecordsList.install(...args))
          })
          .always(() => {
            console.log('complete')
          })
      }
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
