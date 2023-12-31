/** gifler.js | github.com/themadcreator/gifler | @license: Apache-2.0 */
!(function e(t, r, n) {
  function i(o, s) {
    if (!r[o]) {
      if (!t[o]) {
        var h = "function" == typeof require && require;
        if (!s && h) return h(o, !0);
        if (a) return a(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = "MODULE_NOT_FOUND"), f);
      }
      var u = (r[o] = { exports: {} });
      t[o][0].call(
        u.exports,
        function (e) {
          var r = t[o][1][e];
          return i(r ? r : e);
        },
        u,
        u.exports,
        e,
        t,
        r,
        n
      );
    }
    return r[o].exports;
  }
  for (
    var a = "function" == typeof require && require, o = 0;
    o < n.length;
    o++
  )
    i(n[o]);
  return i;
})(
  {
    1: [
      function (e, t, r) {
        function n(e, t, r, n) {
          function a(e) {
            var t = e.length;
            if (2 > t || t > 256 || t & (t - 1))
              throw "Invalid code/color length, must be power of 2 and 2 .. 256.";
            return t;
          }
          var o = 0,
            n = void 0 === n ? {} : n,
            s = void 0 === n.loop ? null : n.loop,
            h = void 0 === n.palette ? null : n.palette;
          if (0 >= t || 0 >= r || t > 65535 || r > 65535)
            throw "Width/Height invalid.";
          (e[o++] = 71),
            (e[o++] = 73),
            (e[o++] = 70),
            (e[o++] = 56),
            (e[o++] = 57),
            (e[o++] = 97);
          var f = 0,
            u = 0;
          if (null !== h) {
            for (var l = a(h); (l >>= 1); ) ++f;
            if (((l = 1 << f), --f, void 0 !== n.background)) {
              if (((u = n.background), u >= l))
                throw "Background index out of range.";
              if (0 === u) throw "Background index explicitly passed as 0.";
            }
          }
          if (
            ((e[o++] = 255 & t),
            (e[o++] = (t >> 8) & 255),
            (e[o++] = 255 & r),
            (e[o++] = (r >> 8) & 255),
            (e[o++] = (null !== h ? 128 : 0) | f),
            (e[o++] = u),
            (e[o++] = 0),
            null !== h)
          )
            for (var d = 0, c = h.length; c > d; ++d) {
              var p = h[d];
              (e[o++] = (p >> 16) & 255),
                (e[o++] = (p >> 8) & 255),
                (e[o++] = 255 & p);
            }
          if (null !== s) {
            if (0 > s || s > 65535) throw "Loop count invalid.";
            (e[o++] = 33),
              (e[o++] = 255),
              (e[o++] = 11),
              (e[o++] = 78),
              (e[o++] = 69),
              (e[o++] = 84),
              (e[o++] = 83),
              (e[o++] = 67),
              (e[o++] = 65),
              (e[o++] = 80),
              (e[o++] = 69),
              (e[o++] = 50),
              (e[o++] = 46),
              (e[o++] = 48),
              (e[o++] = 3),
              (e[o++] = 1),
              (e[o++] = 255 & s),
              (e[o++] = (s >> 8) & 255),
              (e[o++] = 0);
          }
          var v = !1;
          (this.addFrame = function (t, r, n, s, f, u) {
            if (
              (v === !0 && (--o, (v = !1)),
              (u = void 0 === u ? {} : u),
              0 > t || 0 > r || t > 65535 || r > 65535)
            )
              throw "x/y invalid.";
            if (0 >= n || 0 >= s || n > 65535 || s > 65535)
              throw "Width/Height invalid.";
            if (f.length < n * s) throw "Not enough pixels for the frame size.";
            var l = !0,
              d = u.palette;
            if (
              ((void 0 === d || null === d) && ((l = !1), (d = h)),
              void 0 === d || null === d)
            )
              throw "Must supply either a local or global palette.";
            for (var c = a(d), p = 0; (c >>= 1); ) ++p;
            c = 1 << p;
            var m = void 0 === u.delay ? 0 : u.delay,
              g = void 0 === u.disposal ? 0 : u.disposal;
            if (0 > g || g > 3) throw "Disposal out of range.";
            var _ = !1,
              w = 0;
            if (
              void 0 !== u.transparent &&
              null !== u.transparent &&
              ((_ = !0), (w = u.transparent), 0 > w || w >= c)
            )
              throw "Transparent color index.";
            if (
              ((0 !== g || _ || 0 !== m) &&
                ((e[o++] = 33),
                (e[o++] = 249),
                (e[o++] = 4),
                (e[o++] = (g << 2) | (_ === !0 ? 1 : 0)),
                (e[o++] = 255 & m),
                (e[o++] = (m >> 8) & 255),
                (e[o++] = w),
                (e[o++] = 0)),
              (e[o++] = 44),
              (e[o++] = 255 & t),
              (e[o++] = (t >> 8) & 255),
              (e[o++] = 255 & r),
              (e[o++] = (r >> 8) & 255),
              (e[o++] = 255 & n),
              (e[o++] = (n >> 8) & 255),
              (e[o++] = 255 & s),
              (e[o++] = (s >> 8) & 255),
              (e[o++] = l === !0 ? 128 | (p - 1) : 0),
              l === !0)
            )
              for (var x = 0, y = d.length; y > x; ++x) {
                var F = d[x];
                (e[o++] = (F >> 16) & 255),
                  (e[o++] = (F >> 8) & 255),
                  (e[o++] = 255 & F);
              }
            o = i(e, o, 2 > p ? 2 : p, f);
          }),
            (this.end = function () {
              return v === !1 && ((e[o++] = 59), (v = !0)), o;
            });
        }
        function i(e, t, r, n) {
          function i(r) {
            for (; d >= r; )
              (e[t++] = 255 & c),
                (c >>= 8),
                (d -= 8),
                t === o + 256 && ((e[o] = 255), (o = t++));
          }
          function a(e) {
            (c |= e << d), (d += l), i(8);
          }
          e[t++] = r;
          var o = t++,
            s = 1 << r,
            h = s - 1,
            f = s + 1,
            u = f + 1,
            l = r + 1,
            d = 0,
            c = 0,
            p = n[0] & h,
            v = {};
          a(s);
          for (var m = 1, g = n.length; g > m; ++m) {
            var _ = n[m] & h,
              w = (p << 8) | _,
              x = v[w];
            if (void 0 === x) {
              for (c |= p << d, d += l; d >= 8; )
                (e[t++] = 255 & c),
                  (c >>= 8),
                  (d -= 8),
                  t === o + 256 && ((e[o] = 255), (o = t++));
              4096 === u
                ? (a(s), (u = f + 1), (l = r + 1), (v = {}))
                : (u >= 1 << l && ++l, (v[w] = u++)),
                (p = _);
            } else p = x;
          }
          return (
            a(p),
            a(f),
            i(1),
            o + 1 === t ? (e[o] = 0) : ((e[o] = t - o - 1), (e[t++] = 0)),
            t
          );
        }
        function a(e) {
          var t = 0;
          if (
            71 !== e[t++] ||
            73 !== e[t++] ||
            70 !== e[t++] ||
            56 !== e[t++] ||
            56 !== ((e[t++] + 1) & 253) ||
            97 !== e[t++]
          )
            throw "Invalid GIF 87a/89a header.";
          var r = e[t++] | (e[t++] << 8),
            n = e[t++] | (e[t++] << 8),
            i = e[t++],
            a = i >> 7,
            s = 7 & i,
            h = 1 << (s + 1);
          e[t++];
          e[t++];
          var f = null;
          a && ((f = t), (t += 3 * h));
          var u = !0,
            l = [],
            d = 0,
            c = null,
            p = 0,
            v = null;
          for (this.width = r, this.height = n; u && t < e.length; )
            switch (e[t++]) {
              case 33:
                switch (e[t++]) {
                  case 255:
                    if (
                      11 !== e[t] ||
                      (78 == e[t + 1] &&
                        69 == e[t + 2] &&
                        84 == e[t + 3] &&
                        83 == e[t + 4] &&
                        67 == e[t + 5] &&
                        65 == e[t + 6] &&
                        80 == e[t + 7] &&
                        69 == e[t + 8] &&
                        50 == e[t + 9] &&
                        46 == e[t + 10] &&
                        48 == e[t + 11] &&
                        3 == e[t + 12] &&
                        1 == e[t + 13] &&
                        0 == e[t + 16])
                    )
                      (t += 14), (v = e[t++] | (e[t++] << 8)), t++;
                    else
                      for (t += 12; ; ) {
                        var m = e[t++];
                        if (0 === m) break;
                        t += m;
                      }
                    break;
                  case 249:
                    if (4 !== e[t++] || 0 !== e[t + 4])
                      throw "Invalid graphics extension block.";
                    var g = e[t++];
                    (d = e[t++] | (e[t++] << 8)),
                      (c = e[t++]),
                      0 === (1 & g) && (c = null),
                      (p = (g >> 2) & 7),
                      t++;
                    break;
                  case 254:
                    for (;;) {
                      var m = e[t++];
                      if (0 === m) break;
                      t += m;
                    }
                    break;
                  default:
                    throw (
                      "Unknown graphic control label: 0x" +
                      e[t - 1].toString(16)
                    );
                }
                break;
              case 44:
                var _ = e[t++] | (e[t++] << 8),
                  w = e[t++] | (e[t++] << 8),
                  x = e[t++] | (e[t++] << 8),
                  y = e[t++] | (e[t++] << 8),
                  F = e[t++],
                  b = F >> 7,
                  I = (F >> 6) & 1,
                  k = 7 & F,
                  C = 1 << (k + 1),
                  A = f,
                  D = !1;
                if (b) {
                  var D = !0;
                  (A = t), (t += 3 * C);
                }
                var R = t;
                for (t++; ; ) {
                  var m = e[t++];
                  if (0 === m) break;
                  t += m;
                }
                l.push({
                  x: _,
                  y: w,
                  width: x,
                  height: y,
                  has_local_palette: D,
                  palette_offset: A,
                  data_offset: R,
                  data_length: t - R,
                  transparent_index: c,
                  interlaced: !!I,
                  delay: d,
                  disposal: p,
                });
                break;
              case 59:
                u = !1;
                break;
              default:
                throw "Unknown gif block: 0x" + e[t - 1].toString(16);
            }
          (this.numFrames = function () {
            return l.length;
          }),
            (this.loopCount = function () {
              return v;
            }),
            (this.frameInfo = function (e) {
              if (0 > e || e >= l.length) throw "Frame index out of range.";
              return l[e];
            }),
            (this.decodeAndBlitFrameBGRA = function (t, n) {
              var i = this.frameInfo(t),
                a = i.width * i.height,
                s = new Uint8Array(a);
              o(e, i.data_offset, s, a);
              var h = i.palette_offset,
                f = i.transparent_index;
              null === f && (f = 256);
              var u = i.width,
                l = r - u,
                d = u,
                c = 4 * (i.y * r + i.x),
                p = 4 * ((i.y + i.height) * r + i.x),
                v = c,
                m = 4 * l;
              i.interlaced === !0 && (m += 4 * r * 7);
              for (var g = 8, _ = 0, w = s.length; w > _; ++_) {
                var x = s[_];
                if (
                  (0 === d &&
                    ((v += m),
                    (d = u),
                    v >= p &&
                      ((m = 4 * l + 4 * r * (g - 1)),
                      (v = c + (u + l) * (g << 1)),
                      (g >>= 1))),
                  x === f)
                )
                  v += 4;
                else {
                  var y = e[h + 3 * x],
                    F = e[h + 3 * x + 1],
                    b = e[h + 3 * x + 2];
                  (n[v++] = b), (n[v++] = F), (n[v++] = y), (n[v++] = 255);
                }
                --d;
              }
            }),
            (this.decodeAndBlitFrameRGBA = function (t, n) {
              var i = this.frameInfo(t),
                a = i.width * i.height,
                s = new Uint8Array(a);
              o(e, i.data_offset, s, a);
              var h = i.palette_offset,
                f = i.transparent_index;
              null === f && (f = 256);
              var u = i.width,
                l = r - u,
                d = u,
                c = 4 * (i.y * r + i.x),
                p = 4 * ((i.y + i.height) * r + i.x),
                v = c,
                m = 4 * l;
              i.interlaced === !0 && (m += 4 * r * 7);
              for (var g = 8, _ = 0, w = s.length; w > _; ++_) {
                var x = s[_];
                if (
                  (0 === d &&
                    ((v += m),
                    (d = u),
                    v >= p &&
                      ((m = 4 * l + 4 * r * (g - 1)),
                      (v = c + (u + l) * (g << 1)),
                      (g >>= 1))),
                  x === f)
                )
                  v += 4;
                else {
                  var y = e[h + 3 * x],
                    F = e[h + 3 * x + 1],
                    b = e[h + 3 * x + 2];
                  (n[v++] = y), (n[v++] = F), (n[v++] = b), (n[v++] = 255);
                }
                --d;
              }
            });
        }
        function o(e, t, r, n) {
          for (
            var i = e[t++],
              a = 1 << i,
              o = a + 1,
              s = o + 1,
              h = i + 1,
              f = (1 << h) - 1,
              u = 0,
              l = 0,
              d = 0,
              c = e[t++],
              p = new Int32Array(4096),
              v = null;
            ;

          ) {
            for (; 16 > u && 0 !== c; )
              (l |= e[t++] << u), (u += 8), 1 === c ? (c = e[t++]) : --c;
            if (h > u) break;
            var m = l & f;
            if (((l >>= h), (u -= h), m !== a)) {
              if (m === o) break;
              for (var g = s > m ? m : v, _ = 0, w = g; w > a; )
                (w = p[w] >> 8), ++_;
              var x = w,
                y = d + _ + (g !== m ? 1 : 0);
              if (y > n)
                return void console.log(
                  "Warning, gif stream longer than expected."
                );
              (r[d++] = x), (d += _);
              var F = d;
              for (g !== m && (r[d++] = x), w = g; _--; )
                (w = p[w]), (r[--F] = 255 & w), (w >>= 8);
              null !== v &&
                4096 > s &&
                ((p[s++] = (v << 8) | x),
                s >= f + 1 && 12 > h && (++h, (f = (f << 1) | 1))),
                (v = m);
            } else (s = o + 1), (h = i + 1), (f = (1 << h) - 1), (v = null);
          }
          return (
            d !== n &&
              console.log("Warning, gif stream shorter than expected."),
            r
          );
        }
        try {
          (r.GifWriter = n), (r.GifReader = a);
        } catch (e) {}
      },
      {},
    ],
    2: [
      function (e, t, r) {
        var n,
          i,
          a,
          o,
          s,
          h,
          f,
          u = function (e, t) {
            return function () {
              return e.apply(t, arguments);
            };
          };
        (i = e("omggif").GifReader),
          (h = function (e) {
            var t, r;
            return (
              (r = new XMLHttpRequest()),
              r.open("GET", e, (t = !0)),
              (r.responseType = "arraybuffer"),
              {
                xhr: r,
                get: function (e) {
                  return (r.onload = f(e)), r.send(), this;
                },
                animate: function (e) {
                  var t;
                  return (
                    (t = s(e)),
                    (r.onload = f(function (e) {
                      return e.animateInCanvas(t);
                    })),
                    r.send(),
                    this
                  );
                },
                frames: function (e, t, n) {
                  var i;
                  return (
                    null == n && (n = !1),
                    (i = s(e)),
                    (r.onload = f(function (e) {
                      return (e.onDrawFrame = t), e.animateInCanvas(i, n);
                    })),
                    r.send(),
                    this
                  );
                },
              }
            );
          }),
          (f = function (e) {
            return function (t) {
              return e(new n(new i(new Uint8Array(this.response))));
            };
          }),
          (s = function (e) {
            var t, r;
            if (
              "string" == typeof e &&
              "CANVAS" ===
                (null != (r = t = document.querySelector(e))
                  ? r.tagName
                  : void 0)
            )
              return t;
            if ("CANVAS" === (null != e ? e.tagName : void 0)) return e;
            throw new Error(
              "Unexpected selector type. Valid types are query-selector-string/canvas-element"
            );
          }),
          (a = function (e, t, r) {
            var n, i, a;
            return (
              (n = document.createElement("canvas")),
              (i = n.getContext("2d")),
              (n.width = e.width),
              (n.height = e.height),
              (a = i.createImageData(t, r)),
              a.data.set(e.pixels),
              i.putImageData(a, -e.x, -e.y),
              n
            );
          }),
          (o = function (e, t) {
            var r;
            return function () {
              r = [];
              for (
                var t = 0, n = e.numFrames();
                n >= 0 ? n > t : t > n;
                n >= 0 ? t++ : t--
              )
                r.push(t);
              return r;
            }
              .apply(this)
              .map(
                (function (t) {
                  return function (t) {
                    var r;
                    return (
                      (r = e.frameInfo(t)),
                      (r.pixels = new Uint8ClampedArray(
                        e.width * e.height * 4
                      )),
                      e.decodeAndBlitFrameRGBA(t, r.pixels),
                      r
                    );
                  };
                })(this)
              );
          }),
          (n = (function () {
            function e(e) {
              var t;
              (this._reader = e),
                (this._advanceFrame = u(this._advanceFrame, this)),
                (this._nextFrameRender = u(this._nextFrameRender, this)),
                (this._nextFrame = u(this._nextFrame, this)),
                (t = this._reader),
                (this.width = t.width),
                (this.height = t.height),
                (this._frames = o(this._reader)),
                (this._loopCount = this._reader.loopCount()),
                (this._loops = 0),
                (this._frameIndex = 0),
                (this._running = !1);
            }
            return (
              (e.prototype.start = function () {
                return (
                  (this._lastTime = new Date().valueOf()),
                  (this._delayCompensation = 0),
                  (this._running = !0),
                  setTimeout(this._nextFrame, 0),
                  this
                );
              }),
              (e.prototype.stop = function () {
                return (this._running = !1), this;
              }),
              (e.prototype.reset = function () {
                return (this._frameIndex = 0), (this._loops = 0), this;
              }),
              (e.prototype._nextFrame = function () {
                requestAnimationFrame(this._nextFrameRender);
              }),
              (e.prototype._nextFrameRender = function () {
                var e, t;
                if (this._running)
                  return (
                    (e = this._frames[this._frameIndex]),
                    null != (t = this.onFrame) &&
                      t.apply(this, [e, this._frameIndex]),
                    this._enqueueNextFrame()
                  );
              }),
              (e.prototype._advanceFrame = function () {
                (this._frameIndex += 1),
                  this._frameIndex >= this._frames.length &&
                    (0 !== this._loopCount && this._loopCount === this._loops
                      ? this.stop()
                      : ((this._frameIndex = 0), (this._loops += 1)));
              }),
              (e.prototype._enqueueNextFrame = function () {
                var e, t, r, n;
                for (this._advanceFrame(); this._running; ) {
                  if (
                    ((r = this._frames[this._frameIndex]),
                    (t = new Date().valueOf() - this._lastTime),
                    (this._lastTime += t),
                    (this._delayCompensation += t),
                    (n = 10 * r.delay),
                    (e = n - this._delayCompensation),
                    (this._delayCompensation -= n),
                    !(0 > e))
                  ) {
                    setTimeout(this._nextFrame, e);
                    break;
                  }
                  this._advanceFrame();
                }
              }),
              (e.prototype.animateInCanvas = function (e, t) {
                var r;
                return (
                  null == t && (t = !0),
                  t && ((e.width = this.width), (e.height = this.height)),
                  (r = e.getContext("2d")),
                  null == this.onDrawFrame &&
                    (this.onDrawFrame = function (e, t, r) {
                      return e.drawImage(t.buffer, t.x, t.y);
                    }),
                  null == this.onFrame &&
                    (this.onFrame = (function (t) {
                      return function (n, i) {
                        var o, s;
                        switch (
                          (null == n.buffer &&
                            (n.buffer = a(n, t.width, t.height)),
                          "function" == typeof t.disposeFrame &&
                            t.disposeFrame(),
                          n.disposal)
                        ) {
                          case 2:
                            t.disposeFrame = function () {
                              return r.clearRect(0, 0, e.width, e.height);
                            };
                            break;
                          case 3:
                            (s = r.getImageData(0, 0, e.width, e.height)),
                              (t.disposeFrame = function () {
                                return r.putImageData(s, 0, 0);
                              });
                            break;
                          default:
                            t.disposeFrame = null;
                        }
                        return null != (o = t.onDrawFrame)
                          ? o.apply(t, [r, n, i])
                          : void 0;
                      };
                    })(this)),
                  this.start(),
                  this
                );
              }),
              e
            );
          })()),
          (h.Animator = n),
          (h.decodeFrames = o),
          (h.createBufferCanvas = a),
          "undefined" != typeof window &&
            null !== window &&
            (window.gifler = h),
          "undefined" != typeof t && null !== t && (t.exports = h);
      },
      { omggif: 1 },
    ],
  },
  {},
  [2]
);
