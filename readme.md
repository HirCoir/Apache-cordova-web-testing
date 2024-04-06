# README.md for Apache Cordova Web Testing App

This is an Apache Cordova based web app testing environment. It can convert web apps made in HTML into APK files using the Cordova CLI. It allows developers to upload their web app in zip format and provides real-time build progress updates via a socket.io connection.

## Deployment

This app is dockerized. You can deploy the app using the following steps:

1. Ensure Docker is installed on your machine. If not, please download and install Docker from https://www.docker.com/get-started.

2. Clone this repository on your local machine using the following command:

```bash
git clone https://github.com/HirCoir/Apache-cordova-web-testing
```

3. Navigate to the cloned directory:

```bash
cd Apache-cordova-web-testing
```

4. Build the docker image:

```bash
docker build -t cordova-convertor .
```

5. Run the docker container:

```bash
docker run -p 3000:3000 cordova-convertor
```

6. Open your web browser and navigate to http://localhost:3000.

## Usage

1. Once the app is running, you will see a form where you can upload your web app in zip format.

2. Enter the application name and package name.

3. Click 'Convert to APK' to start the conversion process.

4. You will see real-time build progress updates in the progress container.

5. Once the build is complete, you can download the APK file by clicking the download link.

The APK file can then be installed on any Android device just like any other APK files.

Note: Make sure your web app is fully responsive for best user experience across all devices.

Note: The Apache Cordova CLI and Node.js are required in the Docker container. The Dockerfile in this repo should automatically install these if they are not available.

Feel free to contribute to this project by submitting pull requests.
