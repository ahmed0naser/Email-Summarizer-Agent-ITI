# client-angular

This folder contains a minimal Angular app scaffold.

Quick start:

1. Change to this directory:

```
cd client-angular
```

2. Install dependencies:

```
npm install
```

3. Start the dev server:

```
npm start
```

The app will open at http://localhost:4200

Development proxy:

The dev server proxies requests starting with `/api` to the backend at `http://localhost:3001`.

Production build:

Build the Angular app and the server will automatically serve the built files if placed at `client-angular/dist/client-angular` (the server prefers that directory when present). To build:

```
npm run build
```

Then copy or move the `dist/client-angular` folder to the server or run the server from the project root.
