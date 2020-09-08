# Changelog

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
