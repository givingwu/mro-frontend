import { ajax } from 'jquery'

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

export const ERROR_MSG_MAP = {
  401: () => '抱歉，请登录',
  403: () => '抱歉，暂无权限',
  413: () => '抱歉，上传文件内容过大',

  404: () => '服务器迷路了，未寻到这个地址',
  405: () => '服务器无法理解这个请求方法',
  500: () => '服务器开小差，这是一个问题',
  502: () => '网关服务器在跟你开玩笑呢',
  503: () => '服务器不可用，你在跟我开玩笑',
  504: () => '服务器过于拥挤，超时空穿越了'
}

export function getErrorMsg (data, status, statusText) {
  let msg = ''

  if (typeof data !== 'object') {
    msg = ERROR_MSG_MAP[status]
  } else {
    msg = data.statusText || data.message
  }

  return msg || statusText || 'Uncaught (in yzw/http)'
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
      let globalConfig = (this.API_CONFIG && this.API_CONFIG[key]) || {}

      if (!value) return
      if (/:|\s/g.test(value)) {
        value = value.split(/:|\s/g)
      } else {
        value = ['get', value]
      }

      const [method, url, apiMethodName] = value

      this[`${apiMethodName || this._getValidKey(key, this._checkMethod(method))}`] = (
        data,
        config
      ) => {
        return this._request(url, {
          type: method,
          data,
          ...globalConfig,
          ...config
        })
      }
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
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      headers: {},
      ifModified: false,
      statusCode: ERROR_MSG_MAP,
      beforeSend () {},
      success () {},
      error () {},
      ...config
    }

    if (config.dataType === 'json') {
      config.data = JSON.stringify(config.data)
    }

    return ajax(url, config)
      .done((data) => {
        return data
      })
  }
}

/**
 * 默认将全局变量 __YZW__API__ 作为 API 对象生成方法
 * 默认将全局变量 __YZW__API__CONFIG__ 作为 API 的配置对象
 * 将控制权交给页面，更灵活
 */
export default new API(window.__YZW__API__, window.__YZW__API__CONFIG__)
