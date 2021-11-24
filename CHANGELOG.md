# Changelog

## 1.0.0

* 依赖升级
  - 升级 node.js -> 14.18.x
  - 升级 typescript -> 4.4.x

* 组件升级
  - 使用 axios 替换 request
  - 升级 eslint-config-nstarter -> 2.0.x，对应变更 eslint 相关依赖
  - 升级 socket.io -> 4.4.0
  - 使用 @socket.io/redis-adapter 取代 socket.io-redis
  - 使用 @socket.io/redis-emitter 取代 socket.io-emitter

* 工具升级
  - 升级 rimraf -> 3.0.2
  - 升级 ts-node -> 10.4.0

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
