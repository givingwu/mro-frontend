import Template from '../utils/Template'

export default new Template({
  ele: '.T_SaleRecordsList', /* 指定了特定的模版插槽选择器 */
  template: {
    normal: `
      {{if data && data.length}}
        <div class="sales-record">
          <div class="sr-hd clearfix">
            <div class="sr-b">采购商</div>
            <div class="sr-n">购买数量</div>
            <div class="sr-t">购买时间</div>
          </div>
          <div class="sr-bd">
            {{each data item}}
            <div class="sr-bd-item clearfix">
              <div class="sr-bd-t sr-b">
                <div class="sr-bd-tc">
                  {{item.organizationName}}
                  {{item.projectName}}
                </div>
              </div>
              <div class="sr-bd-t sr-n">
                <div class="sr-bd-tc">{{item.quantity}}</div>
              </div>
              <div class="sr-bd-t sr-t">
                <div class="sr-bd-tc">{{item.date}}</div>
              </div>
            </div>
            {{/each}}
          </div>
          <div class="sr-ft J_Pagination"></div>
        </div>
      {{else}}
        <div>暂无数据</div>
      {{/if}}
    `,
    loading: `<div class="loading">加载数据中...</div>`,
    error: `<div class="error load-error">{{text || '请求异常'}}</div>`,
  }
})
