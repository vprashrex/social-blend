# Base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

# Install application dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the bcrypt module inside the Docker image
RUN npm rebuild bcrypt --build-from-source

# Expose the port where the server will run
EXPOSE 4000

# Set the command to start the server
CMD ["npm", "run", "serverStart"]
