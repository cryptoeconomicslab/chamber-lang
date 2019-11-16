const utils = require('./utils')

function calculateInteractiveNodes(properties) {
  return properties.reduce(
    (acc, p) => acc.concat(calculateInteractiveNodesPerProperty(p)),
    []
  )
}

function calculateInteractiveNodesPerProperty(p) {
  const name = p.dec.predicate
  let newContracts = []
  const rootContract = searchInteractiveNode(
    newContracts,
    p.statement[0],
    p,
    name,
    ''
  )
  return newContracts
}

/**
 * Disassembles tree
 * @param {*} property
 * @param {*} name
 * @param {*} depth
 */
function searchInteractiveNode(contracts, property, parent, name, suffix) {
  if (utils.isNotAtomicProposition(property.predicate)) {
    const newContract = {
      dec: {
        isCompiled: true,
        originalPredicateName: name,
        predicate: makeContractName(name, suffix),
        inputDefs: getArguments(property),
        inputs: getInputIndex(parent.dec.inputDefs, getArguments(property))
      },
      statement: property
    }
    let children = []
    let newSuffix = suffix + property.predicate[0]
    if (
      property.predicate == 'ForAllSuchThat' ||
      property.predicate == 'ThereExistsSuchThat'
    ) {
      // quantifier
      children[0] = searchInteractiveNode(
        contracts,
        property.inputDefs[0],
        newContract
      )
      // innerProperty
      children[2] = searchInteractiveNode(
        contracts,
        property.inputDefs[2],
        newContract,
        name,
        newSuffix
      )
    } else if (
      property.predicate == 'And' ||
      property.predicate == 'Or' ||
      property.predicate == 'Not'
    ) {
      property.inputDefs.forEach((p, i) => {
        children[i] = searchInteractiveNode(
          contracts,
          p,
          newContract,
          name,
          newSuffix + (i + 1)
        )
      })
    }
    newContract.statement.compiledChildren = children
    // If not atomic proposition, generate a contract
    contracts.push(newContract)
    return newContract
  } else {
    const processedProperty = processBindOperator(property)
    return {
      dec: {
        originalPredicateName: processedProperty.predicate,
        predicate: processedProperty.predicate,
        inputDefs: processedProperty.inputDefs,
        inputs: getInputIndex(parent.dec.inputDefs, processedProperty.inputDefs)
      }
    }
  }
}

function processBindOperator(property) {
  if (
    utils.isComparisonPredicate(property.predicate) &&
    property.inputDefs[0].syntax == 'bind'
  ) {
    return {
      predicate: property.predicate,
      inputDefs: [
        property.inputDefs[0].parent,
        // TODO: constant value
        property.inputDefs[0].child,
        property.inputDefs[1]
      ]
    }
  } else {
    return property
  }
}

function getInputIndex(inputDefs, inputs) {
  return inputs.map(name => {
    return inputDefs.indexOf(name)
  })
}

function getArguments(property) {
  let args = []
  if (
    property.predicate == 'ForAllSuchThat' ||
    property.predicate == 'ThereExistsSuchThat'
  ) {
    args = args.concat(getArguments(property.inputDefs[0]))
    const variable = property.inputDefs[1]
    const innerArgs = getArguments(property.inputDefs[2])
    args = args.concat(innerArgs.filter(a => a != variable))
  } else {
    property.inputDefs.forEach(p => {
      if (typeof p == 'object' && !!p.predicate) {
        args = args.concat(getArguments(p))
      } else {
        if (p.syntax == 'bind') {
          args.push(p.parent)
        } else {
          args.push(p)
        }
      }
    })
  }
  return args.filter(function(x, i, self) {
    return self.indexOf(x) === i
  })
}

function makeContractName(name, suffix) {
  return utils.toCapitalCase(name) + suffix
}

module.exports = {
  calculateInteractiveNodes
}
