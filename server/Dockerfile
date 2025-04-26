# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the ports the apps run on
EXPOSE 9999 9998

# Command to run both servers using concurrently
CMD ["npm", "run", "start:all"] 
