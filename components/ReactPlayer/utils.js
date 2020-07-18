// eslint-disable-next-line
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = []
    var _n = true
    var _d = false
    var _e = undefined
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value)
        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      /*eslint no-unsafe-finally: 0*/
      try {
        if (!_n && _i['return']) _i['return']()
      } finally {
        if (_d) throw _e
      }
    }
    return _arr
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i)
    } else {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance',
      )
    }
  }
})()

exports.parseStartTime = parseStartTime
var MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/
var MATCH_START_STAMP = /(\d+)(h|m|s)/g
var MATCH_NUMERIC = /^\d+$/

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
function parseStartTime(url) {
  var match = url.match(MATCH_START_QUERY)
  if (match) {
    var stamp = match[1]
    if (stamp.match(MATCH_START_STAMP)) {
      return parseStartStamp(stamp)
    }
    if (MATCH_NUMERIC.test(stamp)) {
      return parseInt(stamp, 10)
    }
  }
  return 0
}

function parseStartStamp(stamp) {
  var seconds = 0
  var array = MATCH_START_STAMP.exec(stamp)
  while (array !== null) {
    var _array = array,
      _array2 = _slicedToArray(_array, 3),
      count = _array2[1],
      period = _array2[2]

    if (period === 'h') seconds += parseInt(count, 10) * 60 * 60
    if (period === 'm') seconds += parseInt(count, 10) * 60
    if (period === 's') seconds += parseInt(count, 10)
    array = MATCH_START_STAMP.exec(stamp)
  }
  return seconds
}
