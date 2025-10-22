# Bus Driver Tracker Expo

This project is a mobile application built with Expo (React Native) for tracking bus drivers, their activities, and related statistics.

## Features
- Real-time location tracking of bus drivers
- Activity log for drivers
- Distance calculation
- Statistics dashboard
- Firebase integration

## Project Structure
- `App.js`: Main entry point of the app
- `components/`: Reusable UI components
- `assets/`: App icons and images
- `firebaseConfig.js`: Firebase configuration
- `app.json`: Expo app configuration
- `package.json`: Project dependencies and scripts

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BusDriverTrackerExpo
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the project root with your Firebase keys. You can copy `.env.example` and fill the values.

   Example (.env):

   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=...
   # Bus Driver Tracker Expo

   Mobile app built with Expo (React Native) to track bus drivers, their locations, and activity.

   Features
   - Real-time location tracking
   - Activity log
   - Distance calculation and session stats
   - Firebase Realtime Database integration

   Quick start
   1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd BusDriverTrackerExpo
   ```

   2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   3. Create a `.env` in the project root (copy `.env.example`) and fill in your Firebase credentials.

   How Expo loads env vars (recommended)
   - This repo includes `app.config.js` which uses `dotenv` to load variables from `.env` into `expoConfig.extra` at start time.
   - `firebaseConfig.js` reads from `process.env` first and falls back to `Constants.expoConfig.extra` at runtime.

   Install dotenv as a dev dependency so `app.config.js` can load `.env`:

   ```bash
   npm install --save-dev dotenv
   # or
   yarn add --dev dotenv
   ```

   Then run Expo normally:

   ```bash
   expo start
   ```

   Alternative (shell exports)
   - You can also export variables directly in your shell before `expo start`:

   ```bash
   export FIREBASE_API_KEY=your_key
   export FIREBASE_DATABASE_URL=https://your-db-url
   expo start
   ```

   Security notes
   - Do NOT commit `.env` to source control. `.gitignore` already excludes `.env`.
   - If you previously committed keys, rotate them in Firebase and remove them from git history (I can help with that).

   Files of interest
   - `firebaseConfig.js` — reads the Firebase config from env/extras and initializes the SDK.
   - `app.config.js` — loads `.env` values into Expo `extra`.

   If you want, I can: add a small npm script to run Expo with env loaded, remove the real `.env` values from the repo (replace with placeholders), or walk through rotating and scrubbing keys from git history.


