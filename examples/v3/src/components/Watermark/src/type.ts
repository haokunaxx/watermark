import { WatermarkOptions } from "watermark-core"

export interface WatermarkExpose {
  draw: (options?: WatermarkOptions) => void
  destroy: () => void
}

