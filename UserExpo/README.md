# User App

This project is a mobile application built with Expo (React Native) for users to search, view, and book bus rides, as well as view route and driver details in real time.

## Features
- Search for available routes and drivers
- View driver and route details
- Real-time map and route tracking
- Book rides
- Firebase integration for backend services

## Project Structure
```
App.js
app.json
index.js
package.json
assets/
src/
  components/
    DriverDetailScreen.js
    MapScreen.js
    RouteDetailsScreen.js
    SearchScreen.js
  services/
    firebaseConfig.js
    firebaseService.js
```

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd UserExpo
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up your Firebase credentials in `src/services/firebaseConfig.js`.

### Running the App
```bash
expo start
```
Scan the QR code with the Expo Go app on your mobile device to run the app.

## Usage
- Search for routes and drivers
- View details and book rides

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

## Secrets & environment

This project keeps Firebase and Google Maps API keys out of source control. Follow these steps to run the app locally and securely provide secrets for builds.

- Local development (quick)
  1. Copy the provided `.env` file (already in the repo as an example) and fill in real values:
     - EXPO_PUBLIC_FIREBASE_API_KEY
     - EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
     - EXPO_PUBLIC_FIREBASE_DATABASE_URL
     - EXPO_PUBLIC_FIREBASE_PROJECT_ID
     - EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
     - EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     - EXPO_PUBLIC_FIREBASE_APP_ID
     - EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
     - EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
  2. Make sure `.env` is listed in `.gitignore` (it is by default in this project).
  3. Start Expo with the env file loaded. Two options:
     - Simple (POSIX shells):
       ```bash
       # load env into current shell session
       set -a
       source .env
       set +a
       expo start
       ```
     - Using dotenv-cli (recommended, avoids modifying your shell):
       ```bash
       npm install --save-dev dotenv-cli
       npx dotenv -e .env expo start
       ```

- Production builds (recommended: EAS)
  - Do NOT store real secrets in the repository. Use EAS secrets to inject values at build time:
    1. Install EAS CLI: `npm install -g eas-cli` and login: `eas login`.
    2. For each secret run:
       ```bash
       eas secret:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "<value>"
       eas secret:create --name EXPO_PUBLIC_GOOGLE_MAPS_API_KEY --value "<value>"
       ```
    3. Use EAS Build; the secrets will be available when building and `app.json` substitutions like `${GOOGLE_MAPS_API_KEY}` will be replaced during the build.

- Notes and tips
  - Variables beginning with `EXPO_PUBLIC_` are exposed to the JS runtime. Only store values here that are safe to be readable from client apps. For private keys or server-only secrets, keep them on a server.
  - For CI, set environment variables in your CI provider (or use EAS secrets) instead of committing `.env`.
  - If you need help wiring env variables into other workflows, tell me which platform (macOS/Linux/Windows) and CI provider you use and I'll add exact commands.
