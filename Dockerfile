FROM oven/bun:1

WORKDIR /app

# Install dependencies from the committed Bun lockfile.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Source is bind-mounted by Compose during development.
COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
