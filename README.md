# DevNotes · 个人技术博客

一个零依赖的个人技术博客项目，使用**纯 HTML5 + CSS3 + 原生 JavaScript** 构建，
没有框架、没有构建工具、没有 CDN 依赖，开箱即用。

## 快速开始

方式一：直接用浏览器打开 `index.html`（双击即可）。

方式二：起一个本地 HTTP 服务器（推荐）:

```bash
cd dev-blog
python3 -m http.server 8000
```

然后访问 http://localhost:8000

## 目录结构

```
dev-blog/
├── index.html              # 首页：文章列表 + 搜索
├── about.html              # 关于页
├── posts/                  # 文章页
│   ├── html5-semantic.html
│   ├── css-flexbox-guide.html
│   └── js-event-loop.html
├── css/
│   └── style.css           # 全部样式（含明暗两套主题）
├── js/
│   └── main.js             # 主题切换 / 搜索 / 返回顶部 / 阅读时长
└── README.md
```

## 已实现的功能

- ✅ 响应式布局（手机 / 平板 / 桌面）
- ✅ 明暗主题一键切换，本地记忆 + 首次跟随系统偏好
- ✅ 首页文章实时搜索（标题 / 摘要 / 标签）
- ✅ 文章阅读时长自动估算
- ✅ 返回顶部按钮、粘性导航

## 如何发布新文章

1. 复制 `posts/` 下任意文章模板（如 `html5-semantic.html`），改名为新文章名
2. 修改页面中标题、日期、标签、正文
3. 在 `index.html` 的文章列表顶部（或末尾）粘贴一个 `.post-card`（`<article>`）
   并更新链接与 `data-tags`（`data-tags` 是搜索时匹配的关键词）
4. 完成，刷新页面即可看到新文章

## 自定义

| 想改什么      | 改哪里                                        |
| ------------- | --------------------------------------------- |
| 站点名称      | 全局搜索替换 `DevNotes`（导航、页脚、标题）   |
| 主题色        | `css/style.css` 中的 `--primary`/`--primary-hover` |
| 个人介绍      | `about.html`                                  |
| 每页排版宽度  | `css/style.css` 中的 `--container`            |
