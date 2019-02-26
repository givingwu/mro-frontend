export default {
  tabDataSet (data) {
    if (data.length) {
      const $tabHD = $(tabHD)
      const $tabHDList = $tabHD.children('div')
      const $tabHDItems = geneItemsByData(data, tabHDItem)

      $tabHDItems.first().addClass('active')
      $tabHDList.append($tabHDItems)

      const $tabBD = $(tabBD)
      const $tabBDPanel = $(tabBDPanel).children('div')

      for (let i = 0, l = data.length; i < l; i++) {
        let item = data[i]

        if (item && item.children && item.children.length) {
          $items.add($(compile(specialTplObj[i] || itemTpl, item)))
        }
      }
      const $tabBDPanelItems = geneItemsByData(data, tabBDItem, [ tabBDPanelFirstItem])
    }
  }
}

const tabHD = `
<div class="yzw-tab-hd">
  <div class="row yzw-tab-list"></div>
</div>
`
const tabHDItem = `
<a class="col col-8 yzw-tab-item J_TabItem"><span>{{title}}</span></a>
`

const tabBD = `
<div class="yzw-tab-bd"></div>
</div>
`
const tabBDPanel = `
<div class="yzw-tab-cont J_TabCont">
 <div class="panel"></div>
</div>
`

const tabBDPanelFirstItem = `
<div class="panel-item panel-first">
  <div class="panel-item-l">
    <img src="{{src}}" alt="{{title}}">
  </div>
  <div class="panel-item-r yzw-small-title">
    <h3>{{title}}</h3>
    <small>{{desc}}</small>
  </div>
</div>
`

const tabBDPanelItem = `
<div class="panel-item">
  <div class="panel-item-t yzw-small-title">
    <h4>{{title}}</h4>
    <small>{{desc}}</small>
  </div>
  <div class="panel-item-b">
    <img src={{src}} alt="{{title}}">
  </div>
</div>
`

function compile (html, data) {
  return html.replace(/\{\{(\s?\w*\s?)\}\}/g, function replacer(match, p1) {
    if (match && (p1 = p1.trim())) {
      return data[p1];
    } else {
      return p1;
    }
  })
}

function geneItemsByData (data, itemTpl, specialTplObj) {
  const $items = $()

  for (let i = 0, l = data.length; i < l; i++) {
    let item = data[i]

    if (item && item.children && item.children.length) {
      $items.add($(compile(specialTplObj[i] || itemTpl, item)))
    }
  }

  return $items;
}
