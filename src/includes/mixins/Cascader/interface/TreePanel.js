import $ from 'jquery'
import TreeNode from './TreeNode'

let maxTabIndex = -1

export default class TabTreePanel {
  constructor ({
    tabIndex = -1,
    lazyload = null,
    state = {}
  }) {
    this.state = state
    this.tabIndex = tabIndex
    this.children = state.children || []
    this.lazyload = lazyload
    this.dom = $(`
      <div class="cascader-panel-item J_TabCont loading">加载数据中...</div>
    `)

    maxTabIndex = Math.max(maxTabIndex, tabIndex)
    console.log('maxTabIndex: ', maxTabIndex)
    this.init()
  }

  init () {
    if (this.children && this.children.length) {
      this.render()
    } else {
      this.renderLoading()
      this.lazyload && this.lazyload()
        .then(data => {
          this.render(data)
        })
        .catch(error => {
          this.renderError(error)
          console.error(error)
        })
    }
  }

  render (children) {
    children = children || this.children

    if (children && children.length) {
      this.dom.removeClass('loading').html('')
      this
        .renderChildren(children)
        .forEach(child => {
          this.dom.append(child.dom)
        })
    } else {
      // this.dom.remove()
      this.children = children
      console.log('this: ', this)
    }

    return this.dom
  }

  renderChildren (children) {
    // eslint-disable-next-line
    return this.nodes = children.map((child, index) => {
      return new TreeNode({
        depth: this.tabIndex,
        index: index,
        state: {
          ...child,
          activeIndex: this.state.index
        }
      })
    })
  }

  renderError (text) {
    return this.dom.addClass('error').html(text || '请求数据异常')
  }

  renderLoading (text) {
    return this.dom.addClass('loading').html(text || '加载数据中...')
  }

  bindEvents () {
    this.dom.on('click', e => {
      console.log('e: ', e, this, this.dom.data())
    })
  }
}
