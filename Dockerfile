FROM ubuntu:16.04

RUN apt-get update && apt-get install -y curl git
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
RUN git clone https://github.com/zeesousa/dankchat
WORKDIR "dankchat"
RUN npm install

CMD ["npm", "start"]
