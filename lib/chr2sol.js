module.exports = {
  toSol: toSol
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



var RESERVED_WORDS = [
  ''
]

function toSolidityLine(line){
  var solidityLine = ""
  switch(line.type){
    case "IfStatement": 
      if(line.alternate){
        solidityLine += `
    if(${line.test.value}){
      ${line.consequent.body.map(_line=> toSolidityLine(_line) ).join("\n")}
    } else {
      ${line.alternate.body.map(_line=> toSolidityLine(_line) ).join("\n")}
    }
        `
      } else {
        solidityLine += `
    if(${line.test.value}){
      ${line.consequent.body.map(_line=> toSolidityLine(_line) ).join("\n")}
    }
        `
      }
    break;
    case "ForStatement": 
      solidityLine += `
    for(${line.init.kind} ${line.init.declarations[0].id.name}=${line.init.declarations[0].init.value}; ${line.test.left.name}${line.test.operator}${line.test.right.value}; ${line.update.argument.name}${line.update.operator}){
      ${line.body.body.map(_line=> toSolidityLine(_line) ).join("\n")}
    }
      `
    break;
    case "ExpressionStatement": 
      const expr = line.expression
      switch(expr.type){
        case "Literal":
          solidityLine+=`"${expr.value}"`
        break;
        case "CallExpression":
          const callee = expr.callee
          const args = expr.arguments.map(arg=> arg.value ).join(", ")
          if(callee.object){
            solidityLine += `${callee.object.name}.${callee.property.name}(${args});`
          } else {
            solidityLine += `    ${callee.name}(${args});`
          }
        break;
        case "AssignmentExpression":
          solidityLine += toFormula(expr)
        break;

        default: console.error("ExpressionStatement:default",expr)
      }
    break;
    case "VariableDeclaration":
      solidityLine += toDeclaration(line.declarations)
    break;
    default: console.error("default",line);
  }
  return solidityLine
}

function toFormula(expr){
  function formulate(expr){
    if(expr.type == "Identifier") {
      return expr.name
    } else if(expr.type == "Literal") {
      return expr.value
    } else {
      return `${formulate(expr.left)} ${expr.operator} ${formulate(expr.right)}`
    }
  }
  return formulate(expr)
}

function toDeclaration(decs){
  var solidityLine = ""
  const dec = decs[0]
  if(dec.init.type == "FunctionExpression"){
    throw new Error("Current spec doesn't allow func def inside clause. Use private declaration outside a clause.");
    /*
    solidityLine += `var ${dec.id.name} = function(${dec.init.params.map(p=> p.name ).join(", ")}){
      `
    var stmts = dec.init.body.body
    stmts.map(stmt=>{
      if(stmt.type == "ReturnStatement"){
        solidityLine += `      return ${stmt.argument.name};`
      } else {
        solidityLine += toDeclaration(stmt.declarations)
      }
    })
    solidityLine += `
    }
    `
    */
  } else if (dec.init.type == "BinaryExpression") {
    solidityLine += `var ${dec.id.name} = ${toFormula(dec.init)};\n`
  }
  return solidityLine
}