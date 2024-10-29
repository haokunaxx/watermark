declare class Watermark {
    private mutationObserver;
    options: Required<WatermarkOptions> | null;
    watermarkEl: HTMLElement | null;
    constructor(options: WatermarkOptions);
    /**
     * 绘制水印，在调用之前如果已经绘制过水印则会先移除之前的水印
     */
    draw: (newOptions?: WatermarkOptions) => Promise<void>;
    /**
     * 销毁水印
     */
    destroy: () => void;
    /**
     * 创建水印元素
     */
    private buildWatermarkEl;
    /**
     * 向容器中添加水印元素
     */
    private appendWatermarkEl;
    /**
     * 移除水印元素
     */
    private removeWatermarkEl;
    /**
     * 监测水印是否被移除和修改
     */
    private observe;
    /**
     * 合并配置参数
     */
    private mergeOptions;
}
export default Watermark;

export declare interface WatermarkOptions {
    zIndex?: string | number;
    width?: number;
    height?: number;
    rotate?: number;
    image?: string;
    content?: string | string[];
    textAlign?: 'left' | 'center';
    fontStyle?: {
        color?: string;
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: string;
    };
    gap?: [number, number];
    offset?: [number, number];
    getContainer: () => HTMLElement | null;
}

export { }
