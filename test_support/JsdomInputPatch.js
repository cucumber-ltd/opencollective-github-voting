/*
This script patches JSDOM so it fires "change" events after setting the .value of an <input> field.
 */

const { JSDOM } = require('jsdom')

const document = new JSDOM(`<input type="text">`).window.document
const HTMLInputElement = Object.getPrototypeOf(document.querySelector('input'))
const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement, 'value')
const setOrig = descriptor.set
descriptor.set = function(value) {
  setOrig.call(this, value)
  const e = document.createEvent('UIEvents')
  e.initEvent('change', true, true)
  this.dispatchEvent(e)
}
Object.defineProperty(HTMLInputElement, 'value', descriptor)