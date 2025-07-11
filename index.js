/**
 * @format
 */
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const { notification } = remoteMessage;
  if (notification) {
    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId: 'promo',
        smallIcon: 'ic_launcher',
      },
    });
  }
});

AppRegistry.registerComponent(appName, () => App);
