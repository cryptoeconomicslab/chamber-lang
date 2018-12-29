const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const compiler = require('./compiler');
const { toSol } = require('./chr2sol')
const { toJs } = require('./chr2js')

module.exports = function(src, ext) {
  const solTemplate = fs.readFileSync(path.join(__dirname, `../lib/${ext}.ejs`));
  var result = compiler(src.toString());

  if(ext == "js"){
    result = toJs(result)
  } else if (ext == "sol"){
    result = toSol(result)
  } else {
    throw new Error(ext+" isn't supported.")
  }
  const template = ejs.compile(solTemplate.toString(), {});
  const output = template({
    contract: result
  });
  console.log(output);
  return output;  
}