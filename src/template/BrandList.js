export default `
  {{if data && data.length}}
    <div class="brands">
        <div class="row brand-list">
          {{each data brand index}}
            <div class="col col-3 brand-item">
              <div class="brand-item-img">
                <img src="{{brand.image}}" alt="{{brand.title}}"/>
              </div>
              <a target="_blank" href="{{brand.link}}" class="brand-item-mask brand-item-link">
                <div class="brand-item-tit">
                  <span>{{brand.title}}</span>
                </div>
                <div class="brand-item-btn">
                  <span>点击查看</span>
                </div>
              </a>
            </div>
          {{/each}}
      </div>
    </div>
  {{/if}}
`
