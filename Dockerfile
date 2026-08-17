FROM node:22-alpine

# Install build tools required by bcrypt (and any other native addons).
# On ARM hosts prebuilt binaries may be absent, causing npm to fall back to
# compiling from source via node-gyp — which needs python3, make, and g++.
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000 

CMD ["npm", "start"]
