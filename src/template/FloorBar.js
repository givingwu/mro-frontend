import $ from 'jquery'
import '../includes/mixins/FloorBar'

export default {
  template: `
    {{if data && data.length}}
      <div class="floor-bar J_FloorBar">
        {{each data item index}}
          <div class="floor-bar-item">
            <span id="{{item.id}}" class="floor-bar-text">{{item.title}}</span>
          </div>
        {{/each}}
      </div>
    {{/if}}
  `,
  initialize () {
    $('.J_FloorBar').initFloorBar()
  }
}
