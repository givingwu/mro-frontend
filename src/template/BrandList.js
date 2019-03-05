export default `
  {{if data && data.length}}
    <div class="brands">
        <div class="row brand-list">
          {{each data brand index}}
            <div class="col col-3 brand-item">
              <div class="brand-item-img">
                <img src="{{brand.href}}" alt="{{brand.title}}"/>
              </div>
              <a href="{{brand.href}}" class="brand-item-mask brand-item-link">
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
