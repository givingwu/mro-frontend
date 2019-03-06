import $ from 'jquery'
import '../includes/mixins/FloatBar'

export default {
  template: `
    {{if data && data.length}}
      <div class="float-bar J_FloatBar">
        {{each data item index}}
          <div class="float-bar-item">
            <span id="{{item.id}}" class="float-bar-text">{{item.title}}</span>
          </div>
        {{/each}}
      </div>
    {{/if}}
  `,
  initialize () {
    $('.J_FloatBar').initFloatBar()
  }
}
