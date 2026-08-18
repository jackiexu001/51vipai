# 51VIPAI 上线部署手册

这份文档的目标：把本地网站发布到互联网上，让别人可以通过 `https://www.51vipai.com/` 访问。

## 先理解 3 个角色

```text
本地文件夹 = 你电脑上的网站源文件
GitHub = 保存网站文件的云端仓库
Cloudflare Pages = 把 GitHub 里的网站发布到互联网
```

你可以把流程理解成：

```text
电脑里的网站 -> 上传到 GitHub -> Cloudflare 自动发布 -> 绑定 51vipai.com
```

## 第一步：确认本地网站能打开

先打开本地预览地址：

```text
http://localhost:8000/index.html
```

确认这些页面能打开：

```text
首页
美股分类页
AI 分类页
加密货币分类页
知识分享分类页
任意一篇文章页
404 页面
```

## 第二步：准备 GitHub 仓库

如果你还没有 GitHub 账号，先注册：

```text
https://github.com/
```

然后新建一个仓库，建议仓库名：

```text
51vipai
```

新建仓库时先不要勾选 README、.gitignore、license，因为我们本地已经有这些文件。

## 第三步：把本地网站上传到 GitHub

这一步需要在项目文件夹里运行 Git 命令。

项目文件夹是：

```text
C:\Users\larry.xu\Downloads\Obsdian\徐浪礼的个人知识库\Codex
```

第一次上传的大致命令是：

```powershell
git init
git add .
git commit -m "Create first version of 51VIPAI"
git branch -M main
git remote add origin https://github.com/你的用户名/51vipai.git
git push -u origin main
```

注意：`你的用户名` 要换成你的 GitHub 用户名。

## 第四步：连接 Cloudflare Pages

进入 Cloudflare 控制台：

```text
https://dash.cloudflare.com/
```

然后按这个路径：

```text
Workers & Pages
-> Create application
-> Pages
-> Connect to Git
```

选择你的 GitHub 仓库：

```text
51vipai
```

构建设置可以这样填：

```text
Framework preset: None
Build command: 留空
Build output directory: /
Root directory: /
```

因为我们现在是最简单的静态网站，不需要构建命令。

## 第五步：绑定你的域名

在 Cloudflare Pages 项目里找到：

```text
Custom domains
```

添加：

```text
www.51vipai.com
```

如果你也想让裸域名可访问，再添加：

```text
51vipai.com
```

Cloudflare 会提示你 DNS 怎么设置。因为你的域名已经在 Cloudflare，通常它会自动帮你处理大部分记录。

## 第六步：以后怎么更新网站

以后日常更新就是这个流程：

```text
1. 本地修改 content.js、文章页或图片
2. 用 localhost 预览
3. git add .
4. git commit -m "描述这次更新"
5. git push
6. Cloudflare Pages 自动重新发布
```

你可以把它理解成：

```text
git push = 告诉 Cloudflare：我有新版本了，请重新上线
```

## 常见问题

### 为什么 Cloudflare Pages 不需要服务器？

因为你现在的网站是静态网站，只有 HTML、CSS、JavaScript 和图片。Cloudflare 可以直接托管这些文件。

### 什么时候需要服务器？

当你以后需要登录、评论、会员、数据库、支付、后台管理系统时，才可能需要服务器或数据库。

### 为什么先用 GitHub？

GitHub 可以保存每一次修改记录。改错了可以回头看，也方便 Cloudflare 自动部署。

### backup 文件夹会不会上传？

不会。因为 `.gitignore` 里已经写了：

```text
backup/
```

这表示 GitHub 会忽略这个本地备份文件夹。
