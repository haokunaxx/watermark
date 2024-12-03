var B = Object.defineProperty;
var A = (a, e, t) => e in a ? B(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var u = (a, e, t) => A(a, typeof e != "symbol" ? e + "" : e, t);
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
function N(a) {
  return a == null;
}
function x(a, e) {
  if (!a)
    return e;
  if (Object.prototype.toString.call(a) === "[object Number]")
    return a;
  const t = parseFloat(a);
  return isNaN(t) ? e : t;
}
function U(a) {
  const { image: e, gap: t, rotate: n } = a, h = document.createElement("canvas"), o = h.getContext("2d"), l = ({ width: m, height: s }) => {
    const r = window.devicePixelRatio, i = t[0] + m, f = t[1] + s;
    h.setAttribute("width", `${i * r}px`), h.setAttribute("height", `${f * r}px`), h.style.width = `${i}px`, h.style.height = `${f}px`, o.translate(i * r / 2, f * r / 2), o.scale(r, r);
    const b = Math.PI * n / 180;
    o.rotate(b);
  }, g = (m, s, r) => {
    let i = 0, f = 0;
    const b = [];
    for (const v of s) {
      const { width: p, fontBoundingBoxAscent: k, fontBoundingBoxDescent: y } = m.measureText(v), d = k + y;
      i += d, f < p && (f = p), b.push({
        width: p,
        height: d
      });
    }
    return {
      contentSizeInfoList: b,
      //每行content的宽高信息
      contentWidth: f,
      //当前 content 渲染所需的最大宽度
      contentHeight: i,
      //所有 content 的渲染高度和
      // width: Math.ceil(Math.abs(totalHeight / Math.sin(rotateAngle)) * 2) //也可计算
      width: Math.ceil(Math.abs(Math.sin(r) * i) + Math.abs(Math.cos(r) * f)),
      //旋转后 canvas 需要的宽度
      height: Math.ceil(Math.abs(Math.sin(r) * f) + Math.abs(Math.cos(r) * i))
      //旋转后 canvas 需要的高度
    };
  }, w = () => {
    const { content: m, rotate: s, fontStyle: r, textAlign: i } = a, { fontFamily: f, fontSize: b, fontWeight: v, color: p } = r, k = parseInt(b) || 16, y = Math.PI * s / 180;
    o.font = `${v} ${k}px ${f}`;
    const d = g(o, m, y), $ = a.width || d.width, W = a.height || d.height;
    return l({ width: $, height: W }), o.fillStyle = p, o.font = `${v} ${k}px ${f}`, o.textBaseline = "top", m.forEach((S, I) => {
      const z = d.contentSizeInfoList[I], M = i === "center" ? -z.width / 2 : -d.contentWidth / 2, C = -(a.height || d.contentHeight) / 2 + z.height * I;
      o.fillText(
        S,
        M,
        C,
        a.width || d.contentWidth
        //最大宽度
      );
    }), Promise.resolve({
      watermarkBase64Url: h.toDataURL(),
      width: $,
      height: W
    });
  };
  return e ? new Promise((m) => {
    const s = new Image();
    s.crossOrigin = "anonymous", s.referrerPolicy = "no-referrer", s.onload = () => {
      let { width: r, height: i } = a;
      return !r && !i ? (r = s.width, i = s.height) : (!r || !i) && (r ? i = s.height / s.width * +r : r = s.width / s.height * +i), l({ width: r, height: i }), o.drawImage(s, -r / 2, -i / 2, r, i), m({
        watermarkBase64Url: h.toDataURL(),
        width: r,
        height: i
      });
    }, s.onerror = () => w(), s.src = e;
  }) : w();
}
class H {
  constructor(e) {
    u(this, "mutationObserver", null);
    u(this, "options");
    u(this, "watermarkEl", null);
    /**
     * 绘制水印，在调用之前如果已经绘制过水印则会先移除之前的水印
     */
    u(this, "draw", async (e) => {
      e && (this.options = this.mergeOptions(e));
      const t = this.options;
      if (!t) return;
      const n = t.getContainer();
      if (!n) return;
      const { watermarkBase64Url: h, width: o, height: l } = await U(t);
      this.removeWatermarkEl(), this.appendWatermarkEl(n, this.buildWatermarkEl(h, o, l, t)), this.observe();
    });
    /**
     * 销毁水印
     */
    u(this, "destroy", () => {
      var e;
      (e = this.mutationObserver) == null || e.disconnect(), this.removeWatermarkEl(), this.mutationObserver = null;
    });
    /**
     * 向容器中添加水印元素
     */
    u(this, "appendWatermarkEl", (e, t) => {
      this.watermarkEl = t, e.append(t);
    });
    /**
    * 移除水印元素
    */
    u(this, "removeWatermarkEl", () => {
      var n, h;
      (n = this.mutationObserver) == null || n.disconnect();
      const e = this.watermarkEl, t = (h = this.options) == null ? void 0 : h.getContainer();
      e && (t && t.contains(e) ? t.removeChild(e) : e.remove());
    });
    /**
     * 监测水印是否被移除和修改
     */
    u(this, "observe", () => {
      var t;
      if (!this.mutationObserver) {
        if (!this.watermarkEl) return;
        this.mutationObserver = new MutationObserver((n) => {
          n.some((o) => {
            let l = !1;
            return o.removedNodes.length && (l = Array.from(o.removedNodes).some((g) => g === this.watermarkEl)), o.attributeName === "style" && o.target === this.watermarkEl && (l = !0), l;
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
    u(this, "mergeOptions", (e) => {
      var h, o, l, g, w, E, m, s, r, i;
      const t = e || {}, n = {
        ...t,
        getContainer: t.getContainer,
        rotate: t.rotate ?? c.rotate,
        width: x(t.width, void 0),
        height: x(t.height, void 0),
        textAlign: t.textAlign || "center",
        gap: [
          x((h = t == null ? void 0 : t.gap) == null ? void 0 : h[0], (o = c == null ? void 0 : c.gap) == null ? void 0 : o[0]),
          x((l = t == null ? void 0 : t.gap) == null ? void 0 : l[1], (g = c == null ? void 0 : c.gap) == null ? void 0 : g[1])
        ],
        fontStyle: {
          ...c.fontStyle,
          ...t.fontStyle || {}
        },
        zIndex: t.zIndex || c.zIndex
      };
      return n.offset = [
        x((w = n == null ? void 0 : n.offset) == null ? void 0 : w[0], (E = c == null ? void 0 : c.offset) == null ? void 0 : E[0]),
        x(
          N((m = n == null ? void 0 : n.offset) == null ? void 0 : m[1]) ? (s = n == null ? void 0 : n.offset) == null ? void 0 : s[0] : (r = n == null ? void 0 : n.offset) == null ? void 0 : r[1],
          (i = c == null ? void 0 : c.offset) == null ? void 0 : i[1]
        )
      ], n;
    });
    this.options = this.mergeOptions(e);
  }
  /**
   * 创建水印元素
   */
  buildWatermarkEl(e, t, n, h) {
    const { zIndex: o, gap: l, offset: g } = h, w = document.createElement("div");
    return w.setAttribute("style", `position: absolute;z-index: ${o};left: ${g[0] || 0}px;top: ${g[1] || 0}px;width: calc(100% - ${g[0] || 0}px);height: calc(100% - ${g[1] || 0}px);background-position: 0 0;background-repeat: repeat;background-size: ${l[0] + t}px ${l[1] + n}px;background-image: url(${e});pointer-events: none;`), w;
  }
}
export {
  H as default
};
