export interface WaterMarkOptions{
  zIndex?: string | number
  width?: number
  height?: number
  rotate?: number
  image?: string
  content?: string | string[]
  textAlign?: 'left' | 'center'
  fontStyle?: {
    color?: string
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
  }
  gap?: [number, number]
  offset?: [number, number]
  getContainer: () => HTMLElement | null
}