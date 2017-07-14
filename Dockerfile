FROM node:4-onbuild

ADD . .

RUN npm install
RUN poi build

CMD ["npm", "start"]
