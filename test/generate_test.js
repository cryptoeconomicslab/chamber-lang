const assert = require('assert');

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const generator = require('../lib/index');


describe('generate', function() {

  describe('SimpleToken.chr', function() {
    describe('generate solidity', function() {
      it('should parse the chamber lang and generate solidity source code', function(done) {
        const src = fs.readFileSync(path.join(__dirname, '../contracts/SimpleToken.chr'));
        const output = generator(src, 'sol');
        assert.equal(output.toString().length > 0, true);
        fs.writeFileSync(path.join(__dirname, '../contracts/SimpleToken.sol'), output);
        done();
      });
    })

    describe('generate javascript', function() {
      it('should parse the chamber lang and generate JavaScript source code', function(done) {
        const src = fs.readFileSync(path.join(__dirname, '../contracts/SimpleToken.chr'));
        const output = generator(src, 'js');
        assert.equal(output.toString().length > 0, true);
        fs.writeFileSync(path.join(__dirname, '../contracts/SimpleToken.js'), output);
        done();
      });
    })
  })

  describe('SellOrder.chr', function() {
    describe('generate solidity', function() {
      it('should parse the chamber lang and generate solidity source code', function(done) {
        const src = fs.readFileSync(path.join(__dirname, '../contracts/SellOrder.chr'));
        const output = generator(src, 'sol');
        assert.equal(output.toString().length > 0, true);
        fs.writeFileSync(path.join(__dirname, '../contracts/SellOrder.sol'), output);
        done();
      });
    })

    describe('generate javascript', function() {
      it('should parse the chamber lang and generate JavaScript source code', function(done) {
        const src = fs.readFileSync(path.join(__dirname, '../contracts/SellOrder.chr'));
        const output = generator(src, 'js');
        assert.equal(output.toString().length > 0, true);
        fs.writeFileSync(path.join(__dirname, '../contracts/SellOrder.js'), output);
        done();
      });
    })
  })


  describe('MultisigGame.chr', function() {
    describe('generate solidity', function() {
      it('should parse the chamber lang and generate solidity source code', function(done) {
        const src = fs.readFileSync(path.join(__dirname, '../contracts/MultisigGame.chr'));
        const output = generator(src, 'sol');
        assert.equal(output.toString().length > 0, true);
        fs.writeFileSync(path.join(__dirname, '../contracts/MultisigGame.sol'), output);
        done();
      });
    })

    describe('generate javascript', function() {
      it('should parse the chamber lang and generate JavaScript source code', function(done) {
        const src = fs.readFileSync(path.join(__dirname, '../contracts/MultisigGame.chr'));
        const output = generator(src, 'js');
        assert.equal(output.toString().length > 0, true);
        fs.writeFileSync(path.join(__dirname, '../contracts/MultisigGame.js'), output);
        done();
      });
    })
  })
});
