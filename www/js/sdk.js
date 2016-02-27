! function t(e, n, r) {
  function i(s, a) {
    if (!n[s]) {
      if (!e[s]) {
        var u = "function" == typeof require && require;
        if (!a && u) return u(s, !0);
        if (o) return o(s, !0);
        throw new Error("Cannot find module '" + s + "'")
      }
      var c = n[s] = {
        exports: {}
      };
      e[s][0].call(c.exports, function(t) {
        var n = e[s][1][t];
        return i(n ? n : t)
      }, c, c.exports, t, e, n, r)
    }
    return n[s].exports
  }
  for (var o = "function" == typeof require && require, s = 0; s < r.length; s++) i(r[s]);
  return i
}({
  1: [function(t, e) {
    e.exports = {
      sdk_host: "https://www.digits.com",
      bridge: {
        path: "/bridge"
      },
      login: {
        path: "/login",
        specs: {
          height: 360,
          width: 530,
          left: 100,
          top: 100,
          location: "yes",
          menubar: "yes",
          scrollbars: "no",
          titlebar: "yes",
          toolbar: "no"
        }
      }
    }
  }, {}],
  2: [function(t, e) {
    function n(t) {
      this.config = t, this.createFrame()
    }
    var r = t("jquery");
    n.prototype = {
      createFrame: function() {
        this.iframe = r(document.createElement("iframe")), this.iframe.css("display", "none");
        var e = t("./popup").url("bridge", this.config);
        this.iframe.attr("src", e).attr("class", "digits-bridge").attr("sandbox", "allow-scripts allow-same-origin allow-forms"), r(document).ready(this.onDocumentReady.bind(this))
      },
      onDocumentReady: function() {
        setTimeout(function() {
          this.iframe.appendTo("body")
        }.bind(this), 20)
      },
      post: function(e, n) {
        var r = t("./post_message");
        return r.send(this.iframe, e, n)
      }
    }, e.exports = n
  }, {
    "./popup": 3,
    "./post_message": 4,
    jquery: 7
  }],
  3: [function(t, e) {
    var n = t("jquery"),
      r = {
        open: function(t, e) {
          var n = this.url(t, e),
            r = e.get(t),
            i = [];
          Object.keys(r.specs).map(function(t) {
            i.push(t + "=" + r.specs[t])
          });
          var o = window.open(n, t, i.join(","));
          return o && o.focus(), o
        },
        url: function(t, e, r) {
          var i = e.get(t);
          if (!i) throw new Error("PopUp: configuration does not exist: " + t);
          var o = e.get("sdk_host") + i.path,
            s = n.extend({
              consumer_key: e.get("consumerKey"),
              host: location.origin
            }, r);
          return [o, "?", n.param(s)].join("")
        }
      };
    e.exports = r
  }, {
    jquery: 7
  }],
  4: [function(t, e) {
    function n() {
      this.callbacks = {}
    }
    var r = t("jquery");
    n.prototype = {
      init: function(t) {
        if (!t) throw new Error("PostMessage: Configuration must be passed in");
        if (!window.postMessage) throw new Error("Browser does not support postMessage");
        this.config = t, r(window).on("message", this.onReceiveMessage.bind(this), !1)
      },
      onReceiveMessage: function(t) {
        this.config && -1 !== this.config.get("sdk_host").search(t.origin) && this.resolve(t.data)
      },
      send: function(t, e, n) {
        if (!this.config) throw new Error("PostMessage should be initialized before sending a message");
        if (!t) throw new Error("You need to pass a valid target window");
        if (t = r(t), n = n || {}, r.isPlainObject(e) || (e = {
            cmd: e
          }), r.isFunction(n) && (n = {
            success: n
          }), e.cmd) {
          e.consumerKey = this.config.get("consumerKey");
          var i = this.promise();
          e.callback = i.id;
          var o = this,
            s = this.config.get("sdk_host");
          return t.ready(function() {
            function n(t) {
              t && (r = t.target.contentWindow);
              try {
                r.postMessage(e, s)
              } catch (t) {
                o.resolve({
                  callback: i.id,
                  result: {
                    error: {
                      type: "exception",
                      message: "postMessage threw an exception"
                    }
                  }
                })
              }
            }
            var r = t[0].contentWindow || t[0];
            try {
              r.postMessage && r.location.origin, t.on("load", n)
            } catch (a) {
              n()
            }
          }), i
        }
      },
      listen: function(t, e) {
        var n = this.promise(e);
        return n.isClosedInterval = window.setInterval(this.checkWindow.bind(this, t, n), 500), n
      },
      checkWindow: function(t, e) {
        if (e.isClosedInterval) try {
          t.closed && (window.clearInterval(e.isClosedInterval), e.isClosedInterval = null, this.resolve({
            callback: e.id,
            result: {
              error: {
                type: "abort",
                message: "window has been closed"
              }
            }
          }))
        } catch (n) {
          window.clearInterval(e.isClosedInterval), e.isClosedInterval = null
        }
      },
      CHARS: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
      promise: function(t) {
        t = t || this.random();
        var e = this.callbacks[t] || r.Deferred(),
          n = e.promise();
        return n.id = t, this.callbacks[t] = e, n
      },
      random: function() {
        for (var t = [], e = 0; 32 > e; e++) t[e] = this.CHARS[Math.floor(32 * Math.random())];
        return t.join("")
      },
      resolve: function(t) {
        var e = t && this.callbacks[t.callback];
        e && (t.result && t.result.error ? e.reject(t.result.error) : e.resolve(t.result), delete this.callbacks[t.callback])
      }
    }, e.exports = new n
  }, {
    jquery: 7
  }],
  5: [function(t, e) {
    function n(t) {
      this.validate(t), this.includeSDKSettings(t), this.properties = t, Object.freeze(this.properties)
    }
    var r = t("jquery");
    n.prototype = {
      validate: function(t) {
        return t ? t.consumerKey ? void 0 : this.throwMissingError("you must specify a valid consumerKey.") : this.throwMissingError("you must specify a configuration object for .init()")
      },
      throwMissingError: function(t) {
        throw new Error("Missing config: " + t)
      },
      includeSDKSettings: function(e) {
        var n, i = r("#sdk-environment");
        i.length && (n = JSON.parse(i.text()));
        var o = t("../../config/sdk.yml");
        r.extend(e, o, n)
      },
      get: function(t) {
        return this.properties[t]
      }
    }, e.exports = n
  }, {
    "../../config/sdk.yml": 1,
    jquery: 7
  }],
  6: [function(t, e) {
    function n() {
      function e(t) {
        throw new Error(t)
      }

      function n(e) {
        var n = t("./bridge/post_message"),
          r = t("./bridge/bridge"),
          i = t("./config");
        u = new i(e), n.init(u), c = new r(u), a = s.INITIALIZED
      }

      function i() {
        return c.post("login:getLoginStatus")
      }

      function o() {
        var e = t("./bridge/popup"),
          n = e.open("login", u);
        if (!n) {
          var i = r.Deferred();
          return i.reject({
            type: "popup_blocker",
            message: "pop up did not open"
          }), i.promise()
        }
        var o = t("./bridge/post_message");
        return o.listen(n, "login:complete")
      }
      var s = {
          NEW: 0,
          INITIALIZED: 1,
          FAILED: 2
        },
        a = s.NEW,
        u = null,
        c = null,
        l = {
          init: function(t) {
            if (a === s.INITIALIZED) return new e("Digits.init() can be called only once");
            var i = r.Deferred();
            try {
              n(t), i.resolve(l)
            } catch (o) {
              a = s.FAILED, i.reject({
                type: "error",
                message: o.message
              })
            }
            return i.promise()
          },
          isInitialized: function() {
            return a === s.INITIALIZED
          },
          getLoginStatus: function() {
            return a !== s.INITIALIZED ? new e("Digits is not initialized") : i()
          },
          logIn: function() {
            return a !== s.INITIALIZED ? new e("Digits is not initialized") : o()
          }
        };
      return l
    }
    t("polyfill-function-prototype-bind");
    var r = t("jquery");
    "undefined" != typeof define && r.isFunction(define) && define.amd ? define("digits", new n) : (window.Digits = new n, "undefined" != typeof e && e.exports && (e.exports = window.Digits))
  }, {
    "./bridge/bridge": 2,
    "./bridge/popup": 3,
    "./bridge/post_message": 4,
    "./config": 5,
    jquery: 7,
    "polyfill-function-prototype-bind": 8
  }],
  7: [function(t, e) {
    (function(n) {
      __browserify_shim_require__ = t,
        function(t, e, n, r, i) {
          var o = function() {
            function t(t) {
              return null == t ? String(t) : B[U.call(t)] || "object"
            }

            function e(e) {
              return "function" == t(e)
            }

            function n(t) {
              return null != t && t == t.window
            }

            function r(t) {
              return null != t && t.nodeType == t.DOCUMENT_NODE
            }

            function i(e) {
              return "object" == t(e)
            }

            function o(t) {
              return i(t) && !n(t) && Object.getPrototypeOf(t) == Object.prototype
            }

            function s(t) {
              return "number" == typeof t.length
            }

            function a(t) {
              return I.call(t, function(t) {
                return null != t
              })
            }

            function u(t) {
              return t.length > 0 ? j.fn.concat.apply([], t) : t
            }

            function c(t) {
              return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
            }

            function l(t) {
              return t in O ? O[t] : O[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
            }

            function f(t, e) {
              return "number" != typeof e || P[c(t)] ? e : e + "px"
            }

            function h(t) {
              var e, n;
              return A[t] || (e = D.createElement(t), D.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), A[t] = n), A[t]
            }

            function p(t) {
              return "children" in t ? k.call(t.children) : j.map(t.childNodes, function(t) {
                return 1 == t.nodeType ? t : void 0
              })
            }

            function d(t, e, n) {
              for (E in e) n && (o(e[E]) || Y(e[E])) ? (o(e[E]) && !o(t[E]) && (t[E] = {}), Y(e[E]) && !Y(t[E]) && (t[E] = []), d(t[E], e[E], n)) : e[E] !== x && (t[E] = e[E])
            }

            function m(t, e) {
              return null == e ? j(t) : j(t).filter(e)
            }

            function g(t, n, r, i) {
              return e(n) ? n.call(t, r, i) : n
            }

            function v(t, e, n) {
              null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
            }

            function y(t, e) {
              var n = t.className,
                r = n && n.baseVal !== x;
              return e === x ? r ? n.baseVal : n : (r ? n.baseVal = e : t.className = e, void 0)
            }

            function b(t) {
              var e;
              try {
                return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : /^0/.test(t) || isNaN(e = Number(t)) ? /^[\[\{]/.test(t) ? j.parseJSON(t) : t : e) : t
              } catch (n) {
                return t
              }
            }

            function w(t, e) {
              e(t);
              for (var n = 0, r = t.childNodes.length; r > n; n++) w(t.childNodes[n], e)
            }
            var x, E, j, C, S, T, N = [],
              k = N.slice,
              I = N.filter,
              D = window.document,
              A = {},
              O = {},
              P = {
                "column-count": 1,
                columns: 1,
                "font-weight": 1,
                "line-height": 1,
                opacity: 1,
                "z-index": 1,
                zoom: 1
              },
              _ = /^\s*<(\w+|!)[^>]*>/,
              L = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
              M = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
              q = /^(?:body|html)$/i,
              F = /([A-Z])/g,
              R = ["val", "css", "html", "text", "data", "width", "height", "offset"],
              z = ["after", "prepend", "before", "append"],
              Z = D.createElement("table"),
              W = D.createElement("tr"),
              $ = {
                tr: D.createElement("tbody"),
                tbody: Z,
                thead: Z,
                tfoot: Z,
                td: W,
                th: W,
                "*": D.createElement("div")
              },
              H = /complete|loaded|interactive/,
              V = /^[\w-]*$/,
              B = {},
              U = B.toString,
              J = {},
              X = D.createElement("div"),
              K = {
                tabindex: "tabIndex",
                readonly: "readOnly",
                "for": "htmlFor",
                "class": "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
              },
              Y = Array.isArray || function(t) {
                return t instanceof Array
              };
            return J.matches = function(t, e) {
              if (!e || !t || 1 !== t.nodeType) return !1;
              var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
              if (n) return n.call(t, e);
              var r, i = t.parentNode,
                o = !i;
              return o && (i = X).appendChild(t), r = ~J.qsa(i, e).indexOf(t), o && X.removeChild(t), r
            }, S = function(t) {
              return t.replace(/-+(.)?/g, function(t, e) {
                return e ? e.toUpperCase() : ""
              })
            }, T = function(t) {
              return I.call(t, function(e, n) {
                return t.indexOf(e) == n
              })
            }, J.fragment = function(t, e, n) {
              var r, i, s;
              return L.test(t) && (r = j(D.createElement(RegExp.$1))), r || (t.replace && (t = t.replace(M, "<$1></$2>")), e === x && (e = _.test(t) && RegExp.$1), e in $ || (e = "*"), s = $[e], s.innerHTML = "" + t, r = j.each(k.call(s.childNodes), function() {
                s.removeChild(this)
              })), o(n) && (i = j(r), j.each(n, function(t, e) {
                R.indexOf(t) > -1 ? i[t](e) : i.attr(t, e)
              })), r
            }, J.Z = function(t, e) {
              return t = t || [], t.__proto__ = j.fn, t.selector = e || "", t
            }, J.isZ = function(t) {
              return t instanceof J.Z
            }, J.init = function(t, n) {
              var r;
              if (!t) return J.Z();
              if ("string" == typeof t)
                if (t = t.trim(), "<" == t[0] && _.test(t)) r = J.fragment(t, RegExp.$1, n), t = null;
                else {
                  if (n !== x) return j(n).find(t);
                  r = J.qsa(D, t)
                } else {
                if (e(t)) return j(D).ready(t);
                if (J.isZ(t)) return t;
                if (Y(t)) r = a(t);
                else if (i(t)) r = [t], t = null;
                else if (_.test(t)) r = J.fragment(t.trim(), RegExp.$1, n), t = null;
                else {
                  if (n !== x) return j(n).find(t);
                  r = J.qsa(D, t)
                }
              }
              return J.Z(r, t)
            }, j = function(t, e) {
              return J.init(t, e)
            }, j.extend = function(t) {
              var e, n = k.call(arguments, 1);
              return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function(n) {
                d(t, n, e)
              }), t
            }, J.qsa = function(t, e) {
              var n, i = "#" == e[0],
                o = !i && "." == e[0],
                s = i || o ? e.slice(1) : e,
                a = V.test(s);
              return r(t) && a && i ? (n = t.getElementById(s)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : k.call(a && !i ? o ? t.getElementsByClassName(s) : t.getElementsByTagName(e) : t.querySelectorAll(e))
            }, j.contains = D.documentElement.contains ? function(t, e) {
              return t !== e && t.contains(e)
            } : function(t, e) {
              for (; e && (e = e.parentNode);)
                if (e === t) return !0;
              return !1
            }, j.type = t, j.isFunction = e, j.isWindow = n, j.isArray = Y, j.isPlainObject = o, j.isEmptyObject = function(t) {
              var e;
              for (e in t) return !1;
              return !0
            }, j.inArray = function(t, e, n) {
              return N.indexOf.call(e, t, n)
            }, j.camelCase = S, j.trim = function(t) {
              return null == t ? "" : String.prototype.trim.call(t)
            }, j.uuid = 0, j.support = {}, j.expr = {}, j.map = function(t, e) {
              var n, r, i, o = [];
              if (s(t))
                for (r = 0; r < t.length; r++) n = e(t[r], r), null != n && o.push(n);
              else
                for (i in t) n = e(t[i], i), null != n && o.push(n);
              return u(o)
            }, j.each = function(t, e) {
              var n, r;
              if (s(t)) {
                for (n = 0; n < t.length; n++)
                  if (e.call(t[n], n, t[n]) === !1) return t
              } else
                for (r in t)
                  if (e.call(t[r], r, t[r]) === !1) return t; return t
            }, j.grep = function(t, e) {
              return I.call(t, e)
            }, window.JSON && (j.parseJSON = JSON.parse), j.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
              B["[object " + e + "]"] = e.toLowerCase()
            }), j.fn = {
              forEach: N.forEach,
              reduce: N.reduce,
              push: N.push,
              sort: N.sort,
              indexOf: N.indexOf,
              concat: N.concat,
              map: function(t) {
                return j(j.map(this, function(e, n) {
                  return t.call(e, n, e)
                }))
              },
              slice: function() {
                return j(k.apply(this, arguments))
              },
              ready: function(t) {
                return H.test(D.readyState) && D.body ? t(j) : D.addEventListener("DOMContentLoaded", function() {
                  t(j)
                }, !1), this
              },
              get: function(t) {
                return t === x ? k.call(this) : this[t >= 0 ? t : t + this.length]
              },
              toArray: function() {
                return this.get()
              },
              size: function() {
                return this.length
              },
              remove: function() {
                return this.each(function() {
                  null != this.parentNode && this.parentNode.removeChild(this)
                })
              },
              each: function(t) {
                return N.every.call(this, function(e, n) {
                  return t.call(e, n, e) !== !1
                }), this
              },
              filter: function(t) {
                return e(t) ? this.not(this.not(t)) : j(I.call(this, function(e) {
                  return J.matches(e, t)
                }))
              },
              add: function(t, e) {
                return j(T(this.concat(j(t, e))))
              },
              is: function(t) {
                return this.length > 0 && J.matches(this[0], t)
              },
              not: function(t) {
                var n = [];
                if (e(t) && t.call !== x) this.each(function(e) {
                  t.call(this, e) || n.push(this)
                });
                else {
                  var r = "string" == typeof t ? this.filter(t) : s(t) && e(t.item) ? k.call(t) : j(t);
                  this.forEach(function(t) {
                    r.indexOf(t) < 0 && n.push(t)
                  })
                }
                return j(n)
              },
              has: function(t) {
                return this.filter(function() {
                  return i(t) ? j.contains(this, t) : j(this).find(t).size()
                })
              },
              eq: function(t) {
                return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
              },
              first: function() {
                var t = this[0];
                return t && !i(t) ? t : j(t)
              },
              last: function() {
                var t = this[this.length - 1];
                return t && !i(t) ? t : j(t)
              },
              find: function(t) {
                var e, n = this;
                return e = t ? "object" == typeof t ? j(t).filter(function() {
                  var t = this;
                  return N.some.call(n, function(e) {
                    return j.contains(e, t)
                  })
                }) : 1 == this.length ? j(J.qsa(this[0], t)) : this.map(function() {
                  return J.qsa(this, t)
                }) : []
              },
              closest: function(t, e) {
                var n = this[0],
                  i = !1;
                for ("object" == typeof t && (i = j(t)); n && !(i ? i.indexOf(n) >= 0 : J.matches(n, t));) n = n !== e && !r(n) && n.parentNode;
                return j(n)
              },
              parents: function(t) {
                for (var e = [], n = this; n.length > 0;) n = j.map(n, function(t) {
                  return (t = t.parentNode) && !r(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
                });
                return m(e, t)
              },
              parent: function(t) {
                return m(T(this.pluck("parentNode")), t)
              },
              children: function(t) {
                return m(this.map(function() {
                  return p(this)
                }), t)
              },
              contents: function() {
                return this.map(function() {
                  return k.call(this.childNodes)
                })
              },
              siblings: function(t) {
                return m(this.map(function(t, e) {
                  return I.call(p(e.parentNode), function(t) {
                    return t !== e
                  })
                }), t)
              },
              empty: function() {
                return this.each(function() {
                  this.innerHTML = ""
                })
              },
              pluck: function(t) {
                return j.map(this, function(e) {
                  return e[t]
                })
              },
              show: function() {
                return this.each(function() {
                  "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName))
                })
              },
              replaceWith: function(t) {
                return this.before(t).remove()
              },
              wrap: function(t) {
                var n = e(t);
                if (this[0] && !n) var r = j(t).get(0),
                  i = r.parentNode || this.length > 1;
                return this.each(function(e) {
                  j(this).wrapAll(n ? t.call(this, e) : i ? r.cloneNode(!0) : r)
                })
              },
              wrapAll: function(t) {
                if (this[0]) {
                  j(this[0]).before(t = j(t));
                  for (var e;
                    (e = t.children()).length;) t = e.first();
                  j(t).append(this)
                }
                return this
              },
              wrapInner: function(t) {
                var n = e(t);
                return this.each(function(e) {
                  var r = j(this),
                    i = r.contents(),
                    o = n ? t.call(this, e) : t;
                  i.length ? i.wrapAll(o) : r.append(o)
                })
              },
              unwrap: function() {
                return this.parent().each(function() {
                  j(this).replaceWith(j(this).children())
                }), this
              },
              clone: function() {
                return this.map(function() {
                  return this.cloneNode(!0)
                })
              },
              hide: function() {
                return this.css("display", "none")
              },
              toggle: function(t) {
                return this.each(function() {
                  var e = j(this);
                  (t === x ? "none" == e.css("display") : t) ? e.show(): e.hide()
                })
              },
              prev: function(t) {
                return j(this.pluck("previousElementSibling")).filter(t || "*")
              },
              next: function(t) {
                return j(this.pluck("nextElementSibling")).filter(t || "*")
              },
              html: function(t) {
                return 0 in arguments ? this.each(function(e) {
                  var n = this.innerHTML;
                  j(this).empty().append(g(this, t, e, n))
                }) : 0 in this ? this[0].innerHTML : null
              },
              text: function(t) {
                return 0 in arguments ? this.each(function(e) {
                  var n = g(this, t, e, this.textContent);
                  this.textContent = null == n ? "" : "" + n
                }) : 0 in this ? this[0].textContent : null
              },
              attr: function(t, e) {
                var n;
                return "string" != typeof t || 1 in arguments ? this.each(function(n) {
                  if (1 === this.nodeType)
                    if (i(t))
                      for (E in t) v(this, E, t[E]);
                    else v(this, t, g(this, e, n, this.getAttribute(t)))
                }) : this.length && 1 === this[0].nodeType ? !(n = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : n : x
              },
              removeAttr: function(t) {
                return this.each(function() {
                  1 === this.nodeType && v(this, t)
                })
              },
              prop: function(t, e) {
                return t = K[t] || t, 1 in arguments ? this.each(function(n) {
                  this[t] = g(this, e, n, this[t])
                }) : this[0] && this[0][t]
              },
              data: function(t, e) {
                var n = "data-" + t.replace(F, "-$1").toLowerCase(),
                  r = 1 in arguments ? this.attr(n, e) : this.attr(n);
                return null !== r ? b(r) : x
              },
              val: function(t) {
                return 0 in arguments ? this.each(function(e) {
                  this.value = g(this, t, e, this.value)
                }) : this[0] && (this[0].multiple ? j(this[0]).find("option").filter(function() {
                  return this.selected
                }).pluck("value") : this[0].value)
              },
              offset: function(t) {
                if (t) return this.each(function(e) {
                  var n = j(this),
                    r = g(this, t, e, n.offset()),
                    i = n.offsetParent().offset(),
                    o = {
                      top: r.top - i.top,
                      left: r.left - i.left
                    };
                  "static" == n.css("position") && (o.position = "relative"), n.css(o)
                });
                if (!this.length) return null;
                var e = this[0].getBoundingClientRect();
                return {
                  left: e.left + window.pageXOffset,
                  top: e.top + window.pageYOffset,
                  width: Math.round(e.width),
                  height: Math.round(e.height)
                }
              },
              css: function(e, n) {
                if (arguments.length < 2) {
                  var r = this[0],
                    i = getComputedStyle(r, "");
                  if (!r) return;
                  if ("string" == typeof e) return r.style[S(e)] || i.getPropertyValue(e);
                  if (Y(e)) {
                    var o = {};
                    return j.each(Y(e) ? e : [e], function(t, e) {
                      o[e] = r.style[S(e)] || i.getPropertyValue(e)
                    }), o
                  }
                }
                var s = "";
                if ("string" == t(e)) n || 0 === n ? s = c(e) + ":" + f(e, n) : this.each(function() {
                  this.style.removeProperty(c(e))
                });
                else
                  for (E in e) e[E] || 0 === e[E] ? s += c(E) + ":" + f(E, e[E]) + ";" : this.each(function() {
                    this.style.removeProperty(c(E))
                  });
                return this.each(function() {
                  this.style.cssText += ";" + s
                })
              },
              index: function(t) {
                return t ? this.indexOf(j(t)[0]) : this.parent().children().indexOf(this[0])
              },
              hasClass: function(t) {
                return t ? N.some.call(this, function(t) {
                  return this.test(y(t))
                }, l(t)) : !1
              },
              addClass: function(t) {
                return t ? this.each(function(e) {
                  C = [];
                  var n = y(this),
                    r = g(this, t, e, n);
                  r.split(/\s+/g).forEach(function(t) {
                    j(this).hasClass(t) || C.push(t)
                  }, this), C.length && y(this, n + (n ? " " : "") + C.join(" "))
                }) : this
              },
              removeClass: function(t) {
                return this.each(function(e) {
                  return t === x ? y(this, "") : (C = y(this), g(this, t, e, C).split(/\s+/g).forEach(function(t) {
                    C = C.replace(l(t), " ")
                  }), y(this, C.trim()), void 0)
                })
              },
              toggleClass: function(t, e) {
                return t ? this.each(function(n) {
                  var r = j(this),
                    i = g(this, t, n, y(this));
                  i.split(/\s+/g).forEach(function(t) {
                    (e === x ? !r.hasClass(t) : e) ? r.addClass(t): r.removeClass(t)
                  })
                }) : this
              },
              scrollTop: function(t) {
                if (this.length) {
                  var e = "scrollTop" in this[0];
                  return t === x ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function() {
                    this.scrollTop = t
                  } : function() {
                    this.scrollTo(this.scrollX, t)
                  })
                }
              },
              scrollLeft: function(t) {
                if (this.length) {
                  var e = "scrollLeft" in this[0];
                  return t === x ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function() {
                    this.scrollLeft = t
                  } : function() {
                    this.scrollTo(t, this.scrollY)
                  })
                }
              },
              position: function() {
                if (this.length) {
                  var t = this[0],
                    e = this.offsetParent(),
                    n = this.offset(),
                    r = q.test(e[0].nodeName) ? {
                      top: 0,
                      left: 0
                    } : e.offset();
                  return n.top -= parseFloat(j(t).css("margin-top")) || 0, n.left -= parseFloat(j(t).css("margin-left")) || 0, r.top += parseFloat(j(e[0]).css("border-top-width")) || 0, r.left += parseFloat(j(e[0]).css("border-left-width")) || 0, {
                    top: n.top - r.top,
                    left: n.left - r.left
                  }
                }
              },
              offsetParent: function() {
                return this.map(function() {
                  for (var t = this.offsetParent || D.body; t && !q.test(t.nodeName) && "static" == j(t).css("position");) t = t.offsetParent;
                  return t
                })
              }
            }, j.fn.detach = j.fn.remove, ["width", "height"].forEach(function(t) {
              var e = t.replace(/./, function(t) {
                return t[0].toUpperCase()
              });
              j.fn[t] = function(i) {
                var o, s = this[0];
                return i === x ? n(s) ? s["inner" + e] : r(s) ? s.documentElement["scroll" + e] : (o = this.offset()) && o[t] : this.each(function(e) {
                  s = j(this), s.css(t, g(this, i, e, s[t]()))
                })
              }
            }), z.forEach(function(e, n) {
              var r = n % 2;
              j.fn[e] = function() {
                var e, i, o = j.map(arguments, function(n) {
                    return e = t(n), "object" == e || "array" == e || null == n ? n : J.fragment(n)
                  }),
                  s = this.length > 1;
                return o.length < 1 ? this : this.each(function(t, e) {
                  i = r ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null;
                  var a = j.contains(D.documentElement, i);
                  o.forEach(function(t) {
                    if (s) t = t.cloneNode(!0);
                    else if (!i) return j(t).remove();
                    i.insertBefore(t, e), a && w(t, function(t) {
                      null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src || window.eval.call(window, t.innerHTML)
                    })
                  })
                })
              }, j.fn[r ? e + "To" : "insert" + (n ? "Before" : "After")] = function(t) {
                return j(t)[e](this), this
              }
            }), J.Z.prototype = j.fn, J.uniq = T, J.deserializeValue = b, j.zepto = J, j
          }();
          ! function(t) {
            function e(t) {
              return t._zid || (t._zid = h++)
            }

            function n(t, n, o, s) {
              if (n = r(n), n.ns) var a = i(n.ns);
              return (g[e(t)] || []).filter(function(t) {
                return !(!t || n.e && t.e != n.e || n.ns && !a.test(t.ns) || o && e(t.fn) !== e(o) || s && t.sel != s)
              })
            }

            function r(t) {
              var e = ("" + t).split(".");
              return {
                e: e[0],
                ns: e.slice(1).sort().join(" ")
              }
            }

            function i(t) {
              return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
            }

            function o(t, e) {
              return t.del && !y && t.e in b || !!e
            }

            function s(t) {
              return w[t] || y && b[t] || t
            }

            function a(n, i, a, u, l, h, p) {
              var d = e(n),
                m = g[d] || (g[d] = []);
              i.split(/\s/).forEach(function(e) {
                if ("ready" == e) return t(document).ready(a);
                var i = r(e);
                i.fn = a, i.sel = l, i.e in w && (a = function(e) {
                  var n = e.relatedTarget;
                  return !n || n !== this && !t.contains(this, n) ? i.fn.apply(this, arguments) : void 0
                }), i.del = h;
                var d = h || a;
                i.proxy = function(t) {
                  if (t = c(t), !t.isImmediatePropagationStopped()) {
                    t.data = u;
                    var e = d.apply(n, t._args == f ? [t] : [t].concat(t._args));
                    return e === !1 && (t.preventDefault(), t.stopPropagation()), e
                  }
                }, i.i = m.length, m.push(i), "addEventListener" in n && n.addEventListener(s(i.e), i.proxy, o(i, p))
              })
            }

            function u(t, r, i, a, u) {
              var c = e(t);
              (r || "").split(/\s/).forEach(function(e) {
                n(t, e, i, a).forEach(function(e) {
                  delete g[c][e.i], "removeEventListener" in t && t.removeEventListener(s(e.e), e.proxy, o(e, u))
                })
              })
            }

            function c(e, n) {
              return (n || !e.isDefaultPrevented) && (n || (n = e), t.each(C, function(t, r) {
                var i = n[t];
                e[t] = function() {
                  return this[r] = x, i && i.apply(n, arguments)
                }, e[r] = E
              }), (n.defaultPrevented !== f ? n.defaultPrevented : "returnValue" in n ? n.returnValue === !1 : n.getPreventDefault && n.getPreventDefault()) && (e.isDefaultPrevented = x)), e
            }

            function l(t) {
              var e, n = {
                originalEvent: t
              };
              for (e in t) j.test(e) || t[e] === f || (n[e] = t[e]);
              return c(n, t)
            }
            var f, h = 1,
              p = Array.prototype.slice,
              d = t.isFunction,
              m = function(t) {
                return "string" == typeof t
              },
              g = {},
              v = {},
              y = "onfocusin" in window,
              b = {
                focus: "focusin",
                blur: "focusout"
              },
              w = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
              };
            v.click = v.mousedown = v.mouseup = v.mousemove = "MouseEvents", t.event = {
              add: a,
              remove: u
            }, t.proxy = function(n, r) {
              var i = 2 in arguments && p.call(arguments, 2);
              if (d(n)) {
                var o = function() {
                  return n.apply(r, i ? i.concat(p.call(arguments)) : arguments)
                };
                return o._zid = e(n), o
              }
              if (m(r)) return i ? (i.unshift(n[r], n), t.proxy.apply(null, i)) : t.proxy(n[r], n);
              throw new TypeError("expected function")
            }, t.fn.bind = function(t, e, n) {
              return this.on(t, e, n)
            }, t.fn.unbind = function(t, e) {
              return this.off(t, e)
            }, t.fn.one = function(t, e, n, r) {
              return this.on(t, e, n, r, 1)
            };
            var x = function() {
                return !0
              },
              E = function() {
                return !1
              },
              j = /^([A-Z]|returnValue$|layer[XY]$)/,
              C = {
                preventDefault: "isDefaultPrevented",
                stopImmediatePropagation: "isImmediatePropagationStopped",
                stopPropagation: "isPropagationStopped"
              };
            t.fn.delegate = function(t, e, n) {
              return this.on(e, t, n)
            }, t.fn.undelegate = function(t, e, n) {
              return this.off(e, t, n)
            }, t.fn.live = function(e, n) {
              return t(document.body).delegate(this.selector, e, n), this
            }, t.fn.die = function(e, n) {
              return t(document.body).undelegate(this.selector, e, n), this
            }, t.fn.on = function(e, n, r, i, o) {
              var s, c, h = this;
              return e && !m(e) ? (t.each(e, function(t, e) {
                h.on(t, n, r, e, o)
              }), h) : (m(n) || d(i) || i === !1 || (i = r, r = n, n = f), (d(r) || r === !1) && (i = r, r = f), i === !1 && (i = E), h.each(function(f, h) {
                o && (s = function(t) {
                  return u(h, t.type, i), i.apply(this, arguments)
                }), n && (c = function(e) {
                  var r, o = t(e.target).closest(n, h).get(0);
                  return o && o !== h ? (r = t.extend(l(e), {
                    currentTarget: o,
                    liveFired: h
                  }), (s || i).apply(o, [r].concat(p.call(arguments, 1)))) : void 0
                }), a(h, e, i, r, n, c || s)
              }))
            }, t.fn.off = function(e, n, r) {
              var i = this;
              return e && !m(e) ? (t.each(e, function(t, e) {
                i.off(t, n, e)
              }), i) : (m(n) || d(r) || r === !1 || (r = n, n = f), r === !1 && (r = E), i.each(function() {
                u(this, e, r, n)
              }))
            }, t.fn.trigger = function(e, n) {
              return e = m(e) || t.isPlainObject(e) ? t.Event(e) : c(e), e._args = n, this.each(function() {
                "dispatchEvent" in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n)
              })
            }, t.fn.triggerHandler = function(e, r) {
              var i, o;
              return this.each(function(s, a) {
                i = l(m(e) ? t.Event(e) : e), i._args = r, i.target = a, t.each(n(a, e.type || e), function(t, e) {
                  return o = e.proxy(i), i.isImmediatePropagationStopped() ? !1 : void 0
                })
              }), o
            }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e) {
              t.fn[e] = function(t) {
                return t ? this.bind(e, t) : this.trigger(e)
              }
            }), ["focus", "blur"].forEach(function(e) {
              t.fn[e] = function(t) {
                return t ? this.bind(e, t) : this.each(function() {
                  try {
                    this[e]()
                  } catch (t) {}
                }), this
              }
            }), t.Event = function(t, e) {
              m(t) || (e = t, t = e.type);
              var n = document.createEvent(v[t] || "Events"),
                r = !0;
              if (e)
                for (var i in e) "bubbles" == i ? r = !!e[i] : n[i] = e[i];
              return n.initEvent(t, r, !0), c(n)
            }
          }(o),
          function(t) {
            function e(e, n, r) {
              var i = t.Event(n);
              return t(e).trigger(i, r), !i.isDefaultPrevented()
            }

            function n(t, n, r, i) {
              return t.global ? e(n || y, r, i) : void 0
            }

            function r(e) {
              e.global && 0 === t.active++ && n(e, null, "ajaxStart")
            }

            function i(e) {
              e.global && !--t.active && n(e, null, "ajaxStop")
            }

            function o(t, e) {
              var r = e.context;
              return e.beforeSend.call(r, t, e) === !1 || n(e, r, "ajaxBeforeSend", [t, e]) === !1 ? !1 : (n(e, r, "ajaxSend", [t, e]), void 0)
            }

            function s(t, e, r, i) {
              var o = r.context,
                s = "success";
              r.success.call(o, t, s, e), i && i.resolveWith(o, [t, s, e]), n(r, o, "ajaxSuccess", [e, r, t]), u(s, e, r)
            }

            function a(t, e, r, i, o) {
              var s = i.context;
              i.error.call(s, r, e, t), o && o.rejectWith(s, [r, e, t]), n(i, s, "ajaxError", [r, i, t || e]), u(e, r, i)
            }

            function u(t, e, r) {
              var o = r.context;
              r.complete.call(o, e, t), n(r, o, "ajaxComplete", [e, r]), i(r)
            }

            function c() {}

            function l(t) {
              return t && (t = t.split(";", 2)[0]), t && (t == j ? "html" : t == E ? "json" : w.test(t) ? "script" : x.test(t) && "xml") || "text"
            }

            function f(t, e) {
              return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
            }

            function h(e) {
              e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = f(e.url, e.data), e.data = void 0)
            }

            function p(e, n, r, i) {
              return t.isFunction(n) && (i = r, r = n, n = void 0), t.isFunction(r) || (i = r, r = void 0), {
                url: e,
                data: n,
                success: r,
                dataType: i
              }
            }

            function d(e, n, r, i) {
              var o, s = t.isArray(n),
                a = t.isPlainObject(n);
              t.each(n, function(n, u) {
                o = t.type(u), i && (n = r ? i : i + "[" + (a || "object" == o || "array" == o ? n : "") + "]"), !i && s ? e.add(u.name, u.value) : "array" == o || !r && "object" == o ? d(e, u, r, n) : e.add(n, u)
              })
            }
            var m, g, v = 0,
              y = window.document,
              b = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
              w = /^(?:text|application)\/javascript/i,
              x = /^(?:text|application)\/xml/i,
              E = "application/json",
              j = "text/html",
              C = /^\s*$/;
            t.active = 0, t.ajaxJSONP = function(e, n) {
              if (!("type" in e)) return t.ajax(e);
              var r, i, u = e.jsonpCallback,
                c = (t.isFunction(u) ? u() : u) || "jsonp" + ++v,
                l = y.createElement("script"),
                f = window[c],
                h = function(e) {
                  t(l).triggerHandler("error", e || "abort")
                },
                p = {
                  abort: h
                };
              return n && n.promise(p), t(l).on("load error", function(o, u) {
                clearTimeout(i), t(l).off().remove(), "error" != o.type && r ? s(r[0], p, e, n) : a(null, u || "error", p, e, n), window[c] = f, r && t.isFunction(f) && f(r[0]), f = r = void 0
              }), o(p, e) === !1 ? (h("abort"), p) : (window[c] = function() {
                r = arguments
              }, l.src = e.url.replace(/\?(.+)=\?/, "?$1=" + c), y.head.appendChild(l), e.timeout > 0 && (i = setTimeout(function() {
                h("timeout")
              }, e.timeout)), p)
            }, t.ajaxSettings = {
              type: "GET",
              beforeSend: c,
              success: c,
              error: c,
              complete: c,
              context: null,
              global: !0,
              xhr: function() {
                return new window.XMLHttpRequest
              },
              accepts: {
                script: "text/javascript, application/javascript, application/x-javascript",
                json: E,
                xml: "application/xml, text/xml",
                html: j,
                text: "text/plain"
              },
              crossDomain: !1,
              timeout: 0,
              processData: !0,
              cache: !0
            }, t.ajax = function(e) {
              var n = t.extend({}, e || {}),
                i = t.Deferred && t.Deferred();
              for (m in t.ajaxSettings) void 0 === n[m] && (n[m] = t.ajaxSettings[m]);
              r(n), n.crossDomain || (n.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(n.url) && RegExp.$2 != window.location.host), n.url || (n.url = window.location.toString()), h(n);
              var u = n.dataType,
                p = /\?.+=\?/.test(n.url);
              if (p && (u = "jsonp"), n.cache !== !1 && (e && e.cache === !0 || "script" != u && "jsonp" != u) || (n.url = f(n.url, "_=" + Date.now())), "jsonp" == u) return p || (n.url = f(n.url, n.jsonp ? n.jsonp + "=?" : n.jsonp === !1 ? "" : "callback=?")), t.ajaxJSONP(n, i);
              var d, v = n.accepts[u],
                y = {},
                b = function(t, e) {
                  y[t.toLowerCase()] = [t, e]
                },
                w = /^([\w-]+:)\/\//.test(n.url) ? RegExp.$1 : window.location.protocol,
                x = n.xhr(),
                E = x.setRequestHeader;
              if (i && i.promise(x), n.crossDomain || b("X-Requested-With", "XMLHttpRequest"), b("Accept", v || "*/*"), (v = n.mimeType || v) && (v.indexOf(",") > -1 && (v = v.split(",", 2)[0]), x.overrideMimeType && x.overrideMimeType(v)), (n.contentType || n.contentType !== !1 && n.data && "GET" != n.type.toUpperCase()) && b("Content-Type", n.contentType || "application/x-www-form-urlencoded"), n.headers)
                for (g in n.headers) b(g, n.headers[g]);
              if (x.setRequestHeader = b, x.onreadystatechange = function() {
                  if (4 == x.readyState) {
                    x.onreadystatechange = c, clearTimeout(d);
                    var e, r = !1;
                    if (x.status >= 200 && x.status < 300 || 304 == x.status || 0 == x.status && "file:" == w) {
                      u = u || l(n.mimeType || x.getResponseHeader("content-type")), e = x.responseText;
                      try {
                        "script" == u ? (1, eval)(e) : "xml" == u ? e = x.responseXML : "json" == u && (e = C.test(e) ? null : t.parseJSON(e))
                      } catch (o) {
                        r = o
                      }
                      r ? a(r, "parsererror", x, n, i) : s(e, x, n, i)
                    } else a(x.statusText || null, x.status ? "error" : "abort", x, n, i)
                  }
                }, o(x, n) === !1) return x.abort(), a(null, "abort", x, n, i), x;
              if (n.xhrFields)
                for (g in n.xhrFields) x[g] = n.xhrFields[g];
              var j = "async" in n ? n.async : !0;
              x.open(n.type, n.url, j, n.username, n.password);
              for (g in y) E.apply(x, y[g]);
              return n.timeout > 0 && (d = setTimeout(function() {
                x.onreadystatechange = c, x.abort(), a(null, "timeout", x, n, i)
              }, n.timeout)), x.send(n.data ? n.data : null), x
            }, t.get = function() {
              return t.ajax(p.apply(null, arguments))
            }, t.post = function() {
              var e = p.apply(null, arguments);
              return e.type = "POST", t.ajax(e)
            }, t.getJSON = function() {
              var e = p.apply(null, arguments);
              return e.dataType = "json", t.ajax(e)
            }, t.fn.load = function(e, n, r) {
              if (!this.length) return this;
              var i, o = this,
                s = e.split(/\s/),
                a = p(e, n, r),
                u = a.success;
              return s.length > 1 && (a.url = s[0], i = s[1]), a.success = function(e) {
                o.html(i ? t("<div>").html(e.replace(b, "")).find(i) : e), u && u.apply(o, arguments)
              }, t.ajax(a), this
            };
            var S = encodeURIComponent;
            t.param = function(t, e) {
              var n = [];
              return n.add = function(t, e) {
                this.push(S(t) + "=" + S(e))
              }, d(n, t, e), n.join("&").replace(/%20/g, "+")
            }
          }(o),
          function(t) {
            t.fn.serializeArray = function() {
              var e, n = [];
              return t([].slice.call(this.get(0).elements)).each(function() {
                e = t(this);
                var r = e.attr("type");
                "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != r && "reset" != r && "button" != r && ("radio" != r && "checkbox" != r || this.checked) && n.push({
                  name: e.attr("name"),
                  value: e.val()
                })
              }), n
            }, t.fn.serialize = function() {
              var t = [];
              return this.serializeArray().forEach(function(e) {
                t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
              }), t.join("&")
            }, t.fn.submit = function(e) {
              if (e) this.bind("submit", e);
              else if (this.length) {
                var n = t.Event("submit");
                this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit()
              }
              return this
            }
          }(o),
          function(t) {
            "__proto__" in {} || t.extend(t.zepto, {
              Z: function(e, n) {
                return e = e || [], t.extend(e, t.fn), e.selector = n || "", e.__Z = !0, e
              },
              isZ: function(e) {
                return "array" === t.type(e) && "__Z" in e
              }
            });
            try {
              getComputedStyle(void 0)
            } catch (e) {
              var n = getComputedStyle;
              window.getComputedStyle = function(t) {
                try {
                  return n(t)
                } catch (e) {
                  return null
                }
              }
            }
          }(o),
          function(t) {
            function e(n) {
              var r = [
                  ["resolve", "done", t.Callbacks({
                    once: 1,
                    memory: 1
                  }), "resolved"],
                  ["reject", "fail", t.Callbacks({
                    once: 1,
                    memory: 1
                  }), "rejected"],
                  ["notify", "progress", t.Callbacks({
                    memory: 1
                  })]
                ],
                i = "pending",
                o = {
                  state: function() {
                    return i
                  },
                  always: function() {
                    return s.done(arguments).fail(arguments), this
                  },
                  then: function() {
                    var n = arguments;
                    return e(function(e) {
                      t.each(r, function(r, i) {
                        var a = t.isFunction(n[r]) && n[r];
                        s[i[1]](function() {
                          var n = a && a.apply(this, arguments);
                          if (n && t.isFunction(n.promise)) n.promise().done(e.resolve).fail(e.reject).progress(e.notify);
                          else {
                            var r = this === o ? e.promise() : this,
                              s = a ? [n] : arguments;
                            e[i[0] + "With"](r, s)
                          }
                        })
                      }), n = null
                    }).promise()
                  },
                  promise: function(e) {
                    return null != e ? t.extend(e, o) : o
                  }
                },
                s = {};
              return t.each(r, function(t, e) {
                var n = e[2],
                  a = e[3];
                o[e[1]] = n.add, a && n.add(function() {
                  i = a
                }, r[1 ^ t][2].disable, r[2][2].lock), s[e[0]] = function() {
                  return s[e[0] + "With"](this === s ? o : this, arguments), this
                }, s[e[0] + "With"] = n.fireWith
              }), o.promise(s), n && n.call(s, s), s
            }
            var n = Array.prototype.slice;
            t.when = function(r) {
              var i, o, s, a = n.call(arguments),
                u = a.length,
                c = 0,
                l = 1 !== u || r && t.isFunction(r.promise) ? u : 0,
                f = 1 === l ? r : e(),
                h = function(t, e, r) {
                  return function(o) {
                    e[t] = this, r[t] = arguments.length > 1 ? n.call(arguments) : o, r === i ? f.notifyWith(e, r) : --l || f.resolveWith(e, r)
                  }
                };
              if (u > 1)
                for (i = new Array(u), o = new Array(u), s = new Array(u); u > c; ++c) a[c] && t.isFunction(a[c].promise) ? a[c].promise().done(h(c, s, a)).fail(f.reject).progress(h(c, o, i)) : --l;
              return l || f.resolveWith(s, a), f.promise()
            }, t.Deferred = e
          }(o),
          function(t) {
            t.Callbacks = function(e) {
              e = t.extend({}, e);
              var n, r, i, o, s, a, u = [],
                c = !e.once && [],
                l = function(t) {
                  for (n = e.memory && t, r = !0, a = o || 0, o = 0, s = u.length, i = !0; u && s > a; ++a)
                    if (u[a].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                      n = !1;
                      break
                    }
                  i = !1, u && (c ? c.length && l(c.shift()) : n ? u.length = 0 : f.disable())
                },
                f = {
                  add: function() {
                    if (u) {
                      var r = u.length,
                        a = function(n) {
                          t.each(n, function(t, n) {
                            "function" == typeof n ? e.unique && f.has(n) || u.push(n) : n && n.length && "string" != typeof n && a(n)
                          })
                        };
                      a(arguments), i ? s = u.length : n && (o = r, l(n))
                    }
                    return this
                  },
                  remove: function() {
                    return u && t.each(arguments, function(e, n) {
                      for (var r;
                        (r = t.inArray(n, u, r)) > -1;) u.splice(r, 1), i && (s >= r && --s, a >= r && --a)
                    }), this
                  },
                  has: function(e) {
                    return !(!u || !(e ? t.inArray(e, u) > -1 : u.length))
                  },
                  empty: function() {
                    return s = u.length = 0, this
                  },
                  disable: function() {
                    return u = c = n = void 0, this
                  },
                  disabled: function() {
                    return !u
                  },
                  lock: function() {
                    return c = void 0, n || f.disable(), this
                  },
                  locked: function() {
                    return !c
                  },
                  fireWith: function(t, e) {
                    return !u || r && !c || (e = e || [], e = [t, e.slice ? e.slice() : e], i ? c.push(e) : l(e)), this
                  },
                  fire: function() {
                    return f.fireWith(this, arguments)
                  },
                  fired: function() {
                    return !!r
                  }
                };
              return f
            }
          }(o),
          function(t) {
            function e(e, r) {
              var u = e[a],
                c = u && i[u];
              if (void 0 === r) return c || n(e);
              if (c) {
                if (r in c) return c[r];
                var l = s(r);
                if (l in c) return c[l]
              }
              return o.call(t(e), r)
            }

            function n(e, n, o) {
              var u = e[a] || (e[a] = ++t.uuid),
                c = i[u] || (i[u] = r(e));
              return void 0 !== n && (c[s(n)] = o), c
            }

            function r(e) {
              var n = {};
              return t.each(e.attributes || u, function(e, r) {
                0 == r.name.indexOf("data-") && (n[s(r.name.replace("data-", ""))] = t.zepto.deserializeValue(r.value))
              }), n
            }
            var i = {},
              o = t.fn.data,
              s = t.camelCase,
              a = t.expando = "Zepto" + +new Date,
              u = [];
            t.fn.data = function(r, i) {
              return void 0 === i ? t.isPlainObject(r) ? this.each(function(e, i) {
                t.each(r, function(t, e) {
                  n(i, t, e)
                })
              }) : 0 in this ? e(this[0], r) : void 0 : this.each(function() {
                n(this, r, i)
              })
            }, t.fn.removeData = function(e) {
              return "string" == typeof e && (e = e.split(/\s+/)), this.each(function() {
                var n = this[a],
                  r = n && i[n];
                r && t.each(e || r, function(t) {
                  delete r[e ? s(this) : t]
                })
              })
            }, ["remove", "empty"].forEach(function(e) {
              var n = t.fn[e];
              t.fn[e] = function() {
                var t = this.find("*");
                return "remove" === e && (t = t.add(this)), t.removeData(), n.call(this)
              }
            })
          }(o), i("undefined" != typeof o ? o : window.Zepto)
        }.call(n, void 0, void 0, void 0, void 0, function(t) {
          e.exports = t
        })
    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {}],
  8: [function() {
    Function.prototype.bind || (Function.prototype.bind = function(t) {
      if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      var e = Array.prototype.slice.call(arguments, 1),
        n = this,
        r = function() {},
        i = function() {
          return n.apply(this instanceof r && t ? this : t, e.concat(Array.prototype.slice.call(arguments)))
        };
      return r.prototype = this.prototype, i.prototype = new r, i
    })
  }, {}]
}, {}, [6]);
