# Use Amazon Linux 2 base image
FROM amazonlinux:2

# Install curl and enable Node.js 16 setup
RUN yum -y update && \
    yum -y install curl && \
    curl -sL https://rpm.nodesource.com/setup_16.x | bash - && \
    yum -y install nodejs && \
    yum clean all

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "index.js"]

