'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
exports.generateId = (bytes = 32) =>
  range(bytes).map(getRandomByte).map(toHex).join('')
const range = (length) => Array.from({length})
const getRandomBit = () => Math.round(Math.random())
const concatenateBits = (accumulator, bit, i) => accumulator + (bit << i)
const getRandomByte = () => range(8).map(getRandomBit).reduce(concatenateBits)
const toHex = (n) => n.toString(16).toUpperCase().padStart(2, '0')
