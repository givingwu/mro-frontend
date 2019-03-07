export default {
  template: `
    {{if data}}
      {{set items = data.children}}
      {{if items && items.length}}
        {{set lastIndex = 8}}
        <div class="yzw-stage">
          <ul class="yzw-stage-list">
            {{each items item index}}
              {{if index === 0}}
                <li class="yzw-stage-item yzw-stage-image">
                  <figure class="yzw-stage-figure">
                    <img src="{{item.image}}" alt="{{item.title}}">
                    <figcaption>
                      <h4>{{item.title}}</h4>
                      <small>{{item.description}}</small>
                    </figcaption>
                  </figure>
                </li>
              {{else if (index > 0 && index <= 4)}}
                <li class="yzw-stage-item yzw-stage-t">
                  <div class="yzw-stage-t-img">
                    <img src="{{item.image}}" alt="{{item.title}}">
                  </div
                  ><div class="yzw-stage-t-info yzw-small-title">
                    <h4>{{item.title}}</h4>
                    <small>{{item.description}}</small>
                  </div>
                </li>
              {{else if (index > 4  && index < lastIndex)}}
                <li class="yzw-stage-item yzw-stage-b">
                  <div class="yzw-stage-b-l">
                    <img src="{{item.image}}" alt="{{item.image}}">
                  </div><div class="yzw-stage-b-r">
                    <div class="yzw-stage-t-info yzw-small-title">
                      <h4>{{item.title}}</h4>
                      <small>{{item.description}}</small>
                    </div>
                  </div>
                </li>
              {{else if index === lastIndex}}
                <li class="yzw-stage-item yzw-stage-b">
                  <div class="yzw-stage-b-r"></div>
                    <div class="yzw-stage-t-info yzw-small-title">
                      <h4>{{item.title || '查看更多'}}</h4>
                      <small>{{item.description || '热销商品'}}</small>
                    </div>
                  </div
                  ><div class="yzw-stage-b-l">
                    {{if item.image}}
                      <img src="{{item.image}}" alt="{{item.image}}>"
                    {{else}}
                      <i class="yzwicon yzwicon-arrow-right-circle-ghost"></i>
                    {{/if}}
                  </div>
                </li>
              {{/if}}
            {{/each}}
          </ul>
        </div>
      {{/if}}
    {{/if}}
  `,
  // template: `{{data}}`,
  initialize () {
    console.log('J_LazyStage initialized success!')
  }
}
