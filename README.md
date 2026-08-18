# 51VIPAI 建站学习项目

这是你的第一版网站骨架，目标是先学会网页最基础的三个组成部分。

## 你现在拥有了什么

- `index.html`：网页内容。想改标题、栏目、文章文字、社交链接，先看这里。
- `styles.css`：网页样式。想改颜色、字号、间距、布局，先看这里。
- `content.js`：网站内容。想改文章、社交媒体、快捷入口，优先看这里。
- `script.js`：网页互动。现在负责顶部 Tab 切换、图标显示和手机端菜单。

## 第一课：网页由三层组成

1. HTML：决定页面有什么内容。
2. CSS：决定页面长什么样。
3. JavaScript：决定页面怎么互动。

你可以把它理解成：

```text
HTML = 房子的结构
CSS = 装修和布局
JavaScript = 开关、电梯和自动门
```

## 第一版网站结构

```text
首页
├── 美股
├── AI
├── 加密货币
├── 知识分享
├── 实用工具
└── 关于
```

## 下一步练习

1. 把 `content.js` 里的社交媒体链接 `url: "#"` 改成你的真实链接。
2. 把 `content.js` 里的占位文章标题改成你真正想写的文章。
3. 用浏览器打开 `index.html`，看看页面效果。
4. 后续我们再学习如何把它部署到 Cloudflare Pages。

## 第二课：把常改内容集中管理

现在社交媒体链接和快捷入口已经放到 `content.js` 顶部的 `siteConfig` 里。

以后你要改社交媒体链接，主要改这里：

```js
const siteConfig = {
  socialLinks: [
    { label: "X / Twitter", shortLabel: "X", url: "#" },
  ],
};
```

其中：

- `label`：完整名称，显示在侧边栏。
- `shortLabel`：短名称，显示在顶部小图标区。
- `url`：真正的链接地址。
- `icon`：想显示的图标类型，比如 `youtube`、`telegram`、`email`。

如果你还没有真实链接，就先保留 `#`。它代表“暂时不跳转”。

## 第三课：文字链接变成图标链接

如果你希望 YouTube 显示成图标，就在 `content.js` 的链接配置里加上：

```js
{ label: "YouTube", shortLabel: "YT", icon: "youtube", url: "#" },
```

现在支持的图标有：

```text
youtube
telegram
email
```

如果某个平台还没有专门图标，比如小红书和微信，页面会自动显示 `shortLabel` 作为替代。

## 第四课：内容和功能分开

现在你主要记住两个文件：

```text
content.js = 你经常改的内容
script.js = 网站自动运行的功能
```

刚开始建站时，不要追求每个文件都看懂。你先学会定位：

```text
我要改文章、链接、分类 -> content.js
我要改颜色、大小、布局 -> styles.css
我要改页面结构 -> index.html
```

## 第五课：Logo 和图片怎么换

网站图片统一放在 `assets` 文件夹。

如果你有 Logo 图片，比如文件名是：

```text
logo.png
```

先把它放到：

```text
assets/logo.png
```

然后打开 `content.js`，找到：

```js
brand: {
  name: "51VIPAI",
  subtitle: "个人投资与 AI 知识库",
  logoImage: "",
},
```

改成：

```js
brand: {
  name: "51VIPAI",
  subtitle: "个人投资与 AI 知识库",
  logoImage: "assets/logo.png",
},
```

如果你要给文章加封面图，比如图片是：

```text
assets/ai-cover.jpg
```

就在对应文章里改：

```js
image: "assets/ai-cover.jpg",
```

如果 `image` 留空，页面会显示一个自动生成的占位封面。

## 第六课：首页卡片和文章页

现在首页上的部分文章卡片可以点击进入详情页。

文章页放在：

```text
articles/
```

例如：

```text
articles/us-stocks-beginner.html
articles/ai-tools-map.html
articles/crypto-beginner.html
```

