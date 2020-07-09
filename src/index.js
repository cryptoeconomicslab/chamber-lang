const CodeMirror = require('codemirror')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/python/python')
require('codemirror/lib/codemirror.css')
require('codemirror/theme/yonce.css')
require('babel-polyfill')
const {
  generateSolidityCode
} = require('@cryptoeconomicslab/ovm-solidity-generator')

const ownership = require('../examples/ownership.txt')
const swap = require('../examples/swap.txt')
const order = require('../examples/order.txt')
const fastFinality = require('../examples/ff.txt')
const examples = {
  ownership,
  swap,
  order,
  fastFinality
}

function main() {
  const codearea = document.getElementById('codearea')
  const solidity = document.getElementById('solidity')
  const messageDom = document.getElementById('message')

  codearea.textContent = examples.ownership
  const inputArea = CodeMirror.fromTextArea(codearea, {
    lineNumbers: true,
    theme: 'yonce',
    mode: 'python'
  })
  const outputArea = CodeMirror.fromTextArea(solidity, {
    lineNumbers: true,
    theme: 'yonce',
    readOnly: true,
    mode: 'javascript'
  })
  inputArea.on('change', function (instance) {
    try {
      compile(instance)
    } catch (e) {
      console.error(e)
      messageDom.innerText =
        'parse error at line ' +
        e.location.start.line +
        ' column ' +
        e.location.start.column
      messageDom.className = 'error'
    }
  })
  compile(inputArea)

  delegate(document.querySelector('.btns'), '.example', 'click', (e) => {
    const exampleName = e.target.id
    inputArea.setValue(examples[exampleName])
  })

  function compile(instance) {
    generateSolidityCode(instance.getValue(), () => {}).then((result) => {
      outputArea.setValue(result)
      messageDom.innerText = 'succeed'
      messageDom.className = 'success'
    })
  }
}

main()

/* Utils */

function on(target, type, callback, useCapture) {
  if (target.addEventListener) {
    target.addEventListener(type, callback, !!useCapture)
  } else {
    target.attachEvent('on' + type, function () {
      callback.call(target)
    })
  }
}

function delegate(target, selector, type, handler) {
  function dispatchEvent(event) {
    var targetElement = event.target
    var potentialElements = qsa(selector, target)
    var hasMatch =
      Array.prototype.indexOf.call(potentialElements, targetElement) >= 0
    var hasMatchParent =
      Array.prototype.indexOf.call(
        potentialElements,
        targetElement.parentElement
      ) >= 0

    if (hasMatch) {
      handler.call(targetElement, event)
    } else if (hasMatchParent) {
      handler.call(targetElement.parentElement, event)
    }
  }

  var useCapture = type === 'blur' || type === 'focus'
  on(target, type, dispatchEvent, useCapture)
}

function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector)
}
