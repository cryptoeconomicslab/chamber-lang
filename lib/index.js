const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const compiler = require('./compiler');


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

function toJs(result){
  return result
}
function toSol(result){
  result.clauses = result.clauses.map(clause=>{
    const lines = clause.statement.body
    const solidityLines = lines.map(line=>{
      var solidityLine = toSolidityLine(line)
      return solidityLine
    })
    clause.statement.body = solidityLines.join("\n")
    return clause
  })
  return result
}
function toSolidityLine(line){
  var solidityLine = ""
  switch(line.type){
    case "IfStatement": 
      solidityLine += `
    if(${line.test.value}){
      ${line.consequent.body.map(_line=> toSolidityLine(_line) ).join("\n")}
    }
      `
    break;
    case "ForStatement": 
      solidityLine += `
    for(${line.init.kind} ${line.init.declarations[0].id.name}=${line.init.declarations[0].init.value}; ${line.test.left.name}${line.test.operator}${line.test.right.value}; ${line.update.argument.name}${line.update.operator}){
      ${line.body.body.map(_line=> toSolidityLine(_line) ).join("\n")}
    }
      `
    break;
    case "ExpressionStatement": 
      var object = line.expression.callee.object
      var property = line.expression.callee.property
      var value = line.expression.arguments.map(arg=> arg.value ).join(", ")
      solidityLine += `${object.name}.${property.name}(${value});`
    break;
    default:
      console.log(line);
  }
  return solidityLine
}