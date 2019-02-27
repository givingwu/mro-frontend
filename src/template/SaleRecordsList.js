import '../utils/ArtTemplate'

const SaleRecordsList = {
  template: `
    {{if data && data.length}}
      <div class="yzw-tab J_HomeTab">
        <div class="yzw-tab-hd">
          <div class="row yzw-tab-list">
            {{each data item index }}
              {{if item && item.children && item.children.length}}
                <a class="col col-8 yzw-tab-item J_TabItem {{ index === 0 ? 'active' : ''}}"><span>{{item.title}}</span></a>
              {{/if}}
            {{/each}}
          </div>
        </div>
        <div class="yzw-tab-bd">
          {{each data item index}}
            {{if item && item.children && item.children.length}}
              {{set children = item.children}}
              <div class="yzw-tab-cont J_TabCont {{ index === 0 ? 'active' : ''}}">
                <div class="panel">
                  {{each children child index }}
                    {{if index === 0 }}
                      <div class="panel-item panel-first">
                        <div class="panel-item-l">
                          <img src="{{child.src}}" alt="{{child.title}}">
                        </div>
                        <div class="panel-item-r yzw-small-title">
                          <h3>{{child.title}}</h3>
                          <small>{{child.desc}}</small>
                        </div>
                      </div>
                    {{else}}
                      <div class="panel-item">
                        <div class="panel-item-t yzw-small-title">
                          <h4>{{child.title}}</h4>
                          <small>{{child.desc}}</small>
                        </div>
                        <div class="panel-item-b">
                          <img src={{child.src}} alt="{{child.title}}">
                        </div>
                      </div>
                    {{/if}}
                  {{/each}}
                </div>
              </div>
            {{/if}}
          {{/each}}
        </div>
      </div>
    {{else}}
      <div>暂无数据</div>
    {{/if}}
  `,
  initialize () {},
  install (data, $el) {
    if (!$el) {
      return window.template && window.template.render(this.template, {
        data
      })
    } else {
      return $el.html(
        window.template && window.template.render(this.template, {
          data
        })
      )
    }
  }
}

export default SaleRecordsList
