
# MRO-FRONTEND

云筑网 MRO 商城前端。

## REQUIREMENTS

+ 兼容性：IE8+

## RULE

### CLASS NAME

+ class 命名遵循 BEM(Replace "can you build this?" with "can you maintain this without losing your minds?")
  1. [get-bem](http://getbem.com/naming/)
  2. [bem-101](https://css-tricks.com/bem-101/)

+ class 命名，如果与 JS 操作对应需要加上 `J_WhatDoUWannaDo`, `J_ModuleName` 以标识其被JavaScript操作。但使用 `J_CamelCase` 点 class 不能被用在 `CSS` 中。
  1. `.head.head--blue.J_Module`
  2. `.cover.cover--top.J_Cover`
  3. `.menu.menu--size-big.J_Menu`
  4. `.menu__item.menu__item--disabled.J_MenuItem`

### JAVASCRIPT

## DESIGN

### OPTIMIZATION

仅渲染首屏可见区域DOM，需要用户交互显示的内容，通过客户端 JavaScript 动态增删 DOM 节点实现加快 [FP/FCP & FMP/TTI](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#_6)。

+ Inline Style
+ [PWA](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)
+ *使用 [.webp] 图片格式
+ 动态加载 JavaScript\CSS\Image 等静态资源文件 with `lazyload` tech

### CACHE

+ [GoogleChrome/workbox](https://github.com/GoogleChrome/workbox) Service Worker 处理 index.html 缓存
+ [LocalStorage] 缓存不常修改内容，通过比对 hash 值更新
+ SERVER Cache-Control/Expires/ETag

### BUILD

+ [webpack](https://webpack.js.org/) 构建
+ support less/scss/postcss
+ support multiple pages
+ support .vue
+ [postcss/autoprefixer](https://github.com/postcss/autoprefixer)
+ [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
+ support [pug](http://naltatis.github.io/jade-syntax-docs/#text)

### SERVER

+ HTTP2.0
+ Cache-Control/Expires/ETag
