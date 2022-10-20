FROM node:14-slim
RUN apt-get update -y && apt-get upgrade -y
RUN mkdir app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start"]