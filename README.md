# OGS online compiler

[![Build Status](https://travis-ci.org/cryptoeconomicslab/online-ogs-editor.svg?branch=master)](https://travis-ci.org/cryptoeconomicslab/online-ogs-editor)

### DEMO

https://ovm-compiler.netlify.app/

### How to install

```
npm i
```

### How to run

```
npm start
```

open http:localhost:1234

### How to make custom transaction?

1. define deprecate condition with predicate contract

2. write payout contract

We also need to implement a PayoutContract for payment processing.
This is for post-processing and additional disputes the withdrawal fund if this State is exited without deprecating it.

3. deploy contracts
4. make custom transaction
