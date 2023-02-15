# Changelog

## 2.0.0

* 规范变更
  - 基于 components 的 init 方法简化组件初始化调度

* 基础环境升级
  - 升级 node.js -> 18.12.x +
  - 升级 typescript -> 4.9.x

* 框架组件升级
  - 升级 nstarter-core -> 1.0.0
  - 升级 nstarter-apm -> 0.3.0
  - 升级 nstarter-cache -> 0.2.0
  - 升级 nstarter-config -> 0.2.0
  - 升级 nstarter-entity -> 0.3.0
  - 升级 nstarter-metrics -> 0.3.0
    - ajv v6 -> v8
    - 升级 nstarter-cache -> 0.2.0
  - 升级 nstarter-mongodb -> 0.3.0
  - 升级 nstarter-redis -> 0.2.x
    - 移除 Connector 对外层服务的 name 管理行为
    - 新增 lazyConnect 模式，支持手动调度异步初始化
    - Connector 连接实例的泛型定义转由 getClient 方法控制
    - 移除事件中的附加消息抛出
  - 升级 nstarter-rabbitmq -> 0.6.0

* 第三方组件升级
  - @sentry/node -> 7.34.0
  - @socket.io/redis-adapter -> 8.0.1
  - @socket.io/redis-emitter -> 5.1.0
  - async -> 3.2.4
  - axios -> 1.3.0
  - connect-redis -> 6.1.3
  - cron -> 2.2.0
  - express -> 4.18.2
  - express-session -> 1.17.3
  - helmet -> 6.0.1
  - http-status -> 1.6.2
  - i18next -> 22.4.9
  - i18next-conv -> 13.1.0
  - moment -> 2.29.4
  - moment-timezone -> 0.5.40
  - mongoose -> 6.9.1
  - nocache -> 3.0.4
  - socket.io -> 4.5.4
  - winston -> 3.8.2
  - winston-daily-rotate-file -> 4.7.1
  - winston-loki -> 6.0.6
  - winston-transport -> 4.5.0

* 工具升级
  - 升级 nstarter-circular -> 0.3.x
  - 升级 rimraf -> 4.1.2
  - 升级 ts-node -> 10.9.1
  - 升级 i18next-scanner -> 4.1.1
  - 升级 eslint -> 8.33.0
  - 升级 eslint-config-nstarter -> 3.0.0


## 1.2.1

* 支持请求 body 过 & 非法 json 的异常处理

## 1.2.0

* 升级 nstarter-core -> 0.6.0
  * 支持组件异步初始化显式调度

## 1.1.2

* 使用 nstarter-redis 替代redis连接管理

## 1.1.1

* 使用 nstarter-config 替代内部配置管理
  - 新增支持配置引用注入能力

## 1.1.0 

* 配置文件内容支持热更新

## 1.0.2

* 新增 nstarter-cache 模块示例

## 1.0.1

* 支持 grafana loki 日志记录请求日志

## 1.0.0

* 基础环境升级
  - 升级 node.js -> 14.18.x
  - 升级 typescript -> 4.4.x

* 新特性
  - 新增 ContextProvider 提供上下文参数跟踪能力
  - 新增 securityMiddlewares 用于增强请求安全规范

* 规范变更
  - 由 nstater-core 的 BaseComponent 取代 AbstractComponent
  - 不在保留全局统一的 types 目录，而有各组件自行管理类型定义
  - 定时任务不再按照 component + plugin 的方式管理，改为直接作为 service

* 组件升级
  - 升级 nstarter-grpc -> 0.3.x 并基于上游插件管理 grpc 依赖
  - 升级 nstarter-mongodb -> 0.2.x，移除 @types/mongoose 类型定义依赖
  - 升级 nstarter-apm -> 0.2.0，移除 elastic-apm-node 直接依赖
  - 升级 nstarter-rabbitmq -> 0.4.0，增加支持上下文传递能力
  - 升级 nstarter-metrics -> 0.2.0
  - 升级 eslint-config-nstarter -> 2.1.x
  - 使用 axios 替换 request
  - 升级 @sentry/node -> 6.15.0
  - 升级 socket.io -> 4.4.0
  - 使用 @socket.io/redis-adapter 取代 socket.io-redis
  - 使用 @socket.io/redis-emitter 取代 socket.io-emitter
  - 升级 winston -> 3.3，winston-transport-> 4.4.0
  - 升级 i18next -> 21.5.3， i18next-conv -> 11.0.2
  - 升级 http-status -> 1.5.0
  - 升级 js-yaml -> 4.1.0

* 工具升级
  - 升级 rimraf -> 3.0.2
  - 升级 ts-node -> 10.4.0
  - 升级 i18next-scanner -> 3.1.0
  - 升级 source-map-support -> 0.5.21

* 修复
  - 拆分 grpc server/client 组件的模板化配置

## 0.6.3-beta

* 提供标准化容器构建环境

## 0.6.2-beta

* 增加 apm 跟踪装饰器示例

## 0.6.1-beta

* 调整选模块定义
  * 合并 `mq_consumer` / `mq_producer` 选装模块 `rabbitmq`
  * 合并 `grpc_server` / `grpc_client` 选装模块为 `grpc`

## 0.6.0-beta

* 统一规范 mongodb 连接为 unifiedTopology 管理方式
* 使用 nstarter-mongodb 封装 mongodb 连接管理
* mongodb 相关装饰器改为包依赖 
