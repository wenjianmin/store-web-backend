<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## 介绍

本项目是`NestJS`技术图书 **《NestJS全栈开发解析：快速上手与实践》** 的实战项目，于**2024.9月**上线。

## 安装

```bash
$ pnpm install
```

## 运行

运行项目之前，首先确保本机安装了MySQL数据库，并创建名为`store_web_project`的数据库，同时在`.env`文件中配置好数据库连接信息。其次，需要安装并启动Redis数据库。

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```
### 注意：
1. 由于项目中权限是环环相扣，如果你使用Postman等接口调试工具，大部分接口需要有access_token验证，意味着需要登录，登录前需要注册，注册需要获取验证，这些都可以在日志中看到。

2. 除此之外，注册之后还不能调用某些接口，因为当前用户的权限集需要分配，你可以往db中添加数据，或者直接导入`sql`目录下的`store_web_project.sql`到db中。

3. 项目中.http已经创建了一些接口测试案例，你可以直接使用。

4. 运行过程中如果出现接口500错误，Nest服务有打印出每个请求日志，你可以在日志中查看到具体错误。

## 常见问题
1. Redis版本太低导致某些API调用错误
![alt text](image-2.png)

2. 业务显示你没有当前权限调用某个接口，请先确认是否有先导入`sql`

3. 如有其他问题，请联系作者。。。
## 运行测试

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```



## 项目配置及注意事项

- class-transformer采用0.3.x版本，使用plainToClass|classToPlain方法操作对象或实体，
不指定默认会安装0.5.x版本，这个版本废弃了前面两个api，使用plainToInstance|instanceToPlain代替，要想使用最新api，可能会报错缺少class-transformer/storage包，此时删除项目中@nestjs/types包即可

- chalk包使用^4.1.2版本，超过5.x是breaking version，应该使用ESM模式

jwt-auth.guard.ts 用于验证用户session状态
role-auth.guard.ts 用于验证用户接口权限

JWTModule注册在user模块中，当然也可以注册到auth模块中统一管理，生成和验证access_token就在auth.service.ts中进行

## 项目目录
``` text
├── README.md  
├── nest-cli.json  
├── package.json  
├── pnpm-lock.yaml  
├── src  
│   ├── activity  
│   │   ├── activity.controller.ts  
│   │   ├── activity.module.ts  
│   │   ├── activity.service.ts  
│   │   ├── dto  
│   │   ├── entities  
│   │   └── start-activity.service.ts  
│   ├── app.controller.spec.ts  
│   ├── app.controller.ts  
│   ├── app.module.ts  
│   ├── app.service.ts  
│   ├── auth  
│   │   ├── auth.module.ts  
│   │   ├── auth.service.ts  
│   │   ├── jwt-auth.guard.ts  
│   │   ├── jwt.strategy.ts  
│   │   └── role-auth.guard.ts  
│   ├── common  
│   │   ├── decorators  
│   │   ├── enums  
│   │   ├── http-exceptions.filter.ts  
│   │   ├── logger  
│   │   ├── logger.middleware.ts  
│   │   ├── mail  
│   │   ├── redis  
│   │   ├── response.interceptor.ts  
│   │   └── utils  
│   ├── logs  
│   │   ├── application-2024-04-05.error.log.gz  
│   │   ├── application-2024-04-05.info.log.gz  
│   │   ├── application-2024-04-06.error.log  
│   │   ├── application-2024-04-06.info.log.gz  
│   │   ├── application-2024-04-07.error.log  
│   │   └── application-2024-04-07.info.log  
│   ├── main.ts  
│   ├── order  
│   │   ├── dto  
│   │   ├── entities  
│   │   ├── order.controller.ts  
│   │   ├── order.module.ts  
│   │   └── order.service.ts  
│   ├── permission  
│   │   ├── dto  
│   │   ├── entities  
│   │   ├── permission.controller.ts  
│   │   ├── permission.module.ts  
│   │   └── permission.service.ts  
│   ├── product  
│   │   ├── dto  
│   │   ├── entities  
│   │   ├── hot-sales.service.ts  
│   │   ├── product.controller.ts  
│   │   ├── product.module.ts  
│   │   └── product.service.ts  
│   ├── role  
│   │   ├── dto  
│   │   ├── entities  
│   │   ├── role.controller.ts  
│   │   ├── role.module.ts  
│   │   └── role.service.ts  
│   ├── sys  
│   │   ├── dto  
│   │   ├── sys.controller.ts  
│   │   ├── sys.module.ts  
│   │   └── sys.service.ts  
│   └── user  
│       ├── dto  
│       ├── entities  
│       ├── user.controller.ts  
│       ├── user.module.ts  
│       └── user.service.ts  
├── tsconfig.build.json  
└── tsconfig.json  
```

## 部署

如需部署到生产环境或Docker环境，需要区分各个服务地址，如Nest服务、Redis MySQL服务，它们在Docker和开发环境的host配置是不一样的，对应不同环境的.evn文件。

## 交流学习

在项目运行中有遇到任何问题，请直接与作者联系！

需要加入交流群探讨学习，直接扫描下方二维码，如过期请添加作者WeChat！

作者WeChat：

<img src="image.png" alt="描述文本" width="200" height="auto">


项目交流群：

<img src="image-1.png" alt="描述文本" width="200" height="auto">

## 支持作者


图书购买链接：<a href="https://item.jd.com/14283389.html" target="blank">京东</a>

图书购买链接：<a href="https://product.dangdang.com/29783482.html" target="blank">当当</a>

## 图书勘误
事实证明，群众的眼睛总是雪亮的。即使经过笔者和编辑人员重复的审查，但错误总是无法完全避免，通过读者反馈，我们收集了书籍中存在可纠正的几点问题：

- 章节2.2.1 Nest CLI的安装：`npm install -g @Nestjs/cli` 及 `npm update -g @Nestjs/cli` 命令中，cli的包名应为小写的`@nestjs/cli`
- 章节3.4.1 类中间件：`我们指定中间件应用在/person路径` 应为 `我们指定中间件应用在/user路径`
- 章节4.1.3 可视化操作MySQL：`接着来设计product表，新增updateTime（创建时间）` 应为 `接着来设计product表，新增updateTime（更新时间）`

## 更新日志

- 2024.10.26 新增Excel导入导出服务，支持Excel导入产品数据到db，导出db数据到Excel。
- 2024.11.10 新增爬虫服务，支持自定义爬虫内容、自动反爬等功能。

## 最新 NestJS 文章 & 专栏
- <a href="https://juejin.cn/column/7287914116285677603" target="blank"> Nest系列专栏 </a>
- <a href="https://juejin.cn/post/7442705410790965248" target="blank">NestJS全栈进阶指南</a>
- <a href="https://juejin.cn/post/7434869636506435624" target="blank"> NestJS实现通用爬虫服务</a>
- <a href="https://juejin.cn/post/7431476378450542626" target="blank"> NestJS实现Excel导入导出服务</a>

## 前端领域
- <a href="https://juejin.cn/column/7283768998777045051" target="blank"> 前端专栏 </a>

## 人生踩坑 & 感悟专栏 
- <a href="https://juejin.cn/column/7283776161527545893" target="blank"> 星光不问赶路人 </a>

