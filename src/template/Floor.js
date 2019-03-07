import $ from 'jquery'
import '../utils/LazyLoadModule'

export default {
  template: `
    {{if data && data.length}}
      <div class="container">
        {{each data item index}}
          {{if item.title}}
            <div class="yzw-floor">
              <div class="yzw-title">
                <h2>{{item.title}}<small>{{item.description}}</small></h2>
              </div>
              <div
                class="yzw-shell yzw-stage-wrapper J_LazyModule J_LazyStage"
                data-key="categoryRegion"
                data-index="{{index}}"
                data-template="FloorStage"
              ></div>
            </div>
          {{/if}}
        {{/each}}
      </div>
    {{/if}}
  `,
  initialize () {
    $('.J_LazyStage').initLazyModule(() => {
      console.log('Floor > J_LazyStage initialized success!')
    })
  }
}
