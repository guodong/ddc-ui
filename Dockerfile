FROM node:8 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN yarn install
RUN npm install react-scripts -g
COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
ADD default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
WORKDIR /usr/share/nginx/html
#COPY ./env.sh .
#COPY .env .

# Add bash
#RUN apk add --no-cache bash

# Make our shell script executable
#RUN chmod +x env.sh

# Start Nginx server
CMD ["nginx -g \"daemon off;\""]
