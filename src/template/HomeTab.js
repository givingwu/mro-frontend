/* eslint-disable */
import '../includes/mixins/Tab'

export default {
  template: `
    {{if data && data.length}}
      <div class="yzw-tab J_HomeTab">
        <div class="yzw-tab-hd">
          <div class="row yzw-tab-list">
            {{each data item index}}
              {{if item && item.children && item.children.length}}
                <a class="col col-8 yzw-tab-item J_TabItem {{index === 0 ? 'active' : ''}}">
                  <span>{{item.title}}</span>
                </a>
              {{/if}}
            {{/each}}
          </div>
        </div>
        <div class="yzw-tab-bd">
          {{each data item index}}
            {{if item && item.children && item.children.length}}
              {{set children = item.children}}
              <div class="yzw-tab-cont J_TabCont {{index === 0 ? 'active' : ''}}">
                <div class="panel">
                  {{each children child index }}
                    {{if index === 0}}
                      <div class="panel-item panel-first">
                        <div class="panel-item-l">
                          <img src="{{child.image}}" alt="{{child.title}}">
                        </div>
                        <div class="panel-item-r yzw-small-title">
                          <h3>{{child.title}}</h3>
                          <small>{{child.description}}</small>
                        </div>
                      </div>
                    {{else}}
                      <div class="panel-item">
                        <div class="panel-item-t yzw-small-title">
                          <h4>{{child.title}}</h4>
                          <small>{{child.description}}</small>
                        </div>
                        <div class="panel-item-b">
                          <img src={{child.image}} alt="{{child.title}}">
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
    {{/if}}
  `,
  initialize: function () {
    $('.J_HomeTab').initTab()
  }
}
