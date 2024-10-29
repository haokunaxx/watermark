import { WatermarkOptions } from "./type";

const defaultOptions: Omit<WatermarkOptions, 'getContainer'> = {
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

function isNullOrUndefined(val: any): val is (undefined | null) {
  return val === undefined || val === null
}

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

function getWatermarkBase64Url(options: Required<WatermarkOptions>) {
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
    const { content, rotate, fontStyle, textAlign } = options as Required<WatermarkOptions & { content: string[] }>
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
      watermarkBase64Url: canvas.toDataURL(),
      width,
      height
    })
  }

  // 用 options 中的 image 生成图片水印
  const drawImage = () => {
    return new Promise<{
      watermarkBase64Url: string
      width: number
      height: number
    }>(resolve => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.referrerPolicy = 'no-referrer'
      img.onload = () => {
        let { width, height } = options as Required<WatermarkOptions>
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
          watermarkBase64Url: canvas.toDataURL(),
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

export default class Watermark {
  private mutationObserver: MutationObserver | null = null

  public options: Required<WatermarkOptions> | null
  public watermarkEl: HTMLElement | null = null

  constructor(options: WatermarkOptions) {
    this.options = this.mergeOptions(options)
  }

  /**
   * 绘制水印，在调用之前如果已经绘制过水印则会先移除之前的水印
   */
  draw = async (newOptions?: WatermarkOptions) => {
    if (newOptions) {
      this.options = this.mergeOptions(newOptions)
    }
    const options = this.options
    if (!options) return;
    const containerEl = options.getContainer()
    if (!containerEl) return;

    const { watermarkBase64Url, width, height } = await getWatermarkBase64Url(options)
    this.removeWatermarkEl()
    this.appendWatermarkEl(containerEl, this.buildWatermarkEl(watermarkBase64Url, width, height, options))
    this.observe()
  }

  /**
   * 销毁水印
   */
  destroy = () => {
    this.mutationObserver?.disconnect()  //取消监测
    this.removeWatermarkEl()  //去掉当前容器下的水印元素
    this.mutationObserver = null
  }

  /**
   * 创建水印元素
   */
  private buildWatermarkEl(
    watermarkBase64Url: string,
    width: number,
    height: number, options: Required<WatermarkOptions>) {

    const { zIndex, gap, offset } = options
    const newWatermarkEl = document.createElement('div')
    newWatermarkEl.setAttribute('style', `position: absolute;z-index: ${zIndex};left: ${offset[0] || 0}px;top: ${offset[1] || 0}px;width: calc(100% - ${offset[0] || 0}px);height: calc(100% - ${offset[1] || 0}px);background-position: 0 0;background-repeat: repeat;background-size: ${gap[0] + width}px ${gap[1] + height}px;background-image: url(${watermarkBase64Url});pointer-events: none;`)
    return newWatermarkEl
  }

  /**
   * 向容器中添加水印元素
   */
  private appendWatermarkEl = (containerEl: HTMLElement, newWatermarkEl: HTMLDivElement) => {
    this.watermarkEl = newWatermarkEl
    containerEl.append(newWatermarkEl)
  }

  /**
  * 移除水印元素
  */
  private removeWatermarkEl = () => {
    this.mutationObserver?.disconnect()
    const watermarkEl = this.watermarkEl
    const containerEl = this.options?.getContainer()
    if (watermarkEl) {
      if (containerEl && containerEl.contains(watermarkEl)) {
        containerEl.removeChild(watermarkEl)
      } else {
        watermarkEl.remove()
      }
    }
  }

  /**
   * 监测水印是否被移除和修改
   */
  private observe = () => {
    if (!this.mutationObserver) {
      if (!this.watermarkEl) return;
      this.mutationObserver = new MutationObserver((mutations) => {
        const isChanged = mutations.some(mutation => {
          let flag = false
          if (mutation.removedNodes.length) {
            flag = Array.from(mutation.removedNodes).some(node => node === this.watermarkEl)
          }
          if (mutation.attributeName === 'style' && mutation.target === this.watermarkEl) {
            flag = true
          }
          return flag
        })
        if (isChanged) {
          this.removeWatermarkEl()
          this.draw()
        }
      })
    }
    const containerEl = this.options?.getContainer()
    if (!this.mutationObserver || !containerEl) return;
    this.mutationObserver!.observe(containerEl, {
      subtree: true,
      attributes: true,
      childList: true
    })
  }

  /**
   * 合并配置参数
   */
  private mergeOptions = (_options: WatermarkOptions) => {
    const options = _options || {}
    const mergedOptions = {
      ...options,
      getContainer: options.getContainer!,
      rotate: options.rotate || defaultOptions.rotate,
      width: parseNumber(options.width, undefined),
      height: parseNumber(options.height, undefined),

      textAlign: options.textAlign || 'center',
      gap: [
        parseNumber(options?.gap?.[0], defaultOptions?.gap?.[0]),
        parseNumber(options?.gap?.[1], defaultOptions?.gap?.[1]),
      ],
      fontStyle: {
        ...defaultOptions.fontStyle,
        ...(options.fontStyle || {})
      },
      zIndex: options.zIndex || defaultOptions.zIndex,
    } as Required<WatermarkOptions>

    mergedOptions['offset'] = [
      parseNumber(mergedOptions?.offset?.[0], defaultOptions?.offset?.[0]) as number,
      parseNumber(
        isNullOrUndefined(mergedOptions?.offset?.[1]) 
          ? mergedOptions?.offset?.[0] 
          : mergedOptions?.offset?.[1], 
        defaultOptions?.offset?.[1]) as number,
    ]
    return mergedOptions
  }
}