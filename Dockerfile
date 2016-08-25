FROM node:4-onbuild

ADD . .

RUN npm install

CMD ["npm", "start"]
