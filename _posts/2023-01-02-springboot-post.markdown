---
layout: post
title: "SpringBoot框架实战"
subtitle: "快速构建企业级应用"
date: 2023-01-02 12:00:00
author: "sorrymaker"
header-img: "img/post-bg-springboot.png"
catalog: true
tags:
  - springboot
---

## SpringBoot 简介

SpringBoot 是由 Pivotal 团队提供的全新框架，其设计目的是用来简化 Spring 应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。

### SpringBoot 的主要特点

- 创建独立的 Spring 应用程序
- 内嵌 Tomcat、Jetty 或 Undertow（无需部署 WAR 文件）
- 提供 starter 依赖，简化构建配置
- 尽可能自动配置 Spring 和第三方库
- 提供生产就绪特性，如指标、健康检查和外部配置
- 完全不需要代码生成和 XML 配置

## 快速开始一个 SpringBoot 项目

### 项目依赖

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 简单的 Controller

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot!";
    }
}
```

### 启动类

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## SpringBoot 进阶

- 自动配置原理
- 外部化配置
- SpringBoot Actuator
- 整合各种中间件

## 总结

SpringBoot 极大地简化了 Spring 应用的开发，是现代 Java 开发不可或缺的框架。
