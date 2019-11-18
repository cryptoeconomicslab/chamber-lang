const assert = require('assert')

const fs = require('fs')
const path = require('path')
const { compile } = require('../lib/index')
const pegSrc = load('../lib/chamber.txt').replace(/\\\\/g, '\\')
const solTemplate = load('../lib/sol.ejs')

function load(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath)).toString()
}

describe('generate', function() {
  describe('checkpoint.txt', function() {
    it('should generate solidity code', function(done) {
      const src = fs.readFileSync(
        path.join(__dirname, '../examples/checkpoint.txt')
      )
      const output = compile(src, solTemplate, pegSrc)
      assert(output.length > 0)
      done()
    })
  })
  describe('order.txt', function() {
    it('should generate solidity code', function(done) {
      const src = fs.readFileSync(path.join(__dirname, '../examples/order.txt'))
      const output = compile(src, solTemplate, pegSrc)
      assert(output.length > 0)
      done()
    })
  })
})
