---
layout: post
title: "API、MCP、token、LoRA等等都是啥？"
subtitle: "一篇文章讲清AI黑话"
date: 2025-04-30 12:00:00
author: "sorrymaker"
header-img: "img/post-bg-API-MCP-token-LoRA.jpg"
catalog: true
tags:
  - Web
---

## API

- **API**即为程序编程接口（application program interface，[**API**](https://zh.wikipedia.org/wiki/%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E6%8E%A5%E5%8F%A3)），他是一套程序之间相互打招呼的一个规矩。

- 例如扫码通过调用付款的**API**，从而实现扫码付款一条龙。

![image-20250430104629214](/img/image-20250430104629214.png)

## MCP

- **MCP**即为模型上下文协议（Model Context Protocol，[**MCP**](https://zh.wikipedia.org/wiki/%E6%A8%A1%E5%9E%8B%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8D%8F%E8%AE%AE)）,主要是模型和工具之前牵线搭桥。

- 例如模型借助浏览器这个工具去互联网上搜索相关内容，浏览器再把搜索到的结果，通过**MCP**传回给模型。

<img src="/img/image-20250430104517233.png" alt="image-20250430104517233" style="zoom:80%;" />

## Agent

- **Agent**即为智能体，能够自主执行任务或者程序，是一个很接近 AGI 的通用人工智能产物。

<img src="/img/image-20250430105043461.png" alt="image-20250430105043461" style="zoom:80%;" />

## RAG

- **RAG**即为检索增强生成（Retrieval-augmented generation, [**RAG**](https://zh.wikipedia.org/wiki/%E6%AA%A2%E7%B4%A2%E5%A2%9E%E5%BC%B7%E7%94%9F%E6%88%90)）。

- 在大模型回答问题前，这个帮手会去先翻你提前存进去知识库的文件，挑出和问题最相关的文档片段，再连同问题一起交给大模型。

<img src="/img/image-20250430105446921.png" alt="image-20250430105446921" style="zoom:80%;" />

- 这样大模型就可以依据资料，给出更靠谱的答案。还能利用你的私有知识库，让回答变得更准确。

## SD-WebUI

- 搭建出来的可视化操作界面，一般叫做 WebUI。即 Web 上可以打开的 UI。

<img src="/img/image-20250430105729665.png" alt="image-20250430105729665" style="zoom:80%;" />

## comfyUI

- 类似这样的节点。

  ![image-20250430110008277](/img/image-20250430110008277.png)

微调能力更强，需要修改时，只需要修改对应的节点即可。

## LoRA

- 简单理解为：微调简化版大模型。
- 通过给原先的大矩阵做降秩，将它压缩的更轻量，训练包更小，出图更快，是一种更方便的版本。

## LLM

- 即大语言模型（large language model，[**LLM**](https://zh.wikipedia.org/wiki/%E5%A4%A7%E5%9E%8B%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B)）。
- 例如 DeepSeek,ChatGPT 这类文字对话工具，背后的引擎都是 LLM，只限于文字。

## token&分词器

- 简单理解为：一个词就是一个 token。

- 大模型收到文本后，会用分词器把文字拆成一个个小块，每一个小块就叫一个 token。

- [OpenAI 在线分词器](https://platform.openai.com/tokenizer)

  <img src="/img/image-20250430111333135.png" alt="image-20250430111333135"  />

## 最后

本文章内容总结来自视频[API、MCP、token、LoRA 等等都是啥？一个视频讲清 AI 黑话](https://www.bilibili.com/video/BV1iGjAzfE7Z/?spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=f11f78ab2e1ae6593a63c6303aceba1e)。
欢迎评论区交流！
