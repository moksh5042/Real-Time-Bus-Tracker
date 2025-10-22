// // src/services/firebaseService.js
// import { db } from "./firebaseConfig";
// import { ref, onValue } from "firebase/database";

// /**
//  * Subscribe to the entire `buses` node.
//  * callback receives an object mapping driverId -> payload
//  * Returns an unsubscribe function.
//  */
// export function subscribeToBuses(callback) {
//   const busesRef = ref(db, "buses");
//   // onValue returns an unsubscribe function
//   const unsub = onValue(busesRef, (snapshot) => {
//     const val = snapshot.val() || {};
//     callback(val);
//   }, (err) => {
//     console.warn("Realtime DB error:", err);
//     callback({});
//   });

//   return () => unsub(); // call to stop listening
// }

// /**
//  * One-shot read for a single driver (optional)
//  */
// export async function getDriver(driverId) {
//   const driverRef = ref(db, `buses/${driverId}`);
//   let result = null;
//   await new Promise((resolve) => {
//     onValue(
//       driverRef,
//       (snap) => {
//         result = snap.exists() ? snap.val() : null;
//         resolve();
//       },
//       { onlyOnce: true }
//     );
//   });
//   return result;
// }


// src/services/firebaseService.js
import { ref, onValue } from "firebase/database";
import { db } from "./firebaseConfig";

export const subscribeToBuses = (callback) => {
  const busesRef = ref(db, "buses");
  
  const unsubscribe = onValue(busesRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  }, (error) => {
    console.error("Firebase read error:", error);
    callback({});
  });

  return unsubscribe;
};