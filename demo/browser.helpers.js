import { isObject } from '@feugene/mu/src/is'

export default function() {
  window.l = (...value) => {
    console.log(...value)
  }

  window.ll = (...value) => {
    console.group('ll')

    Array.from(value).forEach(item => {
      if (isObject(item)) {
        console.dir(item)
      } else if (item instanceof Error || item instanceof HTMLElement || item instanceof DOMImplementation) {
        console.error(item)
      } else {
        console.log(item)
      }
    })

    console.groupEnd()
  }

  window.d = (...value) => {
    console.dir(...value)
  }
}
