/****************************************************************************
 * Copyright (C) 2021, Bitmovin, Inc., All Rights Reserved
 *
 * This source code and its use and distribution, is subject to the terms
 * and conditions of the applicable license agreement.
 *
 * Bitmovin Player Version 8.52.0
 *
 ****************************************************************************/
;(function () {
  !(function (e) {
    if ('object' == typeof exports && 'undefined' != typeof module)
      module.exports = e()
    else if ('function' == typeof define && define.amd) define([], e)
    else {
      var t
      ;(t =
        'undefined' != typeof window
          ? window
          : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
          ? self
          : this),
        ((t.bitmovin || (t.bitmovin = {})).playerui = e())
    }
  })(function () {
    return (function e(t, n, o) {
      function i(s, a) {
        if (!n[s]) {
          if (!t[s]) {
            var l = 'function' == typeof require && require
            if (!a && l) return l(s, !0)
            if (r) return r(s, !0)
            var c = new Error("Cannot find module '" + s + "'")
            throw ((c.code = 'MODULE_NOT_FOUND'), c)
          }
          var u = (n[s] = {exports: {}})
          t[s][0].call(
            u.exports,
            function (e) {
              var n = t[s][1][e]
              return i(n || e)
            },
            u,
            u.exports,
            e,
            t,
            n,
            o,
          )
        }
        return n[s].exports
      }
      for (
        var r = 'function' == typeof require && require, s = 0;
        s < o.length;
        s++
      )
        i(o[s])
      return i
    })(
      {
        1: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ArrayUtils = void 0)
            !(function (e) {
              function t(e, t) {
                var n = e.indexOf(t)
                return n > -1 ? e.splice(n, 1)[0] : null
              }
              e.remove = t
            })(n.ArrayUtils || (n.ArrayUtils = {}))
          },
          {},
        ],
        2: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AudioTrackSwitchHandler = void 0)
            var o = e('./localization/i18n'),
              i = (function () {
                function e(e, t, n) {
                  var i = this
                  ;(this.addAudioTrack = function (e) {
                    var t = e.track
                    i.listElement.hasItem(t.id) ||
                      i.listElement.addItem(t.id, o.i18n.getLocalizer(t.label))
                  }),
                    (this.removeAudioTrack = function (e) {
                      var t = e.track
                      i.listElement.hasItem(t.id) &&
                        i.listElement.removeItem(t.id)
                    }),
                    (this.selectCurrentAudioTrack = function () {
                      var e = i.player.getAudio()
                      e && i.listElement.selectItem(e.id)
                    }),
                    (this.refreshAudioTracks = function () {
                      var e = i.player.getAvailableAudio(),
                        t = function (e) {
                          return {key: e.id, label: e.label}
                        }
                      i.listElement.synchronizeItems(e.map(t)),
                        i.selectCurrentAudioTrack()
                    }),
                    (this.player = e),
                    (this.listElement = t),
                    (this.uimanager = n),
                    this.bindSelectionEvent(),
                    this.bindPlayerEvents(),
                    this.refreshAudioTracks()
                }
                return (
                  (e.prototype.bindSelectionEvent = function () {
                    var e = this
                    this.listElement.onItemSelected.subscribe(function (t, n) {
                      e.player.setAudio(n)
                    })
                  }),
                  (e.prototype.bindPlayerEvents = function () {
                    this.player.on(
                      this.player.exports.PlayerEvent.AudioChanged,
                      this.selectCurrentAudioTrack,
                    ),
                      this.player.on(
                        this.player.exports.PlayerEvent.SourceUnloaded,
                        this.refreshAudioTracks,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.PeriodSwitched,
                        this.refreshAudioTracks,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.AudioAdded,
                        this.addAudioTrack,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.AudioRemoved,
                        this.removeAudioTrack,
                      ),
                      this.uimanager
                        .getConfig()
                        .events.onUpdated.subscribe(this.refreshAudioTracks)
                  }),
                  e
                )
              })()
            n.AudioTrackSwitchHandler = i
          },
          {'./localization/i18n': 82},
        ],
        3: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.BrowserUtils = void 0)
            var o = (function () {
              function e() {}
              return (
                Object.defineProperty(e, 'isMobile', {
                  get: function () {
                    return (
                      !!this.windowExists() &&
                      navigator &&
                      navigator.userAgent &&
                      /Mobi/.test(navigator.userAgent)
                    )
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e, 'isChrome', {
                  get: function () {
                    return (
                      !!this.windowExists() &&
                      navigator &&
                      navigator.userAgent &&
                      /Chrome/.test(navigator.userAgent)
                    )
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e, 'isAndroid', {
                  get: function () {
                    return (
                      !!this.windowExists() &&
                      navigator &&
                      navigator.userAgent &&
                      /Android/.test(navigator.userAgent)
                    )
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e, 'isIOS', {
                  get: function () {
                    return (
                      !!this.windowExists() &&
                      navigator &&
                      navigator.userAgent &&
                      /iPad|iPhone|iPod/.test(navigator.userAgent)
                    )
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e, 'isMacIntel', {
                  get: function () {
                    return (
                      !!this.windowExists() &&
                      navigator &&
                      navigator.userAgent &&
                      'MacIntel' === navigator.platform
                    )
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e, 'isTouchSupported', {
                  get: function () {
                    return (
                      !!this.windowExists() &&
                      ('ontouchstart' in window ||
                        (navigator &&
                          navigator.userAgent &&
                          (navigator.maxTouchPoints > 0 ||
                            navigator.msMaxTouchPoints > 0)))
                    )
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                (e.windowExists = function () {
                  return 'undefined' != typeof window
                }),
                e
              )
            })()
            n.BrowserUtils = o
          },
          {},
        ],
        4: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AdClickOverlay = void 0)
            var i = e('./clickoverlay'),
              r = (function (e) {
                function t() {
                  return (null !== e && e.apply(this, arguments)) || this
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = null
                    t.on(t.exports.PlayerEvent.AdStarted, function (e) {
                      var t = e.ad
                      o.setUrl(t.clickThroughUrl), (i = t.clickThroughUrlOpened)
                    })
                    var r = function () {
                      o.setUrl(null)
                    }
                    t.on(t.exports.PlayerEvent.AdFinished, r),
                      t.on(t.exports.PlayerEvent.AdSkipped, r),
                      t.on(t.exports.PlayerEvent.AdError, r),
                      this.onClick.subscribe(function () {
                        t.pause('ui-ad-click-overlay'), i && i()
                      })
                  }),
                  t
                )
              })(i.ClickOverlay)
            n.AdClickOverlay = r
          },
          {'./clickoverlay': 16},
        ],
        5: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AdMessageLabel = void 0)
            var i = e('./label'),
              r = e('../stringutils'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-label-ad-message',
                        text: s.i18n.getLocalizer('ads.remainingTime'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getConfig(),
                      a = i.text,
                      l = function () {
                        o.setText(
                          r.StringUtils.replaceAdMessagePlaceholders(
                            s.i18n.performLocalization(a),
                            null,
                            t,
                          ),
                        )
                      },
                      c = function (e) {
                        var n = e.ad.uiConfig
                        ;(a = (n && n.message) || i.text),
                          l(),
                          t.on(t.exports.PlayerEvent.TimeChanged, l)
                      },
                      u = function () {
                        t.off(t.exports.PlayerEvent.TimeChanged, l)
                      }
                    t.on(t.exports.PlayerEvent.AdStarted, c),
                      t.on(t.exports.PlayerEvent.AdSkipped, u),
                      t.on(t.exports.PlayerEvent.AdError, u),
                      t.on(t.exports.PlayerEvent.AdFinished, u)
                  }),
                  t
                )
              })(i.Label)
            n.AdMessageLabel = a
          },
          {'../localization/i18n': 82, '../stringutils': 88, './label': 26},
        ],
        6: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AdSkipButton = void 0)
            var i = e('./button'),
              r = e('../stringutils'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-button-ad-skip',
                        untilSkippableMessage: 'Skip ad in {remainingTime}',
                        skippableMessage: 'Skip ad',
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getConfig(),
                      s = i.untilSkippableMessage,
                      a = i.skippableMessage,
                      l = -1,
                      c = function () {
                        o.show(),
                          t.getCurrentTime() < l
                            ? (o.setText(
                                r.StringUtils.replaceAdMessagePlaceholders(
                                  s,
                                  l,
                                  t,
                                ),
                              ),
                              o.disable())
                            : (o.setText(a), o.enable())
                      },
                      u = function (e) {
                        var n = e.ad
                        ;(l = n.skippableAfter),
                          (s =
                            (n.uiConfig && n.uiConfig.untilSkippableMessage) ||
                            i.untilSkippableMessage),
                          (a =
                            (n.uiConfig && n.uiConfig.skippableMessage) ||
                            i.skippableMessage),
                          'number' == typeof l && l >= 0
                            ? (c(), t.on(t.exports.PlayerEvent.TimeChanged, c))
                            : o.hide()
                      },
                      p = function () {
                        t.off(t.exports.PlayerEvent.TimeChanged, c)
                      }
                    t.on(t.exports.PlayerEvent.AdStarted, u),
                      t.on(t.exports.PlayerEvent.AdSkipped, p),
                      t.on(t.exports.PlayerEvent.AdError, p),
                      t.on(t.exports.PlayerEvent.AdFinished, p),
                      this.onClick.subscribe(function () {
                        t.ads.skip()
                      })
                  }),
                  t
                )
              })(i.Button)
            n.AdSkipButton = s
          },
          {'../stringutils': 88, './button': 12},
        ],
        7: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AirPlayToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-airplaytogglebutton',
                        text: r.i18n.getLocalizer('appleAirplay'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    if (
                      (e.prototype.configure.call(this, t, n),
                      !t.isAirplayAvailable)
                    )
                      return void this.hide()
                    this.onClick.subscribe(function () {
                      t.isAirplayAvailable()
                        ? t.showAirplayTargetPicker()
                        : console && console.log('AirPlay unavailable')
                    })
                    var i = function () {
                        t.isAirplayAvailable() ? o.show() : o.hide()
                      },
                      r = function () {
                        t.isAirplayActive() ? o.on() : o.off()
                      }
                    t.on(t.exports.PlayerEvent.AirplayAvailable, i),
                      t.on(t.exports.PlayerEvent.AirplayChanged, r),
                      i(),
                      r()
                  }),
                  t
                )
              })(i.ToggleButton)
            n.AirPlayToggleButton = s
          },
          {'../localization/i18n': 82, './togglebutton': 67},
        ],
        8: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AudioQualitySelectBox = void 0)
            var i = e('./selectbox'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-audioqualityselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = function () {
                        o.selectItem(t.getAudioQuality().id)
                      },
                      s = function () {
                        var e = t.getAvailableAudioQualities()
                        o.clearItems(),
                          o.addItem('auto', r.i18n.getLocalizer('auto'))
                        for (var n = 0, s = e; n < s.length; n++) {
                          var a = s[n]
                          o.addItem(a.id, a.label)
                        }
                        i()
                      }
                    this.onItemSelected.subscribe(function (e, n) {
                      t.setAudioQuality(n)
                    }),
                      t.on(t.exports.PlayerEvent.AudioChanged, s),
                      t.on(t.exports.PlayerEvent.SourceUnloaded, s),
                      t.on(t.exports.PlayerEvent.PeriodSwitched, s),
                      t.on(t.exports.PlayerEvent.AudioQualityChanged, i),
                      t.exports.PlayerEvent.AudioQualityAdded &&
                        (t.on(t.exports.PlayerEvent.AudioQualityAdded, s),
                        t.on(t.exports.PlayerEvent.AudioQualityRemoved, s)),
                      n.getConfig().events.onUpdated.subscribe(s)
                  }),
                  t
                )
              })(i.SelectBox)
            n.AudioQualitySelectBox = s
          },
          {'../localization/i18n': 82, './selectbox': 39},
        ],
        9: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AudioTrackListBox = void 0)
            var i = e('./listbox'),
              r = e('../audiotrackutils'),
              s = (function (e) {
                function t() {
                  return (null !== e && e.apply(this, arguments)) || this
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n),
                      new r.AudioTrackSwitchHandler(t, this, n)
                  }),
                  t
                )
              })(i.ListBox)
            n.AudioTrackListBox = s
          },
          {'../audiotrackutils': 2, './listbox': 27},
        ],
        10: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.AudioTrackSelectBox = void 0)
            var i = e('./selectbox'),
              r = e('../audiotrackutils'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-audiotrackselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n),
                      new r.AudioTrackSwitchHandler(t, this, n)
                  }),
                  t
                )
              })(i.SelectBox)
            n.AudioTrackSelectBox = s
          },
          {'../audiotrackutils': 2, './selectbox': 39},
        ],
        11: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.BufferingOverlay = void 0)
            var i = e('./container'),
              r = e('./component'),
              s = e('../timeout'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.indicators = [
                      new r.Component({
                        tag: 'div',
                        cssClass: 'ui-buffering-overlay-indicator',
                        role: 'img',
                      }),
                      new r.Component({
                        tag: 'div',
                        cssClass: 'ui-buffering-overlay-indicator',
                        role: 'img',
                      }),
                      new r.Component({
                        tag: 'div',
                        cssClass: 'ui-buffering-overlay-indicator',
                        role: 'img',
                      }),
                    ]),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-buffering-overlay',
                        hidden: !0,
                        components: n.indicators,
                        showDelayMs: 1e3,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getConfig(),
                      r = new s.Timeout(i.showDelayMs, function () {
                        o.show()
                      }),
                      a = function () {
                        r.start()
                      },
                      l = function () {
                        r.clear(), o.hide()
                      }
                    t.on(t.exports.PlayerEvent.StallStarted, a),
                      t.on(t.exports.PlayerEvent.StallEnded, l),
                      t.on(t.exports.PlayerEvent.Play, a),
                      t.on(t.exports.PlayerEvent.Playing, l),
                      t.on(t.exports.PlayerEvent.Paused, l),
                      t.on(t.exports.PlayerEvent.Seek, a),
                      t.on(t.exports.PlayerEvent.Seeked, l),
                      t.on(t.exports.PlayerEvent.TimeShift, a),
                      t.on(t.exports.PlayerEvent.TimeShifted, l),
                      t.on(t.exports.PlayerEvent.SourceUnloaded, l),
                      t.isStalled() && this.show()
                  }),
                  t
                )
              })(i.Container)
            n.BufferingOverlay = a
          },
          {'../timeout': 90, './component': 18, './container': 19},
        ],
        12: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Button = void 0)
            var i = e('./component'),
              r = e('../dom'),
              s = e('../eventdispatcher'),
              a = e('../localization/i18n'),
              l = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.buttonEvents = {onClick: new s.EventDispatcher()}),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-button', role: 'button', tabIndex: 0},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.toDomElement = function () {
                    var e = this,
                      t = {
                        id: this.config.id,
                        'aria-label': a.i18n.performLocalization(
                          this.config.ariaLabel || this.config.text,
                        ),
                        class: this.getCssClasses(),
                        type: 'button',
                        'aria-pressed': 'false',
                        tabindex: this.config.tabIndex.toString(),
                      }
                    null != this.config.role && (t.role = this.config.role)
                    var n = new r.DOM('button', t).append(
                      new r.DOM('span', {class: this.prefixCss('label')}).html(
                        a.i18n.performLocalization(this.config.text),
                      ),
                    )
                    return (
                      n.on('click', function () {
                        e.onClickEvent()
                      }),
                      n
                    )
                  }),
                  (t.prototype.setText = function (e) {
                    this.getDomElement()
                      .find('.' + this.prefixCss('label'))
                      .html(a.i18n.performLocalization(e))
                  }),
                  (t.prototype.onClickEvent = function () {
                    this.buttonEvents.onClick.dispatch(this)
                  }),
                  Object.defineProperty(t.prototype, 'onClick', {
                    get: function () {
                      return this.buttonEvents.onClick.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  t
                )
              })(i.Component)
            n.Button = l
          },
          {
            '../dom': 77,
            '../eventdispatcher': 79,
            '../localization/i18n': 82,
            './component': 18,
          },
        ],
        13: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.CastStatusOverlay = void 0)
            var i = e('./container'),
              r = e('./label'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.statusLabel = new r.Label({
                      cssClass: 'ui-cast-status-label',
                    })),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-cast-status-overlay',
                        components: [n.statusLabel],
                        hidden: !0,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      t.on(
                        t.exports.PlayerEvent.CastWaitingForDevice,
                        function (e) {
                          o.show()
                          var t = e.castPayload.deviceName
                          o.statusLabel.setText(
                            s.i18n.getLocalizer('connectingTo', {
                              castDeviceName: t,
                            }),
                          )
                        },
                      ),
                      t.on(t.exports.PlayerEvent.CastStarted, function (e) {
                        o.show()
                        var t = e.deviceName
                        o.statusLabel.setText(
                          s.i18n.getLocalizer('playingOn', {castDeviceName: t}),
                        )
                      }),
                      t.on(t.exports.PlayerEvent.CastStopped, function (e) {
                        o.hide()
                      })
                  }),
                  t
                )
              })(i.Container)
            n.CastStatusOverlay = a
          },
          {'../localization/i18n': 82, './container': 19, './label': 26},
        ],
        14: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.CastToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-casttogglebutton',
                        text: r.i18n.getLocalizer('googleCast'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.onClick.subscribe(function () {
                        t.isCastAvailable()
                          ? t.isCasting()
                            ? t.castStop()
                            : t.castVideo()
                          : console && console.log('Cast unavailable')
                      })
                    var i = function () {
                      t.isCastAvailable() ? o.show() : o.hide()
                    }
                    t.on(t.exports.PlayerEvent.CastAvailable, i),
                      t.on(
                        t.exports.PlayerEvent.CastWaitingForDevice,
                        function () {
                          o.on()
                        },
                      ),
                      t.on(t.exports.PlayerEvent.CastStarted, function () {
                        o.on()
                      }),
                      t.on(t.exports.PlayerEvent.CastStopped, function () {
                        o.off()
                      }),
                      i(),
                      t.isCasting() && this.on()
                  }),
                  t
                )
              })(i.ToggleButton)
            n.CastToggleButton = s
          },
          {'../localization/i18n': 82, './togglebutton': 67},
        ],
        15: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.CastUIContainer = void 0)
            var i = e('./uicontainer'),
              r = e('../timeout'),
              s = (function (e) {
                function t(t) {
                  return e.call(this, t) || this
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getConfig(),
                      s = !1,
                      a = function () {
                        n.onControlsHide.dispatch(o), (s = !1)
                      }
                    this.castUiHideTimeout = new r.Timeout(i.hideDelay, a)
                    var l = function () {
                        s || (n.onControlsShow.dispatch(o), (s = !0))
                      },
                      c = function () {
                        l(), o.castUiHideTimeout.clear()
                      },
                      u = function () {
                        l(), o.castUiHideTimeout.start()
                      },
                      p = function () {
                        t.isPlaying() ? u() : c()
                      }
                    t.on(t.exports.PlayerEvent.Play, u),
                      t.on(t.exports.PlayerEvent.Paused, c),
                      t.on(t.exports.PlayerEvent.Seek, c),
                      t.on(t.exports.PlayerEvent.Seeked, p),
                      n.getConfig().events.onUpdated.subscribe(u)
                  }),
                  (t.prototype.release = function () {
                    e.prototype.release.call(this),
                      this.castUiHideTimeout.clear()
                  }),
                  t
                )
              })(i.UIContainer)
            n.CastUIContainer = s
          },
          {'../timeout': 90, './uicontainer': 69},
        ],
        16: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ClickOverlay = void 0)
            var i = e('./button'),
              r = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-clickoverlay', role: n.config.role},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.initialize = function () {
                    e.prototype.initialize.call(this),
                      this.setUrl(this.config.url)
                    var t = this.getDomElement()
                    t.on('click', function () {
                      t.data('url') && window.open(t.data('url'), '_blank')
                    })
                  }),
                  (t.prototype.getUrl = function () {
                    return this.getDomElement().data('url')
                  }),
                  (t.prototype.setUrl = function (e) {
                    ;(void 0 !== e && null != e) || (e = ''),
                      this.getDomElement().data('url', e)
                  }),
                  t
                )
              })(i.Button)
            n.ClickOverlay = r
          },
          {'./button': 12},
        ],
        17: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.CloseButton = void 0)
            var i = e('./button'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-closebutton',
                        text: r.i18n.getLocalizer('close'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n)
                    var o = this.getConfig()
                    this.onClick.subscribe(function () {
                      o.target.hide()
                    })
                  }),
                  t
                )
              })(i.Button)
            n.CloseButton = s
          },
          {'../localization/i18n': 82, './button': 12},
        ],
        18: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Component = void 0)
            var o = e('../guid'),
              i = e('../dom'),
              r = e('../eventdispatcher'),
              s = (function () {
                function e(e) {
                  void 0 === e && (e = {}),
                    (this.componentEvents = {
                      onShow: new r.EventDispatcher(),
                      onHide: new r.EventDispatcher(),
                      onHoverChanged: new r.EventDispatcher(),
                      onEnabled: new r.EventDispatcher(),
                      onDisabled: new r.EventDispatcher(),
                    }),
                    (this.config = this.mergeConfig(
                      e,
                      {
                        tag: 'div',
                        id: 'bmpui-id-' + o.Guid.next(),
                        cssPrefix: 'bmpui',
                        cssClass: 'ui-component',
                        cssClasses: [],
                        hidden: !1,
                        disabled: !1,
                      },
                      {},
                    ))
                }
                return (
                  (e.prototype.initialize = function () {
                    ;(this.hidden = this.config.hidden),
                      (this.disabled = this.config.disabled),
                      this.isHidden() && ((this.hidden = !1), this.hide()),
                      this.isDisabled() &&
                        ((this.disabled = !1), this.disable())
                  }),
                  (e.prototype.configure = function (e, t) {
                    var n = this
                    this.onShow.subscribe(function () {
                      t.onComponentShow.dispatch(n)
                    }),
                      this.onHide.subscribe(function () {
                        t.onComponentHide.dispatch(n)
                      }),
                      this.getDomElement().on('mouseenter', function () {
                        n.onHoverChangedEvent(!0)
                      }),
                      this.getDomElement().on('mouseleave', function () {
                        n.onHoverChangedEvent(!1)
                      })
                  }),
                  (e.prototype.release = function () {}),
                  (e.prototype.toDomElement = function () {
                    return new i.DOM(this.config.tag, {
                      id: this.config.id,
                      class: this.getCssClasses(),
                      role: this.config.role,
                    })
                  }),
                  (e.prototype.getDomElement = function () {
                    return (
                      this.element || (this.element = this.toDomElement()),
                      this.element
                    )
                  }),
                  (e.prototype.mergeConfig = function (e, t, n) {
                    return Object.assign({}, n, t, e)
                  }),
                  (e.prototype.getCssClasses = function () {
                    var e = this,
                      t = [this.config.cssClass].concat(this.config.cssClasses)
                    return (
                      (t = t.map(function (t) {
                        return e.prefixCss(t)
                      })),
                      t.join(' ').trim()
                    )
                  }),
                  (e.prototype.prefixCss = function (e) {
                    return this.config.cssPrefix + '-' + e
                  }),
                  (e.prototype.getConfig = function () {
                    return this.config
                  }),
                  (e.prototype.hide = function () {
                    this.hidden ||
                      ((this.hidden = !0),
                      this.getDomElement().addClass(
                        this.prefixCss(e.CLASS_HIDDEN),
                      ),
                      this.onHideEvent())
                  }),
                  (e.prototype.show = function () {
                    this.hidden &&
                      (this.getDomElement().removeClass(
                        this.prefixCss(e.CLASS_HIDDEN),
                      ),
                      (this.hidden = !1),
                      this.onShowEvent())
                  }),
                  (e.prototype.isHidden = function () {
                    return this.hidden
                  }),
                  (e.prototype.isShown = function () {
                    return !this.isHidden()
                  }),
                  (e.prototype.toggleHidden = function () {
                    this.isHidden() ? this.show() : this.hide()
                  }),
                  (e.prototype.disable = function () {
                    this.disabled ||
                      ((this.disabled = !0),
                      this.getDomElement().addClass(
                        this.prefixCss(e.CLASS_DISABLED),
                      ),
                      this.onDisabledEvent())
                  }),
                  (e.prototype.enable = function () {
                    this.disabled &&
                      (this.getDomElement().removeClass(
                        this.prefixCss(e.CLASS_DISABLED),
                      ),
                      (this.disabled = !1),
                      this.onEnabledEvent())
                  }),
                  (e.prototype.isDisabled = function () {
                    return this.disabled
                  }),
                  (e.prototype.isEnabled = function () {
                    return !this.isDisabled()
                  }),
                  (e.prototype.isHovered = function () {
                    return this.hovered
                  }),
                  (e.prototype.onShowEvent = function () {
                    this.componentEvents.onShow.dispatch(this)
                  }),
                  (e.prototype.onHideEvent = function () {
                    this.componentEvents.onHide.dispatch(this)
                  }),
                  (e.prototype.onEnabledEvent = function () {
                    this.componentEvents.onEnabled.dispatch(this)
                  }),
                  (e.prototype.onDisabledEvent = function () {
                    this.componentEvents.onDisabled.dispatch(this)
                  }),
                  (e.prototype.onHoverChangedEvent = function (e) {
                    ;(this.hovered = e),
                      this.componentEvents.onHoverChanged.dispatch(this, {
                        hovered: e,
                      })
                  }),
                  Object.defineProperty(e.prototype, 'onShow', {
                    get: function () {
                      return this.componentEvents.onShow.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'onHide', {
                    get: function () {
                      return this.componentEvents.onHide.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'onEnabled', {
                    get: function () {
                      return this.componentEvents.onEnabled.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'onDisabled', {
                    get: function () {
                      return this.componentEvents.onDisabled.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'onHoverChanged', {
                    get: function () {
                      return this.componentEvents.onHoverChanged.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.CLASS_HIDDEN = 'hidden'),
                  (e.CLASS_DISABLED = 'disabled'),
                  e
                )
              })()
            n.Component = s
          },
          {'../dom': 77, '../eventdispatcher': 79, '../guid': 80},
        ],
        19: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Container = void 0)
            var i = e('./component'),
              r = e('../dom'),
              s = e('../arrayutils'),
              a = e('../localization/i18n'),
              l = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-container', components: []},
                      n.config,
                    )),
                    (n.componentsToAdd = []),
                    (n.componentsToRemove = []),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.addComponent = function (e) {
                    this.config.components.push(e), this.componentsToAdd.push(e)
                  }),
                  (t.prototype.removeComponent = function (e) {
                    return (
                      null != s.ArrayUtils.remove(this.config.components, e) &&
                      (this.componentsToRemove.push(e), !0)
                    )
                  }),
                  (t.prototype.getComponents = function () {
                    return this.config.components
                  }),
                  (t.prototype.removeComponents = function () {
                    for (
                      var e = 0, t = this.getComponents().slice();
                      e < t.length;
                      e++
                    ) {
                      var n = t[e]
                      this.removeComponent(n)
                    }
                  }),
                  (t.prototype.updateComponents = function () {
                    for (var e; (e = this.componentsToRemove.shift()); )
                      e.getDomElement().remove()
                    for (; (e = this.componentsToAdd.shift()); )
                      this.innerContainerElement.append(e.getDomElement())
                  }),
                  (t.prototype.toDomElement = function () {
                    var e = new r.DOM(this.config.tag, {
                        id: this.config.id,
                        class: this.getCssClasses(),
                        role: this.config.role,
                        'aria-label': a.i18n.performLocalization(
                          this.config.ariaLabel,
                        ),
                      }),
                      t = new r.DOM(this.config.tag, {
                        class: this.prefixCss('container-wrapper'),
                      })
                    this.innerContainerElement = t
                    for (
                      var n = 0, o = this.config.components;
                      n < o.length;
                      n++
                    ) {
                      var i = o[n]
                      this.componentsToAdd.push(i)
                    }
                    return this.updateComponents(), e.append(t), e
                  }),
                  t
                )
              })(i.Component)
            n.Container = l
          },
          {
            '../arrayutils': 1,
            '../dom': 77,
            '../localization/i18n': 82,
            './component': 18,
          },
        ],
        20: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ControlBar = void 0)
            var i = e('./container'),
              r = e('../uiutils'),
              s = e('./spacer'),
              a = e('../localization/i18n'),
              l = e('../browserutils'),
              c = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-controlbar',
                        hidden: !0,
                        role: 'region',
                        ariaLabel: a.i18n.getLocalizer('controlBar'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var a = 0
                    n.getConfig().disableAutoHideWhenHovered &&
                      !l.BrowserUtils.isMobile &&
                      r.UIUtils.traverseTree(this, function (e) {
                        e instanceof i.Container ||
                          e instanceof s.Spacer ||
                          e.onHoverChanged.subscribe(function (e, t) {
                            t.hovered ? a++ : a--
                          })
                      }),
                      n.onControlsShow.subscribe(function () {
                        o.show()
                      }),
                      n.onPreviewControlsHide.subscribe(function (e, t) {
                        t.cancel = a > 0
                      }),
                      n.onControlsHide.subscribe(function () {
                        o.hide()
                      })
                  }),
                  t
                )
              })(i.Container)
            n.ControlBar = c
          },
          {
            '../browserutils': 3,
            '../localization/i18n': 82,
            '../uiutils': 93,
            './container': 19,
            './spacer': 47,
          },
        ],
        21: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ErrorMessageOverlay = void 0)
            var i = e('./container'),
              r = e('./label'),
              s = e('./tvnoisecanvas'),
              a = e('../errorutils'),
              l = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.errorLabel = new r.Label({
                      cssClass: 'ui-errormessage-label',
                    })),
                    (n.tvNoiseBackground = new s.TvNoiseCanvas()),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-errormessage-overlay',
                        components: [n.tvNoiseBackground, n.errorLabel],
                        hidden: !0,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getConfig()
                    t.on(t.exports.PlayerEvent.Error, function (e) {
                      var t = a.ErrorUtils.defaultErrorMessageTranslator(e),
                        r = n.getConfig().errorMessages || i.messages
                      if (r)
                        if ('function' == typeof r) t = r(e)
                        else if (r[e.code]) {
                          var s = r[e.code]
                          t = 'string' == typeof s ? s : s(e)
                        }
                      o.errorLabel.setText(t),
                        o.tvNoiseBackground.start(),
                        o.show()
                    }),
                      t.on(t.exports.PlayerEvent.SourceLoaded, function (e) {
                        o.isShown() && (o.tvNoiseBackground.stop(), o.hide())
                      })
                  }),
                  (t.prototype.release = function () {
                    e.prototype.release.call(this),
                      this.tvNoiseBackground.stop()
                  }),
                  t
                )
              })(i.Container)
            n.ErrorMessageOverlay = l
          },
          {
            '../errorutils': 78,
            './container': 19,
            './label': 26,
            './tvnoisecanvas': 68,
          },
        ],
        22: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.FullscreenToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-fullscreentogglebutton',
                        text: r.i18n.getLocalizer('fullscreen'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = function () {
                        return t.isViewModeAvailable(
                          t.exports.ViewMode.Fullscreen,
                        )
                      },
                      r = function () {
                        t.getViewMode() === t.exports.ViewMode.Fullscreen
                          ? o.on()
                          : o.off()
                      },
                      s = function () {
                        i() ? o.show() : o.hide()
                      }
                    t.on(t.exports.PlayerEvent.ViewModeChanged, r),
                      t.exports.PlayerEvent.ViewModeAvailabilityChanged &&
                        t.on(
                          t.exports.PlayerEvent.ViewModeAvailabilityChanged,
                          s,
                        ),
                      n.getConfig().events.onUpdated.subscribe(s),
                      this.onClick.subscribe(function () {
                        if (!i())
                          return void (
                            console && console.log('Fullscreen unavailable')
                          )
                        var e =
                          t.getViewMode() === t.exports.ViewMode.Fullscreen
                            ? t.exports.ViewMode.Inline
                            : t.exports.ViewMode.Fullscreen
                        t.setViewMode(e)
                      }),
                      s(),
                      r()
                  }),
                  t
                )
              })(i.ToggleButton)
            n.FullscreenToggleButton = s
          },
          {'../localization/i18n': 82, './togglebutton': 67},
        ],
        23: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.HugePlaybackToggleButton = void 0)
            var i = e('./playbacktogglebutton'),
              r = e('../dom'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-hugeplaybacktogglebutton',
                        text: s.i18n.getLocalizer('playPause'),
                        role: 'button',
                        ariaLabel: s.i18n.getLocalizer('play'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n, !1)
                    var i = function () {
                        t.isPlaying() || o.isPlayInitiated
                          ? t.pause('ui')
                          : t.play('ui')
                      },
                      r = function () {
                        t.getViewMode() === t.exports.ViewMode.Fullscreen
                          ? t.setViewMode(t.exports.ViewMode.Inline)
                          : t.setViewMode(t.exports.ViewMode.Fullscreen)
                      },
                      s = !0,
                      a = 0,
                      l = 0
                    this.onClick.subscribe(function () {
                      if (s) return void i()
                      var e = Date.now()
                      return e - a < 200
                        ? (r(), void (l = e))
                        : e - a < 500
                        ? (r(), i(), void (l = e))
                        : ((a = e),
                          void setTimeout(function () {
                            Date.now() - l > 200 && i()
                          }, 200))
                    }),
                      t.on(t.exports.PlayerEvent.Play, function () {
                        s = !1
                      }),
                      t.on(t.exports.PlayerEvent.Warning, function (e) {
                        e.code ===
                          t.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED &&
                          (s = !0)
                      })
                    var c = function () {
                      o.setTransitionAnimationsEnabled(!1),
                        o.onToggle.subscribeOnce(function () {
                          o.setTransitionAnimationsEnabled(!0)
                        })
                    }
                    c()
                    var u =
                        t.getConfig().playback &&
                        Boolean(t.getConfig().playback.autoplay),
                      p = !t.getSource() && u
                    ;(t.isPlaying() || p) &&
                      (this.on(),
                      c(),
                      t.on(t.exports.PlayerEvent.Warning, function (e) {
                        e.code ===
                          t.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED &&
                          c()
                      }))
                  }),
                  (t.prototype.toDomElement = function () {
                    var t = e.prototype.toDomElement.call(this)
                    return (
                      t.append(
                        new r.DOM('div', {class: this.prefixCss('image')}),
                      ),
                      t
                    )
                  }),
                  (t.prototype.setTransitionAnimationsEnabled = function (e) {
                    var t = this.prefixCss('no-transition-animations')
                    e
                      ? this.getDomElement().removeClass(t)
                      : this.getDomElement().hasClass(t) ||
                        this.getDomElement().addClass(t)
                  }),
                  t
                )
              })(i.PlaybackToggleButton)
            n.HugePlaybackToggleButton = a
          },
          {
            '../dom': 77,
            '../localization/i18n': 82,
            './playbacktogglebutton': 33,
          },
        ],
        24: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.HugeReplayButton = void 0)
            var i = e('./button'),
              r = e('../dom'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-hugereplaybutton',
                        text: s.i18n.getLocalizer('replay'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n),
                      this.onClick.subscribe(function () {
                        t.play('ui')
                      })
                  }),
                  (t.prototype.toDomElement = function () {
                    var t = e.prototype.toDomElement.call(this)
                    return (
                      t.append(
                        new r.DOM('div', {class: this.prefixCss('image')}),
                      ),
                      t
                    )
                  }),
                  t
                )
              })(i.Button)
            n.HugeReplayButton = a
          },
          {'../dom': 77, '../localization/i18n': 82, './button': 12},
        ],
        25: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ItemSelectionList = void 0)
            var i = e('./listselector'),
              r = e('../dom'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {tag: 'ul', cssClass: 'ui-itemselectionlist'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.isActive = function () {
                    return this.items.length > 1
                  }),
                  (t.prototype.toDomElement = function () {
                    var e = new r.DOM('ul', {
                      id: this.config.id,
                      class: this.getCssClasses(),
                    })
                    return (this.listElement = e), this.updateDomItems(), e
                  }),
                  (t.prototype.updateDomItems = function (e) {
                    var n = this
                    void 0 === e && (e = null), this.listElement.empty()
                    for (
                      var o = null,
                        i = function (e) {
                          e.addClass(n.prefixCss(t.CLASS_SELECTED))
                        },
                        a = function (e) {
                          e.removeClass(n.prefixCss(t.CLASS_SELECTED))
                        },
                        l = this,
                        c = 0,
                        u = this.items;
                      c < u.length;
                      c++
                    ) {
                      var p = u[c]
                      !(function (t) {
                        var c = new r.DOM('li', {
                          type: 'li',
                          class: l.prefixCss('ui-selectionlistitem'),
                        }).append(
                          new r.DOM('a', {}).html(
                            s.i18n.performLocalization(t.label),
                          ),
                        )
                        o ||
                          (null == e
                            ? (o = c)
                            : String(e) === t.key && (o = c)),
                          c.on('click', function () {
                            o && a(o),
                              (o = c),
                              i(c),
                              n.onItemSelectedEvent(t.key, !1)
                          }),
                          o && i(o),
                          l.listElement.append(c)
                      })(p)
                    }
                  }),
                  (t.prototype.onItemAddedEvent = function (t) {
                    e.prototype.onItemAddedEvent.call(this, t),
                      this.updateDomItems(this.selectedItem)
                  }),
                  (t.prototype.onItemRemovedEvent = function (t) {
                    e.prototype.onItemRemovedEvent.call(this, t),
                      this.updateDomItems(this.selectedItem)
                  }),
                  (t.prototype.onItemSelectedEvent = function (t, n) {
                    void 0 === n && (n = !0),
                      e.prototype.onItemSelectedEvent.call(this, t),
                      n && this.updateDomItems(t)
                  }),
                  (t.CLASS_SELECTED = 'selected'),
                  t
                )
              })(i.ListSelector)
            n.ItemSelectionList = a
          },
          {'../dom': 77, '../localization/i18n': 82, './listselector': 28},
        ],
        26: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Label = void 0)
            var i = e('./component'),
              r = e('../dom'),
              s = e('../eventdispatcher'),
              a = e('../localization/i18n'),
              l = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.labelEvents = {
                      onClick: new s.EventDispatcher(),
                      onTextChanged: new s.EventDispatcher(),
                    }),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-label'},
                      n.config,
                    )),
                    (n.text = n.config.text),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.toDomElement = function () {
                    var e = this,
                      t = null != this.config.for ? 'label' : 'span',
                      n = new r.DOM(t, {
                        id: this.config.id,
                        for: this.config.for,
                        class: this.getCssClasses(),
                      }).html(a.i18n.performLocalization(this.text))
                    return (
                      n.on('click', function () {
                        e.onClickEvent()
                      }),
                      n
                    )
                  }),
                  (t.prototype.setText = function (e) {
                    if (e !== this.text) {
                      this.text = e
                      var t = a.i18n.performLocalization(e)
                      this.getDomElement().html(t), this.onTextChangedEvent(t)
                    }
                  }),
                  (t.prototype.getText = function () {
                    return a.i18n.performLocalization(this.text)
                  }),
                  (t.prototype.clearText = function () {
                    this.getDomElement().html(''), this.onTextChangedEvent(null)
                  }),
                  (t.prototype.isEmpty = function () {
                    return !this.text
                  }),
                  (t.prototype.onClickEvent = function () {
                    this.labelEvents.onClick.dispatch(this)
                  }),
                  (t.prototype.onTextChangedEvent = function (e) {
                    this.labelEvents.onTextChanged.dispatch(this, e)
                  }),
                  Object.defineProperty(t.prototype, 'onClick', {
                    get: function () {
                      return this.labelEvents.onClick.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onTextChanged', {
                    get: function () {
                      return this.labelEvents.onTextChanged.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  t
                )
              })(i.Component)
            n.Label = l
          },
          {
            '../dom': 77,
            '../eventdispatcher': 79,
            '../localization/i18n': 82,
            './component': 18,
          },
        ],
        27: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ListBox = void 0)
            var i = e('./togglebutton'),
              r = e('./listselector'),
              s = e('../dom'),
              a = e('../arrayutils'),
              l = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.components = []),
                    (n.removeListBoxDomItem = function (e, t) {
                      var o = n.getComponentForKey(t)
                      o &&
                        (o.getDomElement().remove(),
                        a.ArrayUtils.remove(n.components, o))
                    }),
                    (n.addListBoxDomItem = function (e, t) {
                      var o = n.getComponentForKey(t),
                        i = n.getItemForKey(t)
                      if (o) o.setText(i.label)
                      else {
                        var r = n.buildListBoxItemButton(i)
                        r.onClick.subscribe(function () {
                          n.handleSelectionChange(r)
                        }),
                          n.components.push(r),
                          n.listBoxElement.append(r.getDomElement())
                      }
                    }),
                    (n.refreshSelectedItem = function () {
                      for (var e = 0, t = n.items; e < t.length; e++) {
                        var o = t[e],
                          i = n.getComponentForKey(o.key)
                        i &&
                          (String(i.key) === String(n.selectedItem)
                            ? i.on()
                            : i.off())
                      }
                    }),
                    (n.handleSelectionChange = function (e) {
                      n.onItemSelectedEvent(e.key)
                    }),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-listbox'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    this.onItemAdded.subscribe(this.addListBoxDomItem),
                      this.onItemRemoved.subscribe(this.removeListBoxDomItem),
                      this.onItemSelected.subscribe(this.refreshSelectedItem),
                      e.prototype.configure.call(this, t, n)
                  }),
                  (t.prototype.toDomElement = function () {
                    var e = new s.DOM('div', {
                      id: this.config.id,
                      class: this.getCssClasses(),
                    })
                    return (
                      (this.listBoxElement = e),
                      this.createListBoxDomItems(),
                      this.refreshSelectedItem(),
                      e
                    )
                  }),
                  (t.prototype.createListBoxDomItems = function () {
                    this.listBoxElement.empty(), (this.components = [])
                    for (var e = 0, t = this.items; e < t.length; e++) {
                      var n = t[e]
                      this.addListBoxDomItem(this, n.key)
                    }
                  }),
                  (t.prototype.buildListBoxItemButton = function (e) {
                    return new c({key: e.key, text: e.label})
                  }),
                  (t.prototype.getComponentForKey = function (e) {
                    return this.components.find(function (t) {
                      return e === t.key
                    })
                  }),
                  t
                )
              })(r.ListSelector)
            n.ListBox = l
            var c = (function (e) {
              function t(t) {
                var n = e.call(this, t) || this
                return (
                  (n.config = n.mergeConfig(
                    t,
                    {
                      cssClass: 'ui-listbox-button',
                      onClass: 'selected',
                      offClass: '',
                    },
                    n.config,
                  )),
                  n
                )
              }
              return (
                o(t, e),
                Object.defineProperty(t.prototype, 'key', {
                  get: function () {
                    return this.config.key
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                t
              )
            })(i.ToggleButton)
          },
          {
            '../arrayutils': 1,
            '../dom': 77,
            './listselector': 28,
            './togglebutton': 67,
          },
        ],
        28: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ListSelector = void 0)
            var i = e('./component'),
              r = e('../eventdispatcher'),
              s = e('../arrayutils'),
              a = e('../localization/i18n'),
              l = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.listSelectorEvents = {
                      onItemAdded: new r.EventDispatcher(),
                      onItemRemoved: new r.EventDispatcher(),
                      onItemSelected: new r.EventDispatcher(),
                    }),
                    (n.config = n.mergeConfig(
                      t,
                      {items: [], cssClass: 'ui-listselector'},
                      n.config,
                    )),
                    (n.items = n.config.items),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.getItemIndex = function (e) {
                    for (var t in this.items)
                      if (e === this.items[t].key) return parseInt(t)
                    return -1
                  }),
                  (t.prototype.getItems = function () {
                    return this.items
                  }),
                  (t.prototype.hasItem = function (e) {
                    return this.getItemIndex(e) > -1
                  }),
                  (t.prototype.addItem = function (e, t) {
                    var n = {key: e, label: a.i18n.performLocalization(t)}
                    ;(this.config.filter && !this.config.filter(n)) ||
                      (this.config.translator &&
                        (n.label = this.config.translator(n)),
                      this.removeItem(e),
                      this.items.push(n),
                      this.onItemAddedEvent(e))
                  }),
                  (t.prototype.removeItem = function (e) {
                    var t = this.getItemIndex(e)
                    return (
                      t > -1 &&
                      (s.ArrayUtils.remove(this.items, this.items[t]),
                      this.onItemRemovedEvent(e),
                      !0)
                    )
                  }),
                  (t.prototype.selectItem = function (e) {
                    return (
                      e === this.selectedItem ||
                      (this.getItemIndex(e) > -1 &&
                        ((this.selectedItem = e),
                        this.onItemSelectedEvent(e),
                        !0))
                    )
                  }),
                  (t.prototype.getSelectedItem = function () {
                    return this.selectedItem
                  }),
                  (t.prototype.getItemForKey = function (e) {
                    return this.items.find(function (t) {
                      return t.key === e
                    })
                  }),
                  (t.prototype.synchronizeItems = function (e) {
                    var t = this
                    e
                      .filter(function (e) {
                        return !t.hasItem(e.key)
                      })
                      .forEach(function (e) {
                        return t.addItem(e.key, e.label)
                      }),
                      this.items
                        .filter(function (t) {
                          return (
                            0 ===
                            e.filter(function (e) {
                              return e.key === t.key
                            }).length
                          )
                        })
                        .forEach(function (e) {
                          return t.removeItem(e.key)
                        })
                  }),
                  (t.prototype.clearItems = function () {
                    var e = this.items
                    ;(this.items = []), (this.selectedItem = null)
                    for (var t = 0, n = e; t < n.length; t++) {
                      var o = n[t]
                      this.onItemRemovedEvent(o.key)
                    }
                  }),
                  (t.prototype.itemCount = function () {
                    return Object.keys(this.items).length
                  }),
                  (t.prototype.onItemAddedEvent = function (e) {
                    this.listSelectorEvents.onItemAdded.dispatch(this, e)
                  }),
                  (t.prototype.onItemRemovedEvent = function (e) {
                    this.listSelectorEvents.onItemRemoved.dispatch(this, e)
                  }),
                  (t.prototype.onItemSelectedEvent = function (e) {
                    this.listSelectorEvents.onItemSelected.dispatch(this, e)
                  }),
                  Object.defineProperty(t.prototype, 'onItemAdded', {
                    get: function () {
                      return this.listSelectorEvents.onItemAdded.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onItemRemoved', {
                    get: function () {
                      return this.listSelectorEvents.onItemRemoved.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onItemSelected', {
                    get: function () {
                      return this.listSelectorEvents.onItemSelected.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  t
                )
              })(i.Component)
            n.ListSelector = l
          },
          {
            '../arrayutils': 1,
            '../eventdispatcher': 79,
            '../localization/i18n': 82,
            './component': 18,
          },
        ],
        29: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.MetadataLabel = n.MetadataLabelContent = void 0)
            var i,
              r = e('./label')
            !(function (e) {
              ;(e[(e.Title = 0)] = 'Title'),
                (e[(e.Description = 1)] = 'Description')
            })((i = n.MetadataLabelContent || (n.MetadataLabelContent = {})))
            var s = (function (e) {
              function t(t) {
                var n = e.call(this, t) || this
                return (
                  (n.config = n.mergeConfig(
                    t,
                    {
                      cssClasses: [
                        'label-metadata',
                        'label-metadata-' + i[t.content].toLowerCase(),
                      ],
                    },
                    n.config,
                  )),
                  n
                )
              }
              return (
                o(t, e),
                (t.prototype.configure = function (t, n) {
                  var o = this
                  e.prototype.configure.call(this, t, n)
                  var r = this.getConfig(),
                    s = n.getConfig(),
                    a = function () {
                      switch (r.content) {
                        case i.Title:
                          o.setText(s.metadata.title)
                          break
                        case i.Description:
                          o.setText(s.metadata.description)
                      }
                    },
                    l = function () {
                      o.setText(null)
                    }
                  a(),
                    t.on(t.exports.PlayerEvent.SourceUnloaded, l),
                    n.getConfig().events.onUpdated.subscribe(a)
                }),
                t
              )
            })(r.Label)
            n.MetadataLabel = s
          },
          {'./label': 26},
        ],
        30: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PictureInPictureToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-piptogglebutton',
                        text: r.i18n.getLocalizer('pictureInPicture'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = function () {
                        return t.isViewModeAvailable(
                          t.exports.ViewMode.PictureInPicture,
                        )
                      },
                      r = function () {
                        t.getViewMode() === t.exports.ViewMode.PictureInPicture
                          ? o.on()
                          : o.off()
                      },
                      s = function () {
                        i() ? o.show() : o.hide()
                      }
                    t.on(t.exports.PlayerEvent.ViewModeChanged, r),
                      t.exports.PlayerEvent.ViewModeAvailabilityChanged &&
                        t.on(
                          t.exports.PlayerEvent.ViewModeAvailabilityChanged,
                          s,
                        ),
                      n.getConfig().events.onUpdated.subscribe(s),
                      this.onClick.subscribe(function () {
                        if (!i())
                          return void (
                            console && console.log('PIP unavailable')
                          )
                        var e =
                          t.getViewMode() ===
                          t.exports.ViewMode.PictureInPicture
                            ? t.exports.ViewMode.Inline
                            : t.exports.ViewMode.PictureInPicture
                        t.setViewMode(e)
                      }),
                      s(),
                      r()
                  }),
                  t
                )
              })(i.ToggleButton)
            n.PictureInPictureToggleButton = s
          },
          {'../localization/i18n': 82, './togglebutton': 67},
        ],
        31: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PlaybackSpeedSelectBox = void 0)
            var i = e('./selectbox'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.defaultPlaybackSpeeds = [0.25, 0.5, 1, 1.5, 2]),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-playbackspeedselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addDefaultItems(),
                      this.onItemSelected.subscribe(function (e, n) {
                        t.setPlaybackSpeed(parseFloat(n)), o.selectItem(n)
                      })
                    var i = function () {
                      var e = t.getPlaybackSpeed()
                      o.setSpeed(e)
                    }
                    t.on(t.exports.PlayerEvent.PlaybackSpeedChanged, i),
                      n.getConfig().events.onUpdated.subscribe(i)
                  }),
                  (t.prototype.setSpeed = function (e) {
                    this.selectItem(String(e)) ||
                      (this.clearItems(),
                      this.addDefaultItems([e]),
                      this.selectItem(String(e)))
                  }),
                  (t.prototype.addDefaultItems = function (e) {
                    var t = this
                    void 0 === e && (e = []),
                      this.defaultPlaybackSpeeds
                        .concat(e)
                        .sort()
                        .forEach(function (e) {
                          1 !== e
                            ? t.addItem(String(e), e + 'x')
                            : t.addItem(
                                String(e),
                                r.i18n.getLocalizer('normal'),
                              )
                        })
                  }),
                  (t.prototype.clearItems = function () {
                    ;(this.items = []), (this.selectedItem = null)
                  }),
                  t
                )
              })(i.SelectBox)
            n.PlaybackSpeedSelectBox = s
          },
          {'../localization/i18n': 82, './selectbox': 39},
        ],
        32: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PlaybackTimeLabel = n.PlaybackTimeLabelMode = void 0)
            var i,
              r = e('./label'),
              s = e('../playerutils'),
              a = e('../stringutils'),
              l = e('../localization/i18n')
            !(function (e) {
              ;(e[(e.CurrentTime = 0)] = 'CurrentTime'),
                (e[(e.TotalTime = 1)] = 'TotalTime'),
                (e[(e.CurrentAndTotalTime = 2)] = 'CurrentAndTotalTime'),
                (e[(e.RemainingTime = 3)] = 'RemainingTime')
            })((i = n.PlaybackTimeLabelMode || (n.PlaybackTimeLabelMode = {})))
            var c = (function (e) {
              function t(t) {
                void 0 === t && (t = {})
                var n = e.call(this, t) || this
                return (
                  (n.config = n.mergeConfig(
                    t,
                    {
                      cssClass: 'ui-playbacktimelabel',
                      timeLabelMode: i.CurrentAndTotalTime,
                      hideInLivePlayback: !1,
                    },
                    n.config,
                  )),
                  n
                )
              }
              return (
                o(t, e),
                (t.prototype.configure = function (t, n) {
                  var o = this
                  e.prototype.configure.call(this, t, n)
                  var i = this.getConfig(),
                    r = !1,
                    c = this.prefixCss('ui-playbacktimelabel-live'),
                    u = this.prefixCss('ui-playbacktimelabel-live-edge'),
                    p = 0,
                    f = function () {
                      t.timeShift(0)
                    },
                    g = function () {
                      ;(r = t.isLive()),
                        r
                          ? (o.getDomElement().addClass(c),
                            o.setText(l.i18n.getLocalizer('live')),
                            i.hideInLivePlayback && o.hide(),
                            o.onClick.subscribe(f),
                            d())
                          : (o.getDomElement().removeClass(c),
                            o.getDomElement().removeClass(u),
                            o.show(),
                            o.onClick.unsubscribe(f))
                    },
                    d = function () {
                      if (r) {
                        var e = t.getTimeShift() < 0,
                          n = t.getMaxTimeShift() < 0
                        e || (t.isPaused() && n)
                          ? o.getDomElement().removeClass(u)
                          : o.getDomElement().addClass(u)
                      }
                    },
                    h = new s.PlayerUtils.LiveStreamDetector(t, n)
                  h.onLiveChanged.subscribe(function (e, t) {
                    ;(r = t.live), g()
                  }),
                    h.detect()
                  var m = function () {
                    r ||
                      t.getDuration() === 1 / 0 ||
                      o.setTime(
                        s.PlayerUtils.getCurrentTimeRelativeToSeekableRange(t),
                        t.getDuration(),
                      )
                    var e = o.getDomElement().width()
                    e > p &&
                      ((p = e), o.getDomElement().css({'min-width': p + 'px'}))
                  }
                  t.on(t.exports.PlayerEvent.TimeChanged, m),
                    t.on(t.exports.PlayerEvent.Seeked, m),
                    t.on(t.exports.PlayerEvent.TimeShift, d),
                    t.on(t.exports.PlayerEvent.TimeShifted, d),
                    t.on(t.exports.PlayerEvent.Playing, d),
                    t.on(t.exports.PlayerEvent.Paused, d),
                    t.on(t.exports.PlayerEvent.StallStarted, d),
                    t.on(t.exports.PlayerEvent.StallEnded, d)
                  var v = function () {
                    ;(p = 0),
                      o.getDomElement().css({'min-width': null}),
                      (o.timeFormat =
                        Math.abs(
                          t.isLive() ? t.getMaxTimeShift() : t.getDuration(),
                        ) >= 3600
                          ? a.StringUtils.FORMAT_HHMMSS
                          : a.StringUtils.FORMAT_MMSS),
                      m()
                  }
                  n.getConfig().events.onUpdated.subscribe(v), v()
                }),
                (t.prototype.setTime = function (e, t) {
                  var n = a.StringUtils.secondsToTime(e, this.timeFormat),
                    o = a.StringUtils.secondsToTime(t, this.timeFormat)
                  switch (this.config.timeLabelMode) {
                    case i.CurrentTime:
                      this.setText('' + n)
                      break
                    case i.TotalTime:
                      this.setText('' + o)
                      break
                    case i.CurrentAndTotalTime:
                      this.setText(n + ' / ' + o)
                      break
                    case i.RemainingTime:
                      var r = a.StringUtils.secondsToTime(
                        t - e,
                        this.timeFormat,
                      )
                      this.setText('' + r)
                  }
                }),
                (t.prototype.setTimeFormat = function (e) {
                  this.timeFormat = e
                }),
                t
              )
            })(r.Label)
            n.PlaybackTimeLabel = c
          },
          {
            '../localization/i18n': 82,
            '../playerutils': 86,
            '../stringutils': 88,
            './label': 26,
          },
        ],
        33: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PlaybackToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../playerutils'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-playbacktogglebutton',
                        text: s.i18n.getLocalizer('playPause'),
                        ariaLabel: s.i18n.getLocalizer('play'),
                      },
                      n.config,
                    )),
                    (n.isPlayInitiated = !1),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (n, o, i) {
                    var s = this
                    void 0 === i && (i = !0),
                      e.prototype.configure.call(this, n, o)
                    var a = !1,
                      l = function () {
                        a ||
                          (n.isPlaying() || s.isPlayInitiated
                            ? s.on()
                            : s.off())
                      }
                    n.on(n.exports.PlayerEvent.Play, function (e) {
                      ;(s.isPlayInitiated = !0), l()
                    }),
                      n.on(n.exports.PlayerEvent.Paused, function (e) {
                        ;(s.isPlayInitiated = !1), l()
                      }),
                      n.on(n.exports.PlayerEvent.Playing, function (e) {
                        ;(s.isPlayInitiated = !1), l()
                      }),
                      n.on(n.exports.PlayerEvent.SourceLoaded, l),
                      o.getConfig().events.onUpdated.subscribe(l),
                      n.on(n.exports.PlayerEvent.SourceUnloaded, l),
                      n.on(n.exports.PlayerEvent.PlaybackFinished, l),
                      n.on(n.exports.PlayerEvent.CastStarted, l),
                      n.on(n.exports.PlayerEvent.Warning, function (e) {
                        e.code ===
                          n.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED &&
                          ((s.isPlayInitiated = !1), s.off())
                      })
                    var c = function () {
                        n.isLive() && !r.PlayerUtils.isTimeShiftAvailable(n)
                          ? s
                              .getDomElement()
                              .addClass(s.prefixCss(t.CLASS_STOPTOGGLE))
                          : s
                              .getDomElement()
                              .removeClass(s.prefixCss(t.CLASS_STOPTOGGLE))
                      },
                      u = new r.PlayerUtils.TimeShiftAvailabilityDetector(n),
                      p = new r.PlayerUtils.LiveStreamDetector(n, o)
                    u.onTimeShiftAvailabilityChanged.subscribe(function () {
                      return c()
                    }),
                      p.onLiveChanged.subscribe(function () {
                        return c()
                      }),
                      u.detect(),
                      p.detect(),
                      i &&
                        this.onClick.subscribe(function () {
                          n.isPlaying() || s.isPlayInitiated
                            ? n.pause('ui')
                            : n.play('ui')
                        }),
                      o.onSeek.subscribe(function () {
                        a = !0
                      }),
                      o.onSeeked.subscribe(function () {
                        a = !1
                      }),
                      l()
                  }),
                  (t.CLASS_STOPTOGGLE = 'stoptoggle'),
                  t
                )
              })(i.ToggleButton)
            n.PlaybackToggleButton = a
          },
          {
            '../localization/i18n': 82,
            '../playerutils': 86,
            './togglebutton': 67,
          },
        ],
        34: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PlaybackToggleOverlay = void 0)
            var i = e('./container'),
              r = e('./hugeplaybacktogglebutton'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.playbackToggleButton = new r.HugePlaybackToggleButton()),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-playbacktoggle-overlay',
                        components: [n.playbackToggleButton],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return o(t, e), t
              })(i.Container)
            n.PlaybackToggleOverlay = s
          },
          {'./container': 19, './hugeplaybacktogglebutton': 23},
        ],
        35: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.RecommendationOverlay = void 0)
            var i = e('./container'),
              r = e('./component'),
              s = e('../dom'),
              a = e('../stringutils'),
              l = e('./hugereplaybutton'),
              c = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.replayButton = new l.HugeReplayButton()),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-recommendation-overlay',
                        hidden: !0,
                        components: [n.replayButton],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = function () {
                        for (
                          var e = 0, t = o.getComponents().slice();
                          e < t.length;
                          e++
                        ) {
                          var n = t[e]
                          n instanceof u && o.removeComponent(n)
                        }
                        o.updateComponents(),
                          o
                            .getDomElement()
                            .removeClass(o.prefixCss('recommendations'))
                      },
                      r = function () {
                        i()
                        var e = n.getConfig().recommendations
                        if (e.length > 0) {
                          for (var t = 1, r = 0, s = e; r < s.length; r++) {
                            var a = s[r]
                            o.addComponent(
                              new u({
                                itemConfig: a,
                                cssClasses: ['recommendation-item-' + t++],
                              }),
                            )
                          }
                          o.updateComponents(),
                            o
                              .getDomElement()
                              .addClass(o.prefixCss('recommendations'))
                        }
                      }
                    n.getConfig().events.onUpdated.subscribe(r),
                      t.on(t.exports.PlayerEvent.SourceUnloaded, function () {
                        i(), o.hide()
                      }),
                      t.on(t.exports.PlayerEvent.PlaybackFinished, function () {
                        o.show()
                      }),
                      t.on(t.exports.PlayerEvent.Play, function () {
                        o.hide()
                      }),
                      r()
                  }),
                  t
                )
              })(i.Container)
            n.RecommendationOverlay = c
            var u = (function (e) {
              function t(t) {
                var n = e.call(this, t) || this
                return (
                  (n.config = n.mergeConfig(
                    t,
                    {cssClass: 'ui-recommendation-item', itemConfig: null},
                    n.config,
                  )),
                  n
                )
              }
              return (
                o(t, e),
                (t.prototype.toDomElement = function () {
                  var e = this.config.itemConfig,
                    t = new s.DOM('a', {
                      id: this.config.id,
                      class: this.getCssClasses(),
                      href: e.url,
                    }).css({'background-image': 'url(' + e.thumbnail + ')'}),
                    n = new s.DOM('div', {class: this.prefixCss('background')})
                  t.append(n)
                  var o = new s.DOM('span', {
                    class: this.prefixCss('title'),
                  }).append(
                    new s.DOM('span', {
                      class: this.prefixCss('innertitle'),
                    }).html(e.title),
                  )
                  t.append(o)
                  var i = new s.DOM('span', {
                    class: this.prefixCss('duration'),
                  }).append(
                    new s.DOM('span', {
                      class: this.prefixCss('innerduration'),
                    }).html(
                      e.duration ? a.StringUtils.secondsToTime(e.duration) : '',
                    ),
                  )
                  return t.append(i), t
                }),
                t
              )
            })(r.Component)
          },
          {
            '../dom': 77,
            '../stringutils': 88,
            './component': 18,
            './container': 19,
            './hugereplaybutton': 24,
          },
        ],
        36: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SeekBar = void 0)
            var i = e('./component'),
              r = e('../dom'),
              s = e('../eventdispatcher'),
              a = e('../timeout'),
              l = e('../playerutils'),
              c = e('../stringutils'),
              u = e('./seekbarcontroller'),
              p = e('../localization/i18n'),
              f = e('../browserutils'),
              g = e('./timelinemarkershandler'),
              d = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  ;(n.playbackPositionPercentage = 0),
                    (n.seekBarEvents = {
                      onSeek: new s.EventDispatcher(),
                      onSeekPreview: new s.EventDispatcher(),
                      onSeeked: new s.EventDispatcher(),
                    }),
                    (n.seekWhileScrubbing = function (e, t) {
                      t.scrubbing && n.seek(t.position)
                    }),
                    (n.seek = function (e) {
                      if (n.player.isLive()) {
                        var t = n.player.getMaxTimeShift()
                        n.player.timeShift(t - t * (e / 100), 'ui')
                      } else {
                        var o = l.PlayerUtils.getSeekableRangeStart(
                            n.player,
                            0,
                          ),
                          i = n.player.getDuration() * (e / 100),
                          r = i + o
                        n.player.seek(r, 'ui')
                      }
                    })
                  var o = n.config.keyStepIncrements || {
                    leftRight: 1,
                    upDown: 5,
                  }
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-seekbar',
                        vertical: !1,
                        smoothPlaybackPositionUpdateIntervalMs: 50,
                        keyStepIncrements: o,
                        ariaLabel: p.i18n.getLocalizer('seekBar'),
                        tabIndex: 0,
                        snappingRange: 1,
                      },
                      n.config,
                    )),
                    (n.label = n.config.label),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.initialize = function () {
                    e.prototype.initialize.call(this),
                      this.hasLabel() && this.getLabel().initialize()
                  }),
                  (t.prototype.setAriaSliderMinMax = function (e, t) {
                    this.getDomElement().attr('aria-valuemin', e),
                      this.getDomElement().attr('aria-valuemax', t)
                  }),
                  (t.prototype.setAriaSliderValues = function () {
                    if (this.seekBarType === u.SeekBarType.Live) {
                      var e = Math.ceil(this.player.getTimeShift()).toString()
                      this.getDomElement().attr('aria-valuenow', e),
                        this.getDomElement().attr(
                          'aria-valuetext',
                          p.i18n.performLocalization(
                            p.i18n.getLocalizer('seekBar.timeshift'),
                          ) +
                            ' ' +
                            p.i18n.performLocalization(
                              p.i18n.getLocalizer('seekBar.value'),
                            ) +
                            ': ' +
                            e,
                        )
                    } else if (this.seekBarType === u.SeekBarType.Vod) {
                      var t =
                        c.StringUtils.secondsToText(
                          this.player.getCurrentTime(),
                        ) +
                        ' ' +
                        p.i18n.performLocalization(
                          p.i18n.getLocalizer('seekBar.durationText'),
                        ) +
                        ' ' +
                        c.StringUtils.secondsToText(this.player.getDuration())
                      this.getDomElement().attr(
                        'aria-valuenow',
                        Math.floor(this.player.getCurrentTime()).toString(),
                      ),
                        this.getDomElement().attr('aria-valuetext', t)
                    }
                  }),
                  (t.prototype.configure = function (n, o, i) {
                    var r = this
                    if (
                      (void 0 === i && (i = !0),
                      e.prototype.configure.call(this, n, o),
                      (this.player = n),
                      this.setPosition(this.seekBarBackdrop, 100),
                      new u.SeekBarController(
                        this.config.keyStepIncrements,
                        n,
                        o.getConfig().volumeController,
                      ).setSeekBarControls(this.getDomElement(), function () {
                        return r.seekBarType
                      }),
                      !i)
                    )
                      return void (this.seekBarType = u.SeekBarType.Volume)
                    o.onControlsShow.subscribe(function () {
                      r.isUiShown = !0
                    }),
                      o.onControlsHide.subscribe(function () {
                        r.isUiShown = !1
                      })
                    var s = !1,
                      a = !1,
                      c = !1,
                      p = function (e, o) {
                        if (
                          (void 0 === e && (e = null),
                          void 0 === o && (o = !1),
                          !a)
                        ) {
                          if (n.isLive()) {
                            if (0 === n.getMaxTimeShift())
                              r.setPlaybackPosition(100)
                            else {
                              var i =
                                100 -
                                (100 / n.getMaxTimeShift()) * n.getTimeShift()
                              r.setPlaybackPosition(i),
                                r.setAriaSliderMinMax(
                                  n.getMaxTimeShift().toString(),
                                  '0',
                                )
                            }
                            r.setBufferPosition(100)
                          } else {
                            var s = n.getDuration(),
                              i = (100 / s) * r.getRelativeCurrentTime(),
                              l = n.getVideoBufferLength(),
                              c = n.getAudioBufferLength(),
                              u = Math.min(
                                null != l ? l : Number.MAX_VALUE,
                                null != c ? c : Number.MAX_VALUE,
                              )
                            u === Number.MAX_VALUE && (u = 0)
                            var p = (100 / s) * u
                            ;(r.config
                              .smoothPlaybackPositionUpdateIntervalMs ===
                              t.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED ||
                              o ||
                              n.isPaused() ||
                              n.isPaused() === n.isPlaying()) &&
                              r.setPlaybackPosition(i),
                              r.setBufferPosition(i + p),
                              r.setAriaSliderMinMax('0', s.toString())
                          }
                          r.isUiShown && r.setAriaSliderValues()
                        }
                      }
                    n.on(n.exports.PlayerEvent.Ready, p),
                      n.on(n.exports.PlayerEvent.TimeChanged, p),
                      n.on(n.exports.PlayerEvent.StallEnded, p),
                      n.on(n.exports.PlayerEvent.Seeked, p),
                      n.on(n.exports.PlayerEvent.TimeShifted, p),
                      n.on(n.exports.PlayerEvent.SegmentRequestFinished, p),
                      this.configureLivePausedTimeshiftUpdater(n, o, p)
                    var f = function () {
                        ;(c = !0), r.setSeeking(!0)
                      },
                      g = function () {
                        ;(c = !1), r.setSeeking(!1)
                      },
                      d = function () {
                        s && n.play('ui-seek')
                      }
                    n.on(n.exports.PlayerEvent.Seek, f),
                      n.on(n.exports.PlayerEvent.Seeked, g),
                      n.on(n.exports.PlayerEvent.TimeShift, f),
                      n.on(n.exports.PlayerEvent.TimeShifted, g),
                      this.onSeek.subscribe(function (e) {
                        ;(a = !0),
                          o.onSeek.dispatch(e),
                          c || ((s = n.isPlaying()) && n.pause('ui-seek'))
                      }),
                      this.onSeekPreview.subscribe(function (e, t) {
                        o.onSeekPreview.dispatch(e, t)
                      }),
                      this.onSeekPreview.subscribeRateLimited(
                        this.seekWhileScrubbing,
                        200,
                      ),
                      this.onSeeked.subscribe(function (e, t) {
                        ;(a = !1), r.seek(t), o.onSeeked.dispatch(e), d()
                      }),
                      this.hasLabel() && this.getLabel().configure(n, o)
                    var h = !1,
                      m = !1,
                      v = function (e, t) {
                        e && !t ? r.hide() : r.show(),
                          p(null, !0),
                          r.refreshPlaybackPosition()
                      },
                      y = new l.PlayerUtils.LiveStreamDetector(n, o)
                    y.onLiveChanged.subscribe(function (e, t) {
                      ;(h = t.live),
                        h && null != r.smoothPlaybackPositionUpdater
                          ? (r.smoothPlaybackPositionUpdater.clear(),
                            (r.seekBarType = u.SeekBarType.Live))
                          : (r.seekBarType = u.SeekBarType.Vod),
                        v(h, m)
                    })
                    var b = new l.PlayerUtils.TimeShiftAvailabilityDetector(n)
                    b.onTimeShiftAvailabilityChanged.subscribe(function (e, t) {
                      ;(m = t.timeShiftAvailable), v(h, m)
                    }),
                      y.detect(),
                      b.detect(),
                      n.on(n.exports.PlayerEvent.PlayerResized, function () {
                        r.refreshPlaybackPosition()
                      }),
                      o.onConfigured.subscribe(function () {
                        r.refreshPlaybackPosition()
                      }),
                      n.on(n.exports.PlayerEvent.SourceLoaded, function () {
                        r.refreshPlaybackPosition()
                      }),
                      o.getConfig().events.onUpdated.subscribe(function () {
                        p()
                      }),
                      'number' == typeof o.getConfig().seekbarSnappingRange &&
                        (this.config.snappingRange = o.getConfig().seekbarSnappingRange),
                      p(),
                      this.setBufferPosition(0),
                      this.setSeekPosition(0),
                      this.config.smoothPlaybackPositionUpdateIntervalMs !==
                        t.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED &&
                        this.configureSmoothPlaybackPositionUpdater(n, o),
                      this.initializeTimelineMarkers(n, o)
                  }),
                  (t.prototype.initializeTimelineMarkers = function (e, t) {
                    var n = this,
                      o = {
                        cssPrefix: this.config.cssPrefix,
                        snappingRange: this.config.snappingRange,
                      }
                    ;(this.timelineMarkersHandler = new g.TimelineMarkersHandler(
                      o,
                      function () {
                        return n.seekBar.width()
                      },
                      this.seekBarMarkersContainer,
                    )),
                      this.timelineMarkersHandler.initialize(e, t)
                  }),
                  (t.prototype.configureLivePausedTimeshiftUpdater = function (
                    e,
                    t,
                    n,
                  ) {
                    var o = this
                    ;(this.pausedTimeshiftUpdater = new a.Timeout(1e3, n, !0)),
                      e.on(e.exports.PlayerEvent.Paused, function () {
                        e.isLive() &&
                          e.getMaxTimeShift() < 0 &&
                          o.pausedTimeshiftUpdater.start()
                      }),
                      e.on(e.exports.PlayerEvent.Play, function () {
                        return o.pausedTimeshiftUpdater.clear()
                      })
                  }),
                  (t.prototype.configureSmoothPlaybackPositionUpdater = function (
                    e,
                    t,
                  ) {
                    var n = this,
                      o = 0,
                      i = 0
                    this.smoothPlaybackPositionUpdater = new a.Timeout(
                      50,
                      function () {
                        o += 0.05
                        try {
                          i = n.getRelativeCurrentTime()
                        } catch (t) {
                          return void (
                            t instanceof e.exports.PlayerAPINotAvailableError &&
                            n.smoothPlaybackPositionUpdater.clear()
                          )
                        }
                        var t = o - i
                        Math.abs(t) > 2
                          ? (o = i)
                          : t <= -0.05
                          ? (o += 0.05)
                          : t >= 0.05 && (o -= 0.05)
                        var r = (100 / e.getDuration()) * o
                        n.setPlaybackPosition(r)
                      },
                      !0,
                    )
                    var r = function () {
                        e.isLive() ||
                          ((o = n.getRelativeCurrentTime()),
                          n.smoothPlaybackPositionUpdater.start())
                      },
                      s = function () {
                        n.smoothPlaybackPositionUpdater.clear()
                      }
                    e.on(e.exports.PlayerEvent.Play, r),
                      e.on(e.exports.PlayerEvent.Playing, r),
                      e.on(e.exports.PlayerEvent.Paused, s),
                      e.on(e.exports.PlayerEvent.PlaybackFinished, s),
                      e.on(e.exports.PlayerEvent.Seeked, function () {
                        o = n.getRelativeCurrentTime()
                      }),
                      e.on(e.exports.PlayerEvent.SourceUnloaded, s),
                      e.isPlaying() && r()
                  }),
                  (t.prototype.getRelativeCurrentTime = function () {
                    return l.PlayerUtils.getCurrentTimeRelativeToSeekableRange(
                      this.player,
                    )
                  }),
                  (t.prototype.release = function () {
                    e.prototype.release.call(this),
                      this.smoothPlaybackPositionUpdater &&
                        this.smoothPlaybackPositionUpdater.clear(),
                      this.pausedTimeshiftUpdater &&
                        this.pausedTimeshiftUpdater.clear(),
                      this.onSeekPreview.unsubscribe(this.seekWhileScrubbing)
                  }),
                  (t.prototype.toDomElement = function () {
                    var e = this
                    this.config.vertical &&
                      this.config.cssClasses.push('vertical')
                    var t = new r.DOM('div', {
                        id: this.config.id,
                        class: this.getCssClasses(),
                        role: 'slider',
                        'aria-label': p.i18n.performLocalization(
                          this.config.ariaLabel,
                        ),
                        tabindex: this.config.tabIndex.toString(),
                      }),
                      n = new r.DOM('div', {class: this.prefixCss('seekbar')})
                    this.seekBar = n
                    var o = new r.DOM('div', {
                      class: this.prefixCss('seekbar-bufferlevel'),
                    })
                    this.seekBarBufferPosition = o
                    var i = new r.DOM('div', {
                      class: this.prefixCss('seekbar-playbackposition'),
                    })
                    this.seekBarPlaybackPosition = i
                    var s = new r.DOM('div', {
                      class: this.prefixCss('seekbar-playbackposition-marker'),
                    })
                    this.seekBarPlaybackPositionMarker = s
                    var a = new r.DOM('div', {
                      class: this.prefixCss('seekbar-seekposition'),
                    })
                    this.seekBarSeekPosition = a
                    var l = new r.DOM('div', {
                      class: this.prefixCss('seekbar-backdrop'),
                    })
                    this.seekBarBackdrop = l
                    var c = new r.DOM('div', {
                      class: this.prefixCss('seekbar-markers'),
                    })
                    ;(this.seekBarMarkersContainer = c),
                      n.append(
                        this.seekBarBackdrop,
                        this.seekBarBufferPosition,
                        this.seekBarSeekPosition,
                        this.seekBarPlaybackPosition,
                        this.seekBarMarkersContainer,
                        this.seekBarPlaybackPositionMarker,
                      )
                    var u = !1,
                      g = function (t) {
                        t.preventDefault(),
                          null != e.player.vr && t.stopPropagation()
                        var n = 100 * e.getOffset(t)
                        e.setSeekPosition(n),
                          e.setPlaybackPosition(n),
                          e.onSeekPreviewEvent(n, !0)
                      },
                      d = function (t) {
                        t.preventDefault(),
                          new r.DOM(document).off('touchmove mousemove', g),
                          new r.DOM(document).off('touchend mouseup', d)
                        var n = 100 * e.getOffset(t),
                          o =
                            e.timelineMarkersHandler &&
                            e.timelineMarkersHandler.getMarkerAtPosition(n)
                        e.setSeeking(!1),
                          (u = !1),
                          e.onSeekedEvent(o ? o.position : n)
                      }
                    return (
                      n.on('touchstart mousedown', function (t) {
                        var n =
                          f.BrowserUtils.isTouchSupported &&
                          t instanceof TouchEvent
                        t.preventDefault(),
                          null != e.player.vr && t.stopPropagation(),
                          e.setSeeking(!0),
                          (u = !0),
                          e.onSeekEvent(),
                          new r.DOM(document).on(
                            n ? 'touchmove' : 'mousemove',
                            g,
                          ),
                          new r.DOM(document).on(n ? 'touchend' : 'mouseup', d)
                      }),
                      n.on('touchmove mousemove', function (t) {
                        t.preventDefault(), u && g(t)
                        var n = 100 * e.getOffset(t)
                        e.setSeekPosition(n),
                          e.onSeekPreviewEvent(n, !1),
                          e.hasLabel() &&
                            e.getLabel().isHidden() &&
                            e.getLabel().show()
                      }),
                      n.on('touchend mouseleave', function (t) {
                        t.preventDefault(),
                          e.setSeekPosition(0),
                          e.hasLabel() && e.getLabel().hide()
                      }),
                      t.append(n),
                      this.label && t.append(this.label.getDomElement()),
                      t
                    )
                  }),
                  (t.prototype.getHorizontalOffset = function (e) {
                    var t = this.seekBar.offset().left,
                      n = this.seekBar.width(),
                      o = e - t,
                      i = (1 / n) * o
                    return this.sanitizeOffset(i)
                  }),
                  (t.prototype.getVerticalOffset = function (e) {
                    var t = this.seekBar.offset().top,
                      n = this.seekBar.height(),
                      o = e - t,
                      i = (1 / n) * o
                    return 1 - this.sanitizeOffset(i)
                  }),
                  (t.prototype.getOffset = function (e) {
                    return f.BrowserUtils.isTouchSupported &&
                      e instanceof TouchEvent
                      ? this.config.vertical
                        ? this.getVerticalOffset(
                            'touchend' === e.type
                              ? e.changedTouches[0].pageY
                              : e.touches[0].pageY,
                          )
                        : this.getHorizontalOffset(
                            'touchend' === e.type
                              ? e.changedTouches[0].pageX
                              : e.touches[0].pageX,
                          )
                      : e instanceof MouseEvent
                      ? this.config.vertical
                        ? this.getVerticalOffset(e.pageY)
                        : this.getHorizontalOffset(e.pageX)
                      : (console && console.warn('invalid event'), 0)
                  }),
                  (t.prototype.sanitizeOffset = function (e) {
                    return e < 0 ? (e = 0) : e > 1 && (e = 1), e
                  }),
                  (t.prototype.setPlaybackPosition = function (e) {
                    ;(this.playbackPositionPercentage = e),
                      this.setPosition(this.seekBarPlaybackPosition, e)
                    var t = this.config.vertical
                        ? this.seekBar.height() -
                          this.seekBarPlaybackPositionMarker.height()
                        : this.seekBar.width(),
                      n = (t / 100) * e
                    this.config.vertical &&
                      (n =
                        this.seekBar.height() -
                        n -
                        this.seekBarPlaybackPositionMarker.height())
                    var o = this.config.vertical
                      ? {
                          transform: 'translateY(' + n + 'px)',
                          '-ms-transform': 'translateY(' + n + 'px)',
                          '-webkit-transform': 'translateY(' + n + 'px)',
                        }
                      : {
                          transform: 'translateX(' + n + 'px)',
                          '-ms-transform': 'translateX(' + n + 'px)',
                          '-webkit-transform': 'translateX(' + n + 'px)',
                        }
                    this.seekBarPlaybackPositionMarker.css(o)
                  }),
                  (t.prototype.refreshPlaybackPosition = function () {
                    this.setPlaybackPosition(this.playbackPositionPercentage)
                  }),
                  (t.prototype.setBufferPosition = function (e) {
                    this.setPosition(this.seekBarBufferPosition, e)
                  }),
                  (t.prototype.setSeekPosition = function (e) {
                    this.setPosition(this.seekBarSeekPosition, e)
                  }),
                  (t.prototype.setPosition = function (e, t) {
                    var n = t / 100
                    n >= 0.99999 && n <= 1.00001 && (n = 0.99999)
                    var o = this.config.vertical
                      ? {
                          transform: 'scaleY(' + n + ')',
                          '-ms-transform': 'scaleY(' + n + ')',
                          '-webkit-transform': 'scaleY(' + n + ')',
                        }
                      : {
                          transform: 'scaleX(' + n + ')',
                          '-ms-transform': 'scaleX(' + n + ')',
                          '-webkit-transform': 'scaleX(' + n + ')',
                        }
                    e.css(o)
                  }),
                  (t.prototype.setSeeking = function (e) {
                    e
                      ? this.getDomElement().addClass(
                          this.prefixCss(t.CLASS_SEEKING),
                        )
                      : this.getDomElement().removeClass(
                          this.prefixCss(t.CLASS_SEEKING),
                        )
                  }),
                  (t.prototype.isSeeking = function () {
                    return this.getDomElement().hasClass(
                      this.prefixCss(t.CLASS_SEEKING),
                    )
                  }),
                  (t.prototype.hasLabel = function () {
                    return null != this.label
                  }),
                  (t.prototype.getLabel = function () {
                    return this.label
                  }),
                  (t.prototype.onSeekEvent = function () {
                    this.seekBarEvents.onSeek.dispatch(this)
                  }),
                  (t.prototype.onSeekPreviewEvent = function (e, t) {
                    var n =
                        this.timelineMarkersHandler &&
                        this.timelineMarkersHandler.getMarkerAtPosition(e),
                      o = e
                    n &&
                      (n.duration > 0
                        ? e < n.position
                          ? (o = n.position)
                          : e > n.position + n.duration &&
                            (o = n.position + n.duration)
                        : (o = n.position)),
                      this.label &&
                        this.label.getDomElement().css({left: o + '%'}),
                      this.seekBarEvents.onSeekPreview.dispatch(this, {
                        scrubbing: t,
                        position: o,
                        marker: n,
                      })
                  }),
                  (t.prototype.onSeekedEvent = function (e) {
                    this.seekBarEvents.onSeeked.dispatch(this, e)
                  }),
                  Object.defineProperty(t.prototype, 'onSeek', {
                    get: function () {
                      return this.seekBarEvents.onSeek.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onSeekPreview', {
                    get: function () {
                      return this.seekBarEvents.onSeekPreview.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onSeeked', {
                    get: function () {
                      return this.seekBarEvents.onSeeked.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (t.prototype.onShowEvent = function () {
                    e.prototype.onShowEvent.call(this),
                      this.refreshPlaybackPosition()
                  }),
                  (t.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED = -1),
                  (t.CLASS_SEEKING = 'seeking'),
                  t
                )
              })(i.Component)
            n.SeekBar = d
          },
          {
            '../browserutils': 3,
            '../dom': 77,
            '../eventdispatcher': 79,
            '../localization/i18n': 82,
            '../playerutils': 86,
            '../stringutils': 88,
            '../timeout': 90,
            './component': 18,
            './seekbarcontroller': 37,
            './timelinemarkershandler': 65,
          },
        ],
        37: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SeekBarController = n.SeekBarType = void 0)
            var o,
              i = e('../uiutils')
            !(function (e) {
              ;(e[(e.Vod = 0)] = 'Vod'),
                (e[(e.Live = 1)] = 'Live'),
                (e[(e.Volume = 2)] = 'Volume')
            })((o = n.SeekBarType || (n.SeekBarType = {})))
            var r = function (e, t, n) {
                n(e < t.min ? t.min : e > t.max ? t.max : e)
              },
              s = (function () {
                function e(e, t, n) {
                  ;(this.keyStepIncrements = e),
                    (this.player = t),
                    (this.volumeController = n)
                }
                return (
                  (e.prototype.arrowKeyControls = function (e, t, n) {
                    var o = this,
                      i = Math.floor(e)
                    return {
                      left: function () {
                        return r(i - o.keyStepIncrements.leftRight, t, n)
                      },
                      right: function () {
                        return r(i + o.keyStepIncrements.leftRight, t, n)
                      },
                      up: function () {
                        return r(i + o.keyStepIncrements.upDown, t, n)
                      },
                      down: function () {
                        return r(i - o.keyStepIncrements.upDown, t, n)
                      },
                      home: function () {
                        return r(t.min, t, n)
                      },
                      end: function () {
                        return r(t.max, t, n)
                      },
                    }
                  }),
                  (e.prototype.seekBarControls = function (e) {
                    if (e === o.Live)
                      return this.arrowKeyControls(
                        this.player.getTimeShift(),
                        {min: this.player.getMaxTimeShift(), max: 0},
                        this.player.timeShift,
                      )
                    if (e === o.Vod)
                      return this.arrowKeyControls(
                        this.player.getCurrentTime(),
                        {min: 0, max: this.player.getDuration()},
                        this.player.seek,
                      )
                    if (e === o.Volume && null != this.volumeController) {
                      var t = this.volumeController.startTransition()
                      return this.arrowKeyControls(
                        this.player.getVolume(),
                        {min: 0, max: 100},
                        t.finish.bind(t),
                      )
                    }
                  }),
                  (e.prototype.setSeekBarControls = function (e, t) {
                    var n = this
                    e.on('keydown', function (e) {
                      var o = n.seekBarControls(t())
                      switch (e.keyCode) {
                        case i.UIUtils.KeyCode.LeftArrow:
                          o.left(), e.preventDefault()
                          break
                        case i.UIUtils.KeyCode.RightArrow:
                          o.right(), e.preventDefault()
                          break
                        case i.UIUtils.KeyCode.UpArrow:
                          o.up(), e.preventDefault()
                          break
                        case i.UIUtils.KeyCode.DownArrow:
                          o.down(), e.preventDefault()
                          break
                        case i.UIUtils.KeyCode.Home:
                          o.home(), e.preventDefault()
                          break
                        case i.UIUtils.KeyCode.End:
                          o.end(), e.preventDefault()
                          break
                        case i.UIUtils.KeyCode.Space:
                          n.player.isPlaying()
                            ? n.player.pause()
                            : n.player.play(),
                            e.preventDefault()
                      }
                    })
                  }),
                  e
                )
              })()
            n.SeekBarController = s
          },
          {'../uiutils': 93},
        ],
        38: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SeekBarLabel = void 0)
            var i = e('./container'),
              r = e('./label'),
              s = e('./component'),
              a = e('../stringutils'),
              l = e('../imageloader'),
              c = e('../playerutils'),
              u = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.appliedMarkerCssClasses = []),
                    (n.handleSeekPreview = function (e, t) {
                      if (n.player.isLive()) {
                        var o = n.player.getMaxTimeShift(),
                          i = o - o * (t.position / 100)
                        n.setTime(i)
                        var r = (function (e) {
                          var t = n.player.getTimeShift()
                          return n.player.getCurrentTime() - t + e
                        })(i)
                        n.setThumbnail(n.player.getThumbnail(r))
                      } else {
                        var s = n.player.getDuration() * (t.position / 100)
                        n.setTime(s)
                        var a = c.PlayerUtils.getSeekableRangeStart(
                            n.player,
                            0,
                          ),
                          l = s + a
                        n.setThumbnail(n.player.getThumbnail(l))
                      }
                      if (
                        (t.marker
                          ? n.setTitleText(t.marker.marker.title)
                          : n.setTitleText(null),
                        n.appliedMarkerCssClasses.length > 0 &&
                          (n
                            .getDomElement()
                            .removeClass(n.appliedMarkerCssClasses.join(' ')),
                          (n.appliedMarkerCssClasses = [])),
                        t.marker)
                      ) {
                        var u = (t.marker.marker.cssClasses || []).map(
                          function (e) {
                            return n.prefixCss(e)
                          },
                        )
                        n.getDomElement().addClass(u.join(' ')),
                          (n.appliedMarkerCssClasses = u)
                      }
                    }),
                    (n.timeLabel = new r.Label({
                      cssClasses: ['seekbar-label-time'],
                    })),
                    (n.titleLabel = new r.Label({
                      cssClasses: ['seekbar-label-title'],
                    })),
                    (n.thumbnail = new s.Component({
                      cssClasses: ['seekbar-thumbnail'],
                      role: 'img',
                    })),
                    (n.thumbnailImageLoader = new l.ImageLoader()),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-seekbar-label',
                        components: [
                          new i.Container({
                            components: [
                              n.thumbnail,
                              new i.Container({
                                components: [n.titleLabel, n.timeLabel],
                                cssClass: 'seekbar-label-metadata',
                              }),
                            ],
                            cssClass: 'seekbar-label-inner',
                          }),
                        ],
                        hidden: !0,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      (this.player = t),
                      (this.uiManager = n),
                      n.onSeekPreview.subscribeRateLimited(
                        this.handleSeekPreview,
                        100,
                      )
                    var i = function () {
                      ;(o.timeFormat =
                        Math.abs(
                          t.isLive() ? t.getMaxTimeShift() : t.getDuration(),
                        ) >= 3600
                          ? a.StringUtils.FORMAT_HHMMSS
                          : a.StringUtils.FORMAT_MMSS),
                        o.setTitleText(null),
                        o.setThumbnail(null)
                    }
                    n.getConfig().events.onUpdated.subscribe(i), i()
                  }),
                  (t.prototype.setText = function (e) {
                    this.timeLabel.setText(e)
                  }),
                  (t.prototype.setTime = function (e) {
                    this.setText(
                      a.StringUtils.secondsToTime(e, this.timeFormat),
                    )
                  }),
                  (t.prototype.setTitleText = function (e) {
                    void 0 === e && (e = ''), this.titleLabel.setText(e)
                  }),
                  (t.prototype.setThumbnail = function (e) {
                    var t = this
                    void 0 === e && (e = null)
                    var n = this.thumbnail.getDomElement()
                    null == e
                      ? n.css({
                          'background-image': null,
                          display: null,
                          width: null,
                          height: null,
                        })
                      : this.thumbnailImageLoader.load(
                          e.url,
                          function (o, i, r) {
                            void 0 !== e.x
                              ? n.css(t.thumbnailCssSprite(e, i, r))
                              : n.css(t.thumbnailCssSingleImage(e, i, r))
                          },
                        )
                  }),
                  (t.prototype.thumbnailCssSprite = function (e, t, n) {
                    var o = t / e.width,
                      i = n / e.height,
                      r = e.x / e.width,
                      s = e.y / e.height,
                      a = 100 * o,
                      l = 100 * i,
                      c = 100 * r,
                      u = 100 * s,
                      p = (1 / e.width) * e.height
                    return {
                      display: 'inherit',
                      'background-image': 'url(' + e.url + ')',
                      'padding-bottom': 100 * p + '%',
                      'background-size': a + '% ' + l + '%',
                      'background-position': '-' + c + '% -' + u + '%',
                    }
                  }),
                  (t.prototype.thumbnailCssSingleImage = function (e, t, n) {
                    var o = (1 / t) * n
                    return {
                      display: 'inherit',
                      'background-image': 'url(' + e.url + ')',
                      'padding-bottom': 100 * o + '%',
                      'background-size': '100% 100%',
                      'background-position': '0 0',
                    }
                  }),
                  (t.prototype.release = function () {
                    e.prototype.release.call(this),
                      this.uiManager.onSeekPreview.unsubscribe(
                        this.handleSeekPreview,
                      )
                  }),
                  t
                )
              })(i.Container)
            n.SeekBarLabel = u
          },
          {
            '../imageloader': 81,
            '../playerutils': 86,
            '../stringutils': 88,
            './component': 18,
            './container': 19,
            './label': 26,
          },
        ],
        39: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SelectBox = void 0)
            var i = e('./listselector'),
              r = e('../dom'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-selectbox'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.toDomElement = function () {
                    var e = this,
                      t = new r.DOM('select', {
                        id: this.config.id,
                        class: this.getCssClasses(),
                        'aria-label': s.i18n.performLocalization(
                          this.config.ariaLabel,
                        ),
                      })
                    return (
                      (this.selectElement = t),
                      this.updateDomItems(),
                      t.on('change', function () {
                        var n = t.val()
                        e.onItemSelectedEvent(n, !1)
                      }),
                      t
                    )
                  }),
                  (t.prototype.updateDomItems = function (e) {
                    void 0 === e && (e = null), this.selectElement.empty()
                    for (var t = 0, n = this.items; t < n.length; t++) {
                      var o = n[t],
                        i = new r.DOM('option', {value: String(o.key)}).html(
                          s.i18n.performLocalization(o.label),
                        )
                      o.key === String(e) && i.attr('selected', 'selected'),
                        this.selectElement.append(i)
                    }
                  }),
                  (t.prototype.onItemAddedEvent = function (t) {
                    e.prototype.onItemAddedEvent.call(this, t),
                      this.updateDomItems(this.selectedItem)
                  }),
                  (t.prototype.onItemRemovedEvent = function (t) {
                    e.prototype.onItemRemovedEvent.call(this, t),
                      this.updateDomItems(this.selectedItem)
                  }),
                  (t.prototype.onItemSelectedEvent = function (t, n) {
                    void 0 === n && (n = !0),
                      e.prototype.onItemSelectedEvent.call(this, t),
                      n && this.updateDomItems(t)
                  }),
                  t
                )
              })(i.ListSelector)
            n.SelectBox = a
          },
          {'../dom': 77, '../localization/i18n': 82, './listselector': 28},
        ],
        40: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsPanel = void 0)
            var i,
              r = e('./container'),
              s = e('./selectbox'),
              a = e('../timeout'),
              l = e('../eventdispatcher'),
              c = e('./settingspanelpage')
            !(function (e) {
              ;(e[(e.Forwards = 0)] = 'Forwards'),
                (e[(e.Backwards = 1)] = 'Backwards')
            })(i || (i = {}))
            var u = (function (e) {
              function t(t) {
                var n = e.call(this, t) || this
                return (
                  (n.navigationStack = []),
                  (n.settingsPanelEvents = {
                    onSettingsStateChanged: new l.EventDispatcher(),
                  }),
                  (n.config = n.mergeConfig(
                    t,
                    {
                      cssClass: 'ui-settings-panel',
                      hideDelay: 3e3,
                      pageTransitionAnimation: !0,
                    },
                    n.config,
                  )),
                  (n.activePage = n.getRootPage()),
                  n
                )
              }
              return (
                o(t, e),
                (t.prototype.configure = function (t, n) {
                  var o = this
                  e.prototype.configure.call(this, t, n)
                  var i = this.getConfig()
                  n.onControlsHide.subscribe(function () {
                    return o.hideHoveredSelectBoxes()
                  }),
                    i.hideDelay > -1 &&
                      ((this.hideTimeout = new a.Timeout(
                        i.hideDelay,
                        function () {
                          o.hide(), o.hideHoveredSelectBoxes()
                        },
                      )),
                      this.getDomElement().on('mouseenter', function () {
                        o.hideTimeout.clear()
                      }),
                      this.getDomElement().on('mouseleave', function () {
                        o.hideTimeout.reset()
                      }),
                      this.getDomElement().on('focusin', function () {
                        o.hideTimeout.clear()
                      }),
                      this.getDomElement().on('focusout', function () {
                        o.hideTimeout.reset()
                      })),
                    this.onHide.subscribe(function () {
                      i.hideDelay > -1 && o.hideTimeout.clear(),
                        o.activePage.onInactiveEvent()
                    }),
                    this.onShow.subscribe(function () {
                      o.resetNavigation(!0),
                        o.activePage.onActiveEvent(),
                        i.hideDelay > -1 && o.hideTimeout.start()
                    }),
                    this.getRootPage().onSettingsStateChanged.subscribe(
                      function () {
                        o.onSettingsStateChangedEvent()
                      },
                    ),
                    this.updateActivePageClass()
                }),
                (t.prototype.getActivePage = function () {
                  return this.activePage
                }),
                (t.prototype.setActivePageIndex = function (e) {
                  this.setActivePage(this.getPages()[e])
                }),
                (t.prototype.setActivePage = function (e) {
                  if (e === this.getActivePage())
                    return void console.warn(
                      'Page is already the current one ... skipping navigation',
                    )
                  this.navigateToPage(
                    e,
                    this.getActivePage(),
                    i.Forwards,
                    !this.config.pageTransitionAnimation,
                  )
                }),
                (t.prototype.popToRootSettingsPanelPage = function () {
                  this.resetNavigation(this.config.pageTransitionAnimation)
                }),
                (t.prototype.popSettingsPanelPage = function () {
                  if (0 === this.navigationStack.length)
                    return void console.warn(
                      'Already on the root page ... skipping navigation',
                    )
                  var e = this.navigationStack[this.navigationStack.length - 2]
                  e || (e = this.getRootPage()),
                    this.navigateToPage(
                      e,
                      this.activePage,
                      i.Backwards,
                      !this.config.pageTransitionAnimation,
                    )
                }),
                (t.prototype.rootPageHasActiveSettings = function () {
                  return this.getRootPage().hasActiveSettings()
                }),
                (t.prototype.getPages = function () {
                  return this.config.components.filter(function (e) {
                    return e instanceof c.SettingsPanelPage
                  })
                }),
                Object.defineProperty(t.prototype, 'onSettingsStateChanged', {
                  get: function () {
                    return this.settingsPanelEvents.onSettingsStateChanged.getEvent()
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                (t.prototype.release = function () {
                  e.prototype.release.call(this),
                    this.hideTimeout && this.hideTimeout.clear()
                }),
                (t.prototype.addComponent = function (t) {
                  0 === this.getPages().length &&
                    t instanceof c.SettingsPanelPage &&
                    (this.activePage = t),
                    e.prototype.addComponent.call(this, t)
                }),
                (t.prototype.updateActivePageClass = function () {
                  var e = this
                  this.getPages().forEach(function (n) {
                    n === e.activePage
                      ? n
                          .getDomElement()
                          .addClass(e.prefixCss(t.CLASS_ACTIVE_PAGE))
                      : n
                          .getDomElement()
                          .removeClass(e.prefixCss(t.CLASS_ACTIVE_PAGE))
                  })
                }),
                (t.prototype.resetNavigation = function (e) {
                  var t = this.getActivePage(),
                    n = this.getRootPage()
                  t && (e || t.onInactiveEvent()),
                    (this.navigationStack = []),
                    this.animateNavigation(n, t, e),
                    (this.activePage = n),
                    this.updateActivePageClass()
                }),
                (t.prototype.navigateToPage = function (e, t, n, o) {
                  ;(this.activePage = e),
                    n === i.Forwards
                      ? this.navigationStack.push(e)
                      : this.navigationStack.pop(),
                    this.animateNavigation(e, t, o),
                    this.updateActivePageClass(),
                    e.onActiveEvent(),
                    t.onInactiveEvent()
                }),
                (t.prototype.animateNavigation = function (e, t, n) {
                  if (this.config.pageTransitionAnimation) {
                    var o = this.getDomElement(),
                      i = this.getDomElement().get(0),
                      r = i.scrollWidth,
                      s = i.scrollHeight
                    t.getDomElement().css('display', 'none'),
                      this.getDomElement().css({width: '', height: ''})
                    var a = e.getDomElement().get(0),
                      l = a.cloneNode(!0)
                    a.parentNode.appendChild(l), (l.style.display = 'block')
                    var c = i.scrollWidth,
                      u = i.scrollHeight
                    l.parentElement.removeChild(l),
                      t.getDomElement().css('display', ''),
                      o.css({width: r + 'px', height: s + 'px'}),
                      n || this.forceBrowserReflow(),
                      o.css({width: c + 'px', height: u + 'px'})
                  }
                }),
                (t.prototype.forceBrowserReflow = function () {
                  this.getDomElement().get(0).offsetLeft
                }),
                (t.prototype.hideHoveredSelectBoxes = function () {
                  this.getComputedItems().forEach(function (e) {
                    if (e.isActive() && e.setting instanceof s.SelectBox) {
                      var t = e.setting,
                        n = t.getDomElement().css('display')
                      if ('none' === n) return
                      t.getDomElement().css('display', 'none'),
                        window.requestAnimationFrame
                          ? requestAnimationFrame(function () {
                              t.getDomElement().css('display', n)
                            })
                          : t.getDomElement().css('display', n)
                    }
                  })
                }),
                (t.prototype.getComputedItems = function () {
                  for (
                    var e = [], t = 0, n = this.getPages();
                    t < n.length;
                    t++
                  ) {
                    var o = n[t]
                    e.push.apply(e, o.getItems())
                  }
                  return e
                }),
                (t.prototype.getRootPage = function () {
                  return this.getPages()[0]
                }),
                (t.prototype.onSettingsStateChangedEvent = function () {
                  this.settingsPanelEvents.onSettingsStateChanged.dispatch(this)
                }),
                (t.CLASS_ACTIVE_PAGE = 'active'),
                t
              )
            })(r.Container)
            n.SettingsPanel = u
          },
          {
            '../eventdispatcher': 79,
            '../timeout': 90,
            './container': 19,
            './selectbox': 39,
            './settingspanelpage': 42,
          },
        ],
        41: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsPanelItem = void 0)
            var i = e('./container'),
              r = e('./component'),
              s = e('../eventdispatcher'),
              a = e('./label'),
              l = e('./selectbox'),
              c = e('./listbox'),
              u = e('./videoqualityselectbox'),
              p = e('./audioqualityselectbox'),
              f = e('./playbackspeedselectbox'),
              g = (function (e) {
                function t(t, n, o) {
                  void 0 === o && (o = {})
                  var i = e.call(this, o) || this
                  return (
                    (i.settingsPanelItemEvents = {
                      onActiveChanged: new s.EventDispatcher(),
                    }),
                    (i.setting = n),
                    (i.config = i.mergeConfig(
                      o,
                      {cssClass: 'ui-settings-panel-item', role: 'menuitem'},
                      i.config,
                    )),
                    null !== t &&
                      (t instanceof r.Component
                        ? (i.label = t)
                        : (i.label = new a.Label({
                            text: t,
                            for: i.setting.getConfig().id,
                          })),
                      i.addComponent(i.label)),
                    i.addComponent(i.setting),
                    i
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (e, t) {
                    var n = this
                    if (
                      this.setting instanceof l.SelectBox ||
                      this.setting instanceof c.ListBox
                    ) {
                      var o = function () {
                        if (
                          n.setting instanceof l.SelectBox ||
                          n.setting instanceof c.ListBox
                        ) {
                          var e = 2
                          ;((n.setting instanceof u.VideoQualitySelectBox &&
                            n.setting.hasAutoItem()) ||
                            n.setting instanceof p.AudioQualitySelectBox) &&
                            (e = 3),
                            n.setting.itemCount() < e
                              ? n.hide()
                              : n.setting instanceof f.PlaybackSpeedSelectBox &&
                                !t.getConfig().playbackSpeedSelectionEnabled
                              ? n.hide()
                              : n.show(),
                            n.onActiveChangedEvent(),
                            n.getDomElement().attr('aria-haspopup', 'true')
                        }
                      }
                      this.setting.onItemAdded.subscribe(o),
                        this.setting.onItemRemoved.subscribe(o),
                        o()
                    }
                  }),
                  (t.prototype.isActive = function () {
                    return this.isShown()
                  }),
                  (t.prototype.onActiveChangedEvent = function () {
                    this.settingsPanelItemEvents.onActiveChanged.dispatch(this)
                  }),
                  Object.defineProperty(t.prototype, 'onActiveChanged', {
                    get: function () {
                      return this.settingsPanelItemEvents.onActiveChanged.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  t
                )
              })(i.Container)
            n.SettingsPanelItem = g
          },
          {
            '../eventdispatcher': 79,
            './audioqualityselectbox': 8,
            './component': 18,
            './container': 19,
            './label': 26,
            './listbox': 27,
            './playbackspeedselectbox': 31,
            './selectbox': 39,
            './videoqualityselectbox': 70,
          },
        ],
        42: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsPanelPage = void 0)
            var i = e('./container'),
              r = e('./settingspanelitem'),
              s = e('../eventdispatcher'),
              a = e('../browserutils'),
              l = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.settingsPanelPageEvents = {
                      onSettingsStateChanged: new s.EventDispatcher(),
                      onActive: new s.EventDispatcher(),
                      onInactive: new s.EventDispatcher(),
                    }),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-settings-panel-page', role: 'menu'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (n, o) {
                    var i = this
                    e.prototype.configure.call(this, n, o)
                    for (
                      var r = function () {
                          i.onSettingsStateChangedEvent()
                          for (
                            var e = null, n = 0, o = i.getItems();
                            n < o.length;
                            n++
                          ) {
                            var r = o[n]
                            r
                              .getDomElement()
                              .removeClass(i.prefixCss(t.CLASS_LAST)),
                              r.isShown() && (e = r)
                          }
                          e &&
                            e
                              .getDomElement()
                              .addClass(i.prefixCss(t.CLASS_LAST))
                        },
                        s = 0,
                        a = this.getItems();
                      s < a.length;
                      s++
                    ) {
                      a[s].onActiveChanged.subscribe(r)
                    }
                  }),
                  (t.prototype.hasActiveSettings = function () {
                    for (var e = 0, t = this.getItems(); e < t.length; e++) {
                      if (t[e].isActive()) return !0
                    }
                    return !1
                  }),
                  (t.prototype.getItems = function () {
                    return this.config.components.filter(function (e) {
                      return e instanceof r.SettingsPanelItem
                    })
                  }),
                  (t.prototype.onSettingsStateChangedEvent = function () {
                    this.settingsPanelPageEvents.onSettingsStateChanged.dispatch(
                      this,
                    )
                  }),
                  Object.defineProperty(t.prototype, 'onSettingsStateChanged', {
                    get: function () {
                      return this.settingsPanelPageEvents.onSettingsStateChanged.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (t.prototype.onActiveEvent = function () {
                    var e = this.getItems().filter(function (e) {
                      return e.isActive()
                    })
                    this.settingsPanelPageEvents.onActive.dispatch(this),
                      !(e.length > 0) ||
                        a.BrowserUtils.isIOS ||
                        (a.BrowserUtils.isMacIntel &&
                          a.BrowserUtils.isTouchSupported) ||
                        e[0].getDomElement().focusToFirstInput()
                  }),
                  Object.defineProperty(t.prototype, 'onActive', {
                    get: function () {
                      return this.settingsPanelPageEvents.onActive.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (t.prototype.onInactiveEvent = function () {
                    this.settingsPanelPageEvents.onInactive.dispatch(this)
                  }),
                  Object.defineProperty(t.prototype, 'onInactive', {
                    get: function () {
                      return this.settingsPanelPageEvents.onInactive.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (t.CLASS_LAST = 'last'),
                  t
                )
              })(i.Container)
            n.SettingsPanelPage = l
          },
          {
            '../browserutils': 3,
            '../eventdispatcher': 79,
            './container': 19,
            './settingspanelitem': 41,
          },
        ],
        43: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsPanelPageBackButton = void 0)
            var i = e('./settingspanelpagenavigatorbutton'),
              r = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-settingspanelpagebackbutton',
                        text: 'back',
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.onClick.subscribe(function () {
                        o.popPage()
                      })
                  }),
                  t
                )
              })(i.SettingsPanelPageNavigatorButton)
            n.SettingsPanelPageBackButton = r
          },
          {'./settingspanelpagenavigatorbutton': 44},
        ],
        44: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsPanelPageNavigatorButton = void 0)
            var i = e('./button'),
              r = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(t, {}, n.config)),
                    (n.container = n.config.container),
                    (n.targetPage = n.config.targetPage),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.popPage = function () {
                    this.container.popSettingsPanelPage()
                  }),
                  (t.prototype.pushTargetPage = function () {
                    this.container.setActivePage(this.targetPage)
                  }),
                  t
                )
              })(i.Button)
            n.SettingsPanelPageNavigatorButton = r
          },
          {'./button': 12},
        ],
        45: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsPanelPageOpenButton = void 0)
            var i = e('./settingspanelpagenavigatorbutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-settingspanelpageopenbutton',
                        text: r.i18n.getLocalizer('open'),
                        role: 'menuitem',
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.getDomElement().attr('aria-haspopup', 'true'),
                      this.getDomElement().attr(
                        'aria-owns',
                        this.config.targetPage.getConfig().id,
                      ),
                      this.onClick.subscribe(function () {
                        o.pushTargetPage()
                      })
                  }),
                  t
                )
              })(i.SettingsPanelPageNavigatorButton)
            n.SettingsPanelPageOpenButton = s
          },
          {
            '../localization/i18n': 82,
            './settingspanelpagenavigatorbutton': 44,
          },
        ],
        46: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SettingsToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('./settingspanel'),
              s = e('../arrayutils'),
              a = e('../localization/i18n'),
              l = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  if (((n.visibleSettingsPanels = []), !t.settingsPanel))
                    throw new Error('Required SettingsPanel is missing')
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-settingstogglebutton',
                        text: a.i18n.getLocalizer('settings'),
                        settingsPanel: null,
                        autoHideWhenNoActiveSettings: !0,
                        role: 'pop-up button',
                      },
                      n.config,
                    )),
                    n
                      .getDomElement()
                      .attr(
                        'aria-owns',
                        t.settingsPanel.getActivePage().getConfig().id,
                      ),
                    n.getDomElement().attr('aria-haspopup', 'true'),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getConfig(),
                      a = i.settingsPanel
                    if (
                      (this.onClick.subscribe(function () {
                        a.isShown() ||
                          o.visibleSettingsPanels.slice().forEach(function (e) {
                            return e.hide()
                          }),
                          a.toggleHidden()
                      }),
                      a.onShow.subscribe(function () {
                        o.on()
                      }),
                      a.onHide.subscribe(function () {
                        o.off()
                      }),
                      n.onComponentShow.subscribe(function (e) {
                        e instanceof r.SettingsPanel &&
                          (o.visibleSettingsPanels.push(e),
                          e.onHide.subscribeOnce(function () {
                            return s.ArrayUtils.remove(
                              o.visibleSettingsPanels,
                              e,
                            )
                          }))
                      }),
                      i.autoHideWhenNoActiveSettings)
                    ) {
                      var l = function () {
                        a.rootPageHasActiveSettings()
                          ? o.isHidden() && o.show()
                          : o.isShown() && o.hide()
                      }
                      a.onSettingsStateChanged.subscribe(l), l()
                    }
                  }),
                  t
                )
              })(i.ToggleButton)
            n.SettingsToggleButton = l
          },
          {
            '../arrayutils': 1,
            '../localization/i18n': 82,
            './settingspanel': 40,
            './togglebutton': 67,
          },
        ],
        47: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Spacer = void 0)
            var i = e('./component'),
              r = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-spacer'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.onShowEvent = function () {}),
                  (t.prototype.onHideEvent = function () {}),
                  (t.prototype.onHoverChangedEvent = function (e) {}),
                  t
                )
              })(i.Component)
            n.Spacer = r
          },
          {'./component': 18},
        ],
        48: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleListBox = void 0)
            var i = e('./listbox'),
              r = e('../subtitleutils'),
              s = (function (e) {
                function t() {
                  return (null !== e && e.apply(this, arguments)) || this
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n),
                      new r.SubtitleSwitchHandler(t, this, n)
                  }),
                  t
                )
              })(i.ListBox)
            n.SubtitleListBox = s
          },
          {'../subtitleutils': 89, './listbox': 27},
        ],
        49: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleRegionContainer = n.SubtitleRegionContainerManager = n.SubtitleLabel = n.SubtitleOverlay = void 0)
            var i = e('./container'),
              r = e('./label'),
              s = e('./controlbar'),
              a = e('../eventdispatcher'),
              l = e('../dom'),
              c = e('../localization/i18n'),
              u = e('../vttutils'),
              p = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.preprocessLabelEventCallback = new a.EventDispatcher()),
                    (n.previewSubtitleActive = !1),
                    (n.previewSubtitle = new f({
                      text: c.i18n.getLocalizer('subtitle.example'),
                    })),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-subtitle-overlay'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (n, o) {
                    var i = this
                    e.prototype.configure.call(this, n, o)
                    var r = new g()
                    ;(this.subtitleManager = r),
                      (this.subtitleContainerManager = new d(this)),
                      n.on(n.exports.PlayerEvent.CueEnter, function (e) {
                        e.position &&
                          ((e.position.row = e.position.row || 0),
                          (e.position.column = e.position.column || 0))
                        var t = r.cueEnter(e)
                        i.preprocessLabelEventCallback.dispatch(e, t),
                          i.previewSubtitleActive &&
                            i.subtitleContainerManager.removeLabel(
                              i.previewSubtitle,
                            ),
                          i.show(),
                          i.subtitleContainerManager.addLabel(
                            t,
                            i.getDomElement().size(),
                          ),
                          i.updateComponents()
                      }),
                      n.on(n.exports.PlayerEvent.CueExit, function (e) {
                        var t = r.cueExit(e)
                        t &&
                          (i.subtitleContainerManager.removeLabel(t),
                          i.updateComponents()),
                          r.hasCues ||
                            (i.previewSubtitleActive
                              ? (i.subtitleContainerManager.addLabel(
                                  i.previewSubtitle,
                                ),
                                i.updateComponents())
                              : i.hide())
                      })
                    var a = function () {
                      i.hide(),
                        i.subtitleContainerManager.clear(),
                        r.clear(),
                        i.removeComponents(),
                        i.updateComponents()
                    }
                    n.on(n.exports.PlayerEvent.AudioChanged, a),
                      n.on(n.exports.PlayerEvent.SubtitleEnabled, a),
                      n.on(n.exports.PlayerEvent.SubtitleDisabled, a),
                      n.on(n.exports.PlayerEvent.Seek, a),
                      n.on(n.exports.PlayerEvent.TimeShift, a),
                      n.on(n.exports.PlayerEvent.PlaybackFinished, a),
                      n.on(n.exports.PlayerEvent.SourceUnloaded, a),
                      o.onComponentShow.subscribe(function (e) {
                        e instanceof s.ControlBar &&
                          i
                            .getDomElement()
                            .addClass(i.prefixCss(t.CLASS_CONTROLBAR_VISIBLE))
                      }),
                      o.onComponentHide.subscribe(function (e) {
                        e instanceof s.ControlBar &&
                          i
                            .getDomElement()
                            .removeClass(
                              i.prefixCss(t.CLASS_CONTROLBAR_VISIBLE),
                            )
                      }),
                      this.configureCea608Captions(n, o),
                      a()
                  }),
                  (t.prototype.configureCea608Captions = function (e, n) {
                    var o = this,
                      i = 0,
                      r = 0,
                      s = !0,
                      a = !1,
                      l = function () {
                        var e = new f({text: 'X'})
                        e
                          .getDomElement()
                          .css({
                            'font-size': '200px',
                            'line-height': '200px',
                            visibility: 'hidden',
                          }),
                          o.addComponent(e),
                          o.updateComponents(),
                          o.show()
                        var n = e.getDomElement().width(),
                          s = e.getDomElement().height(),
                          a = n / s
                        o.removeComponent(e),
                          o.updateComponents(),
                          o.subtitleManager.hasCues || o.hide()
                        var l = o.getDomElement().width() - 10,
                          c = o.getDomElement().height()
                        if (
                          l / c >
                          (n * t.CEA608_NUM_COLUMNS) / (s * t.CEA608_NUM_ROWS)
                        ) {
                          i = c / t.CEA608_NUM_ROWS
                          var u = l / t.CEA608_NUM_COLUMNS
                          r = u - i * a
                        } else (i = l / t.CEA608_NUM_COLUMNS / a), (r = 0)
                        for (
                          var p = 0, g = o.getComponents();
                          p < g.length;
                          p++
                        ) {
                          var d = g[p]
                          d instanceof f &&
                            d
                              .getDomElement()
                              .css({
                                'font-size': i + 'px',
                                'letter-spacing': r + 'px',
                              })
                        }
                      }
                    e.on(e.exports.PlayerEvent.PlayerResized, function () {
                      a ? l() : (s = !0)
                    }),
                      this.preprocessLabelEventCallback.subscribe(function (
                        e,
                        n,
                      ) {
                        null != e.position &&
                          (a ||
                            ((a = !0),
                            o
                              .getDomElement()
                              .addClass(o.prefixCss(t.CLASS_CEA_608)),
                            s && (l(), (s = !1))),
                          n
                            .getDomElement()
                            .css({
                              left:
                                e.position.column * t.CEA608_COLUMN_OFFSET +
                                '%',
                              top: e.position.row * t.CEA608_ROW_OFFSET + '%',
                              'font-size': i + 'px',
                              'letter-spacing': r + 'px',
                            }))
                      })
                    var c = function () {
                      o
                        .getDomElement()
                        .removeClass(o.prefixCss(t.CLASS_CEA_608)),
                        (a = !1)
                    }
                    e.on(e.exports.PlayerEvent.CueExit, function () {
                      o.subtitleManager.hasCues || c()
                    }),
                      e.on(e.exports.PlayerEvent.SourceUnloaded, c),
                      e.on(e.exports.PlayerEvent.SubtitleEnabled, c),
                      e.on(e.exports.PlayerEvent.SubtitleDisabled, c)
                  }),
                  (t.prototype.enablePreviewSubtitleLabel = function () {
                    ;(this.previewSubtitleActive = !0),
                      this.subtitleManager.hasCues ||
                        (this.subtitleContainerManager.addLabel(
                          this.previewSubtitle,
                        ),
                        this.updateComponents(),
                        this.show())
                  }),
                  (t.prototype.removePreviewSubtitleLabel = function () {
                    ;(this.previewSubtitleActive = !1),
                      this.subtitleContainerManager.removeLabel(
                        this.previewSubtitle,
                      ),
                      this.updateComponents()
                  }),
                  (t.CLASS_CONTROLBAR_VISIBLE = 'controlbar-visible'),
                  (t.CLASS_CEA_608 = 'cea608'),
                  (t.CEA608_NUM_ROWS = 15),
                  (t.CEA608_NUM_COLUMNS = 32),
                  (t.CEA608_ROW_OFFSET = 100 / t.CEA608_NUM_ROWS),
                  (t.CEA608_COLUMN_OFFSET = 100 / t.CEA608_NUM_COLUMNS),
                  t
                )
              })(i.Container)
            n.SubtitleOverlay = p
            var f = (function (e) {
              function t(t) {
                void 0 === t && (t = {})
                var n = e.call(this, t) || this
                return (
                  (n.config = n.mergeConfig(
                    t,
                    {cssClass: 'ui-subtitle-label'},
                    n.config,
                  )),
                  n
                )
              }
              return (
                o(t, e),
                Object.defineProperty(t.prototype, 'vtt', {
                  get: function () {
                    return this.config.vtt
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(t.prototype, 'region', {
                  get: function () {
                    return this.config.region
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(t.prototype, 'regionStyle', {
                  get: function () {
                    return this.config.regionStyle
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                t
              )
            })(r.Label)
            n.SubtitleLabel = f
            var g = (function () {
                function e() {
                  ;(this.activeSubtitleCueMap = {}),
                    (this.activeSubtitleCueCount = 0)
                }
                return (
                  (e.calculateId = function (e) {
                    var t = e.start + '-' + e.text
                    return (
                      e.position &&
                        (t += '-' + e.position.row + '-' + e.position.column),
                      t
                    )
                  }),
                  (e.prototype.cueEnter = function (t) {
                    var n = e.calculateId(t),
                      o = new f({
                        text:
                          t.html || e.generateImageTagText(t.image) || t.text,
                        vtt: t.vtt,
                        region: t.region,
                        regionStyle: t.regionStyle,
                      })
                    return (
                      (this.activeSubtitleCueMap[n] =
                        this.activeSubtitleCueMap[n] || []),
                      this.activeSubtitleCueMap[n].push({event: t, label: o}),
                      this.activeSubtitleCueCount++,
                      o
                    )
                  }),
                  (e.generateImageTagText = function (e) {
                    if (e) {
                      var t = new l.DOM('img', {src: e})
                      return t.css('width', '100%'), t.get(0).outerHTML
                    }
                  }),
                  (e.prototype.getCues = function (t) {
                    var n = e.calculateId(t),
                      o = this.activeSubtitleCueMap[n]
                    return o && o.length > 0
                      ? o.map(function (e) {
                          return e.label
                        })
                      : null
                  }),
                  (e.prototype.cueExit = function (t) {
                    var n = e.calculateId(t),
                      o = this.activeSubtitleCueMap[n]
                    if (o && o.length > 0) {
                      var i = o.shift()
                      return this.activeSubtitleCueCount--, i.label
                    }
                    return null
                  }),
                  Object.defineProperty(e.prototype, 'cueCount', {
                    get: function () {
                      return this.activeSubtitleCueCount
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'hasCues', {
                    get: function () {
                      return this.cueCount > 0
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.prototype.clear = function () {
                    ;(this.activeSubtitleCueMap = {}),
                      (this.activeSubtitleCueCount = 0)
                  }),
                  e
                )
              })(),
              d = (function () {
                function e(e) {
                  ;(this.subtitleOverlay = e),
                    (this.subtitleRegionContainers = {}),
                    (this.subtitleOverlay = e)
                }
                return (
                  (e.prototype.addLabel = function (e, t) {
                    var n, o
                    e.vtt
                      ? ((n =
                          e.vtt.region && e.vtt.region.id
                            ? e.vtt.region.id
                            : 'vtt'),
                        (o = 'vtt'))
                      : (n = o = e.region || 'default')
                    var i = ['subtitle-position-' + o]
                    if (
                      (e.vtt &&
                        e.vtt.region &&
                        i.push('vtt-region-' + e.vtt.region.id),
                      !this.subtitleRegionContainers[n])
                    ) {
                      var r = new h({cssClasses: i})
                      ;(this.subtitleRegionContainers[n] = r),
                        e.regionStyle
                          ? r.getDomElement().attr('style', e.regionStyle)
                          : e.vtt && !e.vtt.region
                          ? r.getDomElement().css('position', 'static')
                          : r.getDomElement()
                      for (var s in this.subtitleRegionContainers)
                        this.subtitleOverlay.addComponent(
                          this.subtitleRegionContainers[s],
                        )
                    }
                    this.subtitleRegionContainers[n].addLabel(e, t)
                  }),
                  (e.prototype.removeLabel = function (e) {
                    var t
                    ;(t = e.vtt
                      ? e.vtt.region && e.vtt.region.id
                        ? e.vtt.region.id
                        : 'vtt'
                      : e.region || 'default'),
                      this.subtitleRegionContainers[t].removeLabel(e),
                      this.subtitleRegionContainers[t].isEmpty() &&
                        (this.subtitleOverlay.removeComponent(
                          this.subtitleRegionContainers[t],
                        ),
                        delete this.subtitleRegionContainers[t])
                  }),
                  (e.prototype.clear = function () {
                    for (var e in this.subtitleRegionContainers)
                      this.subtitleOverlay.removeComponent(
                        this.subtitleRegionContainers[e],
                      )
                    this.subtitleRegionContainers = {}
                  }),
                  e
                )
              })()
            n.SubtitleRegionContainerManager = d
            var h = (function (e) {
              function t(t) {
                void 0 === t && (t = {})
                var n = e.call(this, t) || this
                return (
                  (n.labelCount = 0),
                  (n.config = n.mergeConfig(
                    t,
                    {cssClass: 'subtitle-region-container'},
                    n.config,
                  )),
                  n
                )
              }
              return (
                o(t, e),
                (t.prototype.addLabel = function (e, t) {
                  this.labelCount++,
                    e.vtt &&
                      (e.vtt.region &&
                        t &&
                        u.VttUtils.setVttRegionStyles(this, e.vtt.region, t),
                      u.VttUtils.setVttCueBoxStyles(e, t)),
                    this.addComponent(e),
                    this.updateComponents()
                }),
                (t.prototype.removeLabel = function (e) {
                  this.labelCount--,
                    this.removeComponent(e),
                    this.updateComponents()
                }),
                (t.prototype.isEmpty = function () {
                  return 0 === this.labelCount
                }),
                t
              )
            })(i.Container)
            n.SubtitleRegionContainer = h
          },
          {
            '../dom': 77,
            '../eventdispatcher': 79,
            '../localization/i18n': 82,
            '../vttutils': 95,
            './container': 19,
            './controlbar': 20,
            './label': 26,
          },
        ],
        50: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSelectBox = void 0)
            var i = e('./selectbox'),
              r = e('../subtitleutils'),
              s = e('../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClasses: ['ui-subtitleselectbox'],
                        ariaLabel: s.i18n.getLocalizer('subtitle.select'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n),
                      new r.SubtitleSwitchHandler(t, this, n)
                  }),
                  t
                )
              })(i.SelectBox)
            n.SubtitleSelectBox = a
          },
          {
            '../localization/i18n': 82,
            '../subtitleutils': 89,
            './selectbox': 39,
          },
        ],
        51: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.BackgroundColorSelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClasses: [
                          'ui-subtitlesettingsbackgroundcolorselectbox',
                        ],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        'white',
                        r.i18n.getLocalizer('colors.white'),
                      ),
                      this.addItem(
                        'black',
                        r.i18n.getLocalizer('colors.black'),
                      ),
                      this.addItem('red', r.i18n.getLocalizer('colors.red')),
                      this.addItem(
                        'green',
                        r.i18n.getLocalizer('colors.green'),
                      ),
                      this.addItem('blue', r.i18n.getLocalizer('colors.blue')),
                      this.addItem('cyan', r.i18n.getLocalizer('colors.cyan')),
                      this.addItem(
                        'yellow',
                        r.i18n.getLocalizer('colors.yellow'),
                      ),
                      this.addItem(
                        'magenta',
                        r.i18n.getLocalizer('colors.magenta'),
                      )
                    var i = function () {
                      o.settingsManager.backgroundColor.isSet() &&
                      o.settingsManager.backgroundOpacity.isSet()
                        ? o.toggleOverlayClass(
                            'bgcolor-' +
                              o.settingsManager.backgroundColor.value +
                              o.settingsManager.backgroundOpacity.value,
                          )
                        : o.toggleOverlayClass(null)
                    }
                    this.onItemSelected.subscribe(function (e, t) {
                      o.settingsManager.backgroundColor.value = t
                    }),
                      this.settingsManager.backgroundColor.onChanged.subscribe(
                        function (e, t) {
                          o.settingsManager.backgroundColor.isSet()
                            ? o.settingsManager.backgroundOpacity.isSet() ||
                              (o.settingsManager.backgroundOpacity.value =
                                '100')
                            : o.settingsManager.backgroundOpacity.clear(),
                            o.selectItem(t.value),
                            i()
                        },
                      ),
                      this.settingsManager.backgroundOpacity.onChanged.subscribe(
                        function () {
                          i()
                        },
                      ),
                      this.settingsManager.backgroundColor.isSet() &&
                        this.selectItem(
                          this.settingsManager.backgroundColor.value,
                        )
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.BackgroundColorSelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        52: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.BackgroundOpacitySelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClasses: [
                          'ui-subtitlesettingsbackgroundopacityselectbox',
                        ],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        '100',
                        r.i18n.getLocalizer('percent', {value: 100}),
                      ),
                      this.addItem(
                        '75',
                        r.i18n.getLocalizer('percent', {value: 75}),
                      ),
                      this.addItem(
                        '50',
                        r.i18n.getLocalizer('percent', {value: 50}),
                      ),
                      this.addItem(
                        '25',
                        r.i18n.getLocalizer('percent', {value: 25}),
                      ),
                      this.addItem(
                        '0',
                        r.i18n.getLocalizer('percent', {value: 0}),
                      ),
                      this.onItemSelected.subscribe(function (e, t) {
                        ;(o.settingsManager.backgroundOpacity.value = t),
                          o.settingsManager.backgroundOpacity.isSet()
                            ? o.settingsManager.backgroundColor.isSet() ||
                              (o.settingsManager.backgroundColor.value =
                                'black')
                            : o.settingsManager.backgroundColor.clear()
                      }),
                      this.settingsManager.backgroundOpacity.onChanged.subscribe(
                        function (e, t) {
                          o.selectItem(t.value)
                        },
                      ),
                      this.settingsManager.backgroundOpacity.isSet() &&
                        this.selectItem(
                          this.settingsManager.backgroundOpacity.value,
                        )
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.BackgroundOpacitySelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        53: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.CharacterEdgeSelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClasses: [
                          'ui-subtitlesettingscharacteredgeselectbox',
                        ],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        'raised',
                        r.i18n.getLocalizer(
                          'settings.subtitles.characterEdge.raised',
                        ),
                      ),
                      this.addItem(
                        'depressed',
                        r.i18n.getLocalizer(
                          'settings.subtitles.characterEdge.depressed',
                        ),
                      ),
                      this.addItem(
                        'uniform',
                        r.i18n.getLocalizer(
                          'settings.subtitles.characterEdge.uniform',
                        ),
                      ),
                      this.addItem(
                        'dropshadowed',
                        r.i18n.getLocalizer(
                          'settings.subtitles.characterEdge.dropshadowed',
                        ),
                      ),
                      this.settingsManager.characterEdge.onChanged.subscribe(
                        function (e, t) {
                          t.isSet()
                            ? o.toggleOverlayClass('characteredge-' + t.value)
                            : o.toggleOverlayClass(null),
                            o.selectItem(t.value)
                        },
                      ),
                      this.onItemSelected.subscribe(function (e, t) {
                        o.settingsManager.characterEdge.value = t
                      }),
                      this.settingsManager.characterEdge.isSet() &&
                        this.selectItem(
                          this.settingsManager.characterEdge.value,
                        )
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.CharacterEdgeSelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        54: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.FontColorSelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-subtitlesettingsfontcolorselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        'white',
                        r.i18n.getLocalizer('colors.white'),
                      ),
                      this.addItem(
                        'black',
                        r.i18n.getLocalizer('colors.black'),
                      ),
                      this.addItem('red', r.i18n.getLocalizer('colors.red')),
                      this.addItem(
                        'green',
                        r.i18n.getLocalizer('colors.green'),
                      ),
                      this.addItem('blue', r.i18n.getLocalizer('colors.blue')),
                      this.addItem('cyan', r.i18n.getLocalizer('colors.cyan')),
                      this.addItem(
                        'yellow',
                        r.i18n.getLocalizer('colors.yellow'),
                      ),
                      this.addItem(
                        'magenta',
                        r.i18n.getLocalizer('colors.magenta'),
                      )
                    var i = function () {
                      o.settingsManager.fontColor.isSet() &&
                      o.settingsManager.fontOpacity.isSet()
                        ? o.toggleOverlayClass(
                            'fontcolor-' +
                              o.settingsManager.fontColor.value +
                              o.settingsManager.fontOpacity.value,
                          )
                        : o.toggleOverlayClass(null)
                    }
                    this.onItemSelected.subscribe(function (e, t) {
                      o.settingsManager.fontColor.value = t
                    }),
                      this.settingsManager.fontColor.onChanged.subscribe(
                        function (e, t) {
                          o.settingsManager.fontColor.isSet()
                            ? o.settingsManager.fontOpacity.isSet() ||
                              (o.settingsManager.fontOpacity.value = '100')
                            : o.settingsManager.fontOpacity.clear(),
                            o.selectItem(t.value),
                            i()
                        },
                      ),
                      this.settingsManager.fontOpacity.onChanged.subscribe(
                        function () {
                          i()
                        },
                      ),
                      this.settingsManager.fontColor.isSet() &&
                        this.selectItem(this.settingsManager.fontColor.value)
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.FontColorSelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        55: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.FontFamilySelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-subtitlesettingsfontfamilyselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        'monospacedserif',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.monospacedserif',
                        ),
                      ),
                      this.addItem(
                        'proportionalserif',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.proportionalserif',
                        ),
                      ),
                      this.addItem(
                        'monospacedsansserif',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.monospacedsansserif',
                        ),
                      ),
                      this.addItem(
                        'proportionalsansserif',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.proportionalserif',
                        ),
                      ),
                      this.addItem(
                        'casual',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.casual',
                        ),
                      ),
                      this.addItem(
                        'cursive',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.cursive',
                        ),
                      ),
                      this.addItem(
                        'smallcapital',
                        r.i18n.getLocalizer(
                          'settings.subtitles.font.family.smallcapital',
                        ),
                      ),
                      this.settingsManager.fontFamily.onChanged.subscribe(
                        function (e, t) {
                          t.isSet()
                            ? o.toggleOverlayClass('fontfamily-' + t.value)
                            : o.toggleOverlayClass(null),
                            o.selectItem(t.value)
                        },
                      ),
                      this.onItemSelected.subscribe(function (e, t) {
                        o.settingsManager.fontFamily.value = t
                      }),
                      this.settingsManager.fontFamily.isSet() &&
                        this.selectItem(this.settingsManager.fontFamily.value)
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.FontFamilySelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        56: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.FontOpacitySelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-subtitlesettingsfontopacityselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        '100',
                        r.i18n.getLocalizer('percent', {value: 100}),
                      ),
                      this.addItem(
                        '75',
                        r.i18n.getLocalizer('percent', {value: 75}),
                      ),
                      this.addItem(
                        '50',
                        r.i18n.getLocalizer('percent', {value: 50}),
                      ),
                      this.addItem(
                        '25',
                        r.i18n.getLocalizer('percent', {value: 25}),
                      ),
                      this.onItemSelected.subscribe(function (e, t) {
                        ;(o.settingsManager.fontOpacity.value = t),
                          o.settingsManager.fontOpacity.isSet()
                            ? o.settingsManager.fontColor.isSet() ||
                              (o.settingsManager.fontColor.value = 'white')
                            : o.settingsManager.fontColor.clear()
                      }),
                      this.settingsManager.fontOpacity.onChanged.subscribe(
                        function (e, t) {
                          o.selectItem(t.value)
                        },
                      ),
                      this.settingsManager.fontOpacity.isSet() &&
                        this.selectItem(this.settingsManager.fontOpacity.value)
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.FontOpacitySelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        57: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.FontSizeSelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-subtitlesettingsfontsizeselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        '50',
                        r.i18n.getLocalizer('percent', {value: 50}),
                      ),
                      this.addItem(
                        '75',
                        r.i18n.getLocalizer('percent', {value: 75}),
                      ),
                      this.addItem(
                        '100',
                        r.i18n.getLocalizer('percent', {value: 100}),
                      ),
                      this.addItem(
                        '150',
                        r.i18n.getLocalizer('percent', {value: 150}),
                      ),
                      this.addItem(
                        '200',
                        r.i18n.getLocalizer('percent', {value: 200}),
                      ),
                      this.addItem(
                        '300',
                        r.i18n.getLocalizer('percent', {value: 300}),
                      ),
                      this.addItem(
                        '400',
                        r.i18n.getLocalizer('percent', {value: 400}),
                      ),
                      this.settingsManager.fontSize.onChanged.subscribe(
                        function (e, t) {
                          t.isSet()
                            ? o.toggleOverlayClass('fontsize-' + t.value)
                            : o.toggleOverlayClass(null),
                            o.selectItem(t.value)
                        },
                      ),
                      this.onItemSelected.subscribe(function (e, t) {
                        o.settingsManager.fontSize.value = t
                      }),
                      this.settingsManager.fontSize.isSet() &&
                        this.selectItem(this.settingsManager.fontSize.value)
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.FontSizeSelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        58: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSettingSelectBox = void 0)
            var i = e('../selectbox'),
              r = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.settingsManager = t.settingsManager),
                    (n.overlay = t.overlay),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.toggleOverlayClass = function (e) {
                    this.currentCssClass &&
                      (this.overlay
                        .getDomElement()
                        .removeClass(this.currentCssClass),
                      (this.currentCssClass = null)),
                      e &&
                        ((this.currentCssClass = this.prefixCss(e)),
                        this.overlay
                          .getDomElement()
                          .addClass(this.currentCssClass))
                  }),
                  t
                )
              })(i.SelectBox)
            n.SubtitleSettingSelectBox = r
          },
          {'../selectbox': 39},
        ],
        59: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSettingsLabel = void 0)
            var i = e('../container'),
              r = e('../../dom'),
              s = e('../../localization/i18n'),
              a = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.opener = t.opener),
                    (n.text = t.text),
                    (n.for = t.for),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-label', components: [n.opener]},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.toDomElement = function () {
                    return new r.DOM('label', {
                      id: this.config.id,
                      class: this.getCssClasses(),
                      for: this.for,
                    }).append(
                      new r.DOM('span', {}).html(
                        s.i18n.performLocalization(this.text),
                      ),
                      this.opener.getDomElement(),
                    )
                  }),
                  t
                )
              })(i.Container)
            n.SubtitleSettingsLabel = a
          },
          {'../../dom': 77, '../../localization/i18n': 82, '../container': 19},
        ],
        60: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSettingsProperty = n.SubtitleSettingsManager = void 0)
            var i = e('../../storageutils'),
              r = e('../component'),
              s = e('../../eventdispatcher'),
              a = (function () {
                function e() {
                  var e = this
                  ;(this._properties = {
                    fontColor: new c(this),
                    fontOpacity: new c(this),
                    fontFamily: new c(this),
                    fontSize: new c(this),
                    characterEdge: new c(this),
                    backgroundColor: new c(this),
                    backgroundOpacity: new c(this),
                    windowColor: new c(this),
                    windowOpacity: new c(this),
                  }),
                    (this.userSettings = {}),
                    (this.localStorageKey = l
                      .instance()
                      .prefixCss('subtitlesettings'))
                  var t = this
                  for (var n in this._properties)
                    !(function (n) {
                      t._properties[n].onChanged.subscribe(function (t, o) {
                        o.isSet()
                          ? (e.userSettings[n] = o.value)
                          : delete e.userSettings[n],
                          e.save()
                      })
                    })(n)
                  this.load()
                }
                return (
                  (e.prototype.reset = function () {
                    for (var e in this._properties) this._properties[e].clear()
                  }),
                  Object.defineProperty(e.prototype, 'fontColor', {
                    get: function () {
                      return this._properties.fontColor
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'fontOpacity', {
                    get: function () {
                      return this._properties.fontOpacity
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'fontFamily', {
                    get: function () {
                      return this._properties.fontFamily
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'fontSize', {
                    get: function () {
                      return this._properties.fontSize
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'characterEdge', {
                    get: function () {
                      return this._properties.characterEdge
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'backgroundColor', {
                    get: function () {
                      return this._properties.backgroundColor
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'backgroundOpacity', {
                    get: function () {
                      return this._properties.backgroundOpacity
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'windowColor', {
                    get: function () {
                      return this._properties.windowColor
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(e.prototype, 'windowOpacity', {
                    get: function () {
                      return this._properties.windowOpacity
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.prototype.save = function () {
                    i.StorageUtils.setObject(
                      this.localStorageKey,
                      this.userSettings,
                    )
                  }),
                  (e.prototype.load = function () {
                    this.userSettings =
                      i.StorageUtils.getObject(this.localStorageKey) || {}
                    for (var e in this.userSettings)
                      this._properties[e].value = this.userSettings[e]
                  }),
                  e
                )
              })()
            n.SubtitleSettingsManager = a
            var l = (function (e) {
                function t() {
                  return (null !== e && e.apply(this, arguments)) || this
                }
                return (
                  o(t, e),
                  (t.instance = function () {
                    return t._instance || (t._instance = new t()), t._instance
                  }),
                  (t.prototype.prefixCss = function (t) {
                    return e.prototype.prefixCss.call(this, t)
                  }),
                  t
                )
              })(r.Component),
              c = (function () {
                function e(e) {
                  ;(this._manager = e),
                    (this._onChanged = new s.EventDispatcher())
                }
                return (
                  (e.prototype.isSet = function () {
                    return null != this._value
                  }),
                  (e.prototype.clear = function () {
                    ;(this._value = null), this.onChangedEvent(null)
                  }),
                  Object.defineProperty(e.prototype, 'value', {
                    get: function () {
                      return this._value
                    },
                    set: function (e) {
                      'string' == typeof e && 'null' === e && (e = null),
                        (this._value = e),
                        this.onChangedEvent(e)
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.prototype.onChangedEvent = function (e) {
                    this._onChanged.dispatch(this._manager, this)
                  }),
                  Object.defineProperty(e.prototype, 'onChanged', {
                    get: function () {
                      return this._onChanged.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  e
                )
              })()
            n.SubtitleSettingsProperty = c
          },
          {
            '../../eventdispatcher': 79,
            '../../storageutils': 87,
            '../component': 18,
          },
        ],
        61: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSettingsPanelPage = void 0)
            var i = e('../settingspanelpage'),
              r = e('./subtitlesettingsmanager'),
              s = e('./fontsizeselectbox'),
              a = e('./fontfamilyselectbox'),
              l = e('./fontcolorselectbox'),
              c = e('./fontopacityselectbox'),
              u = e('./characteredgeselectbox'),
              p = e('./backgroundcolorselectbox'),
              f = e('./backgroundopacityselectbox'),
              g = e('./windowcolorselectbox'),
              d = e('./windowopacityselectbox'),
              h = e('./subtitlesettingsresetbutton'),
              m = e('../settingspanelpagebackbutton'),
              v = e('../settingspanelitem'),
              y = e('../../localization/i18n'),
              b = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  ;(n.overlay = t.overlay), (n.settingsPanel = t.settingsPanel)
                  var o = new r.SubtitleSettingsManager()
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        components: [
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer('settings.subtitles.font.size'),
                            new s.FontSizeSelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.font.family',
                            ),
                            new a.FontFamilySelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.font.color',
                            ),
                            new l.FontColorSelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.font.opacity',
                            ),
                            new c.FontOpacitySelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.characterEdge',
                            ),
                            new u.CharacterEdgeSelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.background.color',
                            ),
                            new p.BackgroundColorSelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.background.opacity',
                            ),
                            new f.BackgroundOpacitySelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.window.color',
                            ),
                            new g.WindowColorSelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            y.i18n.getLocalizer(
                              'settings.subtitles.window.opacity',
                            ),
                            new d.WindowOpacitySelectBox({
                              overlay: n.overlay,
                              settingsManager: o,
                            }),
                          ),
                          new v.SettingsPanelItem(
                            new m.SettingsPanelPageBackButton({
                              container: n.settingsPanel,
                              text: y.i18n.getLocalizer('back'),
                            }),
                            new h.SubtitleSettingsResetButton({
                              settingsManager: o,
                            }),
                            {role: 'menubar'},
                          ),
                        ],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.onActive.subscribe(function () {
                        o.overlay.enablePreviewSubtitleLabel()
                      }),
                      this.onInactive.subscribe(function () {
                        o.overlay.removePreviewSubtitleLabel()
                      })
                  }),
                  t
                )
              })(i.SettingsPanelPage)
            n.SubtitleSettingsPanelPage = b
          },
          {
            '../../localization/i18n': 82,
            '../settingspanelitem': 41,
            '../settingspanelpage': 42,
            '../settingspanelpagebackbutton': 43,
            './backgroundcolorselectbox': 51,
            './backgroundopacityselectbox': 52,
            './characteredgeselectbox': 53,
            './fontcolorselectbox': 54,
            './fontfamilyselectbox': 55,
            './fontopacityselectbox': 56,
            './fontsizeselectbox': 57,
            './subtitlesettingsmanager': 60,
            './subtitlesettingsresetbutton': 62,
            './windowcolorselectbox': 63,
            './windowopacityselectbox': 64,
          },
        ],
        62: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSettingsResetButton = void 0)
            var i = e('../button'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-subtitlesettingsresetbutton',
                        text: r.i18n.getLocalizer('reset'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.onClick.subscribe(function () {
                        o.config.settingsManager.reset()
                      })
                  }),
                  t
                )
              })(i.Button)
            n.SubtitleSettingsResetButton = s
          },
          {'../../localization/i18n': 82, '../button': 12},
        ],
        63: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.WindowColorSelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-subtitlesettingswindowcolorselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        'white',
                        r.i18n.getLocalizer('colors.white'),
                      ),
                      this.addItem(
                        'black',
                        r.i18n.getLocalizer('colors.black'),
                      ),
                      this.addItem('red', r.i18n.getLocalizer('colors.red')),
                      this.addItem(
                        'green',
                        r.i18n.getLocalizer('colors.green'),
                      ),
                      this.addItem('blue', r.i18n.getLocalizer('colors.blue')),
                      this.addItem('cyan', r.i18n.getLocalizer('colors.cyan')),
                      this.addItem(
                        'yellow',
                        r.i18n.getLocalizer('colors.yellow'),
                      ),
                      this.addItem(
                        'magenta',
                        r.i18n.getLocalizer('colors.magenta'),
                      )
                    var i = function () {
                      o.settingsManager.windowColor.isSet() &&
                      o.settingsManager.windowOpacity.isSet()
                        ? o.toggleOverlayClass(
                            'windowcolor-' +
                              o.settingsManager.windowColor.value +
                              o.settingsManager.windowOpacity.value,
                          )
                        : o.toggleOverlayClass(null)
                    }
                    this.onItemSelected.subscribe(function (e, t) {
                      o.settingsManager.windowColor.value = t
                    }),
                      this.settingsManager.windowColor.onChanged.subscribe(
                        function (e, t) {
                          o.settingsManager.windowColor.isSet()
                            ? o.settingsManager.windowOpacity.isSet() ||
                              (o.settingsManager.windowOpacity.value = '100')
                            : o.settingsManager.windowOpacity.clear(),
                            o.selectItem(t.value),
                            i()
                        },
                      ),
                      this.settingsManager.windowOpacity.onChanged.subscribe(
                        function () {
                          i()
                        },
                      ),
                      this.settingsManager.windowColor.isSet() &&
                        this.selectItem(this.settingsManager.windowColor.value)
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.WindowColorSelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        64: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.WindowOpacitySelectBox = void 0)
            var i = e('./subtitlesettingselectbox'),
              r = e('../../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClasses: [
                          'ui-subtitlesettingswindowopacityselectbox',
                        ],
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n),
                      this.addItem(null, r.i18n.getLocalizer('default')),
                      this.addItem(
                        '100',
                        r.i18n.getLocalizer('percent', {value: 100}),
                      ),
                      this.addItem(
                        '75',
                        r.i18n.getLocalizer('percent', {value: 75}),
                      ),
                      this.addItem(
                        '50',
                        r.i18n.getLocalizer('percent', {value: 50}),
                      ),
                      this.addItem(
                        '25',
                        r.i18n.getLocalizer('percent', {value: 25}),
                      ),
                      this.addItem(
                        '0',
                        r.i18n.getLocalizer('percent', {value: 0}),
                      ),
                      this.onItemSelected.subscribe(function (e, t) {
                        ;(o.settingsManager.windowOpacity.value = t),
                          o.settingsManager.windowOpacity.isSet()
                            ? o.settingsManager.windowColor.isSet() ||
                              (o.settingsManager.windowColor.value = 'black')
                            : o.settingsManager.windowColor.clear()
                      }),
                      this.settingsManager.windowOpacity.onChanged.subscribe(
                        function (e, t) {
                          o.selectItem(t.value)
                        },
                      ),
                      this.settingsManager.windowOpacity.isSet() &&
                        this.selectItem(
                          this.settingsManager.windowOpacity.value,
                        )
                  }),
                  t
                )
              })(i.SubtitleSettingSelectBox)
            n.WindowOpacitySelectBox = s
          },
          {'../../localization/i18n': 82, './subtitlesettingselectbox': 58},
        ],
        65: [
          function (e, t, n) {
            'use strict'
            function o(e, t) {
              var n = r(e),
                o = (100 / n) * i(t, e, n),
                s = (100 / n) * t.duration
              return (
                o < 0 && !isNaN(s) && (s += o),
                100 - o < s && (s = 100 - o),
                {markerDuration: s, markerPosition: o}
              )
            }
            function i(e, t, n) {
              return t.isLive()
                ? n -
                    (c.PlayerUtils.getSeekableRangeRespectingLive(t).end -
                      e.time)
                : e.time
            }
            function r(e) {
              if (!e.isLive()) return e.getDuration()
              var t = c.PlayerUtils.getSeekableRangeRespectingLive(e),
                n = t.start
              return t.end - n
            }
            function s(e, t) {
              return (t < 0 || isNaN(t)) && e < 0
            }
            function a(e, t) {
              var n = e.getDuration() !== 1 / 0 || e.isLive(),
                o = t.getConfig().metadata.markers.length > 0
              return n && o
            }
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.TimelineMarkersHandler = void 0)
            var l = e('../dom'),
              c = e('../playerutils'),
              u = e('../timeout'),
              p = (function () {
                function e(e, t, n) {
                  ;(this.config = e),
                    (this.getSeekBarWidth = t),
                    (this.markersContainer = n),
                    (this.timelineMarkers = [])
                }
                return (
                  (e.prototype.initialize = function (e, t) {
                    ;(this.player = e),
                      (this.uimanager = t),
                      this.configureMarkers()
                  }),
                  (e.prototype.configureMarkers = function () {
                    var e = this
                    this.player.on(
                      this.player.exports.PlayerEvent.SourceUnloaded,
                      function () {
                        return e.clearMarkers()
                      },
                    ),
                      this.player.on(
                        this.player.exports.PlayerEvent.AdBreakStarted,
                        function () {
                          return e.clearMarkers()
                        },
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.AdBreakFinished,
                        function () {
                          return e.updateMarkers()
                        },
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.PlayerResized,
                        function () {
                          return e.updateMarkersDOM()
                        },
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.SourceLoaded,
                        function () {
                          e.player.isLive() &&
                            (e.player.on(
                              e.player.exports.PlayerEvent.TimeChanged,
                              function () {
                                return e.updateMarkers()
                              },
                            ),
                            e.configureLivePausedTimeshiftUpdater(function () {
                              return e.updateMarkers()
                            }))
                        },
                      ),
                      this.uimanager
                        .getConfig()
                        .events.onUpdated.subscribe(function () {
                          return e.updateMarkers()
                        }),
                      this.uimanager.onRelease.subscribe(function () {
                        return e.uimanager
                          .getConfig()
                          .events.onUpdated.unsubscribe(function () {
                            return e.updateMarkers()
                          })
                      }),
                      this.updateMarkers()
                  }),
                  (e.prototype.getMarkerAtPosition = function (e) {
                    var t = this.config.snappingRange
                    return (
                      this.timelineMarkers.find(function (n) {
                        var o = n.duration > 0,
                          i =
                            o &&
                            e >= n.position - t &&
                            e <= n.position + n.duration + t,
                          r = e >= n.position - t && e <= n.position + t
                        return i || r
                      }) || null
                    )
                  }),
                  (e.prototype.clearMarkers = function () {
                    ;(this.timelineMarkers = []), this.markersContainer.empty()
                  }),
                  (e.prototype.removeMarkerFromConfig = function (e) {
                    this.uimanager.getConfig().metadata.markers = this.uimanager
                      .getConfig()
                      .metadata.markers.filter(function (t) {
                        return e !== t
                      })
                  }),
                  (e.prototype.filterRemovedMarkers = function () {
                    var e = this
                    this.timelineMarkers = this.timelineMarkers.filter(
                      function (t) {
                        var n = e.uimanager
                          .getConfig()
                          .metadata.markers.find(function (e) {
                            return t.marker === e
                          })
                        return n || e.removeMarkerFromDOM(t), n
                      },
                    )
                  }),
                  (e.prototype.removeMarkerFromDOM = function (e) {
                    e.element && e.element.remove()
                  }),
                  (e.prototype.updateMarkers = function () {
                    var e = this
                    if (!a(this.player, this.uimanager))
                      return void this.clearMarkers()
                    this.filterRemovedMarkers(),
                      this.uimanager
                        .getConfig()
                        .metadata.markers.forEach(function (t) {
                          var n = o(e.player, t),
                            i = n.markerPosition,
                            r = n.markerDuration
                          if (s(i, r)) e.removeMarkerFromConfig(t)
                          else if (i <= 100) {
                            var a = e.timelineMarkers.find(function (e) {
                              return e.marker === t
                            })
                            if (a)
                              (a.position = i),
                                (a.duration = r),
                                e.updateMarkerDOM(a)
                            else {
                              var l = {marker: t, position: i, duration: r}
                              e.timelineMarkers.push(l), e.createMarkerDOM(l)
                            }
                          }
                        })
                  }),
                  (e.prototype.getMarkerCssProperties = function (e) {
                    var t = this.getSeekBarWidth(),
                      n = (t / 100) * (e.position < 0 ? 0 : e.position),
                      o = {transform: 'translateX(' + n + 'px)'}
                    if (e.duration > 0) {
                      var i = Math.round((t / 100) * e.duration)
                      o.width = i + 'px'
                    }
                    return o
                  }),
                  (e.prototype.updateMarkerDOM = function (e) {
                    e.element.css(this.getMarkerCssProperties(e))
                  }),
                  (e.prototype.createMarkerDOM = function (e) {
                    var t = this,
                      n = ['seekbar-marker']
                        .concat(e.marker.cssClasses || [])
                        .map(function (e) {
                          return t.prefixCss(e)
                        }),
                      o = new l.DOM('div', {
                        class: n.join(' '),
                        'data-marker-time': String(e.marker.time),
                        'data-marker-title': String(e.marker.title),
                      }).css(this.getMarkerCssProperties(e))
                    if (e.marker.imageUrl) {
                      var i = function () {
                          r.remove()
                        },
                        r = new l.DOM('img', {
                          class: this.prefixCss('seekbar-marker-image'),
                          src: e.marker.imageUrl,
                        }).on('error', i)
                      o.append(r)
                    }
                    ;(e.element = o), this.markersContainer.append(o)
                  }),
                  (e.prototype.updateMarkersDOM = function () {
                    var e = this
                    this.timelineMarkers.forEach(function (t) {
                      t.element ? e.updateMarkerDOM(t) : e.createMarkerDOM(t)
                    })
                  }),
                  (e.prototype.configureLivePausedTimeshiftUpdater = function (
                    e,
                  ) {
                    var t = this
                    ;(this.pausedTimeshiftUpdater = new u.Timeout(1e3, e, !0)),
                      this.player.on(
                        this.player.exports.PlayerEvent.Paused,
                        function () {
                          t.player.isLive() &&
                            t.player.getMaxTimeShift() < 0 &&
                            t.pausedTimeshiftUpdater.start()
                        },
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.Play,
                        function () {
                          return t.pausedTimeshiftUpdater.clear()
                        },
                      )
                  }),
                  (e.prototype.prefixCss = function (e) {
                    return this.config.cssPrefix + '-' + e
                  }),
                  e
                )
              })()
            n.TimelineMarkersHandler = p
          },
          {'../dom': 77, '../playerutils': 86, '../timeout': 90},
        ],
        66: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.TitleBar = void 0)
            var i = e('./container'),
              r = e('./metadatalabel'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-titlebar',
                        hidden: !0,
                        components: [
                          new r.MetadataLabel({
                            content: r.MetadataLabelContent.Title,
                          }),
                          new r.MetadataLabel({
                            content: r.MetadataLabelContent.Description,
                          }),
                        ],
                        keepHiddenWithoutMetadata: !1,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    for (
                      var i = this.getConfig(),
                        s = !this.isHidden(),
                        a = !0,
                        l = function () {
                          a = !1
                          for (
                            var e = 0, t = o.getComponents();
                            e < t.length;
                            e++
                          ) {
                            var n = t[e]
                            if (n instanceof r.MetadataLabel && !n.isEmpty()) {
                              a = !0
                              break
                            }
                          }
                          o.isShown()
                            ? i.keepHiddenWithoutMetadata && !a && o.hide()
                            : s && o.show()
                        },
                        c = 0,
                        u = this.getComponents();
                      c < u.length;
                      c++
                    ) {
                      var p = u[c]
                      p instanceof r.MetadataLabel &&
                        p.onTextChanged.subscribe(l)
                    }
                    n.onControlsShow.subscribe(function () {
                      ;(s = !0), (i.keepHiddenWithoutMetadata && !a) || o.show()
                    }),
                      n.onControlsHide.subscribe(function () {
                        ;(s = !1), o.hide()
                      }),
                      l()
                  }),
                  t
                )
              })(i.Container)
            n.TitleBar = s
          },
          {'./container': 19, './metadatalabel': 29},
        ],
        67: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ToggleButton = void 0)
            var i = e('./button'),
              r = e('../eventdispatcher'),
              s = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  n.toggleButtonEvents = {
                    onToggle: new r.EventDispatcher(),
                    onToggleOn: new r.EventDispatcher(),
                    onToggleOff: new r.EventDispatcher(),
                  }
                  var o = {
                    cssClass: 'ui-togglebutton',
                    onClass: 'on',
                    offClass: 'off',
                  }
                  return (n.config = n.mergeConfig(t, o, n.config)), n
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    e.prototype.configure.call(this, t, n)
                    var o = this.getConfig()
                    this.getDomElement().addClass(this.prefixCss(o.offClass))
                  }),
                  (t.prototype.on = function () {
                    if (this.isOff()) {
                      var e = this.getConfig()
                      ;(this.onState = !0),
                        this.getDomElement().removeClass(
                          this.prefixCss(e.offClass),
                        ),
                        this.getDomElement().addClass(
                          this.prefixCss(e.onClass),
                        ),
                        this.onToggleEvent(),
                        this.onToggleOnEvent(),
                        this.getDomElement().attr('aria-pressed', 'true')
                    }
                  }),
                  (t.prototype.off = function () {
                    if (this.isOn()) {
                      var e = this.getConfig()
                      ;(this.onState = !1),
                        this.getDomElement().removeClass(
                          this.prefixCss(e.onClass),
                        ),
                        this.getDomElement().addClass(
                          this.prefixCss(e.offClass),
                        ),
                        this.onToggleEvent(),
                        this.onToggleOffEvent(),
                        this.getDomElement().attr('aria-pressed', 'false')
                    }
                  }),
                  (t.prototype.toggle = function () {
                    this.isOn() ? this.off() : this.on()
                  }),
                  (t.prototype.isOn = function () {
                    return this.onState
                  }),
                  (t.prototype.isOff = function () {
                    return !this.isOn()
                  }),
                  (t.prototype.onClickEvent = function () {
                    e.prototype.onClickEvent.call(this), this.onToggleEvent()
                  }),
                  (t.prototype.onToggleEvent = function () {
                    this.toggleButtonEvents.onToggle.dispatch(this)
                  }),
                  (t.prototype.onToggleOnEvent = function () {
                    this.toggleButtonEvents.onToggleOn.dispatch(this)
                  }),
                  (t.prototype.onToggleOffEvent = function () {
                    this.toggleButtonEvents.onToggleOff.dispatch(this)
                  }),
                  Object.defineProperty(t.prototype, 'onToggle', {
                    get: function () {
                      return this.toggleButtonEvents.onToggle.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onToggleOn', {
                    get: function () {
                      return this.toggleButtonEvents.onToggleOn.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  Object.defineProperty(t.prototype, 'onToggleOff', {
                    get: function () {
                      return this.toggleButtonEvents.onToggleOff.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  t
                )
              })(i.Button)
            n.ToggleButton = s
          },
          {'../eventdispatcher': 79, './button': 12},
        ],
        68: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.TvNoiseCanvas = void 0)
            var i = e('./component'),
              r = e('../dom'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.canvasWidth = 160),
                    (n.canvasHeight = 90),
                    (n.interferenceHeight = 50),
                    (n.lastFrameUpdate = 0),
                    (n.frameInterval = 60),
                    (n.useAnimationFrame = !!window.requestAnimationFrame),
                    (n.config = n.mergeConfig(
                      t,
                      {cssClass: 'ui-tvnoisecanvas'},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.toDomElement = function () {
                    return (this.canvas = new r.DOM('canvas', {
                      class: this.getCssClasses(),
                    }))
                  }),
                  (t.prototype.start = function () {
                    ;(this.canvasElement = this.canvas.get(0)),
                      (this.canvasContext = this.canvasElement.getContext(
                        '2d',
                      )),
                      (this.noiseAnimationWindowPos = -this.canvasHeight),
                      (this.lastFrameUpdate = 0),
                      (this.canvasElement.width = this.canvasWidth),
                      (this.canvasElement.height = this.canvasHeight),
                      this.renderFrame()
                  }),
                  (t.prototype.stop = function () {
                    this.useAnimationFrame
                      ? cancelAnimationFrame(this.frameUpdateHandlerId)
                      : clearTimeout(this.frameUpdateHandlerId)
                  }),
                  (t.prototype.renderFrame = function () {
                    if (
                      this.lastFrameUpdate + this.frameInterval >
                      new Date().getTime()
                    )
                      return void this.scheduleNextRender()
                    for (
                      var e,
                        t = this.canvasWidth,
                        n = this.canvasHeight,
                        o = this.canvasContext.createImageData(t, n),
                        i = 0;
                      i < n;
                      i++
                    )
                      for (var r = 0; r < t; r++)
                        (e = t * i * 4 + 4 * r),
                          (o.data[e] = 255 * Math.random()),
                          (i < this.noiseAnimationWindowPos ||
                            i >
                              this.noiseAnimationWindowPos +
                                this.interferenceHeight) &&
                            (o.data[e] *= 0.85),
                          (o.data[e + 1] = o.data[e]),
                          (o.data[e + 2] = o.data[e]),
                          (o.data[e + 3] = 50)
                    this.canvasContext.putImageData(o, 0, 0),
                      (this.lastFrameUpdate = new Date().getTime()),
                      (this.noiseAnimationWindowPos += 7),
                      this.noiseAnimationWindowPos > n &&
                        (this.noiseAnimationWindowPos = -n),
                      this.scheduleNextRender()
                  }),
                  (t.prototype.scheduleNextRender = function () {
                    this.useAnimationFrame
                      ? (this.frameUpdateHandlerId = window.requestAnimationFrame(
                          this.renderFrame.bind(this),
                        ))
                      : (this.frameUpdateHandlerId = setTimeout(
                          this.renderFrame.bind(this),
                          this.frameInterval,
                        ))
                  }),
                  t
                )
              })(i.Component)
            n.TvNoiseCanvas = s
          },
          {'../dom': 77, './component': 18},
        ],
        69: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.UIContainer = void 0)
            var i = e('./container'),
              r = e('../dom'),
              s = e('../timeout'),
              a = e('../playerutils'),
              l = e('../eventdispatcher'),
              c = e('../localization/i18n'),
              u = (function (e) {
                function t(t) {
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-uicontainer',
                        role: 'region',
                        ariaLabel: c.i18n.getLocalizer('player'),
                        hideDelay: 5e3,
                      },
                      n.config,
                    )),
                    (n.playerStateChange = new l.EventDispatcher()),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this.getConfig()
                    o.userInteractionEventSource
                      ? (this.userInteractionEventSource = new r.DOM(
                          o.userInteractionEventSource,
                        ))
                      : (this.userInteractionEventSource = this.getDomElement()),
                      e.prototype.configure.call(this, t, n),
                      this.configureUIShowHide(t, n),
                      this.configurePlayerStates(t, n)
                  }),
                  (t.prototype.configureUIShowHide = function (e, t) {
                    var n = this,
                      o = this.getConfig()
                    if (-1 === o.hideDelay)
                      return void t.onConfigured.subscribe(function () {
                        return t.onControlsShow.dispatch(n)
                      })
                    var i,
                      r = !1,
                      a = !1,
                      l = !0,
                      c = function () {
                        return (
                          o.hidePlayerStateExceptions &&
                          o.hidePlayerStateExceptions.indexOf(i) > -1
                        )
                      },
                      u = function () {
                        r || (t.onControlsShow.dispatch(n), (r = !0)),
                          a || e.isCasting() || c() || n.uiHideTimeout.start()
                      },
                      p = function () {
                        if (r && !e.isCasting()) {
                          var o = {}
                          t.onPreviewControlsHide.dispatch(n, o),
                            o.cancel
                              ? u()
                              : (t.onControlsHide.dispatch(n), (r = !1))
                        }
                      }
                    ;(this.uiHideTimeout = new s.Timeout(o.hideDelay, p)),
                      (this.userInteractionEvents = [
                        {
                          name: 'touchend',
                          handler: function (t) {
                            r ||
                              (l && !e.isPlaying()
                                ? (l = !1)
                                : t.preventDefault(),
                              u())
                          },
                        },
                        {
                          name: 'mouseenter',
                          handler: function () {
                            u()
                          },
                        },
                        {
                          name: 'mousemove',
                          handler: function () {
                            u()
                          },
                        },
                        {
                          name: 'focusin',
                          handler: function () {
                            u()
                          },
                        },
                        {
                          name: 'keydown',
                          handler: function () {
                            u()
                          },
                        },
                        {
                          name: 'mouseleave',
                          handler: function () {
                            a || c() || n.uiHideTimeout.start()
                          },
                        },
                      ]),
                      this.userInteractionEvents.forEach(function (e) {
                        return n.userInteractionEventSource.on(
                          e.name,
                          e.handler,
                        )
                      }),
                      t.onSeek.subscribe(function () {
                        n.uiHideTimeout.clear(), (a = !0)
                      }),
                      t.onSeeked.subscribe(function () {
                        ;(a = !1), c() || n.uiHideTimeout.start()
                      }),
                      e.on(e.exports.PlayerEvent.CastStarted, function () {
                        u()
                      }),
                      this.playerStateChange.subscribe(function (e, t) {
                        ;(i = t),
                          c()
                            ? (n.uiHideTimeout.clear(), u())
                            : n.uiHideTimeout.start()
                      })
                  }),
                  (t.prototype.configurePlayerStates = function (e, n) {
                    var o = this,
                      i = this.getDomElement(),
                      s = []
                    for (var l in a.PlayerUtils.PlayerState)
                      if (isNaN(Number(l))) {
                        var c =
                          a.PlayerUtils.PlayerState[
                            a.PlayerUtils.PlayerState[l]
                          ]
                        s[a.PlayerUtils.PlayerState[l]] = this.prefixCss(
                          t.STATE_PREFIX + c.toLowerCase(),
                        )
                      }
                    var u = function () {
                        i.removeClass(s[a.PlayerUtils.PlayerState.Idle]),
                          i.removeClass(s[a.PlayerUtils.PlayerState.Prepared]),
                          i.removeClass(s[a.PlayerUtils.PlayerState.Playing]),
                          i.removeClass(s[a.PlayerUtils.PlayerState.Paused]),
                          i.removeClass(s[a.PlayerUtils.PlayerState.Finished])
                      },
                      p = function (e) {
                        u(),
                          i.addClass(s[e]),
                          o.playerStateChange.dispatch(o, e)
                      }
                    e.on(e.exports.PlayerEvent.SourceLoaded, function () {
                      p(a.PlayerUtils.PlayerState.Prepared)
                    }),
                      e.on(e.exports.PlayerEvent.Play, function () {
                        p(a.PlayerUtils.PlayerState.Playing)
                      }),
                      e.on(e.exports.PlayerEvent.Playing, function () {
                        p(a.PlayerUtils.PlayerState.Playing)
                      }),
                      e.on(e.exports.PlayerEvent.Paused, function () {
                        p(a.PlayerUtils.PlayerState.Paused)
                      }),
                      e.on(e.exports.PlayerEvent.PlaybackFinished, function () {
                        p(a.PlayerUtils.PlayerState.Finished)
                      }),
                      e.on(e.exports.PlayerEvent.SourceUnloaded, function () {
                        p(a.PlayerUtils.PlayerState.Idle)
                      }),
                      n.getConfig().events.onUpdated.subscribe(function () {
                        p(a.PlayerUtils.getState(e))
                      }),
                      e.on(e.exports.PlayerEvent.ViewModeChanged, function () {
                        e.getViewMode() === e.exports.ViewMode.Fullscreen
                          ? i.addClass(o.prefixCss(t.FULLSCREEN))
                          : i.removeClass(o.prefixCss(t.FULLSCREEN))
                      }),
                      e.getViewMode() === e.exports.ViewMode.Fullscreen &&
                        i.addClass(this.prefixCss(t.FULLSCREEN)),
                      e.on(e.exports.PlayerEvent.StallStarted, function () {
                        i.addClass(o.prefixCss(t.BUFFERING))
                      }),
                      e.on(e.exports.PlayerEvent.StallEnded, function () {
                        i.removeClass(o.prefixCss(t.BUFFERING))
                      }),
                      e.isStalled() && i.addClass(this.prefixCss(t.BUFFERING)),
                      e.on(e.exports.PlayerEvent.CastStarted, function () {
                        i.addClass(o.prefixCss(t.REMOTE_CONTROL))
                      }),
                      e.on(e.exports.PlayerEvent.CastStopped, function () {
                        i.removeClass(o.prefixCss(t.REMOTE_CONTROL))
                      }),
                      e.isCasting() &&
                        i.addClass(this.prefixCss(t.REMOTE_CONTROL)),
                      n.onControlsShow.subscribe(function () {
                        i.removeClass(o.prefixCss(t.CONTROLS_HIDDEN)),
                          i.addClass(o.prefixCss(t.CONTROLS_SHOWN))
                      }),
                      n.onControlsHide.subscribe(function () {
                        i.removeClass(o.prefixCss(t.CONTROLS_SHOWN)),
                          i.addClass(o.prefixCss(t.CONTROLS_HIDDEN))
                      })
                    var f = function (e, t) {
                      i.removeClass(o.prefixCss('layout-max-width-400')),
                        i.removeClass(o.prefixCss('layout-max-width-600')),
                        i.removeClass(o.prefixCss('layout-max-width-800')),
                        i.removeClass(o.prefixCss('layout-max-width-1200')),
                        e <= 400
                          ? i.addClass(o.prefixCss('layout-max-width-400'))
                          : e <= 600
                          ? i.addClass(o.prefixCss('layout-max-width-600'))
                          : e <= 800
                          ? i.addClass(o.prefixCss('layout-max-width-800'))
                          : e <= 1200 &&
                            i.addClass(o.prefixCss('layout-max-width-1200'))
                    }
                    e.on(e.exports.PlayerEvent.PlayerResized, function (e) {
                      var t = Math.round(
                        Number(e.width.substring(0, e.width.length - 2)),
                      )
                      Math.round(
                        Number(e.height.substring(0, e.height.length - 2)),
                      )
                      f(t)
                    }),
                      f(
                        new r.DOM(e.getContainer()).width(),
                        new r.DOM(e.getContainer()).height(),
                      )
                  }),
                  (t.prototype.release = function () {
                    var t = this
                    this.userInteractionEvents &&
                      this.userInteractionEvents.forEach(function (e) {
                        return t.userInteractionEventSource.off(
                          e.name,
                          e.handler,
                        )
                      }),
                      e.prototype.release.call(this),
                      this.uiHideTimeout && this.uiHideTimeout.clear()
                  }),
                  (t.prototype.toDomElement = function () {
                    var t = e.prototype.toDomElement.call(this)
                    return (
                      document &&
                      void 0 !== document.createElement('p').style.flex
                        ? t.addClass(this.prefixCss('flexbox'))
                        : t.addClass(this.prefixCss('no-flexbox')),
                      t
                    )
                  }),
                  (t.STATE_PREFIX = 'player-state-'),
                  (t.FULLSCREEN = 'fullscreen'),
                  (t.BUFFERING = 'buffering'),
                  (t.REMOTE_CONTROL = 'remote-control'),
                  (t.CONTROLS_SHOWN = 'controls-shown'),
                  (t.CONTROLS_HIDDEN = 'controls-hidden'),
                  t
                )
              })(i.Container)
            n.UIContainer = u
          },
          {
            '../dom': 77,
            '../eventdispatcher': 79,
            '../localization/i18n': 82,
            '../playerutils': 86,
            '../timeout': 90,
            './container': 19,
          },
        ],
        70: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VideoQualitySelectBox = void 0)
            var i = e('./selectbox'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {cssClasses: ['ui-videoqualityselectbox']},
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = function () {
                        o.selectItem(t.getVideoQuality().id)
                      },
                      s = function () {
                        var e = t.getAvailableVideoQualities()
                        o.clearItems(),
                          (o.hasAuto = 'progressive' !== t.getStreamType()),
                          o.hasAuto &&
                            o.addItem('auto', r.i18n.getLocalizer('auto'))
                        for (var n = 0, s = e; n < s.length; n++) {
                          var a = s[n]
                          o.addItem(a.id, a.label)
                        }
                        i()
                      }
                    this.onItemSelected.subscribe(function (e, n) {
                      t.setVideoQuality(n)
                    }),
                      t.on(t.exports.PlayerEvent.SourceUnloaded, s),
                      t.on(t.exports.PlayerEvent.PeriodSwitched, s),
                      t.on(t.exports.PlayerEvent.VideoQualityChanged, i),
                      t.exports.PlayerEvent.VideoQualityAdded &&
                        (t.on(t.exports.PlayerEvent.VideoQualityAdded, s),
                        t.on(t.exports.PlayerEvent.VideoQualityRemoved, s)),
                      n.getConfig().events.onUpdated.subscribe(s)
                  }),
                  (t.prototype.hasAutoItem = function () {
                    return this.hasAuto
                  }),
                  t
                )
              })(i.SelectBox)
            n.VideoQualitySelectBox = s
          },
          {'../localization/i18n': 82, './selectbox': 39},
        ],
        71: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VolumeControlButton = void 0)
            var i = e('./container'),
              r = e('./volumeslider'),
              s = e('./volumetogglebutton'),
              a = e('../timeout'),
              l = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.volumeToggleButton = new s.VolumeToggleButton()),
                    (n.volumeSlider = new r.VolumeSlider({
                      vertical: null == t.vertical || t.vertical,
                      hidden: !0,
                    })),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-volumecontrolbutton',
                        components: [n.volumeToggleButton, n.volumeSlider],
                        hideDelay: 500,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = this.getVolumeToggleButton(),
                      r = this.getVolumeSlider()
                    this.volumeSliderHideTimeout = new a.Timeout(
                      this.getConfig().hideDelay,
                      function () {
                        r.hide()
                      },
                    )
                    var s = !1
                    i.getDomElement().on('mouseenter', function () {
                      r.isHidden() && r.show(),
                        o.volumeSliderHideTimeout.clear()
                    }),
                      i.getDomElement().on('mouseleave', function () {
                        o.volumeSliderHideTimeout.reset()
                      }),
                      r.getDomElement().on('mouseenter', function () {
                        o.volumeSliderHideTimeout.clear(), (s = !0)
                      }),
                      r.getDomElement().on('mouseleave', function () {
                        r.isSeeking()
                          ? o.volumeSliderHideTimeout.clear()
                          : o.volumeSliderHideTimeout.reset(),
                          (s = !1)
                      }),
                      r.onSeeked.subscribe(function () {
                        s || o.volumeSliderHideTimeout.reset()
                      })
                  }),
                  (t.prototype.release = function () {
                    e.prototype.release.call(this),
                      this.volumeSliderHideTimeout.clear()
                  }),
                  (t.prototype.getVolumeToggleButton = function () {
                    return this.volumeToggleButton
                  }),
                  (t.prototype.getVolumeSlider = function () {
                    return this.volumeSlider
                  }),
                  t
                )
              })(i.Container)
            n.VolumeControlButton = l
          },
          {
            '../timeout': 90,
            './container': 19,
            './volumeslider': 72,
            './volumetogglebutton': 73,
          },
        ],
        72: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VolumeSlider = void 0)
            var i = e('./seekbar'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.updateVolumeWhileScrubbing = function (e, t) {
                      t.scrubbing &&
                        n.volumeTransition &&
                        n.volumeTransition.update(t.position)
                    }),
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-volumeslider',
                        hideIfVolumeControlProhibited: !0,
                        ariaLabel: r.i18n.getLocalizer('settings.audio.volume'),
                        tabIndex: 0,
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.setVolumeAriaSliderValues = function (e) {
                    this.getDomElement().attr(
                      'aria-valuenow',
                      Math.ceil(e).toString(),
                    ),
                      this.getDomElement().attr(
                        'aria-valuetext',
                        r.i18n.performLocalization(
                          r.i18n.getLocalizer('seekBar.value'),
                        ) +
                          ': ' +
                          Math.ceil(e),
                      )
                  }),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n, !1),
                      this.setAriaSliderMinMax('0', '100')
                    var i = this.getConfig(),
                      r = n.getConfig().volumeController
                    if (
                      i.hideIfVolumeControlProhibited &&
                      !this.detectVolumeControlAvailability()
                    )
                      return void this.hide()
                    r.onChanged.subscribe(function (e, t) {
                      t.muted
                        ? (o.setVolumeAriaSliderValues(0),
                          o.setPlaybackPosition(0))
                        : (o.setPlaybackPosition(t.volume),
                          o.setVolumeAriaSliderValues(t.volume))
                    }),
                      this.onSeek.subscribe(function () {
                        o.volumeTransition = r.startTransition()
                      }),
                      this.onSeekPreview.subscribeRateLimited(
                        this.updateVolumeWhileScrubbing,
                        50,
                      ),
                      this.onSeeked.subscribe(function (e, t) {
                        o.volumeTransition && o.volumeTransition.finish(t)
                      }),
                      t.on(t.exports.PlayerEvent.PlayerResized, function () {
                        o.refreshPlaybackPosition()
                      }),
                      n.onConfigured.subscribe(function () {
                        o.refreshPlaybackPosition()
                      }),
                      n.getConfig().events.onUpdated.subscribe(function () {
                        o.refreshPlaybackPosition()
                      }),
                      n.onComponentShow.subscribe(function () {
                        o.refreshPlaybackPosition()
                      }),
                      n.onComponentHide.subscribe(function () {
                        o.refreshPlaybackPosition()
                      }),
                      r.onChangedEvent()
                  }),
                  (t.prototype.detectVolumeControlAvailability = function () {
                    var e = document.createElement('video')
                    return (e.volume = 0.7), 1 !== e.volume
                  }),
                  (t.prototype.release = function () {
                    e.prototype.release.call(this),
                      this.onSeekPreview.unsubscribe(
                        this.updateVolumeWhileScrubbing,
                      )
                  }),
                  t
                )
              })(i.SeekBar)
            n.VolumeSlider = s
          },
          {'../localization/i18n': 82, './seekbar': 36},
        ],
        73: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VolumeToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this,
                    o = {
                      cssClass: 'ui-volumetogglebutton',
                      text: r.i18n.getLocalizer('settings.audio.mute'),
                      onClass: 'muted',
                      offClass: 'unmuted',
                      ariaLabel: r.i18n.getLocalizer('settings.audio.mute'),
                    }
                  return (n.config = n.mergeConfig(t, o, n.config)), n
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = n.getConfig().volumeController
                    i.onChanged.subscribe(function (e, t) {
                      t.muted ? o.on() : o.off()
                      var n = Math.ceil(t.volume / 10)
                      o.getDomElement().data(
                        o.prefixCss('volume-level-tens'),
                        String(n),
                      )
                    }),
                      this.onClick.subscribe(function () {
                        i.toggleMuted()
                      }),
                      i.onChangedEvent()
                  }),
                  t
                )
              })(i.ToggleButton)
            n.VolumeToggleButton = s
          },
          {'../localization/i18n': 82, './togglebutton': 67},
        ],
        74: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VRToggleButton = void 0)
            var i = e('./togglebutton'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-vrtogglebutton',
                        text: r.i18n.getLocalizer('vr'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.configure = function (t, n) {
                    var o = this
                    e.prototype.configure.call(this, t, n)
                    var i = function () {
                        var e = t.getSource()
                        return e && Boolean(e.vr)
                      },
                      r = function () {
                        var e = t.getSource()
                        return t.vr && Boolean(e.vr)
                      },
                      s = function (e) {
                        ;(e.type === t.exports.PlayerEvent.Warning &&
                          e.code !==
                            t.exports.WarningCode.VR_RENDERING_ERROR) ||
                          (i() && r()
                            ? (o.show(),
                              t.vr && t.vr.getStereo() ? o.on() : o.off())
                            : o.hide())
                      },
                      a = function () {
                        i() ? o.show() : o.hide()
                      }
                    t.on(t.exports.PlayerEvent.VRStereoChanged, s),
                      t.on(t.exports.PlayerEvent.Warning, s),
                      t.on(t.exports.PlayerEvent.SourceUnloaded, a),
                      n.getConfig().events.onUpdated.subscribe(a),
                      this.onClick.subscribe(function () {
                        r()
                          ? t.vr && t.vr.getStereo()
                            ? t.vr.setStereo(!1)
                            : t.vr.setStereo(!0)
                          : console && console.log('No VR content')
                      }),
                      a()
                  }),
                  t
                )
              })(i.ToggleButton)
            n.VRToggleButton = s
          },
          {'../localization/i18n': 82, './togglebutton': 67},
        ],
        75: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Watermark = void 0)
            var i = e('./clickoverlay'),
              r = e('../localization/i18n'),
              s = (function (e) {
                function t(t) {
                  void 0 === t && (t = {})
                  var n = e.call(this, t) || this
                  return (
                    (n.config = n.mergeConfig(
                      t,
                      {
                        cssClass: 'ui-watermark',
                        url: 'http://bitmovin.com',
                        role: 'link',
                        text: 'logo',
                        ariaLabel: r.i18n.getLocalizer('watermarkLink'),
                      },
                      n.config,
                    )),
                    n
                  )
                }
                return o(t, e), t
              })(i.ClickOverlay)
            n.Watermark = s
          },
          {'../localization/i18n': 82, './clickoverlay': 16},
        ],
        76: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.DemoFactory = void 0)
            var o = e('./components/vrtogglebutton'),
              i = e('./components/settingstogglebutton'),
              r = e('./components/volumeslider'),
              s = e('./components/playbacktimelabel'),
              a = e('./components/airplaytogglebutton'),
              l = e('./components/errormessageoverlay'),
              c = e('./components/controlbar'),
              u = e('./components/casttogglebutton'),
              p = e('./components/fullscreentogglebutton'),
              f = e('./components/recommendationoverlay'),
              g = e('./components/playbackspeedselectbox'),
              d = e('./components/audioqualityselectbox'),
              h = e('./components/caststatusoverlay'),
              m = e('./components/uicontainer'),
              v = e('./components/watermark'),
              y = e('./components/subtitleoverlay'),
              b = e('./components/settingspanel'),
              P = e('./components/seekbarlabel'),
              C = e('./components/playbacktoggleoverlay'),
              S = e('./components/pictureinpicturetogglebutton'),
              _ = e('./components/spacer'),
              w = e('./components/container'),
              O = e('./components/volumetogglebutton'),
              k = e('./components/playbacktogglebutton'),
              x = e('./components/seekbar'),
              E = e('./components/videoqualityselectbox'),
              T = e('./uimanager'),
              M = e('./components/titlebar'),
              L = e('./components/bufferingoverlay'),
              I = e('./components/subtitlelistbox'),
              A = e('./components/audiotracklistbox'),
              B = e('./components/settingspanelitem'),
              j = e('./components/settingspanelpage'),
              D = e('./uifactory')
            !(function (e) {
              function t(e, t) {
                void 0 === t && (t = {})
                return new T.UIManager(
                  e,
                  [
                    {
                      ui: D.UIFactory.modernSmallScreenAdsUI(),
                      condition: function (e) {
                        return (
                          e.isMobile &&
                          e.documentWidth < 600 &&
                          e.isAd &&
                          e.adRequiresUi
                        )
                      },
                    },
                    {
                      ui: D.UIFactory.modernAdsUI(),
                      condition: function (e) {
                        return e.isAd && e.adRequiresUi
                      },
                    },
                    {
                      ui: D.UIFactory.modernSmallScreenUI(),
                      condition: function (e) {
                        return e.isMobile && e.documentWidth < 600
                      },
                    },
                    {ui: n()},
                  ],
                  t,
                )
              }
              function n() {
                var e = new y.SubtitleOverlay(),
                  t = new b.SettingsPanel({
                    components: [
                      new j.SettingsPanelPage({
                        components: [
                          new B.SettingsPanelItem(
                            'Video Quality',
                            new E.VideoQualitySelectBox(),
                          ),
                          new B.SettingsPanelItem(
                            'Speed',
                            new g.PlaybackSpeedSelectBox(),
                          ),
                          new B.SettingsPanelItem(
                            'Audio Quality',
                            new d.AudioQualitySelectBox(),
                          ),
                        ],
                      }),
                    ],
                    hidden: !0,
                  }),
                  n = new I.SubtitleListBox(),
                  T = new b.SettingsPanel({
                    components: [
                      new j.SettingsPanelPage({
                        components: [new B.SettingsPanelItem(null, n)],
                      }),
                    ],
                    hidden: !0,
                  }),
                  D = new A.AudioTrackListBox(),
                  U = new b.SettingsPanel({
                    components: [
                      new j.SettingsPanelPage({
                        components: [new B.SettingsPanelItem(null, D)],
                      }),
                    ],
                    hidden: !0,
                  }),
                  z = new c.ControlBar({
                    components: [
                      U,
                      T,
                      t,
                      new w.Container({
                        components: [
                          new s.PlaybackTimeLabel({
                            timeLabelMode: s.PlaybackTimeLabelMode.CurrentTime,
                            hideInLivePlayback: !0,
                          }),
                          new x.SeekBar({label: new P.SeekBarLabel()}),
                          new s.PlaybackTimeLabel({
                            timeLabelMode: s.PlaybackTimeLabelMode.TotalTime,
                            cssClasses: ['text-right'],
                          }),
                        ],
                        cssClasses: ['controlbar-top'],
                      }),
                      new w.Container({
                        components: [
                          new k.PlaybackToggleButton(),
                          new O.VolumeToggleButton(),
                          new r.VolumeSlider(),
                          new _.Spacer(),
                          new S.PictureInPictureToggleButton(),
                          new a.AirPlayToggleButton(),
                          new u.CastToggleButton(),
                          new o.VRToggleButton(),
                          new i.SettingsToggleButton({
                            settingsPanel: U,
                            cssClass: 'ui-audiotracksettingstogglebutton',
                          }),
                          new i.SettingsToggleButton({
                            settingsPanel: T,
                            cssClass: 'ui-subtitlesettingstogglebutton',
                          }),
                          new i.SettingsToggleButton({settingsPanel: t}),
                          new p.FullscreenToggleButton(),
                        ],
                        cssClasses: ['controlbar-bottom'],
                      }),
                    ],
                  })
                return new m.UIContainer({
                  components: [
                    e,
                    new L.BufferingOverlay(),
                    new C.PlaybackToggleOverlay(),
                    new h.CastStatusOverlay(),
                    z,
                    new M.TitleBar(),
                    new f.RecommendationOverlay(),
                    new v.Watermark(),
                    new l.ErrorMessageOverlay(),
                  ],
                })
              }
              e.buildDemoWithSeparateAudioSubtitlesButtons = t
            })(n.DemoFactory || (n.DemoFactory = {}))
          },
          {
            './components/airplaytogglebutton': 7,
            './components/audioqualityselectbox': 8,
            './components/audiotracklistbox': 9,
            './components/bufferingoverlay': 11,
            './components/caststatusoverlay': 13,
            './components/casttogglebutton': 14,
            './components/container': 19,
            './components/controlbar': 20,
            './components/errormessageoverlay': 21,
            './components/fullscreentogglebutton': 22,
            './components/pictureinpicturetogglebutton': 30,
            './components/playbackspeedselectbox': 31,
            './components/playbacktimelabel': 32,
            './components/playbacktogglebutton': 33,
            './components/playbacktoggleoverlay': 34,
            './components/recommendationoverlay': 35,
            './components/seekbar': 36,
            './components/seekbarlabel': 38,
            './components/settingspanel': 40,
            './components/settingspanelitem': 41,
            './components/settingspanelpage': 42,
            './components/settingstogglebutton': 46,
            './components/spacer': 47,
            './components/subtitlelistbox': 48,
            './components/subtitleoverlay': 49,
            './components/titlebar': 66,
            './components/uicontainer': 69,
            './components/videoqualityselectbox': 70,
            './components/volumeslider': 72,
            './components/volumetogglebutton': 73,
            './components/vrtogglebutton': 74,
            './components/watermark': 75,
            './uifactory': 91,
            './uimanager': 92,
          },
        ],
        77: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.DOM = void 0)
            var o = (function () {
              function e(e, t) {
                if (((this.document = document), e instanceof Array)) {
                  if (e.length > 0 && e[0] instanceof HTMLElement) {
                    var n = e
                    this.elements = n
                  }
                } else if (e instanceof HTMLElement) {
                  var o = e
                  this.elements = [o]
                } else if (e instanceof Document) this.elements = null
                else if (t) {
                  var i = e,
                    o = document.createElement(i)
                  for (var r in t) {
                    var s = t[r]
                    null != s && o.setAttribute(r, s)
                  }
                  this.elements = [o]
                } else {
                  var a = e
                  this.elements = this.findChildElements(a)
                }
              }
              return (
                Object.defineProperty(e.prototype, 'length', {
                  get: function () {
                    return this.elements ? this.elements.length : 0
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                (e.prototype.get = function (e) {
                  return void 0 === e
                    ? this.elements
                    : !this.elements ||
                      e >= this.elements.length ||
                      e < -this.elements.length
                    ? void 0
                    : e < 0
                    ? this.elements[this.elements.length - e]
                    : this.elements[e]
                }),
                (e.prototype.forEach = function (e) {
                  this.elements &&
                    this.elements.forEach(function (t) {
                      e(t)
                    })
                }),
                (e.prototype.findChildElementsOfElement = function (e, t) {
                  var n = e.querySelectorAll(t)
                  return [].slice.call(n)
                }),
                (e.prototype.findChildElements = function (e) {
                  var t = this,
                    n = []
                  return this.elements
                    ? (this.forEach(function (o) {
                        n = n.concat(t.findChildElementsOfElement(o, e))
                      }),
                      n)
                    : this.findChildElementsOfElement(document, e)
                }),
                (e.prototype.find = function (t) {
                  return new e(this.findChildElements(t))
                }),
                (e.prototype.focusToFirstInput = function () {
                  var e = this.findChildElements(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                  )
                  e.length > 0 && e[0].focus()
                }),
                (e.prototype.scrollTo = function (e, t) {
                  this.elements[0].scrollTo(e, t)
                }),
                (e.prototype.html = function (e) {
                  return arguments.length > 0 ? this.setHtml(e) : this.getHtml()
                }),
                (e.prototype.getHtml = function () {
                  return this.elements[0].innerHTML
                }),
                (e.prototype.setHtml = function (e) {
                  return (
                    (void 0 !== e && null != e) || (e = ''),
                    this.forEach(function (t) {
                      t.innerHTML = e
                    }),
                    this
                  )
                }),
                (e.prototype.empty = function () {
                  return (
                    this.forEach(function (e) {
                      e.innerHTML = ''
                    }),
                    this
                  )
                }),
                (e.prototype.val = function () {
                  var e = this.elements[0]
                  if (
                    e instanceof HTMLSelectElement ||
                    e instanceof HTMLInputElement
                  )
                    return e.value
                  throw new Error('val() not supported for ' + typeof e)
                }),
                (e.prototype.attr = function (e, t) {
                  return arguments.length > 1
                    ? this.setAttr(e, t)
                    : this.getAttr(e)
                }),
                (e.prototype.removeAttr = function (e) {
                  this.forEach(function (t) {
                    t.removeAttribute(e)
                  })
                }),
                (e.prototype.getAttr = function (e) {
                  return this.elements[0].getAttribute(e)
                }),
                (e.prototype.setAttr = function (e, t) {
                  return (
                    this.forEach(function (n) {
                      n.setAttribute(e, t)
                    }),
                    this
                  )
                }),
                (e.prototype.data = function (e, t) {
                  return arguments.length > 1
                    ? this.setData(e, t)
                    : this.getData(e)
                }),
                (e.prototype.getData = function (e) {
                  return this.elements[0].getAttribute('data-' + e)
                }),
                (e.prototype.setData = function (e, t) {
                  return (
                    this.forEach(function (n) {
                      n.setAttribute('data-' + e, t)
                    }),
                    this
                  )
                }),
                (e.prototype.append = function () {
                  for (var e = [], t = 0; t < arguments.length; t++)
                    e[t] = arguments[t]
                  return (
                    this.forEach(function (t) {
                      e.forEach(function (e) {
                        e.elements.forEach(function (n, o) {
                          t.appendChild(e.elements[o])
                        })
                      })
                    }),
                    this
                  )
                }),
                (e.prototype.remove = function () {
                  this.forEach(function (e) {
                    var t = e.parentNode
                    t && t.removeChild(e)
                  })
                }),
                (e.prototype.offset = function () {
                  var e = this.elements[0],
                    t = e.getBoundingClientRect(),
                    n = document.body.parentElement.getBoundingClientRect()
                  return {top: t.top - n.top, left: t.left - n.left}
                }),
                (e.prototype.width = function () {
                  return this.elements[0].offsetWidth
                }),
                (e.prototype.height = function () {
                  return this.elements[0].offsetHeight
                }),
                (e.prototype.size = function () {
                  return {width: this.width(), height: this.height()}
                }),
                (e.prototype.on = function (e, t) {
                  var n = this
                  return (
                    e.split(' ').forEach(function (e) {
                      null == n.elements
                        ? n.document.addEventListener(e, t)
                        : n.forEach(function (n) {
                            n.addEventListener(e, t)
                          })
                    }),
                    this
                  )
                }),
                (e.prototype.off = function (e, t) {
                  var n = this
                  return (
                    e.split(' ').forEach(function (e) {
                      null == n.elements
                        ? n.document.removeEventListener(e, t)
                        : n.forEach(function (n) {
                            n.removeEventListener(e, t)
                          })
                    }),
                    this
                  )
                }),
                (e.prototype.addClass = function (e) {
                  return (
                    this.forEach(function (t) {
                      var n
                      if (t.classList) {
                        var o = e.split(' ').filter(function (e) {
                          return e.length > 0
                        })
                        o.length > 0 && (n = t.classList).add.apply(n, o)
                      } else t.className += ' ' + e
                    }),
                    this
                  )
                }),
                (e.prototype.removeClass = function (e) {
                  return (
                    this.forEach(function (t) {
                      var n
                      if (t.classList) {
                        var o = e.split(' ').filter(function (e) {
                          return e.length > 0
                        })
                        o.length > 0 && (n = t.classList).remove.apply(n, o)
                      } else t.className = t.className.replace(new RegExp('(^|\\b)' + e.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
                    }),
                    this
                  )
                }),
                (e.prototype.hasClass = function (e) {
                  var t = !1
                  return (
                    this.forEach(function (n) {
                      n.classList
                        ? n.classList.contains(e) && (t = !0)
                        : new RegExp('(^| )' + e + '( |$)', 'gi').test(
                            n.className,
                          ) && (t = !0)
                    }),
                    t
                  )
                }),
                (e.prototype.css = function (e, t) {
                  if ('string' == typeof e) {
                    var n = e
                    return 2 === arguments.length
                      ? this.setCss(n, t)
                      : this.getCss(n)
                  }
                  var o = e
                  return this.setCssCollection(o)
                }),
                (e.prototype.getCss = function (e) {
                  return getComputedStyle(this.elements[0])[e]
                }),
                (e.prototype.setCss = function (e, t) {
                  return (
                    this.forEach(function (n) {
                      n.style[e] = t
                    }),
                    this
                  )
                }),
                (e.prototype.setCssCollection = function (e) {
                  return (
                    this.forEach(function (t) {
                      Object.assign(t.style, e)
                    }),
                    this
                  )
                }),
                e
              )
            })()
            n.DOM = o
          },
          {},
        ],
        78: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ErrorUtils = void 0)
            !(function (e) {
              ;(e.defaultErrorMessages = {
                1e3: 'Error is unknown',
                1001: 'The player API is not available after a call to PlayerAPI.destroy.',
                1100: 'General setup error',
                1101: 'There was an error when inserting the HTML video element',
                1102: 'No configuration was provided',
                1103: 'The license is not valid',
                1104: 'The the domain-locked player is not authorized to playback on this domain',
                1105: 'The domain is not allowlisted',
                1106: 'The license server URL is invalid',
                1107: 'The impression server URL is invalid',
                1108: 'Could not initialize a rendering engine',
                1109: 'The used flash version does not support playback',
                1110: 'Native Flash is not authorized by a valid Adobe token',
                1111: "Flash doesn't have sufficient resources",
                1112: 'Flash container API not available',
                1113: 'Protocol not supported. This site has been loaded using "file" protocol, but unfortunately this is not supported. Please load the page using a web server (using http or https)',
                1200: 'General source error',
                1201: 'No valid source was provided',
                1202: 'The downloaded manifest is invalid',
                1203: 'There was no technology detected to playback the provided source',
                1204: 'The stream type is not supported',
                1205: 'The forced technology is not supported',
                1206: 'No stream found for supported technologies.',
                1207: 'The downloaded segment is empty',
                1208: 'The manifest could not be loaded',
                1209: 'Progressive stream type not supported or the stream has an error',
                1210: 'HLS stream has an error',
                1211: 'The encryption method is not supported',
                1300: 'General playback error',
                1301: 'Video decoder or demuxer had an error with the content',
                1302: 'General error if Flash renderer has an error',
                1303: "Flash doesn't have sufficient resources",
                1304: 'The transmuxer could not be initialized',
                1400: 'Network error while downloading',
                1401: 'The manifest download timed out',
                1402: 'The segment download timed out',
                1403: 'The progressive stream download timed out',
                1404: 'The Certificate could not be loaded',
                2e3: 'General DRM error',
                2001: 'Required DRM configuration is missing',
                2002: 'The licensing server URL is missing',
                2003: 'License request failed',
                2004: 'Key or KeyId is missing',
                2005: 'Key size is not supported',
                2006: 'Unable to instantiate a key system supporting the required combinations',
                2007: 'Unable to create or initialize key session',
                2008: 'The MediaKey object could not be created/initialized',
                2009: 'Key error',
                2010: 'The key system is not supported',
                2011: 'The certificate is not valid',
                2012: 'Invalid header key/value pair for PlayReady license request',
                2013: 'Content cannot be played back because the output is restricted on this machine',
                2014: 'DRM error for the Flash renderer',
                2100: 'General VR error',
                2101: 'Player technology not compatible with VR playback',
                3e3: 'General module error',
                3001: 'The definition of the module is invalid (e.g. incomplete).',
                3002: 'The module definition specifies dependencies but the module is not provided via a function for deferred loading.',
                3003: 'A module cannot be loaded because it has not been added to the player core.',
                3004: 'A module cannot be loaded because one or more dependencies are missing.',
                3100: 'An Advertising module error has occurred. Refer to the attached AdvertisingError.',
              }),
                (e.defaultErrorMessageTranslator = function (t) {
                  var n = e.defaultErrorMessages[t.code]
                  return n ? n + '\n(' + t.name + ')' : t.code + ' ' + t.name
                })
            })(n.ErrorUtils || (n.ErrorUtils = {}))
          },
          {},
        ],
        79: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__extends) ||
              (function () {
                var e = function (t, n) {
                  return (e =
                    Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array &&
                      function (e, t) {
                        e.__proto__ = t
                      }) ||
                    function (e, t) {
                      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                    })(t, n)
                }
                return function (t, n) {
                  function o() {
                    this.constructor = t
                  }
                  e(t, n),
                    (t.prototype =
                      null === n
                        ? Object.create(n)
                        : ((o.prototype = n.prototype), new o()))
                }
              })()
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.EventDispatcher = void 0)
            var i = e('./arrayutils'),
              r = e('./timeout'),
              s = (function () {
                function e() {
                  this.listeners = []
                }
                return (
                  (e.prototype.subscribe = function (e) {
                    this.listeners.push(new a(e))
                  }),
                  (e.prototype.subscribeOnce = function (e) {
                    this.listeners.push(new a(e, !0))
                  }),
                  (e.prototype.subscribeRateLimited = function (e, t) {
                    this.listeners.push(new l(e, t))
                  }),
                  (e.prototype.unsubscribe = function (e) {
                    for (var t = 0; t < this.listeners.length; t++) {
                      var n = this.listeners[t]
                      if (n.listener === e)
                        return (
                          n.clear(), i.ArrayUtils.remove(this.listeners, n), !0
                        )
                    }
                    return !1
                  }),
                  (e.prototype.unsubscribeAll = function () {
                    for (var e = 0, t = this.listeners; e < t.length; e++) {
                      t[e].clear()
                    }
                    this.listeners = []
                  }),
                  (e.prototype.dispatch = function (e, t) {
                    void 0 === t && (t = null)
                    for (
                      var n = [], o = this.listeners.slice(0), r = 0, s = o;
                      r < s.length;
                      r++
                    ) {
                      var a = s[r]
                      a.fire(e, t), a.isOnce() && n.push(a)
                    }
                    for (var l = 0, c = n; l < c.length; l++) {
                      var u = c[l]
                      i.ArrayUtils.remove(this.listeners, u)
                    }
                  }),
                  (e.prototype.getEvent = function () {
                    return this
                  }),
                  e
                )
              })()
            n.EventDispatcher = s
            var a = (function () {
                function e(e, t) {
                  void 0 === t && (t = !1),
                    (this.eventListener = e),
                    (this.once = t)
                }
                return (
                  Object.defineProperty(e.prototype, 'listener', {
                    get: function () {
                      return this.eventListener
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.prototype.fire = function (e, t) {
                    this.eventListener(e, t)
                  }),
                  (e.prototype.isOnce = function () {
                    return this.once
                  }),
                  (e.prototype.clear = function () {}),
                  e
                )
              })(),
              l = (function (e) {
                function t(t, n) {
                  var o = e.call(this, t) || this
                  o.rateMs = n
                  var i = function () {
                    o.rateLimitTimout.start()
                  }
                  return (
                    (o.rateLimitTimout = new r.Timeout(o.rateMs, function () {
                      o.lastSeenEvent &&
                        (o.fireSuper(
                          o.lastSeenEvent.sender,
                          o.lastSeenEvent.args,
                        ),
                        i(),
                        (o.lastSeenEvent = null))
                    })),
                    (o.rateLimitingEventListener = function (e, t) {
                      if (o.shouldFireEvent())
                        return o.fireSuper(e, t), void i()
                      o.lastSeenEvent = {sender: e, args: t}
                    }),
                    o
                  )
                }
                return (
                  o(t, e),
                  (t.prototype.shouldFireEvent = function () {
                    return !this.rateLimitTimout.isActive()
                  }),
                  (t.prototype.fireSuper = function (t, n) {
                    e.prototype.fire.call(this, t, n)
                  }),
                  (t.prototype.fire = function (e, t) {
                    this.rateLimitingEventListener(e, t)
                  }),
                  (t.prototype.clear = function () {
                    e.prototype.clear.call(this), this.rateLimitTimout.clear()
                  }),
                  t
                )
              })(a)
          },
          {'./arrayutils': 1, './timeout': 90},
        ],
        80: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Guid = void 0)
            !(function (e) {
              function t() {
                return n++
              }
              var n = 1
              e.next = t
            })(n.Guid || (n.Guid = {}))
          },
          {},
        ],
        81: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.ImageLoader = void 0)
            var o = e('./dom'),
              i = (function () {
                function e() {
                  this.state = {}
                }
                return (
                  (e.prototype.load = function (e, t) {
                    var n = this
                    if (this.state[e]) {
                      var i = this.state[e]
                      ;(i.loadedCallback = t),
                        i.loaded && this.callLoadedCallback(i)
                    } else {
                      var r = {
                        url: e,
                        image: new o.DOM('img', {}),
                        loadedCallback: t,
                        loaded: !1,
                        width: 0,
                        height: 0,
                      }
                      ;(this.state[e] = r),
                        r.image.on('load', function (e) {
                          ;(r.loaded = !0),
                            (r.width = r.image.get(0).width),
                            (r.height = r.image.get(0).height),
                            n.callLoadedCallback(r)
                        }),
                        r.image.attr('src', r.url)
                    }
                  }),
                  (e.prototype.callLoadedCallback = function (e) {
                    e.loadedCallback(e.url, e.width, e.height)
                  }),
                  e
                )
              })()
            n.ImageLoader = i
          },
          {'./dom': 77},
        ],
        82: [
          function (e, t, n) {
            'use strict'
            var o =
                (this && this.__assign) ||
                function () {
                  return (
                    (o =
                      Object.assign ||
                      function (e) {
                        for (var t, n = 1, o = arguments.length; n < o; n++) {
                          t = arguments[n]
                          for (var i in t)
                            Object.prototype.hasOwnProperty.call(t, i) &&
                              (e[i] = t[i])
                        }
                        return e
                      }),
                    o.apply(this, arguments)
                  )
                },
              i =
                (this && this.__importDefault) ||
                function (e) {
                  return e && e.__esModule ? e : {default: e}
                }
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.i18n = n.defaultVocabularies = void 0)
            var r = i(e('./languages/de.json')),
              s = i(e('./languages/en.json'))
            n.defaultVocabularies = {en: s.default, de: r.default}
            var a = {language: 'en', vocabularies: n.defaultVocabularies},
              l = (function () {
                function e(e) {
                  this.setConfig(e)
                }
                return (
                  (e.prototype.setConfig = function (e) {
                    var t = o(o({}, a), e),
                      n = 'auto' === t.language,
                      i = this.mergeVocabulariesWithDefaultVocabularies(
                        t.vocabularies,
                      )
                    this.initializeLanguage(t.language, n, i),
                      this.initializeVocabulary(i)
                  }),
                  (e.containsLanguage = function (e, t) {
                    return e.hasOwnProperty(t)
                  }),
                  (e.prototype.mergeVocabulariesWithDefaultVocabularies = function (
                    t,
                  ) {
                    void 0 === t && (t = {})
                    var i = o(o({}, n.defaultVocabularies), t)
                    return Object.keys(i).reduce(function (r, s) {
                      var a,
                        l = i[s]
                      return (
                        e.containsLanguage(n.defaultVocabularies, s) &&
                          e.containsLanguage(t, s) &&
                          (l = o(o({}, n.defaultVocabularies[s]), t[s])),
                        o(o({}, r), ((a = {}), (a[s] = l), a))
                      )
                    }, {})
                  }),
                  (e.prototype.initializeLanguage = function (t, n, o) {
                    if (n) {
                      var i = window.navigator.language
                      if (e.containsLanguage(o, i))
                        return void (this.language = i)
                      var r = i.slice(0, 2)
                      if (e.containsLanguage(o, r))
                        return void (this.language = r)
                    }
                    this.language = t
                  }),
                  (e.prototype.initializeVocabulary = function (e) {
                    this.vocabulary = ['en', this.language].reduce(function (
                      t,
                      n,
                    ) {
                      return o(o({}, t), e[n] || {})
                    },
                    {})
                  }),
                  (e.prototype.replaceVariableWithPlaceholderIfExists = function (
                    e,
                    t,
                  ) {
                    var n = e.match(new RegExp('{[a-zA-Z0-9]+}', 'g'))
                    return 0 === n.length
                      ? e
                      : n
                          .map(function (e) {
                            return {match: e, key: e.slice(1, -1)}
                          })
                          .reduce(function (e, n) {
                            var o = n.key,
                              i = n.match
                            return t.hasOwnProperty(o) ? e.replace(i, t[o]) : e
                          }, e)
                  }),
                  (e.prototype.getLocalizer = function (e, t) {
                    var n = this
                    return function () {
                      if (null != e) {
                        var o = n.vocabulary[e]
                        return (
                          null == o && (o = e),
                          null != t &&
                            (o = n.replaceVariableWithPlaceholderIfExists(
                              o,
                              t,
                            )),
                          o
                        )
                      }
                    }
                  }),
                  (e.prototype.performLocalization = function (e) {
                    return 'function' == typeof e ? e() : e
                  }),
                  e
                )
              })()
            n.i18n = new l(a)
          },
          {'./languages/de.json': 83, './languages/en.json': 84},
        ],
        83: [
          function (e, t, n) {
            t.exports = {
              'settings.video.quality': 'Videoqualität',
              'settings.audio.quality': 'Audioqualität',
              'settings.audio.track': 'Audiospur',
              speed: 'Geschwindigkeit',
              play: 'Abspielen',
              playPause: 'Abspielen/Pause',
              open: 'öffnen',
              close: 'Schließen',
              'settings.audio.mute': 'Stummschaltung',
              'settings.audio.volume': 'Lautstärke',
              pictureInPicture: 'Bild im Bild',
              appleAirplay: 'Apple AirPlay',
              googleCast: 'Google Cast',
              vr: 'VR',
              settings: 'Einstellungen',
              fullscreen: 'Vollbild',
              off: 'aus',
              'settings.subtitles': 'Untertitel',
              'settings.subtitles.font.size': 'Größe',
              'settings.subtitles.font.family': 'Schriftart',
              'settings.subtitles.font.color': 'Farbe',
              'settings.subtitles.font.opacity': 'Deckkraft',
              'settings.subtitles.characterEdge': 'Ränder',
              'settings.subtitles.background.color': 'Hintergrundfarbe',
              'settings.subtitles.background.opacity': 'Hintergrunddeckkraft',
              'settings.subtitles.window.color': 'Hintergrundfarbe',
              'settings.subtitles.window.opacity': 'Hintergrunddeckkraft',
              'settings.time.hours': 'Stunden',
              'settings.time.minutes': 'Minuten',
              'settings.time.seconds': 'Sekunden',
              back: 'Zurück',
              reset: 'Zurücksetzen',
              replay: 'Wiederholen',
              'ads.remainingTime':
                'Diese Anzeige endet in {remainingTime} Sekunden',
              default: 'standard',
              'colors.white': 'weiß',
              'colors.black': 'schwarz',
              'colors.red': 'rot',
              'colors.green': 'grün',
              'colors.blue': 'blau',
              'colors.yellow': 'gelb',
              'subtitle.example': 'Beispiel Untertitel',
              'subtitle.select': 'Untertitel auswählen',
              playingOn: 'Spielt auf <strong>{castDeviceName}</strong>',
              connectingTo:
                'Verbindung mit <strong>{castDeviceName}</strong> wird hergestellt...',
              watermarkLink: 'Link zum Homepage',
              controlBar: 'Videoplayer Kontrollen',
              player: 'Video player',
              seekBar: 'Video-Timeline',
              'seekBar.value': 'Wert',
              'seekBar.timeshift': 'Timeshift',
              'seekBar.durationText': 'aus',
            }
          },
          {},
        ],
        84: [
          function (e, t, n) {
            t.exports = {
              'settings.video.quality': 'Video Quality',
              'settings.audio.quality': 'Audio Quality',
              'settings.audio.track': 'Audio Track',
              'settings.audio.mute': 'Mute',
              'settings.audio.volume': 'Volume',
              'settings.subtitles.window.color': 'Window color',
              'settings.subtitles.window.opacity': 'Window opacity',
              'settings.subtitles': 'Subtitles',
              'settings.subtitles.font.color': 'Font color',
              'settings.subtitles.font.opacity': 'Font opacity',
              'settings.subtitles.background.color': 'Background color',
              'settings.subtitles.background.opacity': 'Background opacity',
              'colors.white': 'white',
              'colors.black': 'black',
              'colors.red': 'red',
              'colors.green': 'green',
              'colors.blue': 'blue',
              'colors.cyan': 'cyan',
              'colors.yellow': 'yellow',
              'colors.magenta': 'magenta',
              percent: '{value}%',
              'settings.subtitles.font.size': 'Font size',
              'settings.subtitles.characterEdge': 'Character edge',
              'settings.subtitles.characterEdge.raised': 'raised',
              'settings.subtitles.characterEdge.depressed': 'depressed',
              'settings.subtitles.characterEdge.uniform': 'uniform',
              'settings.subtitles.characterEdge.dropshadowed': 'drop shadowed',
              'settings.subtitles.font.family': 'Font family',
              'settings.subtitles.font.family.monospacedserif':
                'monospaced serif',
              'settings.subtitles.font.family.proportionalserif':
                'proportional serif',
              'settings.subtitles.font.family.monospacedsansserif':
                'monospaced sans serif',
              'settings.subtitles.font.family.proportionalsansserif':
                'proportional sans serif',
              'settings.subtitles.font.family.casual': 'casual',
              'settings.subtitles.font.family.cursive': 'cursive',
              'settings.subtitles.font.family.smallcapital': 'small capital',
              'settings.time.hours': 'Hours',
              'settings.time.minutes': 'Minutes',
              'settings.time.seconds': 'Seconds',
              'ads.remainingTime':
                'This ad will end in {remainingTime} seconds.',
              settings: 'Settings',
              fullscreen: 'Fullscreen',
              speed: 'Speed',
              playPause: 'Play/Pause',
              play: 'Play',
              open: 'open',
              close: 'Close',
              pictureInPicture: 'Picture-in-Picture',
              appleAirplay: 'Apple AirPlay',
              googleCast: 'Google Cast',
              vr: 'VR',
              off: 'off',
              auto: 'auto',
              back: 'Back',
              reset: 'Reset',
              replay: 'Replay',
              normal: 'normal',
              default: 'default',
              live: 'Live',
              'subtitle.example': 'example subtitle',
              'subtitle.select': 'Select subtitle',
              playingOn: 'Playing on <strong>{castDeviceName}</strong>',
              connectingTo:
                'Connecting to <strong>{castDeviceName}</strong>...',
              watermarkLink: 'Link to Homepage',
              controlBar: 'Video player controls',
              player: 'Video player',
              seekBar: 'Video timeline',
              'seekBar.value': 'Value',
              'seekBar.timeshift': 'Timeshift',
              'seekBar.durationText': 'out of',
            }
          },
          {},
        ],
        85: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.version = void 0),
              (n.version = '3.23.0')
            var o = e('./uimanager')
            Object.defineProperty(n, 'UIManager', {
              enumerable: !0,
              get: function () {
                return o.UIManager
              },
            }),
              Object.defineProperty(n, 'UIInstanceManager', {
                enumerable: !0,
                get: function () {
                  return o.UIInstanceManager
                },
              })
            var i = e('./uifactory')
            Object.defineProperty(n, 'UIFactory', {
              enumerable: !0,
              get: function () {
                return i.UIFactory
              },
            })
            var r = e('./demofactory')
            Object.defineProperty(n, 'DemoFactory', {
              enumerable: !0,
              get: function () {
                return r.DemoFactory
              },
            })
            var s = e('./arrayutils')
            Object.defineProperty(n, 'ArrayUtils', {
              enumerable: !0,
              get: function () {
                return s.ArrayUtils
              },
            })
            var a = e('./stringutils')
            Object.defineProperty(n, 'StringUtils', {
              enumerable: !0,
              get: function () {
                return a.StringUtils
              },
            })
            var l = e('./playerutils')
            Object.defineProperty(n, 'PlayerUtils', {
              enumerable: !0,
              get: function () {
                return l.PlayerUtils
              },
            })
            var c = e('./uiutils')
            Object.defineProperty(n, 'UIUtils', {
              enumerable: !0,
              get: function () {
                return c.UIUtils
              },
            })
            var u = e('./browserutils')
            Object.defineProperty(n, 'BrowserUtils', {
              enumerable: !0,
              get: function () {
                return u.BrowserUtils
              },
            })
            var p = e('./storageutils')
            Object.defineProperty(n, 'StorageUtils', {
              enumerable: !0,
              get: function () {
                return p.StorageUtils
              },
            })
            var f = e('./errorutils')
            Object.defineProperty(n, 'ErrorUtils', {
              enumerable: !0,
              get: function () {
                return f.ErrorUtils
              },
            })
            var g = e('./components/button')
            Object.defineProperty(n, 'Button', {
              enumerable: !0,
              get: function () {
                return g.Button
              },
            })
            var d = e('./components/controlbar')
            Object.defineProperty(n, 'ControlBar', {
              enumerable: !0,
              get: function () {
                return d.ControlBar
              },
            })
            var h = e('./components/fullscreentogglebutton')
            Object.defineProperty(n, 'FullscreenToggleButton', {
              enumerable: !0,
              get: function () {
                return h.FullscreenToggleButton
              },
            })
            var m = e('./components/hugeplaybacktogglebutton')
            Object.defineProperty(n, 'HugePlaybackToggleButton', {
              enumerable: !0,
              get: function () {
                return m.HugePlaybackToggleButton
              },
            })
            var v = e('./components/playbacktimelabel')
            Object.defineProperty(n, 'PlaybackTimeLabel', {
              enumerable: !0,
              get: function () {
                return v.PlaybackTimeLabel
              },
            }),
              Object.defineProperty(n, 'PlaybackTimeLabelMode', {
                enumerable: !0,
                get: function () {
                  return v.PlaybackTimeLabelMode
                },
              })
            var y = e('./components/playbacktogglebutton')
            Object.defineProperty(n, 'PlaybackToggleButton', {
              enumerable: !0,
              get: function () {
                return y.PlaybackToggleButton
              },
            })
            var b = e('./components/seekbar')
            Object.defineProperty(n, 'SeekBar', {
              enumerable: !0,
              get: function () {
                return b.SeekBar
              },
            })
            var P = e('./components/selectbox')
            Object.defineProperty(n, 'SelectBox', {
              enumerable: !0,
              get: function () {
                return P.SelectBox
              },
            })
            var C = e('./components/itemselectionlist')
            Object.defineProperty(n, 'ItemSelectionList', {
              enumerable: !0,
              get: function () {
                return C.ItemSelectionList
              },
            })
            var S = e('./components/settingspanel')
            Object.defineProperty(n, 'SettingsPanel', {
              enumerable: !0,
              get: function () {
                return S.SettingsPanel
              },
            })
            var _ = e('./components/settingstogglebutton')
            Object.defineProperty(n, 'SettingsToggleButton', {
              enumerable: !0,
              get: function () {
                return _.SettingsToggleButton
              },
            })
            var w = e('./components/togglebutton')
            Object.defineProperty(n, 'ToggleButton', {
              enumerable: !0,
              get: function () {
                return w.ToggleButton
              },
            })
            var O = e('./components/videoqualityselectbox')
            Object.defineProperty(n, 'VideoQualitySelectBox', {
              enumerable: !0,
              get: function () {
                return O.VideoQualitySelectBox
              },
            })
            var k = e('./components/volumetogglebutton')
            Object.defineProperty(n, 'VolumeToggleButton', {
              enumerable: !0,
              get: function () {
                return k.VolumeToggleButton
              },
            })
            var x = e('./components/vrtogglebutton')
            Object.defineProperty(n, 'VRToggleButton', {
              enumerable: !0,
              get: function () {
                return x.VRToggleButton
              },
            })
            var E = e('./components/watermark')
            Object.defineProperty(n, 'Watermark', {
              enumerable: !0,
              get: function () {
                return E.Watermark
              },
            })
            var T = e('./components/uicontainer')
            Object.defineProperty(n, 'UIContainer', {
              enumerable: !0,
              get: function () {
                return T.UIContainer
              },
            })
            var M = e('./components/container')
            Object.defineProperty(n, 'Container', {
              enumerable: !0,
              get: function () {
                return M.Container
              },
            })
            var L = e('./components/label')
            Object.defineProperty(n, 'Label', {
              enumerable: !0,
              get: function () {
                return L.Label
              },
            })
            var I = e('./components/audioqualityselectbox')
            Object.defineProperty(n, 'AudioQualitySelectBox', {
              enumerable: !0,
              get: function () {
                return I.AudioQualitySelectBox
              },
            })
            var A = e('./components/audiotrackselectbox')
            Object.defineProperty(n, 'AudioTrackSelectBox', {
              enumerable: !0,
              get: function () {
                return A.AudioTrackSelectBox
              },
            })
            var B = e('./components/caststatusoverlay')
            Object.defineProperty(n, 'CastStatusOverlay', {
              enumerable: !0,
              get: function () {
                return B.CastStatusOverlay
              },
            })
            var j = e('./components/casttogglebutton')
            Object.defineProperty(n, 'CastToggleButton', {
              enumerable: !0,
              get: function () {
                return j.CastToggleButton
              },
            })
            var D = e('./components/component')
            Object.defineProperty(n, 'Component', {
              enumerable: !0,
              get: function () {
                return D.Component
              },
            })
            var U = e('./components/errormessageoverlay')
            Object.defineProperty(n, 'ErrorMessageOverlay', {
              enumerable: !0,
              get: function () {
                return U.ErrorMessageOverlay
              },
            })
            var z = e('./components/recommendationoverlay')
            Object.defineProperty(n, 'RecommendationOverlay', {
              enumerable: !0,
              get: function () {
                return z.RecommendationOverlay
              },
            })
            var R = e('./components/seekbarlabel')
            Object.defineProperty(n, 'SeekBarLabel', {
              enumerable: !0,
              get: function () {
                return R.SeekBarLabel
              },
            })
            var V = e('./components/subtitleoverlay')
            Object.defineProperty(n, 'SubtitleOverlay', {
              enumerable: !0,
              get: function () {
                return V.SubtitleOverlay
              },
            })
            var H = e('./components/subtitleselectbox')
            Object.defineProperty(n, 'SubtitleSelectBox', {
              enumerable: !0,
              get: function () {
                return H.SubtitleSelectBox
              },
            })
            var F = e('./components/titlebar')
            Object.defineProperty(n, 'TitleBar', {
              enumerable: !0,
              get: function () {
                return F.TitleBar
              },
            })
            var N = e('./components/volumecontrolbutton')
            Object.defineProperty(n, 'VolumeControlButton', {
              enumerable: !0,
              get: function () {
                return N.VolumeControlButton
              },
            })
            var W = e('./components/clickoverlay')
            Object.defineProperty(n, 'ClickOverlay', {
              enumerable: !0,
              get: function () {
                return W.ClickOverlay
              },
            })
            var q = e('./components/adskipbutton')
            Object.defineProperty(n, 'AdSkipButton', {
              enumerable: !0,
              get: function () {
                return q.AdSkipButton
              },
            })
            var K = e('./components/admessagelabel')
            Object.defineProperty(n, 'AdMessageLabel', {
              enumerable: !0,
              get: function () {
                return K.AdMessageLabel
              },
            })
            var Q = e('./components/adclickoverlay')
            Object.defineProperty(n, 'AdClickOverlay', {
              enumerable: !0,
              get: function () {
                return Q.AdClickOverlay
              },
            })
            var G = e('./components/playbackspeedselectbox')
            Object.defineProperty(n, 'PlaybackSpeedSelectBox', {
              enumerable: !0,
              get: function () {
                return G.PlaybackSpeedSelectBox
              },
            })
            var Y = e('./components/hugereplaybutton')
            Object.defineProperty(n, 'HugeReplayButton', {
              enumerable: !0,
              get: function () {
                return Y.HugeReplayButton
              },
            })
            var X = e('./components/bufferingoverlay')
            Object.defineProperty(n, 'BufferingOverlay', {
              enumerable: !0,
              get: function () {
                return X.BufferingOverlay
              },
            })
            var J = e('./components/castuicontainer')
            Object.defineProperty(n, 'CastUIContainer', {
              enumerable: !0,
              get: function () {
                return J.CastUIContainer
              },
            })
            var Z = e('./components/playbacktoggleoverlay')
            Object.defineProperty(n, 'PlaybackToggleOverlay', {
              enumerable: !0,
              get: function () {
                return Z.PlaybackToggleOverlay
              },
            })
            var $ = e('./components/closebutton')
            Object.defineProperty(n, 'CloseButton', {
              enumerable: !0,
              get: function () {
                return $.CloseButton
              },
            })
            var ee = e('./components/metadatalabel')
            Object.defineProperty(n, 'MetadataLabel', {
              enumerable: !0,
              get: function () {
                return ee.MetadataLabel
              },
            }),
              Object.defineProperty(n, 'MetadataLabelContent', {
                enumerable: !0,
                get: function () {
                  return ee.MetadataLabelContent
                },
              })
            var te = e('./components/airplaytogglebutton')
            Object.defineProperty(n, 'AirPlayToggleButton', {
              enumerable: !0,
              get: function () {
                return te.AirPlayToggleButton
              },
            })
            var ne = e('./components/volumeslider')
            Object.defineProperty(n, 'VolumeSlider', {
              enumerable: !0,
              get: function () {
                return ne.VolumeSlider
              },
            })
            var oe = e('./components/pictureinpicturetogglebutton')
            Object.defineProperty(n, 'PictureInPictureToggleButton', {
              enumerable: !0,
              get: function () {
                return oe.PictureInPictureToggleButton
              },
            })
            var ie = e('./components/spacer')
            Object.defineProperty(n, 'Spacer', {
              enumerable: !0,
              get: function () {
                return ie.Spacer
              },
            })
            var re = e('./components/subtitlesettings/backgroundcolorselectbox')
            Object.defineProperty(n, 'BackgroundColorSelectBox', {
              enumerable: !0,
              get: function () {
                return re.BackgroundColorSelectBox
              },
            })
            var se = e(
              './components/subtitlesettings/backgroundopacityselectbox',
            )
            Object.defineProperty(n, 'BackgroundOpacitySelectBox', {
              enumerable: !0,
              get: function () {
                return se.BackgroundOpacitySelectBox
              },
            })
            var ae = e('./components/subtitlesettings/characteredgeselectbox')
            Object.defineProperty(n, 'CharacterEdgeSelectBox', {
              enumerable: !0,
              get: function () {
                return ae.CharacterEdgeSelectBox
              },
            })
            var le = e('./components/subtitlesettings/fontcolorselectbox')
            Object.defineProperty(n, 'FontColorSelectBox', {
              enumerable: !0,
              get: function () {
                return le.FontColorSelectBox
              },
            })
            var ce = e('./components/subtitlesettings/fontfamilyselectbox')
            Object.defineProperty(n, 'FontFamilySelectBox', {
              enumerable: !0,
              get: function () {
                return ce.FontFamilySelectBox
              },
            })
            var ue = e('./components/subtitlesettings/fontopacityselectbox')
            Object.defineProperty(n, 'FontOpacitySelectBox', {
              enumerable: !0,
              get: function () {
                return ue.FontOpacitySelectBox
              },
            })
            var pe = e('./components/subtitlesettings/fontsizeselectbox')
            Object.defineProperty(n, 'FontSizeSelectBox', {
              enumerable: !0,
              get: function () {
                return pe.FontSizeSelectBox
              },
            })
            var fe = e('./components/subtitlesettings/subtitlesettingselectbox')
            Object.defineProperty(n, 'SubtitleSettingSelectBox', {
              enumerable: !0,
              get: function () {
                return fe.SubtitleSettingSelectBox
              },
            })
            var ge = e('./components/subtitlesettings/subtitlesettingslabel')
            Object.defineProperty(n, 'SubtitleSettingsLabel', {
              enumerable: !0,
              get: function () {
                return ge.SubtitleSettingsLabel
              },
            })
            var de = e('./components/subtitlesettings/windowcolorselectbox')
            Object.defineProperty(n, 'WindowColorSelectBox', {
              enumerable: !0,
              get: function () {
                return de.WindowColorSelectBox
              },
            })
            var he = e('./components/subtitlesettings/windowopacityselectbox')
            Object.defineProperty(n, 'WindowOpacitySelectBox', {
              enumerable: !0,
              get: function () {
                return he.WindowOpacitySelectBox
              },
            })
            var me = e(
              './components/subtitlesettings/subtitlesettingsresetbutton',
            )
            Object.defineProperty(n, 'SubtitleSettingsResetButton', {
              enumerable: !0,
              get: function () {
                return me.SubtitleSettingsResetButton
              },
            })
            var ve = e('./components/listbox')
            Object.defineProperty(n, 'ListBox', {
              enumerable: !0,
              get: function () {
                return ve.ListBox
              },
            })
            var ye = e('./components/subtitlelistbox')
            Object.defineProperty(n, 'SubtitleListBox', {
              enumerable: !0,
              get: function () {
                return ye.SubtitleListBox
              },
            })
            var be = e('./components/audiotracklistbox')
            Object.defineProperty(n, 'AudioTrackListBox', {
              enumerable: !0,
              get: function () {
                return be.AudioTrackListBox
              },
            })
            var Pe = e('./components/settingspanelpage')
            Object.defineProperty(n, 'SettingsPanelPage', {
              enumerable: !0,
              get: function () {
                return Pe.SettingsPanelPage
              },
            })
            var Ce = e('./components/settingspanelpagebackbutton')
            Object.defineProperty(n, 'SettingsPanelPageBackButton', {
              enumerable: !0,
              get: function () {
                return Ce.SettingsPanelPageBackButton
              },
            })
            var Se = e('./components/settingspanelpageopenbutton')
            Object.defineProperty(n, 'SettingsPanelPageOpenButton', {
              enumerable: !0,
              get: function () {
                return Se.SettingsPanelPageOpenButton
              },
            })
            var _e = e(
              './components/subtitlesettings/subtitlesettingspanelpage',
            )
            Object.defineProperty(n, 'SubtitleSettingsPanelPage', {
              enumerable: !0,
              get: function () {
                return _e.SubtitleSettingsPanelPage
              },
            })
            var we = e('./components/settingspanelitem')
            Object.defineProperty(n, 'SettingsPanelItem', {
              enumerable: !0,
              get: function () {
                return we.SettingsPanelItem
              },
            }),
              'function' != typeof Object.assign &&
                (Object.assign = function (e) {
                  if (null == e)
                    throw new TypeError(
                      'Cannot convert undefined or null to object',
                    )
                  e = Object(e)
                  for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t]
                    if (null != n)
                      for (var o in n)
                        Object.prototype.hasOwnProperty.call(n, o) &&
                          (e[o] = n[o])
                  }
                  return e
                })
          },
          {
            './arrayutils': 1,
            './browserutils': 3,
            './components/adclickoverlay': 4,
            './components/admessagelabel': 5,
            './components/adskipbutton': 6,
            './components/airplaytogglebutton': 7,
            './components/audioqualityselectbox': 8,
            './components/audiotracklistbox': 9,
            './components/audiotrackselectbox': 10,
            './components/bufferingoverlay': 11,
            './components/button': 12,
            './components/caststatusoverlay': 13,
            './components/casttogglebutton': 14,
            './components/castuicontainer': 15,
            './components/clickoverlay': 16,
            './components/closebutton': 17,
            './components/component': 18,
            './components/container': 19,
            './components/controlbar': 20,
            './components/errormessageoverlay': 21,
            './components/fullscreentogglebutton': 22,
            './components/hugeplaybacktogglebutton': 23,
            './components/hugereplaybutton': 24,
            './components/itemselectionlist': 25,
            './components/label': 26,
            './components/listbox': 27,
            './components/metadatalabel': 29,
            './components/pictureinpicturetogglebutton': 30,
            './components/playbackspeedselectbox': 31,
            './components/playbacktimelabel': 32,
            './components/playbacktogglebutton': 33,
            './components/playbacktoggleoverlay': 34,
            './components/recommendationoverlay': 35,
            './components/seekbar': 36,
            './components/seekbarlabel': 38,
            './components/selectbox': 39,
            './components/settingspanel': 40,
            './components/settingspanelitem': 41,
            './components/settingspanelpage': 42,
            './components/settingspanelpagebackbutton': 43,
            './components/settingspanelpageopenbutton': 45,
            './components/settingstogglebutton': 46,
            './components/spacer': 47,
            './components/subtitlelistbox': 48,
            './components/subtitleoverlay': 49,
            './components/subtitleselectbox': 50,
            './components/subtitlesettings/backgroundcolorselectbox': 51,
            './components/subtitlesettings/backgroundopacityselectbox': 52,
            './components/subtitlesettings/characteredgeselectbox': 53,
            './components/subtitlesettings/fontcolorselectbox': 54,
            './components/subtitlesettings/fontfamilyselectbox': 55,
            './components/subtitlesettings/fontopacityselectbox': 56,
            './components/subtitlesettings/fontsizeselectbox': 57,
            './components/subtitlesettings/subtitlesettingselectbox': 58,
            './components/subtitlesettings/subtitlesettingslabel': 59,
            './components/subtitlesettings/subtitlesettingspanelpage': 61,
            './components/subtitlesettings/subtitlesettingsresetbutton': 62,
            './components/subtitlesettings/windowcolorselectbox': 63,
            './components/subtitlesettings/windowopacityselectbox': 64,
            './components/titlebar': 66,
            './components/togglebutton': 67,
            './components/uicontainer': 69,
            './components/videoqualityselectbox': 70,
            './components/volumecontrolbutton': 71,
            './components/volumeslider': 72,
            './components/volumetogglebutton': 73,
            './components/vrtogglebutton': 74,
            './components/watermark': 75,
            './demofactory': 76,
            './errorutils': 78,
            './playerutils': 86,
            './storageutils': 87,
            './stringutils': 88,
            './uifactory': 91,
            './uimanager': 92,
            './uiutils': 93,
          },
        ],
        86: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PlayerUtils = void 0)
            var o = e('./eventdispatcher'),
              i = e('./browserutils')
            !(function (e) {
              function t(e) {
                return e.isLive() && 0 !== e.getMaxTimeShift()
              }
              function n(e) {
                return e.hasEnded()
                  ? l.Finished
                  : e.isPlaying()
                  ? l.Playing
                  : e.isPaused()
                  ? l.Paused
                  : null != e.getSource()
                  ? l.Prepared
                  : l.Idle
              }
              function r(t) {
                var n = t.getCurrentTime()
                return t.isLive() ? n : n - e.getSeekableRangeStart(t, 0)
              }
              function s(e, t) {
                return (
                  void 0 === t && (t = 0),
                  (e.getSeekableRange() && e.getSeekableRange().start) || t
                )
              }
              function a(e) {
                if (!e.isLive()) return e.getSeekableRange()
                var t = -e.getTimeShift(),
                  n = -e.getMaxTimeShift(),
                  o = e.getCurrentTime()
                return {start: o - (n - t), end: o + t}
              }
              var l
              !(function (e) {
                ;(e[(e.Idle = 0)] = 'Idle'),
                  (e[(e.Prepared = 1)] = 'Prepared'),
                  (e[(e.Playing = 2)] = 'Playing'),
                  (e[(e.Paused = 3)] = 'Paused'),
                  (e[(e.Finished = 4)] = 'Finished')
              })((l = e.PlayerState || (e.PlayerState = {}))),
                (e.isTimeShiftAvailable = t),
                (e.getState = n),
                (e.getCurrentTimeRelativeToSeekableRange = r),
                (e.getSeekableRangeStart = s),
                (e.getSeekableRangeRespectingLive = a)
              var c = (function () {
                function t(e) {
                  var t = this
                  ;(this.timeShiftAvailabilityChangedEvent = new o.EventDispatcher()),
                    (this.player = e),
                    (this.timeShiftAvailable = void 0)
                  var n = function () {
                    t.detect()
                  }
                  e.on(e.exports.PlayerEvent.SourceLoaded, n),
                    e.on(e.exports.PlayerEvent.TimeChanged, n)
                }
                return (
                  (t.prototype.detect = function () {
                    if (this.player.isLive()) {
                      var t = e.isTimeShiftAvailable(this.player)
                      t !== this.timeShiftAvailable &&
                        (this.timeShiftAvailabilityChangedEvent.dispatch(
                          this.player,
                          {timeShiftAvailable: t},
                        ),
                        (this.timeShiftAvailable = t))
                    }
                  }),
                  Object.defineProperty(
                    t.prototype,
                    'onTimeShiftAvailabilityChanged',
                    {
                      get: function () {
                        return this.timeShiftAvailabilityChangedEvent.getEvent()
                      },
                      enumerable: !1,
                      configurable: !0,
                    },
                  ),
                  t
                )
              })()
              e.TimeShiftAvailabilityDetector = c
              var u = (function () {
                function e(e, t) {
                  var n = this
                  ;(this.liveChangedEvent = new o.EventDispatcher()),
                    (this.player = e),
                    (this.uimanager = t),
                    (this.live = void 0)
                  var r = function () {
                    n.detect()
                  }
                  this.uimanager.getConfig().events.onUpdated.subscribe(r),
                    e.on(e.exports.PlayerEvent.Play, r),
                    i.BrowserUtils.isAndroid &&
                      i.BrowserUtils.isChrome &&
                      e.on(e.exports.PlayerEvent.TimeChanged, r),
                    e.exports.PlayerEvent.DurationChanged &&
                      e.on(e.exports.PlayerEvent.DurationChanged, r),
                    e.on(e.exports.PlayerEvent.AdBreakStarted, r),
                    e.on(e.exports.PlayerEvent.AdBreakFinished, r)
                }
                return (
                  (e.prototype.detect = function () {
                    var e = this.player.isLive()
                    e !== this.live &&
                      (this.liveChangedEvent.dispatch(this.player, {live: e}),
                      (this.live = e))
                  }),
                  Object.defineProperty(e.prototype, 'onLiveChanged', {
                    get: function () {
                      return this.liveChangedEvent.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  e
                )
              })()
              e.LiveStreamDetector = u
            })(n.PlayerUtils || (n.PlayerUtils = {}))
          },
          {'./browserutils': 3, './eventdispatcher': 79},
        ],
        87: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.StorageUtils = void 0)
            !(function (e) {
              function t() {
                if (s) return s
                var e = {length: 0}
                try {
                  e = window.localStorage
                  var t = '__storage_test__'
                  e.setItem(t, t), e.removeItem(t), (s = !0)
                } catch (t) {
                  s =
                    t instanceof DOMException &&
                    (22 === t.code ||
                      1014 === t.code ||
                      'QuotaExceededError' === t.name ||
                      'NS_ERROR_DOM_QUOTA_REACHED' === t.name) &&
                    0 !== e.length
                }
                return s
              }
              function n(t, n) {
                e.hasLocalStorage() && window.localStorage.setItem(t, n)
              }
              function o(t) {
                return e.hasLocalStorage()
                  ? window.localStorage.getItem(t)
                  : null
              }
              function i(t, o) {
                if (e.hasLocalStorage()) {
                  n(t, JSON.stringify(o))
                }
              }
              function r(t) {
                if (e.hasLocalStorage()) {
                  var n = o(t)
                  if (t) {
                    return JSON.parse(n)
                  }
                }
                return null
              }
              var s
              ;(e.hasLocalStorage = t),
                (e.setItem = n),
                (e.getItem = o),
                (e.setObject = i),
                (e.getObject = r)
            })(n.StorageUtils || (n.StorageUtils = {}))
          },
          {},
        ],
        88: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.StringUtils = void 0)
            var o = e('./localization/i18n')
            !(function (e) {
              function t(t, n) {
                void 0 === n && (n = e.FORMAT_HHMMSS)
                var o = t < 0
                o && (t = -t)
                var r = Math.floor(t / 3600),
                  s = Math.floor(t / 60) - 60 * r,
                  a = Math.floor(t) % 60
                return (
                  (o ? '-' : '') +
                  n
                    .replace('hh', i(r, 2))
                    .replace('mm', i(s, 2))
                    .replace('ss', i(a, 2))
                )
              }
              function n(e) {
                var t = e < 0
                t && (e = -e)
                var n = Math.floor(e / 3600),
                  r = Math.floor(e / 60) - 60 * n,
                  s = Math.floor(e) % 60
                return (
                  (t ? '-' : '') +
                  (0 !== n
                    ? i(n, 2) +
                      ' ' +
                      o.i18n.performLocalization(
                        o.i18n.getLocalizer('settings.time.hours'),
                      ) +
                      ' '
                    : '') +
                  (0 !== r
                    ? i(r, 2) +
                      ' ' +
                      o.i18n.performLocalization(
                        o.i18n.getLocalizer('settings.time.minutes'),
                      ) +
                      ' '
                    : '') +
                  i(s, 2) +
                  ' ' +
                  o.i18n.performLocalization(
                    o.i18n.getLocalizer('settings.time.seconds'),
                  )
                )
              }
              function i(e, t) {
                var n = e + ''
                return '0000000000'.substr(0, t - n.length) + n
              }
              function r(e, t, n) {
                var o = new RegExp(
                  '\\{(remainingTime|playedTime|adDuration)(}|%((0[1-9]\\d*(\\.\\d+(d|f)|d|f)|\\.\\d+f|d|f)|hh:mm:ss|mm:ss)})',
                  'g',
                )
                return e.replace(o, function (e) {
                  var o = 0
                  return (
                    e.indexOf('remainingTime') > -1
                      ? (o = t
                          ? Math.ceil(t - n.getCurrentTime())
                          : n.getDuration() - n.getCurrentTime())
                      : e.indexOf('playedTime') > -1
                      ? (o = n.getCurrentTime())
                      : e.indexOf('adDuration') > -1 && (o = n.getDuration()),
                    s(o, e)
                  )
                })
              }
              function s(e, n) {
                var o = /%((0[1-9]\d*(\.\d+(d|f)|d|f)|\.\d+f|d|f)|hh:mm:ss|mm:ss)/,
                  r = /(%0[1-9]\d*)(?=(\.\d+f|f|d))/,
                  s = /\.\d*(?=f)/
                o.test(n) || (n = '%d')
                var a = 0,
                  l = n.match(r)
                l && (a = parseInt(l[0].substring(2)))
                var c = null,
                  u = n.match(s)
                if (
                  (u &&
                    !isNaN(parseInt(u[0].substring(1))) &&
                    (c = parseInt(u[0].substring(1))) > 20 &&
                    (c = 20),
                  n.indexOf('f') > -1)
                ) {
                  var p = ''
                  return (
                    (p = null !== c ? e.toFixed(c) : '' + e),
                    p.indexOf('.') > -1
                      ? i(p, p.length + (a - p.indexOf('.')))
                      : i(p, a)
                  )
                }
                if (n.indexOf(':') > -1) {
                  var f = Math.ceil(e)
                  if (n.indexOf('hh') > -1) return t(f)
                  var g = Math.floor(f / 60),
                    d = f % 60
                  return i(g, 2) + ':' + i(d, 2)
                }
                return i(Math.ceil(e), a)
              }
              ;(e.FORMAT_HHMMSS = 'hh:mm:ss'),
                (e.FORMAT_MMSS = 'mm:ss'),
                (e.secondsToTime = t),
                (e.secondsToText = n),
                (e.replaceAdMessagePlaceholders = r)
            })(n.StringUtils || (n.StringUtils = {}))
          },
          {'./localization/i18n': 82},
        ],
        89: [
          function (e, t, n) {
            'use strict'
            var o =
              (this && this.__spreadArrays) ||
              function () {
                for (var e = 0, t = 0, n = arguments.length; t < n; t++)
                  e += arguments[t].length
                for (var o = Array(e), i = 0, t = 0; t < n; t++)
                  for (
                    var r = arguments[t], s = 0, a = r.length;
                    s < a;
                    s++, i++
                  )
                    o[i] = r[s]
                return o
              }
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.SubtitleSwitchHandler = void 0)
            var i = e('./localization/i18n'),
              r = (function () {
                function e(t, n, r) {
                  var s = this
                  ;(this.addSubtitle = function (e) {
                    var t = e.subtitle
                    s.listElement.hasItem(t.id) ||
                      s.listElement.addItem(t.id, t.label)
                  }),
                    (this.removeSubtitle = function (e) {
                      var t = e.subtitle
                      s.listElement.hasItem(t.id) &&
                        s.listElement.removeItem(t.id)
                    }),
                    (this.selectCurrentSubtitle = function () {
                      if (s.player.subtitles) {
                        var t = s.player.subtitles
                          .list()
                          .filter(function (e) {
                            return e.enabled
                          })
                          .pop()
                        s.listElement.selectItem(t ? t.id : e.SUBTITLES_OFF_KEY)
                      }
                    }),
                    (this.clearSubtitles = function () {
                      s.listElement.clearItems()
                    }),
                    (this.refreshSubtitles = function () {
                      if (s.player.subtitles) {
                        var t = {
                            key: e.SUBTITLES_OFF_KEY,
                            label: i.i18n.getLocalizer('off'),
                          },
                          n = s.player.subtitles.list(),
                          r = function (e) {
                            return {key: e.id, label: e.label}
                          }
                        s.listElement.synchronizeItems(o([t], n.map(r))),
                          s.selectCurrentSubtitle()
                      }
                    }),
                    (this.player = t),
                    (this.listElement = n),
                    (this.uimanager = r),
                    this.bindSelectionEvent(),
                    this.bindPlayerEvents(),
                    this.refreshSubtitles()
                }
                return (
                  (e.prototype.bindSelectionEvent = function () {
                    var t = this
                    this.listElement.onItemSelected.subscribe(function (n, o) {
                      if (o === e.SUBTITLES_OFF_KEY) {
                        var i = t.player.subtitles
                          .list()
                          .filter(function (e) {
                            return e.enabled
                          })
                          .pop()
                        i && t.player.subtitles.disable(i.id)
                      } else t.player.subtitles.enable(o, !0)
                    })
                  }),
                  (e.prototype.bindPlayerEvents = function () {
                    this.player.on(
                      this.player.exports.PlayerEvent.SubtitleAdded,
                      this.addSubtitle,
                    ),
                      this.player.on(
                        this.player.exports.PlayerEvent.SubtitleEnabled,
                        this.selectCurrentSubtitle,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.SubtitleDisabled,
                        this.selectCurrentSubtitle,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.SubtitleRemoved,
                        this.removeSubtitle,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.SourceUnloaded,
                        this.clearSubtitles,
                      ),
                      this.player.on(
                        this.player.exports.PlayerEvent.PeriodSwitched,
                        this.refreshSubtitles,
                      ),
                      this.uimanager
                        .getConfig()
                        .events.onUpdated.subscribe(this.refreshSubtitles)
                  }),
                  (e.SUBTITLES_OFF_KEY = 'null'),
                  e
                )
              })()
            n.SubtitleSwitchHandler = r
          },
          {'./localization/i18n': 82},
        ],
        90: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.Timeout = void 0)
            var o = (function () {
              function e(e, t, n) {
                void 0 === n && (n = !1),
                  (this.delay = e),
                  (this.callback = t),
                  (this.repeat = n),
                  (this.timeoutOrIntervalId = 0),
                  (this.active = !1)
              }
              return (
                (e.prototype.start = function () {
                  return this.reset(), this
                }),
                (e.prototype.clear = function () {
                  this.clearInternal()
                }),
                (e.prototype.reset = function () {
                  var e = this
                  this.clearInternal(),
                    this.repeat
                      ? (this.timeoutOrIntervalId = setInterval(
                          this.callback,
                          this.delay,
                        ))
                      : (this.timeoutOrIntervalId = setTimeout(function () {
                          ;(e.active = !1), e.callback()
                        }, this.delay)),
                    (this.active = !0)
                }),
                (e.prototype.isActive = function () {
                  return this.active
                }),
                (e.prototype.clearInternal = function () {
                  this.repeat
                    ? clearInterval(this.timeoutOrIntervalId)
                    : clearTimeout(this.timeoutOrIntervalId),
                    (this.active = !1)
                }),
                e
              )
            })()
            n.Timeout = o
          },
          {},
        ],
        91: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.UIFactory = void 0)
            var o = e('./components/subtitleoverlay'),
              i = e('./components/settingspanelpage'),
              r = e('./components/settingspanelitem'),
              s = e('./components/videoqualityselectbox'),
              a = e('./components/playbackspeedselectbox'),
              l = e('./components/audiotrackselectbox'),
              c = e('./components/audioqualityselectbox'),
              u = e('./components/settingspanel'),
              p = e('./components/subtitlesettings/subtitlesettingspanelpage'),
              f = e('./components/settingspanelpageopenbutton'),
              g = e('./components/subtitlesettings/subtitlesettingslabel'),
              d = e('./components/subtitleselectbox'),
              h = e('./components/controlbar'),
              m = e('./components/container'),
              v = e('./components/playbacktimelabel'),
              y = e('./components/seekbar'),
              b = e('./components/seekbarlabel'),
              P = e('./components/playbacktogglebutton'),
              C = e('./components/volumetogglebutton'),
              S = e('./components/volumeslider'),
              _ = e('./components/spacer'),
              w = e('./components/pictureinpicturetogglebutton'),
              O = e('./components/airplaytogglebutton'),
              k = e('./components/casttogglebutton'),
              x = e('./components/vrtogglebutton'),
              E = e('./components/settingstogglebutton'),
              T = e('./components/fullscreentogglebutton'),
              M = e('./components/uicontainer'),
              L = e('./components/bufferingoverlay'),
              I = e('./components/playbacktoggleoverlay'),
              A = e('./components/caststatusoverlay'),
              B = e('./components/titlebar'),
              j = e('./components/recommendationoverlay'),
              D = e('./components/watermark'),
              U = e('./components/errormessageoverlay'),
              z = e('./components/adclickoverlay'),
              R = e('./components/admessagelabel'),
              V = e('./components/adskipbutton'),
              H = e('./components/closebutton'),
              F = e('./components/metadatalabel'),
              N = e('./playerutils'),
              W = e('./components/label'),
              q = e('./components/castuicontainer'),
              K = e('./uimanager'),
              Q = e('./localization/i18n')
            !(function (e) {
              function t(t, n) {
                return void 0 === n && (n = {}), e.buildModernUI(t, n)
              }
              function n(t, n) {
                return (
                  void 0 === n && (n = {}), e.buildModernSmallScreenUI(t, n)
                )
              }
              function G(t, n) {
                return (
                  void 0 === n && (n = {}), e.buildModernCastReceiverUI(t, n)
                )
              }
              function Y() {
                var e = new o.SubtitleOverlay(),
                  t = new i.SettingsPanelPage({
                    components: [
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('settings.video.quality'),
                        new s.VideoQualitySelectBox(),
                      ),
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('speed'),
                        new a.PlaybackSpeedSelectBox(),
                      ),
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('settings.audio.track'),
                        new l.AudioTrackSelectBox(),
                      ),
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('settings.audio.quality'),
                        new c.AudioQualitySelectBox(),
                      ),
                    ],
                  }),
                  n = new u.SettingsPanel({components: [t], hidden: !0}),
                  z = new p.SubtitleSettingsPanelPage({
                    settingsPanel: n,
                    overlay: e,
                  }),
                  R = new d.SubtitleSelectBox(),
                  V = new f.SettingsPanelPageOpenButton({
                    targetPage: z,
                    container: n,
                    ariaLabel: Q.i18n.getLocalizer('settings.subtitles'),
                    text: Q.i18n.getLocalizer('open'),
                  })
                t.addComponent(
                  new r.SettingsPanelItem(
                    new g.SubtitleSettingsLabel({
                      text: Q.i18n.getLocalizer('settings.subtitles'),
                      opener: V,
                    }),
                    R,
                    {role: 'menubar'},
                  ),
                ),
                  n.addComponent(z)
                var H = new h.ControlBar({
                  components: [
                    n,
                    new m.Container({
                      components: [
                        new v.PlaybackTimeLabel({
                          timeLabelMode: v.PlaybackTimeLabelMode.CurrentTime,
                          hideInLivePlayback: !0,
                        }),
                        new y.SeekBar({label: new b.SeekBarLabel()}),
                        new v.PlaybackTimeLabel({
                          timeLabelMode: v.PlaybackTimeLabelMode.TotalTime,
                          cssClasses: ['text-right'],
                        }),
                      ],
                      cssClasses: ['controlbar-top'],
                    }),
                    new m.Container({
                      components: [
                        new P.PlaybackToggleButton(),
                        new C.VolumeToggleButton(),
                        new S.VolumeSlider(),
                        new _.Spacer(),
                        new w.PictureInPictureToggleButton(),
                        new O.AirPlayToggleButton(),
                        new k.CastToggleButton(),
                        new x.VRToggleButton(),
                        new E.SettingsToggleButton({settingsPanel: n}),
                        new T.FullscreenToggleButton(),
                      ],
                      cssClasses: ['controlbar-bottom'],
                    }),
                  ],
                })
                return new M.UIContainer({
                  components: [
                    e,
                    new L.BufferingOverlay(),
                    new I.PlaybackToggleOverlay(),
                    new A.CastStatusOverlay(),
                    H,
                    new B.TitleBar(),
                    new j.RecommendationOverlay(),
                    new D.Watermark(),
                    new U.ErrorMessageOverlay(),
                  ],
                  hideDelay: 2e3,
                  hidePlayerStateExceptions: [
                    N.PlayerUtils.PlayerState.Prepared,
                    N.PlayerUtils.PlayerState.Paused,
                    N.PlayerUtils.PlayerState.Finished,
                  ],
                })
              }
              function X() {
                return new M.UIContainer({
                  components: [
                    new L.BufferingOverlay(),
                    new z.AdClickOverlay(),
                    new I.PlaybackToggleOverlay(),
                    new m.Container({
                      components: [
                        new R.AdMessageLabel({
                          text: Q.i18n.getLocalizer('ads.remainingTime'),
                        }),
                        new V.AdSkipButton(),
                      ],
                      cssClass: 'ui-ads-status',
                    }),
                    new h.ControlBar({
                      components: [
                        new m.Container({
                          components: [
                            new P.PlaybackToggleButton(),
                            new C.VolumeToggleButton(),
                            new S.VolumeSlider(),
                            new _.Spacer(),
                            new T.FullscreenToggleButton(),
                          ],
                          cssClasses: ['controlbar-bottom'],
                        }),
                      ],
                    }),
                  ],
                  cssClasses: ['ui-skin-ads'],
                  hideDelay: 2e3,
                  hidePlayerStateExceptions: [
                    N.PlayerUtils.PlayerState.Prepared,
                    N.PlayerUtils.PlayerState.Paused,
                    N.PlayerUtils.PlayerState.Finished,
                  ],
                })
              }
              function J() {
                var e = new o.SubtitleOverlay(),
                  t = new i.SettingsPanelPage({
                    components: [
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('settings.video.quality'),
                        new s.VideoQualitySelectBox(),
                      ),
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('speed'),
                        new a.PlaybackSpeedSelectBox(),
                      ),
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('settings.audio.track'),
                        new l.AudioTrackSelectBox(),
                      ),
                      new r.SettingsPanelItem(
                        Q.i18n.getLocalizer('settings.audio.quality'),
                        new c.AudioQualitySelectBox(),
                      ),
                    ],
                  }),
                  n = new u.SettingsPanel({
                    components: [t],
                    hidden: !0,
                    pageTransitionAnimation: !1,
                    hideDelay: -1,
                  }),
                  P = new p.SubtitleSettingsPanelPage({
                    settingsPanel: n,
                    overlay: e,
                  }),
                  S = new f.SettingsPanelPageOpenButton({
                    targetPage: P,
                    container: n,
                    ariaLabel: Q.i18n.getLocalizer('settings.subtitles'),
                    text: Q.i18n.getLocalizer('open'),
                  }),
                  _ = new d.SubtitleSelectBox()
                t.addComponent(
                  new r.SettingsPanelItem(
                    new g.SubtitleSettingsLabel({
                      text: Q.i18n.getLocalizer('settings.subtitles'),
                      opener: S,
                    }),
                    _,
                    {role: 'menubar'},
                  ),
                ),
                  n.addComponent(P),
                  n.addComponent(new H.CloseButton({target: n})),
                  P.addComponent(new H.CloseButton({target: n}))
                var z = new h.ControlBar({
                  components: [
                    new m.Container({
                      components: [
                        new v.PlaybackTimeLabel({
                          timeLabelMode: v.PlaybackTimeLabelMode.CurrentTime,
                          hideInLivePlayback: !0,
                        }),
                        new y.SeekBar({label: new b.SeekBarLabel()}),
                        new v.PlaybackTimeLabel({
                          timeLabelMode: v.PlaybackTimeLabelMode.TotalTime,
                          cssClasses: ['text-right'],
                        }),
                      ],
                      cssClasses: ['controlbar-top'],
                    }),
                  ],
                })
                return new M.UIContainer({
                  components: [
                    e,
                    new L.BufferingOverlay(),
                    new A.CastStatusOverlay(),
                    new I.PlaybackToggleOverlay(),
                    new j.RecommendationOverlay(),
                    z,
                    new B.TitleBar({
                      components: [
                        new F.MetadataLabel({
                          content: F.MetadataLabelContent.Title,
                        }),
                        new k.CastToggleButton(),
                        new x.VRToggleButton(),
                        new w.PictureInPictureToggleButton(),
                        new O.AirPlayToggleButton(),
                        new C.VolumeToggleButton(),
                        new E.SettingsToggleButton({settingsPanel: n}),
                        new T.FullscreenToggleButton(),
                      ],
                    }),
                    n,
                    new D.Watermark(),
                    new U.ErrorMessageOverlay(),
                  ],
                  cssClasses: ['ui-skin-smallscreen'],
                  hideDelay: 2e3,
                  hidePlayerStateExceptions: [
                    N.PlayerUtils.PlayerState.Prepared,
                    N.PlayerUtils.PlayerState.Paused,
                    N.PlayerUtils.PlayerState.Finished,
                  ],
                })
              }
              function Z() {
                return new M.UIContainer({
                  components: [
                    new L.BufferingOverlay(),
                    new z.AdClickOverlay(),
                    new I.PlaybackToggleOverlay(),
                    new B.TitleBar({
                      components: [
                        new W.Label({cssClass: 'label-metadata-title'}),
                        new T.FullscreenToggleButton(),
                      ],
                    }),
                    new m.Container({
                      components: [
                        new R.AdMessageLabel({
                          text: 'Ad: {remainingTime} secs',
                        }),
                        new V.AdSkipButton(),
                      ],
                      cssClass: 'ui-ads-status',
                    }),
                  ],
                  cssClasses: ['ui-skin-ads', 'ui-skin-smallscreen'],
                  hideDelay: 2e3,
                  hidePlayerStateExceptions: [
                    N.PlayerUtils.PlayerState.Prepared,
                    N.PlayerUtils.PlayerState.Paused,
                    N.PlayerUtils.PlayerState.Finished,
                  ],
                })
              }
              function $() {
                var e = new h.ControlBar({
                  components: [
                    new m.Container({
                      components: [
                        new v.PlaybackTimeLabel({
                          timeLabelMode: v.PlaybackTimeLabelMode.CurrentTime,
                          hideInLivePlayback: !0,
                        }),
                        new y.SeekBar({
                          smoothPlaybackPositionUpdateIntervalMs: -1,
                        }),
                        new v.PlaybackTimeLabel({
                          timeLabelMode: v.PlaybackTimeLabelMode.TotalTime,
                          cssClasses: ['text-right'],
                        }),
                      ],
                      cssClasses: ['controlbar-top'],
                    }),
                  ],
                })
                return new q.CastUIContainer({
                  components: [
                    new o.SubtitleOverlay(),
                    new L.BufferingOverlay(),
                    new I.PlaybackToggleOverlay(),
                    new D.Watermark(),
                    e,
                    new B.TitleBar({keepHiddenWithoutMetadata: !0}),
                    new U.ErrorMessageOverlay(),
                  ],
                  cssClasses: ['ui-skin-cast-receiver'],
                  hideDelay: 2e3,
                  hidePlayerStateExceptions: [
                    N.PlayerUtils.PlayerState.Prepared,
                    N.PlayerUtils.PlayerState.Paused,
                    N.PlayerUtils.PlayerState.Finished,
                  ],
                })
              }
              function ee(e, t) {
                void 0 === t && (t = {})
                return new K.UIManager(
                  e,
                  [
                    {
                      ui: Z(),
                      condition: function (e) {
                        return (
                          e.isMobile &&
                          e.documentWidth < 600 &&
                          e.isAd &&
                          e.adRequiresUi
                        )
                      },
                    },
                    {
                      ui: X(),
                      condition: function (e) {
                        return e.isAd && e.adRequiresUi
                      },
                    },
                    {
                      ui: J(),
                      condition: function (e) {
                        return (
                          !e.isAd &&
                          !e.adRequiresUi &&
                          e.isMobile &&
                          e.documentWidth < 600
                        )
                      },
                    },
                    {
                      ui: Y(),
                      condition: function (e) {
                        return !e.isAd && !e.adRequiresUi
                      },
                    },
                  ],
                  t,
                )
              }
              function te(e, t) {
                return (
                  void 0 === t && (t = {}),
                  new K.UIManager(
                    e,
                    [
                      {
                        ui: Z(),
                        condition: function (e) {
                          return e.isAd && e.adRequiresUi
                        },
                      },
                      {
                        ui: J(),
                        condition: function (e) {
                          return !e.isAd && !e.adRequiresUi
                        },
                      },
                    ],
                    t,
                  )
                )
              }
              function ne(e, t) {
                return void 0 === t && (t = {}), new K.UIManager(e, $(), t)
              }
              ;(e.buildDefaultUI = t),
                (e.buildDefaultSmallScreenUI = n),
                (e.buildDefaultCastReceiverUI = G),
                (e.modernUI = Y),
                (e.modernAdsUI = X),
                (e.modernSmallScreenUI = J),
                (e.modernSmallScreenAdsUI = Z),
                (e.modernCastReceiverUI = $),
                (e.buildModernUI = ee),
                (e.buildModernSmallScreenUI = te),
                (e.buildModernCastReceiverUI = ne)
            })(n.UIFactory || (n.UIFactory = {}))
          },
          {
            './components/adclickoverlay': 4,
            './components/admessagelabel': 5,
            './components/adskipbutton': 6,
            './components/airplaytogglebutton': 7,
            './components/audioqualityselectbox': 8,
            './components/audiotrackselectbox': 10,
            './components/bufferingoverlay': 11,
            './components/caststatusoverlay': 13,
            './components/casttogglebutton': 14,
            './components/castuicontainer': 15,
            './components/closebutton': 17,
            './components/container': 19,
            './components/controlbar': 20,
            './components/errormessageoverlay': 21,
            './components/fullscreentogglebutton': 22,
            './components/label': 26,
            './components/metadatalabel': 29,
            './components/pictureinpicturetogglebutton': 30,
            './components/playbackspeedselectbox': 31,
            './components/playbacktimelabel': 32,
            './components/playbacktogglebutton': 33,
            './components/playbacktoggleoverlay': 34,
            './components/recommendationoverlay': 35,
            './components/seekbar': 36,
            './components/seekbarlabel': 38,
            './components/settingspanel': 40,
            './components/settingspanelitem': 41,
            './components/settingspanelpage': 42,
            './components/settingspanelpageopenbutton': 45,
            './components/settingstogglebutton': 46,
            './components/spacer': 47,
            './components/subtitleoverlay': 49,
            './components/subtitleselectbox': 50,
            './components/subtitlesettings/subtitlesettingslabel': 59,
            './components/subtitlesettings/subtitlesettingspanelpage': 61,
            './components/titlebar': 66,
            './components/uicontainer': 69,
            './components/videoqualityselectbox': 70,
            './components/volumeslider': 72,
            './components/volumetogglebutton': 73,
            './components/vrtogglebutton': 74,
            './components/watermark': 75,
            './localization/i18n': 82,
            './playerutils': 86,
            './uimanager': 92,
          },
        ],
        92: [
          function (e, t, n) {
            'use strict'
            function o(e) {
              for (var t = []; e; ) {
                var n = Object.getOwnPropertyNames(e).filter(function (e) {
                  return -1 === t.indexOf(e)
                })
                ;(t = t.concat(n)), (e = Object.getPrototypeOf(e))
              }
              return t
            }
            var i =
                (this && this.__extends) ||
                (function () {
                  var e = function (t, n) {
                    return (e =
                      Object.setPrototypeOf ||
                      ({__proto__: []} instanceof Array &&
                        function (e, t) {
                          e.__proto__ = t
                        }) ||
                      function (e, t) {
                        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                      })(t, n)
                  }
                  return function (t, n) {
                    function o() {
                      this.constructor = t
                    }
                    e(t, n),
                      (t.prototype =
                        null === n
                          ? Object.create(n)
                          : ((o.prototype = n.prototype), new o()))
                  }
                })(),
              r =
                (this && this.__assign) ||
                function () {
                  return (
                    (r =
                      Object.assign ||
                      function (e) {
                        for (var t, n = 1, o = arguments.length; n < o; n++) {
                          t = arguments[n]
                          for (var i in t)
                            Object.prototype.hasOwnProperty.call(t, i) &&
                              (e[i] = t[i])
                        }
                        return e
                      }),
                    r.apply(this, arguments)
                  )
                },
              s =
                (this && this.__spreadArrays) ||
                function () {
                  for (var e = 0, t = 0, n = arguments.length; t < n; t++)
                    e += arguments[t].length
                  for (var o = Array(e), i = 0, t = 0; t < n; t++)
                    for (
                      var r = arguments[t], s = 0, a = r.length;
                      s < a;
                      s++, i++
                    )
                      o[i] = r[s]
                  return o
                }
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.PlayerWrapper = n.UIInstanceManager = n.UIManager = void 0)
            var a = e('./components/uicontainer'),
              l = e('./dom'),
              c = e('./components/container'),
              u = e('./eventdispatcher'),
              p = e('./uiutils'),
              f = e('./arrayutils'),
              g = e('./browserutils'),
              d = e('./volumecontroller'),
              h = e('./localization/i18n'),
              m = (function () {
                function e(e, t, n) {
                  var o = this
                  if (
                    (void 0 === n && (n = {}),
                    (this.events = {
                      onUiVariantResolve: new u.EventDispatcher(),
                    }),
                    t instanceof a.UIContainer)
                  ) {
                    var i = t,
                      s = []
                    s.push({ui: i}), (this.uiVariants = s)
                  } else this.uiVariants = t
                  ;(this.player = e),
                    (this.managerPlayerWrapper = new b(e)),
                    (n.metadata = n.metadata ? n.metadata : {}),
                    (this.config = r(
                      r(
                        {
                          playbackSpeedSelectionEnabled: !0,
                          autoUiVariantResolve: !0,
                          disableAutoHideWhenHovered: !1,
                        },
                        n,
                      ),
                      {
                        events: {onUpdated: new u.EventDispatcher()},
                        volumeController: new d.VolumeController(
                          this.managerPlayerWrapper.getPlayer(),
                        ),
                      },
                    ))
                  var c = function () {
                    var t = e.getSource() || {}
                    o.config.metadata = JSON.parse(
                      JSON.stringify(n.metadata || {}),
                    )
                    var i = {
                      metadata: {
                        title: t.title,
                        description: t.description,
                        markers: t.markers,
                      },
                      recommendations: t.recommendations,
                    }
                    ;(o.config.metadata.title =
                      i.metadata.title || n.metadata.title),
                      (o.config.metadata.description =
                        i.metadata.description || n.metadata.description),
                      (o.config.metadata.markers =
                        i.metadata.markers || n.metadata.markers || []),
                      (o.config.recommendations =
                        i.recommendations || n.recommendations || [])
                  }
                  c(),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(
                        this.player.exports.PlayerEvent.SourceLoaded,
                        function () {
                          c(), o.config.events.onUpdated.dispatch(o)
                        },
                      ),
                    n.container
                      ? (this.uiContainerElement =
                          (n.container, HTMLElement, new l.DOM(n.container)))
                      : (this.uiContainerElement = new l.DOM(e.getContainer())),
                    (this.uiInstanceManagers = [])
                  for (
                    var p = [], f = 0, g = this.uiVariants;
                    f < g.length;
                    f++
                  ) {
                    var h = g[f]
                    null == h.condition && p.push(h),
                      this.uiInstanceManagers.push(new y(e, h.ui, this.config))
                  }
                  if (p.length > 1)
                    throw Error(
                      'Too many UIs without a condition: You cannot have more than one default UI',
                    )
                  if (
                    p.length > 0 &&
                    p[0] !== this.uiVariants[this.uiVariants.length - 1]
                  )
                    throw Error(
                      'Invalid UI variant order: the default UI (without condition) must be at the end of the list',
                    )
                  var m = null,
                    v = function (t) {
                      if (null != t)
                        switch (t.type) {
                          case e.exports.PlayerEvent.AdStarted:
                            m = t
                            break
                          case e.exports.PlayerEvent.AdBreakFinished:
                            ;(m = null), o.config.events.onUpdated.dispatch(o)
                            break
                          case e.exports.PlayerEvent.SourceLoaded:
                          case e.exports.PlayerEvent.SourceUnloaded:
                            m = null
                        }
                      var n = null != m,
                        i = !1
                      if (n) {
                        var r = m.ad
                        if (r.isLinear) {
                          var s = r
                          i = (s.uiConfig && s.uiConfig.requestsUi) || !1
                        }
                      }
                      i && o.config.events.onUpdated.dispatch(o),
                        o.resolveUiVariant(
                          {isAd: n, adRequiresUi: i},
                          function (e) {
                            e.isAd &&
                              o.currentUi
                                .getWrappedPlayer()
                                .fireEventInUI(
                                  o.player.exports.PlayerEvent.AdStarted,
                                  m,
                                )
                          },
                        )
                    }
                  this.config.autoUiVariantResolve &&
                    (this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.SourceLoaded, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.SourceUnloaded, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.Play, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.Paused, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.AdStarted, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.AdBreakFinished, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.PlayerResized, v),
                    this.managerPlayerWrapper
                      .getPlayer()
                      .on(this.player.exports.PlayerEvent.ViewModeChanged, v)),
                    v(null)
                }
                return (
                  (e.localize = function (e) {
                    return h.i18n.getLocalizer(e)
                  }),
                  (e.setLocalizationConfig = function (e) {
                    h.i18n.setConfig(e)
                  }),
                  (e.prototype.getConfig = function () {
                    return this.config
                  }),
                  (e.prototype.getUiVariants = function () {
                    return this.uiVariants
                  }),
                  (e.prototype.switchToUiVariant = function (e, t) {
                    var n = this.uiVariants.indexOf(e),
                      o = this.uiInstanceManagers[n],
                      i = !1
                    o !== this.currentUi && (i = !0),
                      i &&
                        (this.currentUi && this.currentUi.getUI().hide(),
                        (this.currentUi = o),
                        null != this.currentUi &&
                          (this.currentUi.isConfigured() ||
                            this.addUi(this.currentUi),
                          t && t(),
                          this.currentUi.getUI().show()))
                  }),
                  (e.prototype.resolveUiVariant = function (e, t) {
                    void 0 === e && (e = {})
                    var n = {
                        isAd: !1,
                        adRequiresUi: !1,
                        isFullscreen:
                          this.player.getViewMode() ===
                          this.player.exports.ViewMode.Fullscreen,
                        isMobile: g.BrowserUtils.isMobile,
                        isPlaying: this.player.isPlaying(),
                        width: this.uiContainerElement.width(),
                        documentWidth: document.body.clientWidth,
                      },
                      o = r(r({}, n), e)
                    this.events.onUiVariantResolve.dispatch(this, o)
                    for (
                      var i = null, s = 0, a = this.uiVariants;
                      s < a.length;
                      s++
                    ) {
                      var l = a[s]
                      if (null == l.condition || !0 === l.condition(o)) {
                        i = l
                        break
                      }
                    }
                    this.switchToUiVariant(i, function () {
                      t && t(o)
                    })
                  }),
                  (e.prototype.addUi = function (e) {
                    var t = e.getUI().getDomElement(),
                      n = e.getWrappedPlayer()
                    e.configureControls(),
                      this.uiContainerElement.append(t),
                      n.getSource() &&
                        this.config.events.onUpdated.dispatch(this),
                      window.requestAnimationFrame
                        ? requestAnimationFrame(function () {
                            e.onConfigured.dispatch(e.getUI())
                          })
                        : setTimeout(function () {
                            e.onConfigured.dispatch(e.getUI())
                          }, 0)
                  }),
                  (e.prototype.releaseUi = function (e) {
                    e.releaseControls(),
                      e.getUI().getDomElement().remove(),
                      e.clearEventHandlers()
                  }),
                  (e.prototype.release = function () {
                    for (
                      var e = 0, t = this.uiInstanceManagers;
                      e < t.length;
                      e++
                    ) {
                      var n = t[e]
                      this.releaseUi(n)
                    }
                    this.managerPlayerWrapper.clearEventHandlers()
                  }),
                  Object.defineProperty(e.prototype, 'onUiVariantResolve', {
                    get: function () {
                      return this.events.onUiVariantResolve
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.prototype.getTimelineMarkers = function () {
                    return this.config.metadata.markers
                  }),
                  (e.prototype.addTimelineMarker = function (e) {
                    this.config.metadata.markers.push(e),
                      this.config.events.onUpdated.dispatch(this)
                  }),
                  (e.prototype.removeTimelineMarker = function (e) {
                    return (
                      f.ArrayUtils.remove(this.config.metadata.markers, e) ===
                        e && (this.config.events.onUpdated.dispatch(this), !0)
                    )
                  }),
                  e
                )
              })()
            n.UIManager = m
            var v = (function () {
              function e(e, t, n) {
                ;(this.events = {
                  onConfigured: new u.EventDispatcher(),
                  onSeek: new u.EventDispatcher(),
                  onSeekPreview: new u.EventDispatcher(),
                  onSeeked: new u.EventDispatcher(),
                  onComponentShow: new u.EventDispatcher(),
                  onComponentHide: new u.EventDispatcher(),
                  onControlsShow: new u.EventDispatcher(),
                  onPreviewControlsHide: new u.EventDispatcher(),
                  onControlsHide: new u.EventDispatcher(),
                  onRelease: new u.EventDispatcher(),
                }),
                  (this.playerWrapper = new b(e)),
                  (this.ui = t),
                  (this.config = n)
              }
              return (
                (e.prototype.getConfig = function () {
                  return this.config
                }),
                (e.prototype.getUI = function () {
                  return this.ui
                }),
                (e.prototype.getPlayer = function () {
                  return this.playerWrapper.getPlayer()
                }),
                Object.defineProperty(e.prototype, 'onConfigured', {
                  get: function () {
                    return this.events.onConfigured
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onSeek', {
                  get: function () {
                    return this.events.onSeek
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onSeekPreview', {
                  get: function () {
                    return this.events.onSeekPreview
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onSeeked', {
                  get: function () {
                    return this.events.onSeeked
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onComponentShow', {
                  get: function () {
                    return this.events.onComponentShow
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onComponentHide', {
                  get: function () {
                    return this.events.onComponentHide
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onControlsShow', {
                  get: function () {
                    return this.events.onControlsShow
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onPreviewControlsHide', {
                  get: function () {
                    return this.events.onPreviewControlsHide
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onControlsHide', {
                  get: function () {
                    return this.events.onControlsHide
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                Object.defineProperty(e.prototype, 'onRelease', {
                  get: function () {
                    return this.events.onRelease
                  },
                  enumerable: !1,
                  configurable: !0,
                }),
                (e.prototype.clearEventHandlers = function () {
                  this.playerWrapper.clearEventHandlers()
                  var e = this.events
                  for (var t in e) {
                    e[t].unsubscribeAll()
                  }
                }),
                e
              )
            })()
            n.UIInstanceManager = v
            var y = (function (e) {
                function t() {
                  return (null !== e && e.apply(this, arguments)) || this
                }
                return (
                  i(t, e),
                  (t.prototype.getWrappedPlayer = function () {
                    return this.getPlayer()
                  }),
                  (t.prototype.configureControls = function () {
                    this.configureControlsTree(this.getUI()),
                      (this.configured = !0)
                  }),
                  (t.prototype.isConfigured = function () {
                    return this.configured
                  }),
                  (t.prototype.configureControlsTree = function (e) {
                    var t = this,
                      n = []
                    p.UIUtils.traverseTree(e, function (e) {
                      for (var o = 0, i = n; o < i.length; o++) {
                        if (i[o] === e)
                          throw (
                            (console &&
                              console.error('Circular reference in UI tree', e),
                            Error(
                              'Circular reference in UI tree: ' +
                                e.constructor.name,
                            ))
                          )
                      }
                      e.initialize(), e.configure(t.getPlayer(), t), n.push(e)
                    })
                  }),
                  (t.prototype.releaseControls = function () {
                    this.configured &&
                      (this.onRelease.dispatch(this.getUI()),
                      this.releaseControlsTree(this.getUI()),
                      (this.configured = !1)),
                      (this.released = !0)
                  }),
                  (t.prototype.isReleased = function () {
                    return this.released
                  }),
                  (t.prototype.releaseControlsTree = function (e) {
                    if ((e.release(), e instanceof c.Container))
                      for (
                        var t = 0, n = e.getComponents();
                        t < n.length;
                        t++
                      ) {
                        var o = n[t]
                        this.releaseControlsTree(o)
                      }
                  }),
                  (t.prototype.clearEventHandlers = function () {
                    e.prototype.clearEventHandlers.call(this)
                  }),
                  t
                )
              })(v),
              b = (function () {
                function e(e) {
                  var t = this
                  ;(this.eventHandlers = {}), (this.player = e)
                  for (
                    var n = Object.getOwnPropertyNames(
                        Object.getPrototypeOf({}),
                      ),
                      i = s(['constructor'], n),
                      r = o(e).filter(function (e) {
                        return -1 === i.indexOf(e)
                      }),
                      a = [],
                      l = [],
                      c = 0,
                      u = r;
                    c < u.length;
                    c++
                  ) {
                    var p = u[c]
                    'function' == typeof e[p] ? a.push(p) : l.push(p)
                  }
                  for (var g = {}, d = 0, h = a; d < h.length; d++) {
                    var m = h[d]
                    !(function (t) {
                      g[t] = function () {
                        return e[t].apply(e, arguments)
                      }
                    })(m)
                  }
                  for (var v = 0, y = l; v < y.length; v++) {
                    var b = y[v]
                    !(function (t) {
                      var n = (function (e) {
                        for (; e; ) {
                          var n = Object.getOwnPropertyDescriptor(e, t)
                          if (n) return n
                          e = Object.getPrototypeOf(e)
                        }
                      })(e)
                      n && (n.get || n.set)
                        ? Object.defineProperty(g, t, {
                            get: function () {
                              return n.get.call(e)
                            },
                            set: function (t) {
                              return n.set.call(e, t)
                            },
                          })
                        : (g[t] = e[t])
                    })(b)
                  }
                  ;(g.on = function (n, o) {
                    return (
                      e.on(n, o),
                      t.eventHandlers[n] || (t.eventHandlers[n] = []),
                      t.eventHandlers[n].push(o),
                      g
                    )
                  }),
                    (g.off = function (n, o) {
                      return (
                        e.off(n, o),
                        t.eventHandlers[n] &&
                          f.ArrayUtils.remove(t.eventHandlers[n], o),
                        g
                      )
                    }),
                    (g.fireEventInUI = function (e, n) {
                      if (t.eventHandlers[e])
                        for (
                          var o = Object.assign(
                              {},
                              {timestamp: Date.now(), type: e, uiSourced: !0},
                              n,
                            ),
                            i = 0,
                            r = t.eventHandlers[e];
                          i < r.length;
                          i++
                        ) {
                          var s = r[i]
                          s(o)
                        }
                    }),
                    (this.wrapper = g)
                }
                return (
                  (e.prototype.getPlayer = function () {
                    return this.wrapper
                  }),
                  (e.prototype.clearEventHandlers = function () {
                    try {
                      this.player.getSource()
                    } catch (e) {
                      e instanceof
                        this.player.exports.PlayerAPINotAvailableError &&
                        (this.eventHandlers = {})
                    }
                    for (var e in this.eventHandlers)
                      for (
                        var t = 0, n = this.eventHandlers[e];
                        t < n.length;
                        t++
                      ) {
                        var o = n[t]
                        this.player.off(e, o)
                      }
                  }),
                  e
                )
              })()
            n.PlayerWrapper = b
          },
          {
            './arrayutils': 1,
            './browserutils': 3,
            './components/container': 19,
            './components/uicontainer': 69,
            './dom': 77,
            './eventdispatcher': 79,
            './localization/i18n': 82,
            './uiutils': 93,
            './volumecontroller': 94,
          },
        ],
        93: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.UIUtils = void 0)
            var o = e('./components/container')
            !(function (e) {
              function t(e, t) {
                var n = function (e, i) {
                  if ((t(e, i), e instanceof o.Container))
                    for (var r = 0, s = e.getComponents(); r < s.length; r++) {
                      var a = s[r]
                      n(a, e)
                    }
                }
                n(e)
              }
              e.traverseTree = t
              !(function (e) {
                ;(e[(e.LeftArrow = 37)] = 'LeftArrow'),
                  (e[(e.UpArrow = 38)] = 'UpArrow'),
                  (e[(e.RightArrow = 39)] = 'RightArrow'),
                  (e[(e.DownArrow = 40)] = 'DownArrow'),
                  (e[(e.Space = 32)] = 'Space'),
                  (e[(e.End = 35)] = 'End'),
                  (e[(e.Home = 36)] = 'Home')
              })(e.KeyCode || (e.KeyCode = {}))
            })(n.UIUtils || (n.UIUtils = {}))
          },
          {'./components/container': 19},
        ],
        94: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VolumeTransition = n.VolumeController = void 0)
            var o = e('./eventdispatcher'),
              i = (function () {
                function e(e) {
                  var t = this
                  ;(this.player = e),
                    (this.events = {onChanged: new o.EventDispatcher()}),
                    this.storeVolume()
                  var n = function () {
                    t.onChangedEvent()
                  }
                  e.on(e.exports.PlayerEvent.SourceLoaded, n),
                    e.on(e.exports.PlayerEvent.VolumeChanged, n),
                    e.on(e.exports.PlayerEvent.Muted, n),
                    e.on(e.exports.PlayerEvent.Unmuted, n)
                }
                return (
                  (e.prototype.setVolume = function (t) {
                    this.player.setVolume(t, e.issuerName)
                  }),
                  (e.prototype.getVolume = function () {
                    return this.player.getVolume()
                  }),
                  (e.prototype.setMuted = function (t) {
                    t
                      ? this.player.mute(e.issuerName)
                      : this.player.unmute(e.issuerName)
                  }),
                  (e.prototype.toggleMuted = function () {
                    this.isMuted() || 0 === this.getVolume()
                      ? this.recallVolume()
                      : this.setMuted(!0)
                  }),
                  (e.prototype.isMuted = function () {
                    return this.player.isMuted()
                  }),
                  (e.prototype.storeVolume = function () {
                    this.storedVolume = this.getVolume()
                  }),
                  (e.prototype.recallVolume = function () {
                    this.setMuted(0 === this.storedVolume),
                      this.setVolume(this.storedVolume)
                  }),
                  (e.prototype.startTransition = function () {
                    return new r(this)
                  }),
                  (e.prototype.onChangedEvent = function () {
                    var e = this.isMuted(),
                      t = this.getVolume(),
                      n = e || 0 === t,
                      o = e ? 0 : t
                    this.events.onChanged.dispatch(this, {volume: o, muted: n})
                  }),
                  Object.defineProperty(e.prototype, 'onChanged', {
                    get: function () {
                      return this.events.onChanged.getEvent()
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (e.issuerName = 'ui-volumecontroller'),
                  e
                )
              })()
            n.VolumeController = i
            var r = (function () {
              function e(e) {
                ;(this.controller = e), e.storeVolume()
              }
              return (
                (e.prototype.update = function (e) {
                  this.controller.setMuted(!1), this.controller.setVolume(e)
                }),
                (e.prototype.finish = function (e) {
                  0 === e
                    ? (this.controller.recallVolume(),
                      this.controller.setMuted(!0))
                    : (this.controller.setMuted(!1),
                      this.controller.setVolume(e),
                      this.controller.storeVolume())
                }),
                e
              )
            })()
            n.VolumeTransition = r
          },
          {'./eventdispatcher': 79},
        ],
        95: [
          function (e, t, n) {
            'use strict'
            Object.defineProperty(n, '__esModule', {value: !0}),
              (n.VttUtils = void 0)
            var o
            !(function (e) {
              ;(e.Top = 'top'),
                (e.Bottom = 'bottom'),
                (e.Left = 'left'),
                (e.Right = 'right')
            })(o || (o = {}))
            var i = new Map([
                [o.Top, o.Bottom],
                [o.Left, o.Right],
                [o.Right, o.Left],
              ]),
              r = function (e, t) {
                t.region
                  ? (e.css('position', 'relative'),
                    e.css('unicode-bidi', 'plaintext'))
                  : (e.css('position', 'absolute'),
                    e.css('overflow-wrap', 'break-word'),
                    e.css('overflow', 'hidden'),
                    e.css('flex-flow', 'column')),
                  e.css('display', 'inline-flex')
              },
              s = function (e, t, n) {
                switch (t.lineAlign) {
                  case 'center':
                    e.css('margin-' + n, '-14px')
                    break
                  case 'end':
                    e.css('margin-' + n, '-28px')
                }
              },
              a = function (e, t, n, o) {
                if ('auto' !== t.line) {
                  var i = parseFloat(t.line)
                  if (t.snapToLines) {
                    var r = Number(t.line)
                    r < 0 && (r = 21 + r)
                    i = (100 * ((o.height / 21) * r)) / o.height
                  }
                  e.css(n, i + '%'), s(e, t, n)
                }
              },
              l = function (e, t, n) {
                '' === t.vertical
                  ? (e.css('writing-mode', 'horizontal-tb'),
                    e.css(o.Bottom, '0'),
                    a(e, t, o.Top, n))
                  : 'lr' === t.vertical
                  ? (e.css('writing-mode', 'vertical-lr'),
                    e.css(o.Right, '0'),
                    e.css(o.Top, '0'),
                    a(e, t, o.Right, n))
                  : 'rl' === t.vertical &&
                    (e.css('writing-mode', 'vertical-rl'),
                    e.css(o.Left, '0'),
                    e.css(o.Top, '0'),
                    a(e, t, o.Left, n))
              },
              c = function (e, t, n) {
                if ('auto' === t.position) e.css(n, '0')
                else
                  switch (t.positionAlign) {
                    case 'line-left':
                      e.css(n, t.position + '%'),
                        e.css(i.get(n), 'auto'),
                        e.css('justify-content', 'flex-start')
                      break
                    case 'center':
                      e.css(n, t.position - t.size / 2 + '%'),
                        e.css(i.get(n), 'auto'),
                        e.css('justify-content', 'center')
                      break
                    case 'line-right':
                      e.css(n, 'auto'),
                        e.css(i.get(n), t.position + '%'),
                        e.css('justify-content', 'flex-end')
                      break
                    default:
                      e.css(n, t.position + '%'),
                        e.css('justify-content', 'flex-start')
                  }
              }
            !(function (e) {
              ;(e.setVttCueBoxStyles = function (e, t) {
                var n = e.vtt,
                  i = e.getDomElement()
                r(i, n), l(i, n, t)
                var s = 'middle' === n.align ? 'center' : n.align
                i.css('text-align', s)
                var a = n.size
                '' === n.vertical
                  ? (i.css('width', a + '%'), c(i, n, o.Left))
                  : (i.css('height', a + '%'), c(i, n, o.Top))
              }),
                (e.setVttRegionStyles = function (e, t, n) {
                  var i = e.getDomElement(),
                    r =
                      (n.width * t.viewportAnchorX) / 100 -
                      (((n.width * t.width) / 100) * t.regionAnchorX) / 100,
                    s =
                      (n.height * t.viewportAnchorY) / 100 -
                      (28 * t.lines * t.regionAnchorY) / 100
                  i.css('position', 'absolute'),
                    i.css('overflow', 'hidden'),
                    i.css('width', t.width + '%'),
                    i.css(o.Left, r + 'px'),
                    i.css(o.Right, 'unset'),
                    i.css(o.Top, s + 'px'),
                    i.css(o.Bottom, 'unset'),
                    i.css('height', 28 * t.lines + 'px')
                })
            })(n.VttUtils || (n.VttUtils = {}))
          },
          {},
        ],
      },
      {},
      [85],
    )(85)
  })
})()
