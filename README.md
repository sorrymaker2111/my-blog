# [sorrymaker 的博客](https://sorrymaker.top)

> 「他单纯只想玩 galgame」 - 一个喜欢玩游戏的 Java 开发者的个人博客

![](img/index_bg.png)

## 关于本站

这是一个基于 Jekyll 的个人博客网站，主要记录：

- Java 编程与开发技术分享
- SpringBoot 框架学习笔记
- Web 前后端开发心得
- Galgame 游戏体验与推荐
- 日常生活随想与记录

本站使用[Hux Blog](https://github.com/Huxpro/huxpro.github.io)主题修改而来，根据个人喜好进行了定制，添加了动漫风格元素，并优化了移动端显示效果。

## Getting Started

1. 你需要安装[Ruby](https://www.ruby-lang.org/en/)和[Bundler](https://bundler.io/)来使用[Jekyll](https://jekyllrb.com/)。按照[Using Jekyll with Bundler](https://jekyllrb.com/tutorials/using-jekyll-with-bundler/)指南完成环境配置。

2. 安装`Gemfile`中的依赖包：

```sh
$ bundle install
```

3. 启动网站（默认地址：`localhost:4000`）：

```sh
$ bundle exec jekyll serve  # 或者使用 npm start
```

## Development (Build From Source)

要修改主题，你需要安装[Grunt](https://gruntjs.com/)。在`Gruntfile.js`中可以找到多个任务，包括压缩 JavaScript、将`.less`编译为`.css`、添加保持 Apache 2.0 许可完整的标语、监视变更等。

是的，这些都是继承而来的，非常老式。没有模块化和转译等功能。

Jekyll 相关的关键代码位于`_include/`和`_layouts/`目录中。大多数是[Liquid](https://github.com/Shopify/liquid/wiki)模板。

此主题使用 Jekyll 的默认代码语法高亮器[Rouge](http://rouge.jneen.net/)，它与 Pygments 主题兼容，所以只需选择任何 pygments 主题 css（例如从[这里](http://jwarby.github.io/jekyll-pygments-themes/languages/javascript.html)），并替换`highlight.less`的内容即可。

## 特色功能

- 响应式设计，适配各种设备
- 多语言支持（中文/英文）
- PWA 支持，可离线访问
- 文章分类与标签系统
- 集成评论系统
- 自定义社交媒体链接（B 站、抖音、Github 等）
- 丰富的自定义设置选项

## 联系我

- B 站：[sorrymaker2111](https://space.bilibili.com/392759115)
- Github：[sorrymaker2111](https://github.com/sorrymaker2111)
- 抖音：[sorrymaker](https://www.douyin.com/user/MS4wLjABAAAAvRciV_I85LBc2bbp1Vqxp5v2bVOgr8NxXy-cMzNzjeg)

## License

Apache License 2.0.
Copyright (c) 2015-present Huxpro

Hux Blog is derived from [Clean Blog Jekyll Theme (MIT License)](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll/)
Copyright (c) 2013-2016 Blackrock Digital LLC.
