// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth  } from "firebase/auth";
// import { getMessaging, isSupported } from "firebase/messaging";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

 

// let messaging: Awaited<ReturnType<typeof getMessaging>> | null = null;

// if (typeof window !== "undefined") {
//   void isSupported().then((supported) => {
//     if (supported) {
//       messaging = getMessaging(app);
//     }
//   });
// }

// export { app, messaging };

// export const auth = getAuth(app);



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = initializeApp(firebaseConfig);

let messagingPromise: Promise<Messaging | null> | null = null;

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => (supported ? getMessaging(app) : null))
      .catch(() => null);
  }

  return messagingPromise;
};

export const firebasePublicConfig = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
};

export const auth = getAuth(app);

export { app };