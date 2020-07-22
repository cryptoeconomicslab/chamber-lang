# Gazelle Custom State Editor

[![Build Status](https://travis-ci.org/cryptoeconomicslab/online-ogs-editor.svg?branch=master)](https://travis-ci.org/cryptoeconomicslab/online-ogs-editor)

## DEMO

https://ogs-editor.netlify.app/

## How to make custom transaction?

This DSL is used for Gazelle smart contracts [here](https://github.com/cryptoeconomicslab/ovm-contracts/blob/master/contracts/Predicate/plasma/OwnershipPredicate.ovm). With this DSL, developers can define new deprecation conditions that can be used with Plasma. The full guide is coming soon.

1. define deprecate condition with predicate contract

define StateObject and use in Gazelle.

```
client.sendTransaction(token, amount, StateObject.create(deployed address, inputs...))
```

2. write payout contract

We also need to implement a PayoutContract for payment processing.
This is for post-processing and additional disputes the withdrawal fund if this State is exited without deprecating it.

3. deploy contracts
4. make custom transaction

## Development

### How to install

```
npm i
```

### How to run

```
npm start
```

open http:localhost:1234
