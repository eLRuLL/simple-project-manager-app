# Simple Project Manager App

This app handles the management of projects, with the ability to create and edit Projects.
The projects can be assigned to users and have their status, name and description updated.
The app also have offline support, so you can still update the projects, and the app will
sync the changes with the backend when it comes back online.

It contains a backend (express.js) and a mobile application (react-native with Expo).
To get the `backend` started, you can use docker:

    docker compose up -d

To get the react-native started, run:

    cd mobile/
    npm run ios

The app contains a way to automatically generate types and the sdk so the frontend communicates
with the backend endpoints and models, through OpenAPI swagger. When you update the backend
schemas and endpoints, you should run:

    cd mobile/
    npm run generate-client

