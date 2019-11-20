const utils = require('./utils')


/**
 * 
 * @param {*} claimDefinitions are definition of claim
 * ```
 * def ownership(owner) :=
 * with Tx(su) as tx {
 *   with Signature() as signature {
 *     SignedBy(tx, owner, signature)
 *   }
 * }
 * ```
 * ```
 * {
 *   "dec": {
 *     "predicate": predicate name,
 *     "inputDefs": ["argument name"...]
 *   },
 *   "statement": [
 *     "predicate": 
 *     "inputDefs": [property or constant...]
 *   ]
 * }
 * ```
 */
function calculateInteractiveNodes(claimDefinitions) {
  console.log(JSON.parse(JSON.stringify(claimDefinitions)))
  return claimDefinitions.map(calculateInteractiveNodesPerProperty)
  /*
  return claimDefinitions.reduce(
    (acc, p) => acc.concat(calculateInteractiveNodesPerProperty(p)),
    []
  )
  */
}

function calculateInteractiveNodesPerProperty(p) {
  const name = utils.toCapitalCase(p.dec.predicate)
  let newContracts = []
  searchInteractiveNode(
    newContracts,
    p.statement[0],
    p,
    name,
    ''
  )
  return {
    dec: {
      predicate: name,
      inputDefs: p.dec.inputDefs
    },
    implicitPredicates: newContracts
  }
}

/**
 * searchInteractiveNode
 * @param {*} contracts 
 * @param {*} property 
 * @param {*} parent 
 * @param {*} name 
 * @param {*} parentSuffix 
 */
function searchInteractiveNode(contracts, property, parent, name, parentSuffix) {
  if (utils.isNotAtomicProposition(property.predicate)) {
    let suffix = parentSuffix + property.predicate[0]
    const newInputDefs = [makeContractName(name, suffix)].concat(getArguments(property))
    const newContract = {
      dec: {
        isCompiled: true,
        originalPredicateName: name,
        predicate: makeContractName(name, suffix),
        inputDefs: newInputDefs,
        inputs: getInputIndex(parent.dec.inputDefs, newInputDefs)
      },
      statement: property
    }
    let children = []
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
        suffix
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
          suffix + (i + 1)
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
