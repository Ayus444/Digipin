# Dockerfile (Production)
# Use Node.js LTS alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the project files
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the port the app listens on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]