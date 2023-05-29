# Stage 1: Build the React app
FROM node:14-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Expose the container port (adjust if necessary)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]

