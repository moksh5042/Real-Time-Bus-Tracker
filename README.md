# Real-Time Bus Tracker

A real-time bus tracking system consisting of two mobile applications: one for bus drivers to share their location and another for users to track bus locations and routes.

## Project Structure

The project contains two main applications:

### 1. Bus Driver Application (BusDriverTrackerExpo)
- Mobile application for bus drivers
- Tracks and shares real-time location
- Records activity logs
- Provides statistical information

### 2. User Application (UserExpo)
- Mobile application for passengers
- View real-time bus locations
- Search and view route details
- Track buses on the map
- View driver details

## Features

### Bus Driver App Features
- Real-time location sharing
- Activity logging
- Distance tracking
- Statistical dashboard
- Firebase integration for real-time updates

### User App Features
- Real-time bus tracking
- Route listing and details
- Interactive maps
- Driver information
- Route search functionality
- Location-based services

## Technology Stack

- **Frontend Framework:** React Native with Expo
- **Backend/Database:** Firebase
- **Maps Integration:** React Native Maps
- **Real-time Updates:** Firebase Realtime Database
- **Authentication:** Firebase Authentication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/moksh5042/Real-Time-Bus-Tracker.git
```

2. Install dependencies for Bus Driver App:
```bash
cd BusDriverTrackerExpo
npm install
```

3. Install dependencies for User App:
```bash
cd ../UserExpo
npm install
```

4. Set up Firebase configuration:
- Create a Firebase project
- Add your Firebase configuration in `firebaseConfig.js` for both apps

5. Start the applications:
```bash
# For Bus Driver App
cd BusDriverTrackerExpo
expo start

# For User App
cd UserExpo
expo start
```

## Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account
- Google Maps API key

### Configuration
1. Set up your Firebase configuration in `firebaseConfig.js`
2. Configure your Google Maps API key in the respective configuration files
3. Update any environment-specific variables

## Contact

Project Owner: moksh5042
GitHub Repository: [Real-Time-Bus-Tracker](https://github.com/moksh5042/Real-Time-Bus-Tracker)

## Acknowledgments

- Thanks to all contributors who have helped with the development
- Expo team for the amazing mobile development framework
- Firebase team for the robust backend services