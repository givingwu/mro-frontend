export default `
{{if data && data.length}}
  {{each data item index}}
    <a class="yzw-section yzw-ad-banner href="{{item.href}}" title="{{item.title}}">
      <img(src="{{item.img}}", alt="{{item.title}}" />
    </a>
  {{/each}}
{{/if}}
`
