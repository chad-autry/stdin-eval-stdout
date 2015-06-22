FROM gliderlabs/alpine:3.1
RUN apk --update add nodejs
COPY . /app
ENTRYPOINT ["node", "/app/src/index.js"]
