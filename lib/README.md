# 更新说明
## 1.1.4 更新内容
- 清理 console.log

## 1.1.3 更新内容
 - 修复配置项 rotate 传 0 时的取值问题 
 - 修复 textAlign 为 lef 时，绘制文本的 x 取值不正确。

## 1.1.2更新内容
- 修复 offset 配置项第二个值为 0 时取了第一个值的问题。

# 使用说明

## 安装
```javascript
  npm i watermark-core
```
或者

```javascript
  <script src="./watermark.umd.js"></script>
```

## 使用
**vue2/3、react、javascript 的不同使用示例都在 [watermark仓库](https://github.com/haokunaxx/watermark) 的`/examples/*` 目录下。
进入各个目录（js 目录除外，可直接打开 index.html）后执行以下命令启动示例项目查看。**

```javascript
  npm i
  npm run dev
```

**以下示例为 html + javascript** 

html 结构：
```html
<div id="testBox">
  <h1>xxxxx</h1>
  <h2>xxxxxxxxxxx</h2>
  <p>nihao</p>
  <!-- ... -->
  <button class="J_toggleWatermarkContentBtn">切换水印内容</button>
  <button class="J_showWatermarkBtn">显示水印</button>
  <button class="J_hiddenWatermarkBtn">隐藏水印</button>
</div>
```

script：

```javascript
  let content = ['watermark1(水印 1)', 'watermark2(水印 2)', 'watermark3(水印 3)'],

  const getContainer = () => document.querySelector('#testBox')

  const watermark = new Watermark({
    content,
    getContainer
  })

  watermark.draw()

  document.querySelector('.J_toggleWatermarkContentBtn').addEventListener('click', () => {

    content = ['这是新的水印']

    watermark.draw({
      content,
      getContainer
    })
  })
  document.querySelector('.J_showWatermarkBtn').addEventListener('click', () => {
    watermark.draw({
      content,
      getContainer
    })
  })
  document.querySelector('.J_hiddenWatermarkBtn').addEventListener('click', () => {
    watermark.destroy()
  })
```

样式：
```css
  #testBox {
    position: relative;
    width: 500px;
    height: 500px;
    margin: 100px auto;
    border: 1px solid #ddd
  }
```