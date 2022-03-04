# {{APP_NAME}}

## 开发调试

* 安装依赖

  ```bash
  npm install
  ```

* 编译

  ```bash
  npm run build
  ```

* 运行

  ```bash
  node ./dist/app.js --require source-map-support/register
  ```

* 更新 JSON Schema

  当工程内的实体对象结构定义 (`src/entities`) 发生修改后，需要手动更新 json-schema 结构描述文文件。

  ```bash
  npm run json-schema
  ```

## 打包构建

* 构建容器镜像

  ```bash
  make docker-build
  ```

* 单元测试

  ```bash
  make docker-test
  ```

----

Made on 🌍 with 💓.
