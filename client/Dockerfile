# Use Node.js v18 as the base image
FROM node:18.19.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port for the application
EXPOSE 5173

# Define environment variable for mode switching
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the application if in production mode
# RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Default command to run in either dev or prod
CMD ["npm", "run", "dev", "--", "--host"]
