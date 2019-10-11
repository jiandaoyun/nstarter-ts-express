FROM node:10.15.3-alpine

USER root:root
WORKDIR /var/app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' \
    /etc/apk/repositories && \
    apk add --no-cache tini

ENV TZ=UTC
ADD [ "./build/release.zip", "/tmp" ]
RUN unzip -q /tmp/release.zip -d /var/app && ls -lh
RUN npm install --production

ENTRYPOINT ["/sbin/tini", "--"]
VOLUME [ "/var/app/conf.d", "/var/app/log", "/var/app/temp" ]
EXPOSE 3000
