# Use an official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose the port on which the application will run
EXPOSE 8080

# Run the application using the HTTP server
CMD ["npm", "start"]

