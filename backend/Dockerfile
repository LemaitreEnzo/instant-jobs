FROM node:25.5.0

# Create app directory
WORKDIR /usr/src/backend

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Start backend server
CMD ["npm", "run", "dev"]

# Expose the port the app runs on
EXPOSE 3000

