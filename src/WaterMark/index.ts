import { WaterMarkOptions } from "./type";

const defaultOptions = {
  zIndex: 999999,
  rotate: -20,
  gap: [24, 24],
  offset: [0, 0],
  // image: 'https://i2.hdslb.com/bfs/face/976d631ab78c2c668e3b42dde7aaefebc1045df6.jpg@240w_240h_1c_1s_!web-avatar-nav.avif',
  textAlign: 'center',
  fontStyle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
};

function parseNumber(val: string | undefined | number, defVal: number | undefined) {
  if (!val) {
    return defVal as number
  }

  if (Object.prototype.toString.call(val) === '[object Number]') {
    return val as number
  }

  const parseRes = parseFloat(val as string)
  return isNaN(parseRes) ? defVal : parseRes
}

export function getWaterMarkBase64Url(options: Required<WaterMarkOptions>) {
  const { image, gap, rotate } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  /**
   * 配置 canvas：大小、旋转、平移原点至中心、根据设备像素比缩放(绘制大的，缩放成小的)。
   * @param {}  
   */
  const configCanvas = ({ width, height }: { width: number, height: number }) => {
    const ratio = window.devicePixelRatio
    const canvasWidth = gap[0] + width,
      canvasHeight = gap[1] + height
    canvas.setAttribute('width', `${canvasWidth * ratio}px`)
    canvas.setAttribute('height', `${canvasHeight * ratio}px`)
    // 控制 canvas 显示，不对生成的图片有影响。
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`
    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2)
    ctx.scale(ratio, ratio)
    const rotateAngle = Math.PI * rotate / 180
    ctx.rotate(rotateAngle)
  }


  const measureText = (ctx: CanvasRenderingContext2D, content: string[], rotateAngle: number) => {
    let totalHeight = 0,
      maxWidth = 0
    const contentSizeInfoList = []
    for (const item of content) {
      const { width, fontBoundingBoxAscent, fontBoundingBoxDescent } = ctx.measureText(item)
      const lineHeight = fontBoundingBoxAscent + fontBoundingBoxDescent
      totalHeight += lineHeight
      maxWidth < width && (maxWidth = width);
      contentSizeInfoList.push({
        width,
        height: lineHeight
      })
    }

    return {
      contentSizeInfoList,  //每行content的宽高信息
      contentWidth: maxWidth, //当前 content 渲染所需的最大宽度
      contentHeight: totalHeight, //所有 content 的渲染高度和
      // width: Math.ceil(Math.abs(totalHeight / Math.sin(rotateAngle)) * 2) //也可计算
      width: Math.ceil(Math.abs(Math.sin(rotateAngle) * totalHeight) + Math.abs(Math.cos(rotateAngle) * maxWidth)), //旋转后 canvas 需要的宽度
      height: Math.ceil(Math.abs(Math.sin(rotateAngle) * maxWidth) + Math.abs(Math.cos(rotateAngle) * totalHeight)) //旋转后 canvas 需要的高度
    }

  }


  // 用 options 中的 content 生成文字水印
  const drawText = () => {
    const { content, rotate, fontStyle, textAlign } = options as Required<WaterMarkOptions & { content: string[] }>
    const { fontFamily, fontSize, fontWeight, color } = fontStyle
    const realFontSize = parseInt(fontSize!) || 16

    const rotateAngle = Math.PI * rotate / 180
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`
    const measureSize = measureText(ctx, content, rotateAngle)

    const width = options.width || measureSize.width,
      height = options.height || measureSize.height
    configCanvas({ width, height })
    ctx.fillStyle = color as string
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`  //此行避免 ctx.font重置。但为什么会重置？
    ctx.textBaseline = 'top'

    content.forEach((item, index) => {
      const itemSizeInfo = measureSize.contentSizeInfoList[index]
      const startX = textAlign === "center" ? -itemSizeInfo.width / 2 : 12,
        startY = -(options.height || measureSize.contentHeight) / 2 + itemSizeInfo.height * index

      ctx.fillText(item, startX, startY,
        options.width || measureSize.contentWidth //最大宽度
      )
    })

    return Promise.resolve({
      waterMarkBase64Url: canvas.toDataURL(),
      width,
      height
    })
  }

  // 用 options 中的 image 生成图片水印
  const drawImage = () => {
    return new Promise<{
      waterMarkBase64Url: string
      width: number
      height: number
    }>(resolve => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.referrerPolicy = 'no-referrer'
      img.onload = () => {
        let { width, height } = options as Required<WaterMarkOptions>
        if (!width && !height) {  // 都不存在
          width = img.width
          height = img.height
        } else if (!width || !height) {  // 两者有一不存在
          if (!width) {
            width = img.width / img.height * +height
          } else {
            height = img.height / img.width * +width
          }
        }
        configCanvas({ width, height })
        ctx.drawImage(img, -width / 2, -height / 2, width, height)
        return resolve({
          waterMarkBase64Url: canvas.toDataURL(),
          width,
          height
        })
      }
      img.onerror = () => {
        return drawText()
      }
      img.src = image
    })
  }
  return image ? drawImage() : drawText()
}

export default class WaterMark {
  public options: Required<WaterMarkOptions> | null
  private mutationObserver: MutationObserver | null = null
  public containerEl: HTMLElement | null = null
  public waterMarkEl: HTMLElement | null = null
  private visibleStatus = false

  constructor(options: WaterMarkOptions) {
    this.options = this.mergeOptions(options)
    this.containerEl = this.options.getContainer()
  }

  /**
   * 绘制水印
   */
  async draw() {
    const containerEl = this.containerEl,
      options = this.options
    if (!containerEl || !options) return
    this.visibleStatus = true
    if (this.mutationObserver) {
      // 销毁
      this.mutationObserver.disconnect()
      this.removeWaterMarkEl()
      // this.waterMarkEl && this.waterMarkEl.remove()
      // this.waterMarkEl = null
    }
    const { waterMarkBase64Url, width, height } = await getWaterMarkBase64Url(options)
    const { zIndex, gap, offset } = options as Required<WaterMarkOptions>
    const newWaterMarkEl = document.createElement('div')
    newWaterMarkEl.setAttribute('style', `
      position: absolute;
      z-index: ${zIndex};
      left: ${offset[0] || 0}px;
      top: ${offset[1] || 0}px;
      width: calc(100% - ${offset[0] || 0}px);
      height: calc(100% - ${offset[1] || 0}px);
      background-position: 0 0;
      background-repeat: repeat;
      background-size: ${gap[0] + width}px ${gap[1] + height}px;
      background-image: url(${waterMarkBase64Url});
      pointer-events: none;
    `)

    this.waterMarkEl = newWaterMarkEl
    containerEl.append(newWaterMarkEl)
    this.observe()
  }

  /**
   * 隐藏水印
   */
  hidden() {
    if (!this.waterMarkEl || !this.visibleStatus) return;
    this.visibleStatus = false
    this.disconnect()
    this.waterMarkEl.style.display = 'none'
  }

  /**
   * 显示水印
   */
  show() {
    if (!this.waterMarkEl || this.visibleStatus) return;
    this.visibleStatus = true
    this.waterMarkEl.style.display = 'block'
    this.observe()
  }

  /**
   * 销毁水印
   */
  destroy() {
    this.disconnect()   //取消监测
    this.removeWaterMarkEl()  //去掉当前容器下的水印元素
    this.mutationObserver = null
    this.options = null
    this.waterMarkEl = null
    this.visibleStatus = false
  }

  /**
   * 刷新水印（更新配置项并重新绘制）
   */
  fresh(options: WaterMarkOptions) {
    this.updateOptions(options)
    this.draw()
  }


  /**
  * 移除水印元素
  */
  private removeWaterMarkEl() {
    const waterMarkEl = this.waterMarkEl,
      containerEl = this.containerEl

    if (waterMarkEl) {
      if (containerEl && containerEl.contains(waterMarkEl)) {
        containerEl.removeChild(waterMarkEl)
      } else {
        waterMarkEl.remove()
      }
    }
  }

  /**
   * 监测水印是否被移除和修改
   */
  private observe() {
    if (!this.mutationObserver) {
      if (!this.waterMarkEl) return;
      this.mutationObserver = new MutationObserver((mutations) => {
        const isChanged = mutations.some(mutation => {
          let flag = false
          if (mutation.removedNodes.length) {
            flag = Array.from(mutation.removedNodes).some(node => node === this.waterMarkEl)
          }
          if (mutation.attributeName === 'style' && mutation.target === this.waterMarkEl) {
            flag = true
          }
          return flag
        })
        if (isChanged) {
          this.removeWaterMarkEl()
          this.draw()
        }
      })
    }

    if (!this.mutationObserver || !this.containerEl) return;
    this.mutationObserver!.observe(this.containerEl, {
      subtree: true,
      attributes: true,
      childList: true
    })
  }

  /**
 * 停止监测
 */
  private disconnect() {
    if (!this.mutationObserver) return
    this.mutationObserver.disconnect()
  }

  /**
   * 合并配置参数
   */
  private mergeOptions(_options: Partial<WaterMarkOptions>) {
    const options = _options || {}
    const mergedOptions = {
      ...options,
      getContainer: options.getContainer!,
      rotate: options.rotate || defaultOptions.rotate,
      width: parseNumber(options.width, undefined),
      height: parseNumber(options.height, undefined),

      textAlign: options.textAlign || 'center',
      gap: [
        parseNumber(options?.gap?.[0], defaultOptions.gap[0]),
        parseNumber(options?.gap?.[1], defaultOptions.gap[1]),
      ],
      fontStyle: {
        ...defaultOptions.fontStyle,
        ...(options.fontStyle || {})
      },
      zIndex: options.zIndex || defaultOptions.zIndex,
    } as Required<WaterMarkOptions>

    mergedOptions['offset'] = [
      parseNumber(mergedOptions?.offset?.[0], defaultOptions.offset[0]) as number,
      parseNumber(mergedOptions?.offset?.[1] || mergedOptions?.offset?.[0], defaultOptions.offset[1]) as number,
    ]
    return mergedOptions
  }

  /**
   * 更新配置选项
   */
  private updateOptions(options: WaterMarkOptions) {
    this.options = this.mergeOptions(options)
    this.containerEl = options.getContainer()
  }
}