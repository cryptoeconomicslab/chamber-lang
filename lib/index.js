const ejs = require('ejs')
const parse = require('./parser')
const calculator = require('./cal')

function compile(src, templateSrc, pegSrc) {
  const result = parse(src.toString(), pegSrc)
  const claimDefs = calculator.calculateInteractiveNodes(result)

  const template = ejs.compile(templateSrc.toString(), {})
  console.log(claimDefs)

  const output = template({
    claimDefs
  })
  return output
}

module.exports = {
  compile
}
