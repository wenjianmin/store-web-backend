FROM node:18-alpine3.18
WORKDIR /servers
COPY . .
ENV TZ=Asia/Guangzhou
RUN npm set registry=https://registry.npmmirror.com
RUN npm i -g pnpm && pnpm i && pnpm run build
EXPOSE 3333
CMD pnpm start:docker
