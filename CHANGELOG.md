# Changelog

## 1.0.0

* 基础环境升级
  - 升级 node.js -> 14.18.x
  - 升级 typescript -> 4.4.x

* 新特性
  - 新增 ContextProvider 提供上下文参数跟踪能力

* 组件升级
  - 升级 nstarter-grpc -> 0.3.x 并基于上游插件管理 grpc 依赖
  - 升级 nstarter-mongodb -> 0.2.x，移除 @types/mongoose 类型定义依赖
  - 升级 nstarter-apm -> 0.2.0，移除 elastic-apm-node 直接依赖
  - 升级 nstarter-rabbitmq -> 0.3.0
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
