// // src/services/routeService.js
// import { db } from "../../firebaseConfig";
// import { ref, onValue } from "firebase/database";

// /**
//  * Subscribe to all predefined routes from Firebase.
//  * Calls `callback` with an object of routeId -> route data.
//  */
// export function subscribeToRoutes(callback) {
//   const routesRef = ref(db, "routes");
//   const unsubscribe = onValue(
//     routesRef,
//     (snapshot) => {
//       if (snapshot.exists()) {
//         callback(snapshot.val());
//       } else {
//         callback({});
//       }
//     },
//     (error) => {
//       console.error("Firebase subscribeToRoutes error:", error);
//       callback({});
//     }
//   );

//   return () => unsubscribe();
// }



import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

export function subscribeToRoutes(callback) {
  const routesRef = ref(db, "routes");
  return onValue(routesRef, snap => {
    callback(snap.exists() ? snap.val() : {});
  });
}
