export default `
{{if data && data.length}}
  {{each data item index}}
    <a target="_blank" class="yzw-section yzw-ad-banner" href="{{item.link}}" title="{{item.title}}">
      <img(src="{{item.image}}", alt="{{item.title}}" />
    </a>
  {{/each}}
{{/if}}
`
