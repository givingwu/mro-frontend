import '../../assets/style/detail.scss'
import $ from 'jquery'
import '../../common'
import '../../includes/mixins/InputNumber'
import '../../includes/mixins/PreviewSwitcher'
import '../../includes/mixins/Tab'
// import '../../includes/mixins/Cascader'
import '../../includes/mixins/Cascader/interface/Cascader'
import SaleRecordsList from '../../template/SaleRecordsList'
import '../../plugins/jquery.pagination'
import '../../plugins/jquery.scrollbar'
import API from '../../utils/api'

window.$ = $

console.log(SaleRecordsList)
console.log(API)

// initialize
$(() => {
  $('.J_Tab').initTab({
    currentIndex: 0,
    indicator: '.J_TabActiveIndicator',
    callback (i) {
      +i === 1 && updateTabView()
    }
  })

  $('.J_ScrollbarOuter').scrollbar()

  $('.J_Preview').previewSwitcher({
    itemGap: 18,
    callback: function callback (item) {
      console.log(item)
    }
  })

  /* $('.J_Cascader').initAddressCascader({
    data: ['四川', '成都', '高新区', '华阳镇街道'], // id: 510199
    callback: (val, vis) => console.log(val, vis)
  }) */

  $('.J_Cascader').initCascader({
    value: '510199', // id: 510199
    callback: (ele) => console.log(ele)
  })

  function updateTabView (data, showLoading = true) {
    if (showLoading) {
      SaleRecordsList.renderLoading()
    } else {
      $(SaleRecordsList.ele).addClass('loading')
    }

    API.getSaleRecords({
      supplierSkuId: 200,
      sysStatus: 1,
      ...data
    }).done((data) => {
      const { datas: list, ...pagination } = data

      SaleRecordsList.render(list, () => renderPagination(pagination))
      $('.J_SaleRecordsListTotal').text(pagination.total)
    }).fail((cfg, status, statusText) => {
      console.log(cfg, status, statusText)
      SaleRecordsList.renderError(statusText)
    }).always(() => {
      $(SaleRecordsList.ele).removeClass('loading')
    })
  }

  function renderPagination ({ totalPage, total, pageSize, pageNo }) {
    if (totalPage) {
      $('.J_Pagination').pagination({
        items: total,
        itemsOnPage: pageSize,
        currentPage: pageNo,
        pages: totalPage,
        onPageClick (pageNumber) {
          updateTabView({
            pageNo: pageNumber
          }, false)
        }
      })
    }
  }
})
