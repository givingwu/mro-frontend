import $, { extend } from 'jquery'

const defaultOptions = {
  wrapper: '.J_Preview',
  current: '.J_PreviewImageCurrent',
  prevBtn: '.J_PreviewPrev',
  nextBtn: '.J_PreviewNext',
}

class PreviewSwitcher {
  constructor(options) {
    this.options = extend({}, options)
  }
}

export default PreviewSwitcher
