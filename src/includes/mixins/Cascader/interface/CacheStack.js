/**
 * FIFO Stack Cached Class
 */
export default class CacheStack {
  constructor (maxLength) {
    /* Array like Object */
    this.cachedPool = {}
    this.maxLength = maxLength
    // this.pointer = -1 /* stack pointer */
  }

  get (key) {
    // eslint-disable-next-line
    return this.cachedPool[key] || null
  }

  set (key, ele) {
    if (!this.get(key)) {
      if (this.isOverflow()) {
        // delete previous value of the top of CacheStack
        delete this.cachedPool[this.getStackTopKey()]
      }
    }

    // eslint-disable-next-line
    return this.cachedPool[key] = ele
  }

  getCachedKeys () {
    return Object.keys(this.cachedPool)
  }

  /* getStackPointer () {
    const nextPointer = ++this.pointer

    if (nextPointer < this.maxLength) {
      return nextPointer
    } else {
      // eslint-disable-next-line
      return this.pointer = 0
    }
  } */

  getStackTopKey () {
    return this.getCachedKeys()[0]
  }

  isOverflow () {
    return this.getCachedKeys().length >= this.maxLength
  }
}
