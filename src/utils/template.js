import $ from 'jquery'
import './ArtTemplate'

export default class Template {
  constructor (template) {
    this.template = Object.assign({}, template)
    const { ele, template: tpl, type, initialize } = this.template

    if (ele) {
      this.$ele = $(ele)
    }

    if (tpl && typeof tpl === 'object') {
      this.normalTpl = tpl.normal
      this.loadingTpl = tpl.loading
      this.errorTpl = tpl.error
    } else {
      if (!tpl) {
        throw new ReferenceError('必须实现基础模版 template')
      } else {
        this.normalTpl = tpl
      }
    }

    if (initialize) {
      this.initialize = initialize
      this.initialized = false
    }

    this.type = type || 'normal'
  }

  /**
   * render 的快捷调用
   *
   * @param {String|Object} type
   * @param {Object} state
   * @param {Function} callback
   * @memberof Template
   */
  setState (type, state, callback) {
    if (type && typeof type === 'object') {
      callback = state
      state = type
      type = null
    } else {
      this.type = type
    }

    switch (this.type) {
      case 'loading':
        this.renderLoading(state, callback)
        break
      case 'error':
        this.renderError(state, callback)
        break
      default:
        this.render(state, callback)
        break
    }
  }

  setHost($ele) {
    this.$ele = $ele
  }

  render (data, method = 'html', callback) {
    if (typeof method === 'function') {
      callback = method
      method = 'html'
    }

    this.$ele[method](
      window.template &&
      window.template.render(
        this.normalTpl,
        { data }
      )
    )

    callback && callback(this)

    if (this.initialize && !this.initialized) {
      this.initialize()
      this.initialized = true
    }
  }

  renderLoading (data, method = 'html', callback) {
    if (!this.loadingTpl) {
      console.log(this)
      throw new ReferenceError('还未实现当前模版的 loading state template!')
    }

    if (typeof method === 'function') {
      callback = method
      method = 'html'
    }

    this.$ele[method](
      window.template &&
      window.template.render(
        this.loadingTpl,
        { data }
      )
    )

    callback && callback(this)
  }

  renderError (data, method = 'html', callback) {
    if (!this.errorTpl) {
      console.log(this)
      throw new ReferenceError('还未实现当前模版的 error state template!')
    }

    if (typeof method === 'function') {
      callback = method
      method = 'html'
    }

    this.$ele[method](
      window.template &&
      window.template.render(
        this.errorTpl,
        { data }
      )
    )

    callback && callback(this)
  }
}
