var B = Object.defineProperty;
var A = (s, e, t) => e in s ? B(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var d = (s, e, t) => A(s, typeof e != "symbol" ? e + "" : e, t);
const c = {
  zIndex: 999999,
  rotate: -20,
  gap: [24, 24],
  offset: [0, 0],
  // image: 'https://i2.hdslb.com/bfs/face/976d631ab78c2c668e3b42dde7aaefebc1045df6.jpg@240w_240h_1c_1s_!web-avatar-nav.avif',
  textAlign: "center",
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal"
  }
};
function x(s, e) {
  if (!s)
    return e;
  if (Object.prototype.toString.call(s) === "[object Number]")
    return s;
  const t = parseFloat(s);
  return isNaN(t) ? e : t;
}
function N(s) {
  const { image: e, gap: t, rotate: n } = s, h = document.createElement("canvas"), a = h.getContext("2d"), l = ({ width: f, height: i }) => {
    const r = window.devicePixelRatio, o = t[0] + f, g = t[1] + i;
    h.setAttribute("width", `${o * r}px`), h.setAttribute("height", `${g * r}px`), h.style.width = `${o}px`, h.style.height = `${g}px`, a.translate(o * r / 2, g * r / 2), a.scale(r, r);
    const b = Math.PI * n / 180;
    a.rotate(b);
  }, m = (f, i, r) => {
    let o = 0, g = 0;
    const b = [];
    for (const v of i) {
      const { width: p, fontBoundingBoxAscent: k, fontBoundingBoxDescent: y } = f.measureText(v), w = k + y;
      o += w, g < p && (g = p), b.push({
        width: p,
        height: w
      });
    }
    return {
      contentSizeInfoList: b,
      //每行content的宽高信息
      contentWidth: g,
      //当前 content 渲染所需的最大宽度
      contentHeight: o,
      //所有 content 的渲染高度和
      // width: Math.ceil(Math.abs(totalHeight / Math.sin(rotateAngle)) * 2) //也可计算
      width: Math.ceil(Math.abs(Math.sin(r) * o) + Math.abs(Math.cos(r) * g)),
      //旋转后 canvas 需要的宽度
      height: Math.ceil(Math.abs(Math.sin(r) * g) + Math.abs(Math.cos(r) * o))
      //旋转后 canvas 需要的高度
    };
  }, u = () => {
    const { content: f, rotate: i, fontStyle: r, textAlign: o } = s, { fontFamily: g, fontSize: b, fontWeight: v, color: p } = r, k = parseInt(b) || 16, y = Math.PI * i / 180;
    a.font = `${v} ${k}px ${g}`;
    const w = m(a, f, y), $ = s.width || w.width, W = s.height || w.height;
    return l({ width: $, height: W }), a.fillStyle = p, a.font = `${v} ${k}px ${g}`, a.textBaseline = "top", f.forEach((S, I) => {
      const z = w.contentSizeInfoList[I], M = o === "center" ? -z.width / 2 : 12, C = -(s.height || w.contentHeight) / 2 + z.height * I;
      a.fillText(
        S,
        M,
        C,
        s.width || w.contentWidth
        //最大宽度
      );
    }), Promise.resolve({
      watermarkBase64Url: h.toDataURL(),
      width: $,
      height: W
    });
  };
  return e ? new Promise((f) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.referrerPolicy = "no-referrer", i.onload = () => {
      let { width: r, height: o } = s;
      return !r && !o ? (r = i.width, o = i.height) : (!r || !o) && (r ? o = i.height / i.width * +r : r = i.width / i.height * +o), l({ width: r, height: o }), a.drawImage(i, -r / 2, -o / 2, r, o), f({
        watermarkBase64Url: h.toDataURL(),
        width: r,
        height: o
      });
    }, i.onerror = () => u(), i.src = e;
  }) : u();
}
class U {
  constructor(e) {
    d(this, "mutationObserver", null);
    d(this, "options");
    d(this, "watermarkEl", null);
    /**
     * 绘制水印，在调用之前如果已经绘制过水印则会先移除之前的水印
     */
    d(this, "draw", async (e) => {
      e && (this.options = this.mergeOptions(e));
      const t = this.options;
      if (!t) return;
      const n = t.getContainer();
      if (!n) return;
      const { watermarkBase64Url: h, width: a, height: l } = await N(t);
      this.removeWatermarkEl(), this.appendWatermarkEl(n, this.buildWatermarkEl(h, a, l, t)), this.observe();
    });
    /**
     * 销毁水印
     */
    d(this, "destroy", () => {
      var e;
      (e = this.mutationObserver) == null || e.disconnect(), this.removeWatermarkEl(), this.mutationObserver = null;
    });
    /**
     * 向容器中添加水印元素
     */
    d(this, "appendWatermarkEl", (e, t) => {
      this.watermarkEl = t, e.append(t);
    });
    /**
    * 移除水印元素
    */
    d(this, "removeWatermarkEl", () => {
      var n, h;
      (n = this.mutationObserver) == null || n.disconnect();
      const e = this.watermarkEl, t = (h = this.options) == null ? void 0 : h.getContainer();
      e && (t && t.contains(e) ? t.removeChild(e) : e.remove());
    });
    /**
     * 监测水印是否被移除和修改
     */
    d(this, "observe", () => {
      var t;
      if (!this.mutationObserver) {
        if (!this.watermarkEl) return;
        this.mutationObserver = new MutationObserver((n) => {
          n.some((a) => {
            let l = !1;
            return a.removedNodes.length && (l = Array.from(a.removedNodes).some((m) => m === this.watermarkEl)), a.attributeName === "style" && a.target === this.watermarkEl && (l = !0), l;
          }) && (this.removeWatermarkEl(), this.draw());
        });
      }
      const e = (t = this.options) == null ? void 0 : t.getContainer();
      !this.mutationObserver || !e || this.mutationObserver.observe(e, {
        subtree: !0,
        attributes: !0,
        childList: !0
      });
    });
    /**
     * 合并配置参数
     */
    d(this, "mergeOptions", (e) => {
      var h, a, l, m, u, E, f, i, r;
      const t = e || {}, n = {
        ...t,
        getContainer: t.getContainer,
        rotate: t.rotate || c.rotate,
        width: x(t.width, void 0),
        height: x(t.height, void 0),
        textAlign: t.textAlign || "center",
        gap: [
          x((h = t == null ? void 0 : t.gap) == null ? void 0 : h[0], (a = c == null ? void 0 : c.gap) == null ? void 0 : a[0]),
          x((l = t == null ? void 0 : t.gap) == null ? void 0 : l[1], (m = c == null ? void 0 : c.gap) == null ? void 0 : m[1])
        ],
        fontStyle: {
          ...c.fontStyle,
          ...t.fontStyle || {}
        },
        zIndex: t.zIndex || c.zIndex
      };
      return n.offset = [
        x((u = n == null ? void 0 : n.offset) == null ? void 0 : u[0], (E = c == null ? void 0 : c.offset) == null ? void 0 : E[0]),
        x(((f = n == null ? void 0 : n.offset) == null ? void 0 : f[1]) || ((i = n == null ? void 0 : n.offset) == null ? void 0 : i[0]), (r = c == null ? void 0 : c.offset) == null ? void 0 : r[1])
      ], n;
    });
    this.options = this.mergeOptions(e);
  }
  /**
   * 创建水印元素
   */
  buildWatermarkEl(e, t, n, h) {
    const { zIndex: a, gap: l, offset: m } = h, u = document.createElement("div");
    return u.setAttribute("style", `position: absolute;z-index: ${a};left: ${m[0] || 0}px;top: ${m[1] || 0}px;width: calc(100% - ${m[0] || 0}px);height: calc(100% - ${m[1] || 0}px);background-position: 0 0;background-repeat: repeat;background-size: ${l[0] + t}px ${l[1] + n}px;background-image: url(${e});pointer-events: none;`), u;
  }
}
export {
  U as default
};
