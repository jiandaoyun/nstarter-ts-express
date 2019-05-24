FROM node:10.15.3-alpine

USER root:root
WORKDIR /var/app

ENV TZ=UTC
ADD [ "./build/release.tar.gz", "/var/app" ]
RUN npm install --production

VOLUME [ "/var/app/conf.d", "/var/app/log", "/var/app/temp" ]
EXPOSE 3000
