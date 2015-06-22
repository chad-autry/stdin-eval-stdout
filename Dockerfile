FROM gliderlabs/alpine:3.1
RUN apk --update add nodejs
COPY .
ENTRYPOINT ["node", "src/index.js"]
