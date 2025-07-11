import React,{ useEffect,useRef,useContext  } from 'react';
import { NavigationContainer,DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './src/screens/welcome/welcomescreen';
import Signup from './src/screens/signin/signupscreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Register from './src/screens/register/register';
import Loginscreen from './src/screens/login/login';
import Numberscreen from './src/screens/others/numberscreen';
import Verificationscreen from './src/screens/signin/verification';
import Forgetpassword from './src/screens/login/forgetpassword';
import Passwordverification from './src/screens/register/passwordverification';
import Resetpassword from './src/screens/login/resetpassword';
import Termscondition from './src/screens/others/terms&condition';
import Mapsearch from './src/screens/home/mapsearch';
// import Driver from './src/login/driver';
// import Paymentmethod from './src/screens/others/paymentmethod';
// import BookingSuccessScreen from './src/screens/others/sucessfullyscreen';
import Economy from './src/screens/others/economy';
import MySidebar from './src/screens/common/sidebar';
import Editaccount from './src/screens/profile/editaccount';
import OfflinePopup from './src/screens/offlinePopup/OfflinePopup';
import Riderscreen from './src/screens/Rider/Riderscreen';
import Payment from './src/screens/payment/payment';
import Linked from './src/screens/linked/linked';
import Support from './src/screens/support/support';
import ChooseOnMapScreen from './src/screens/home/ChooseOnMapScreen';
import Paymentnetopia from './src/screens/payment/paymentNeto';
import { navigationRef } from './src/services/navigationService';
import {setupNotificationChannel, mockPromoMessage, handlePromoNotification,listenToPromoMessages,FIREBASE_AUTH} from './src/services/firebaseAuth'; 
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { OrientationProvider } from './src/screens/common/OrientationContext';

const Stack = createStackNavigator();

export default function App() {
 useEffect(() => {
  // Create notification channel
  notifee.createChannel({
    id: 'promo',
    name: 'Promotions',
  });
  listenToPromoMessages();
  messaging().onNotificationOpenedApp(remoteMessage => {
    handlePromoNotification(remoteMessage);
  });
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      handlePromoNotification(remoteMessage);
    }
  });

  if (__DEV__) {
    setTimeout(() => {
      handlePromoNotification(FIREBASE_AUTH);
    }, 4000);
  }
}, []);

  useEffect(() => {
    if (__DEV__) {
      console.log('🧪 useEffect: Running test with mock promo message...');
      setTimeout(() => {
        handlePromoNotification(FIREBASE_AUTH);
      }, 5000);
    }
  }, []);

  useEffect(() => {
  setupNotificationChannel();
  // listenToPromoMessages();   
}, []);
  
  return (
    <SafeAreaProvider>
         <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <OfflinePopup />
      <NavigationContainer  theme={DarkTheme} ref={navigationRef}>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Signup" component={Signup} />          
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="numberverify" component={Verificationscreen} />
          <Stack.Screen name="emailpasswordverification" component={Passwordverification} />
          <Stack.Screen name="Mapsearch" component={Mapsearch} />
          <Stack.Screen name="editaccount" component={Editaccount} />          
          <Stack.Screen name="number" component={Numberscreen} />
          <Stack.Screen name="forgetpassword" component={Forgetpassword} />
          <Stack.Screen name="Resetpassword" component={Resetpassword} />
          <Stack.Screen name="Termscondition" component={Termscondition} />         
          <Stack.Screen name="economy" component={Economy} />
          <Stack.Screen name="sidebar" component={MySidebar} />
          <Stack.Screen name="riderscreen" component={Riderscreen} />
          <Stack.Screen name="payment" component={Payment} />
          <Stack.Screen name="linked" component={Linked} />
          <Stack.Screen name="support" component={Support} />
          <Stack.Screen name="ChooseOnMap" component={ChooseOnMapScreen} />
          <Stack.Screen name="PaymentNetopia" component={Paymentnetopia} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
{/* <Stack.Screen name="Paymentmethod" component={Paymentmethod} /> */}
          {/* <Stack.Screen name="BookingSuccessScreen" component={BookingSuccessScreen} /> */}
           {/* <Stack.Screen name="Driver" component={Driver} /> */}
           {/* <Stack.Screen name="login" component={Loginscreen} /> */}