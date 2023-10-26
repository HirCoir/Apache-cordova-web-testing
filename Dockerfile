FROM beevelop/cordova:latest
WORKDIR /app
RUN npm install express multer adm-zip socket.io
COPY  . .
CMD node app.js