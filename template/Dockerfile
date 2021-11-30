ARG NODE_IMAGE=node:14.18.1-alpine

# 构建环境容器
FROM ${NODE_IMAGE} as build

WORKDIR /var/opt/build

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .
RUN npm run json-schema && \
    npm run config-schema && \
    npm run eslint:html && \
    npm run build

RUN mkdir -p ./build && \
    mv ./public ./resources ./views \
       ./dist ./tools \
       package*.json *.md LICENSE makefile \
       ./build

# 输出结果
FROM scratch as archive
COPY --from=build /var/opt/build/lint ./lint
COPY --from=build /var/opt/build/coverage ./coverage

# 运行环境容器
FROM ${NODE_IMAGE} as runtime

USER root:root
WORKDIR /var/app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' \
    /etc/apk/repositories && \
    apk add --no-cache tini

ENV TZ=UTC

COPY ./package.json ./package-lock.json ./
RUN npm install --production

COPY --from=build /var/opt/build/build ./

ENTRYPOINT ["/sbin/tini", "--"]
VOLUME [ "/var/app/conf.d", "/var/app/log" ]
EXPOSE 3000
