const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;
let appName;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('zipFile'), (req, res) => {
  appName = req.body.appName;

  const cordovaDirectory = path.join(__dirname, appName);
  const cordovaCreateCommand = `cordova create "${cordovaDirectory}" "${req.body.packageName}" "${appName}"`;

  exec(cordovaCreateCommand, (errCreate, stdoutCreate, stderrCreate) => {
    if (errCreate) {
      console.error(`Error en la creación de la aplicación Cordova: ${errCreate}`);
      res.status(500).json({ error: 'Error en la creación de la aplicación Cordova' });
      return;
    }

    const zip = new AdmZip(req.file.buffer);
    zip.extractAllTo(path.join(cordovaDirectory, 'www'), true);

    process.chdir(cordovaDirectory);

    const cordovaAddPlatformCommand = 'cordova platform add android';
    exec(cordovaAddPlatformCommand, (errAdd, stdoutAdd, stderrAdd) => {
      if (errAdd) {
        console.error(`Error al agregar la plataforma Android: ${errAdd}`);
        res.status(500).json({ error: 'Error al agregar la plataforma Android' });
        return;
      }

      const cordovaBuildCommand = 'cordova build android';
      const buildProcess = exec(cordovaBuildCommand);

      let responseData = { progress: '' };

      buildProcess.stdout.on('data', (data) => {
        io.emit('buildProgress', data);
        responseData.progress += data;
      });

      buildProcess.stderr.on('data', (data) => {
        io.emit('buildLog', data);
      });

      buildProcess.on('close', (code) => {
        io.emit('buildComplete', `Construcción completada con código ${code}`);
        responseData.complete = true;
        responseData.code = code;
        res.json(responseData);
      });
    });
  });
});

app.get('/download', (req, res) => {
    const apkPath = path.join(__dirname, `${appName}/platforms/android/app/build/outputs/apk/debug/app-debug.apk`);
  
    res.download(apkPath, 'app-debug.apk', (err) => {
      if (err) {
        console.error(`Error al descargar la APK: ${err}`);
        res.status(500).json({ error: 'Error al descargar la APK' });
      }
      // No necesitas el else aquí ya que el código continuará después del bloque if
    });
  });
  
server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});