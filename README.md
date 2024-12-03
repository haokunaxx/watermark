# 使用

## 安装
```javascript
  npm i watermark-core
```
或者

```javascript
  <script src="./watermark.umd.js"></script>
```

## 使用
vue2/3、react、javascript 的不同使用示例都在[watermark仓库](https://github.com/haokunaxx/watermark) 的`/examples/*` 目录下。
进入各个目录（js 目录除外，可直接打开 index.html）后执行以下命令启动示例项目查看。

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