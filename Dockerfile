FROM node:24-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=development


WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci 

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 
