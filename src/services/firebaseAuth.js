// Firebase & React Native setup
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { navigate } from './navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config (dynamic via env or constants)
const firebaseConfig = {
    apiKey: "AIzaSyA1mNcs2WaASM2gfrvyzLVe7s-CybWJOpM",
    authDomain: "klassride-56d41.firebasestorage.app",
    projectId: "klassride-56d41",
    storageBucket: "klassride-56d41.firebasestorage.app",
    messagingSenderId: "490509769992",
    appId: "1:490509769992:android:15eec0e7b16570e5c9a0bd"
};

//  Initialize Firebase Auth (Singleton)
let FIREBASE_AUTH;
if (getApps().length === 0) {
  const FIREBASE_APP = initializeApp(firebaseConfig);
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  FIREBASE_AUTH = getAuth();
}

export default FIREBASE_AUTH;

//
//  NOTIFICATIONS
//

//  Create channel once for Android
export const setupNotificationChannel = async () => {
  await notifee.requestPermission();

  await notifee.createChannel({
    id: 'promo',
    name: 'Promotions',
    importance: AndroidImportance.HIGH,
  });
};

// Foreground FCM handler — triggers local in-app push
export const listenToPromoMessages = () => {
  messaging().onMessage(async remoteMessage => {
    console.log(' Foreground FCM Message:', remoteMessage);
    const token =await AsyncStorage.getItem("accessToken");
    const data = remoteMessage?.data;
    const notification = remoteMessage?.notification;

    if (data?.type === 'promo') {
      await notifee.displayNotification({
        token:token,
        title: notification?.title,
        body: notification?.body,
        android: {
          channelId: 'promo',
          smallIcon: 'ic_launcher',
          color: '#FF5722',
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  });
};

//  Central handler — handles both real and mock messages
export const handlePromoNotification = async (remoteMessage) => {
  const data = remoteMessage?.data;
  const notification = remoteMessage?.notification;

  if (data?.type === 'promo') {
    console.log(' Handling promo message:', data);

    navigate('Mapsearch', {
      promoData: {
        campaignId: data.campaignId,
        discount: data.discount,
        deepLink: data.deepLink,
        expires: data.expires,
        title: notification?.title,
        body: notification?.body,
      },
    });
  }
};

//  Mock message for dev testing
// export const mockPromoMessage = {
//   token: 'DEVICE_REGISTRATION_TOKEN',
//   notification: {
//     title: '🔥 25% Off Your Next Ride!',
//     body: 'Limited time offer. Book your next ride now and save big!',
//   },
//   data: {
//     type: 'promo',
//     campaignId: 'summer2025_discount',
//     deepLink: 'app://ridepromo?campaign=summer2025',
//     discount: '25%',
//     expires: '2025-06-30',
//   },
//   android: {
//     notification: {
//       sound: 'default',
//       icon: 'ic_promo',
//       color: '#FF5722',
//       click_action: 'OPEN_PROMO_SCREEN',
//     },
//   },
//   apns: {
//     payload: {
//       aps: {
//         sound: 'default',
//         category: 'PROMO_ALERT',
//       },
//     },
//   },
// };
