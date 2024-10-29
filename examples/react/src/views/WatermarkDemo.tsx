import { useRef, useState } from "react";
import { WaterMark } from "../components/WaterMark";
export function WatermarkDemo() {
  // const [watermarkProps, setWatermarkProps] = useState({
  // style: {
  //   width: '500px',
  //   height: '500px',
  //   margin: '100px auto',
  //   border: '1px solid #ddd'
  // },
  //   rotate: 30,
  //   content: ['jannkjdhachaoohkbcancmamc',
  //     '哈啰 hello hi Halo 哈喽',
  //     '你好我是？？',
  //     '你好我有一个帽衫']
  // })

  const [content, setContent] = useState(['jannkjdhachaoohkbcancmamc',
    '哈啰 hello hi Halo 哈喽',
    '你好我是？？',
    '你好我有一个帽衫'])
  const [offset, setOffset] = useState<[number, number] | [number]>([0, 0])

  const watermarkRef = useRef<{
    draw: () => void
    destroy: () => void
  }>(null)
  const toggleContent1 = () => {
    setContent(['dasdadadadadadad', 'xux 199801', 'abcdefghijklmn'])
  }
  const toggleContent2 = () => {
    setContent(['你好，再见！'])
  }

  const showWaterMark = () => {
    watermarkRef.current?.draw()
  }

  const hiddenWatermark = () => {
    watermarkRef.current?.destroy()
  }

  const moveWatermark = () => {
    // setOffset([100, 100])
    setOffset([100, 0])
    // setOffset([100])
  }
  return <WaterMark ref={watermarkRef}
    // {
    // ...watermarkProps
    // }
    style={{
      width: '500px',
      height: '500px',
      margin: '100px auto',
      border: '1px solid #ddd'
    }}
    content={content}
    offset={offset}
  >
    <div>
      <h1>asdjahdknalkdhakld</h1>
      <h2>adjlajdlajdlja</h2>
      nihao
      <button onClick={toggleContent1}>切换水印内容 1</button>
      <button onClick={toggleContent2}>切换水印内容 2</button>
      <button onClick={showWaterMark}>显示水印</button>
      <button onClick={hiddenWatermark}>隐藏水印</button>
      <button onClick={moveWatermark}>水印整体右移 100 px</button>
    </div>
  </WaterMark>
}