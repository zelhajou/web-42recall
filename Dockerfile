# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]