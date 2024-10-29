import { WatermarkOptions } from "watermark-core"
import WatermarkBuilder from 'watermark-core'
import { PropsWithChildren, useEffect, useRef, CSSProperties, useCallback, useMemo, forwardRef,  useImperativeHandle } from "react"

type WatermarkCompProps = PropsWithChildren<Omit<WatermarkOptions, 'getContainer'> & {
  style?: CSSProperties,
  className?: string
}>
export const WaterMarkWithRef = (props: WatermarkCompProps, ref: any) => {
  const { children,
    style,
    className = '',

    rotate,
    content,
    image,
    zIndex,
    textAlign,

    width,
    height,
    fontStyle,
    gap,
    offset,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const getContainer = useCallback(() => {
    return containerRef.current
  }, [])

  const calcStyle = useMemo<CSSProperties>(() => ({
    ...style,
    position: 'relative'
  }), [style])


  const offsetStr = offset?.join(','),
    gapStr = gap?.join(','),
    fontStyleStr = JSON.stringify(fontStyle)

  const watermarkOptions = useMemo(() => {
    const offset = offsetStr?.split(',').map(Number) as WatermarkOptions['offset'],
      gap = gapStr?.split(',').map(Number) as WatermarkOptions['gap']

    return {
      rotate,
      content,
      image,
      zIndex,
      textAlign,
      width,
      height,
      fontStyle: fontStyleStr && JSON.parse(fontStyleStr),
      gap,
      offset,
      getContainer
    }
  }, [rotate,
    content,
    image,
    zIndex,
    textAlign,
    width,
    height,
    fontStyleStr,
    gapStr,
    offsetStr,
    getContainer])

  const watermark = useRef(new WatermarkBuilder(watermarkOptions))

  // expose
  useImperativeHandle(ref, () => ({
    destroy: watermark.current.destroy,
    draw: watermark.current.draw
  }))

  useEffect(() => {
    const _watermark = watermark.current
    _watermark.draw(watermarkOptions)
    return () => {
      _watermark.destroy()
    }
  }, [watermarkOptions])

  return children ? <div className={className} ref={containerRef} style={calcStyle}>
    {children}
  </div> : null
}

// Similar to the styled-component，可以视作一个容器组件。
export const WaterMark = forwardRef(WaterMarkWithRef)