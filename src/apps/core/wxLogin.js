! function (n, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (n = n || self).WwLogin = e()
}(this, (function () {


  function n(n, e) {
    if (!(n instanceof e)) throw new TypeError("Cannot call a class as a function")
  }

  function e(n, e) {
    for (var t = 0; t < e.length; t++) {
      var o = e[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(n, o.key, o)
    }
  }
  var t = {
    sso: "/wwopen/sso/qrConnect",
    tww: "/login/wwLogin/sso/qrConnect",
    native: "/native/sso/qrConnect",
    twxg: "/login/wwLogin/sso/qrConnect"
  };
  return function () {
    function o() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      n(this, o), e.version = "1.2.5", this.options = e, this.url = this.getUrl(e), this.init(this.url)
    }
    var i, s, r;
    return i = o, (s = [{
      key: "init",
      value: function (n) {
        this.options.is_mobile ? window.location = n : this.createFrame(n)
      }
    }, {
      key: "getUrl",
      value: function (n) {
        var e = ["login_type=jssdk"];
        for (var o in n)[void 0, null].includes(n[o]) || "id" === o || e.push("".concat(o, "=").concat(n[o]));
        n.business_type = n.business_type || "sso";
        var i = t[n.business_type];
        if (!i) throw new Error("Argument business_type not match. Current version is ".concat("1.2.5", "."));
        return "".concat("https://open.work.weixin.qq.com").concat(i, "?").concat(e.join("&"))
      }
    }, {
      key: "createFrame",
      value: function (n) {
        var e = document.createElement("iframe"),
          t = document.getElementById(this.options.id);
        e.src = n, e.frameBorder = "0", e.allowTransparency = "true", e.scrolling = "no", e.width = "300px", e.height = "400px", t.innerHTML = "", t.appendChild(e), e.onload = function () {
          e.contentWindow.postMessage && window.addEventListener && (window.addEventListener("message", (function (n) {
            var e = n.data;
            "string" == typeof e && /^http/.test(e) && e && n.origin.indexOf("work.weixin.qq.com") > -1 && (window.location.href = e)
          })), e.contentWindow.postMessage("ask_usePostMessage", "*"))
        }
      }
    }]) && e(i.prototype, s), r && e(i, r), o
  }()
}));