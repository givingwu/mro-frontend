import '../utils/LazyLoadModule'

export default {
  template: `
    {{if data && data.length}}
      <div class="container">
        {{each data item index}}
          {{if item.title}}
            <div class="yzw-floor">
              <div class="yzw-title">
                <h2>
                  {{item.title}}
                  <small>{{item.desc}}</small>
                </h2>
              </div>
            </div>
          {{/if}}

          {{if item && item.children && item.children.length}}
            {{set children = item.children}}
            <div class="yzw-stage">
              <ul class="yzw-stage-list">
                {{each children child index }}
                  {{if index === 0 }}
                    <li class="yzw-stage-item yzw-stage-image">
                      <figure class="yzw-stage-figure">
                        <img src="{{child.src}}" alt="{{child.title}}">
                        <figcaption>
                          <h4>{{child.title}}</h4>
                          <small>{{child.desc}}</small>
                        </figcaption>
                      </figure>
                    </li>
                  {{else}}
                    <li class="yzw-stage-item">
                      {{if child.top}}
                        {{set top = child.top }}
                        <div class="yzw-stage-t">
                          <div class="yzw-stage-t-img">
                            <img src="{{top.src}}" alt="{{top.title}}">
                          </div>
                          <div class="yzw-stage-t-info yzw-small-title">
                            <h4>{{top.title}}</h4>
                            <small>{{top.desc}}</small>
                          </div>
                        </div>
                      {{/if}}
                      {{if child.btm}}
                        {{set btm = child.btm }}
                        <div class="yzw-stage-b">
                          <div class="yzw-stage-b-l">
                            <img src={{btm.src}} alt={{btm.src}}>
                          </div>
                          <div class="yzw-stage-b-r">
                            <div class="yzw-stage-t-info yzw-small-title">
                              <h4>{{btm.title}}</h4>
                              <small>{{btm.desc}}</small>
                            </div>
                          </div>
                        </div>
                      {{/if}}
                    </li>
                  {{/if}}
                </ul>
              </div>
            {/if}
        {{/each}}
      </div>
    {{/if}}
  `,
  initialize () {
    console.log('FloorStage initialized success!')
  }
}
