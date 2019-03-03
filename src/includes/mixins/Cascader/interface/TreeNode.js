import $ from 'jquery'

export default class TabTreeNode {
  constructor ({
    depth,
    index,
    state
  }) {
    this.depth = depth
    this.index = index
    this.state = state || {}

    this.render(state)
  }

  render ({
    label,
    value
  }) {
    this.dom = $(`<a data-depth="${this.depth}" data-value="${value}">${label}</a>`)

    if (this.isActive()) {
      this.dom.addClass('active')
    }

    // this.bindEvents()
  }

  isActive () {
    return this.state.activeIndex === this.index
  }
}
