FROM node:22-alpine

# Build tools for bcrypt and other native addons. On ARM hosts (including the
# Oracle Ampere box) npm finds no prebuilt binary and compiles via node-gyp,
# which needs python3, make, and g++.
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# ci, not install: installs exactly the lockfile so an image build cannot
# silently pick up a different dependency tree than CI tested.
RUN npm ci

COPY . .

# node:alpine ships an unprivileged `node` user; running as root by default is
# an unnecessary risk.
RUN chown -R node:node /app
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]
