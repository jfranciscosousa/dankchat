FROM node:4-onbuild

ADD . .

RUN npm install
RUN gulp

CMD ["npm", "start"]