首页卡片为什么能跳转？因为 `content.js` 里的文章加了 `url`：

```js
{
  title: "AI 工具地图：从使用者到创造者",
  url: "articles/ai-tools-map.html",
}
```

你可以这样理解：

```text
首页卡片 = 文章入口
articles 里面的 HTML 文件 = 文章正文
url = 入口要跳去哪里
```

## 第七课：新增一篇文章的标准流程

以后新增文章按这 4 步来：

```text
1. 复制 templates/article-template.html
2. 放到 articles 文件夹里，并改成英文文件名
3. 修改文章标题、摘要、日期、正文
4. 在 content.js 里给对应卡片填写 url
```

例如新增一篇知识库文章：

```text
articles/how-to-build-knowledge-base.html
```

然后在 `content.js` 对应文章里写：

```js
url: "articles/how-to-build-knowledge-base.html",
```

为什么文件名建议用英文？

```text
英文文件名更适合网址，也更不容易在部署时出现编码问题。
```

## 第八课：分类独立页面

现在每个栏目都有自己的页面：

```text
categories/us-stocks.html
categories/ai.html
categories/crypto.html
categories/knowledge.html
categories/tools.html
categories/about.html
```

首页点击“查看全部”会进入当前分类页。

你可以这样理解：

```text
首页 = 展示重点内容
分类页 = 展示某一类的全部内容
文章页 = 展示一篇文章的正文
```

这个结构更接近真正的博客网站，也更适合以后做搜索引擎优化。

## 第九课：用本地网址预览网站

以后建议用本地预览地址打开网站：

```text
http://localhost:8000/index.html
```

不要频繁双击 `index.html`。

你可以这样理解：

```text
双击 HTML = 直接从电脑文件夹打开
localhost = 在自己电脑上临时模拟一个真实网站
```

为什么推荐 `localhost`？

```text
1. 更接近真实网站运行方式
2. 页面跳转路径更稳定
3. 排查问题更清楚
4. 后面部署到 Cloudflare Pages 时更容易理解
```

如果本地预览服务没有启动，可以在项目文件夹里运行：

```powershell
py -m http.server 8000
```

然后打开：

```text
http://localhost:8000/index.html
```

如果你想停止本地预览服务，可以在运行命令的窗口里按：

```text
Ctrl + C
```

## 第十课：部署前准备

上线前要区分两类文件：

```text
正式网站文件 = 可以放到网上
本地辅助文件 = 给自己学习、备份、整理用，不一定要公开
```

目前正式网站核心文件包括：

```text
index.html
404.html
styles.css
content.js
script.js
category.js
robots.txt
sitemap.xml
assets/
articles/
categories/
```

其中：

```text
404.html = 用户访问不存在页面时看到的页面
robots.txt = 给搜索引擎看的抓取规则
sitemap.xml = 给搜索引擎看的网站地图
.gitignore = 告诉 GitHub 哪些本地文件不要上传
```

`backup/` 是本地备份文件夹，不应该作为正式网站内容发布。

部署前检查清单：

```text
1. 首页能打开
2. 分类页能打开
3. 文章页能打开
4. 图片路径没有写错
5. 社交媒体链接没有填错
6. backup 不上传
7. 404 页面存在
8. sitemap.xml 里的域名是正式域名
```

## 第十一课：上线部署的基本路线

部署手册在：

```text
DEPLOYMENT.md
```

你现在先记住这条路线：

```text
本地网站 -> GitHub -> Cloudflare Pages -> 51vipai.com
```

其中：

```text
GitHub = 保存代码和文章
Cloudflare Pages = 发布网站
51vipai.com = 用户访问的网站地址
```

## Cloudflare Pages 的简单理解

Cloudflare Pages 是一个“网站托管平台”。你把网站文件交给它，它就帮你把这些页面放到互联网上，让别人可以通过 `51vipai.com` 访问。

第一阶段我们先把本地网站做好。等你熟悉修改方法后，再部署上线。
