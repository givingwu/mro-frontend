import { ajax, isNotEmptyObject } from 'jquery'

/**
 * capitalize
 * @param {String} str
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const camelize = (str) => {
  return str
    .split(/-|_/g)
    .map(s => capitalize(s))
    .join('')
}

/**
 * 用来快速生成 HTTP Method + API key 的快捷方法的 API 对象
 * @example
 * ```js
    const api = new API(
      api = window.__YZW__API__ = {
        user: '/users/${userID}', // 默认为 get 方法
        postUser: 'post /users/user',
        deleteUser: 'delete /users/${userID}'
      },
      setup = window.__YZW__API__CONFIG__
    )

    api.getUser(data, config).done(success()).fail(fail())
    api.postUser(data, config).done(success()).fail(fail())
    api.deleteUser(data, config).done(success()).fail(fail())
 * ```
 *
 * @export
 * @class API
 */
export class API {
  constructor (api, setup) {
    this.API = api
    this.API_CONFIG = setup

    this.METHODS = ['get', 'post', 'put', 'delete', 'option', 'head']
    this.API && this._init()
  }

  _init () {
    Object.keys(this.API).forEach(key => {
      let value = this.API[key] || ''
      let config = (this.API_CONFIG && this.API_CONFIG[key]) || {}

      if (!value) return
      if (/:|\s/g.test(value)) {
        value = value.split(/:|\s/g)
      } else {
        value = ['get', value]
      }

      const [method, url, apiMethodName] = value

      this[`${apiMethodName || this._getValidKey(key, this._checkMethod(method))}`] = data =>
        this._request(url, {
          type: method,
          data,
          ...config
        })
    })
  }

  _checkMethod (method) {
    const isMethod = method && this.METHODS.includes(method)

    if (!isMethod) {
      throw new Error(
        `method only could be one of ${
          this.METHODS
        } not is ${method}!`
      )
    } else {
      return method.toLowerCase()
    }
  }

  _getValidKey (key, method) {
    return this._startsWithMethod(key) ? key : method + camelize(key)
  }

  _startsWithMethod (key) {
    return this.METHODS.some(method => {
      return key.startsWith(method)
    })
  }

  _request (url, config) {
    config = {
      data: null,
      dataType: 'json',
      contentType: 'application/json',
      headers: {},
      dataFilter (data, type) {
        console.log(data, type)
      },
      ifModified: false,
      beforeSend () {},
      success () {},
      error () {},
      ...config
    }

    if (config.dataType === 'JSON' && !isNotEmptyObject(config.data)) {
      config.data = JSON.stringify(config.data)
    }

    return ajax(url, config)
  }
}

/**
 * 默认将全局变量 __YZW__API__ 作为 API 对象生成方法
 * 默认将全局变量 __YZW__API__CONFIG__ 作为 API 的配置对象
 * 将控制权交给页面，更灵活
 */
export default new API(window.__YZW__API__, window.__YZW__API__CONFIG__)
