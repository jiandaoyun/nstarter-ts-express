ARG NODE_IMAGE=node:14.18.1-alpine

# 基础构建环境
FROM ${NODE_IMAGE} as release
RUN npm publish