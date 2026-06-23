# NEXIVORA Backend Dockerfile
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build the app (frontend + backend)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
