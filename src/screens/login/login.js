import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, View, Image, SafeAreaView, Alert, Animated, Easing } from "react-native";
import { TouchableOpacity } from "react-native";
import klassride from "../../assets/images/klassride-white.png"
import { useNavigation } from "@react-navigation/native";
import google from '../../assets/images/google_logo.png';
import facebook from '../../assets/images/facebook_logo.png';
import Linking from 'react-native/Libraries/Linking/Linking';
import { wp, hp } from "../common/responsive"
import { fonts } from "../../components/customfont";
import { signInWithEmailAndPassword } from "firebase/auth";
import FIREBASE_AUTH from "../../services/firebaseAuth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import { environment } from "../../environments/environment";
import Feather from "react-native-vector-icons/Feather";

export default function Loginscreen() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const handlelog = () => {
    navigation.navigate('')
  }
  const startSpin = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };
  
  //Google signIn authendication
  GoogleSignin.configure({
    //941971406456-nvgl9lu54j4c3nau8cl02rvtlp1meeoc.apps.googleusercontent.com
    //941971406456-s2vjiv84c368hkeshol3a61tb4ll9fia.apps.googleusercontent.com
    webClientId: '941971406456-s2vjiv84c368hkeshol3a61tb4ll9fia.apps.googleusercontent.com', // Replace with the Web client ID you copied
  });


  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();
      const { idToken } = signInResult;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = FIREBASE_AUTH.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      console.log('Google sign-in successful!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
      if (error.code === 'DEVELOPER_ERROR') {
        // Alert.alert('Google Sign-In Error', 'A developer error occurred. Please check your configuration.');
      } else {
        // Alert.alert('Error', error.message);
      }
    }
  }

  async function onFacebookButtonPress() {
    try {
      console.log("Attempting Facebook sign-in...");

      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccessToken
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign-in the user with the credential and wait for it to complete
      await auth().signInWithCredential(facebookCredential);

      console.log("User signed in with Facebook successfully!");
      // navigation.navigate("Driver");

    } catch (error) {
      Alert.alert("Login Error", error.message || "An error occurred during Facebook sign-in");
      console.error("Facebook login error:", error);
    }
  }

  const handleToReg = () => {
    navigation.navigate('Register')
  }
  const handleLogin = async () => {
  
    console.log("first")
    if (!email || email.trim() === '') {
      setError('Email is required');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // if (password && !password.length < 6) {
    //   setError('Password must be at least 6 characters');
    //   return;
    // }

    if (!password) {
      setError('Password is required');
      return;
    }
     // Firebase default input credentials
    //  signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
    //  .then((userCredential) => {
    //    const user = userCredential.user;
    //    console.log(user);
    //    console.log('User account created & signed in!');
    //    // navigation.navigate("Driver")
    //  })
    //  .catch(error => {
    //    if (error.code === 'auth/email-already-in-use') {
    //      console.log('That email address is already in use!');
    //    }

    //    if (error.code === 'auth/invalid-email') {
    //      console.log('That email address is invalid!');
    //    }

    //    console.error(error);
    //  });

    setLoading(true);
        startSpin();

     const { apiBaseUrl, login } = environment; 
    try {
    console.log("here")

      const response = await fetch(apiBaseUrl + login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      setTimeout(() => {
        setLoading(false); 
      }, 3000);
      if (response.ok) {

        Alert.alert('Success', 'Logged in successfully');
        console.log('Response:', data);
        // navigation.navigate('Register')

      } else {

        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <SafeAreaView style={styles.container} >
      {/* <View style={styles.header}>
      <Header />
      </View> */}
      <Image source={klassride} style={styles.logo} />
      <Text style={styles.heading}> LOGIN </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.inputEmail}
        onChangeText={setemail}
        value={email}
        placeholder="Email Address "
        keyboardType="email-address"
        placeholderTextColor="#CBC0C0"

      />
      <TextInput
        style={styles.inputPassword}
        onChangeText={setpassword}
        value={password}
        placeholder="Password"
        keyboardType="Password"
        secureTextEntry={true}
        placeholderTextColor="#CBC0C0"

      />
      <View>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.forget} onPress={handlelog}>Forget Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonspace}>
        <TouchableOpacity activeOpacity={0.8} style={styles.button}>
          <Text style={styles.Submitbutton} onPress={handleToReg}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lap}>
        <Text style={[styles.log, { fontFamily: fonts.Poppins }]}>or sign up with</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity activeOpacity={0.8} style={styles.google} onPress={onGoogleButtonPress}>
            <Image source={google} style={styles.iconImage} />
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.facebook} onPress={onFacebookButtonPress}>
            <Image source={facebook} style={styles.iconImage} />
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
      <View style={styles.loaderOverlay}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Feather name="loader" size={40} color="#ff7d00" />
        </Animated.View>
      </View>
    )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303336",
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
  },
  header: {
    marginBottom: hp(3.5),
  },
  logo: {
    // width: wp(43),
    // height: hp(11.2),
    // marginBottom: hp(3),
    width: '100%',  // Use percentage-based width
    height: '10.5%',
    // aspectRatio: 1.5,  // Adjust as per your logo’s aspect ratio
    marginBottom: hp(3),
    marginTop: hp(-3),
    resizeMode: "contain",
  },
  
  heading: {
    color: "white",
    fontSize: wp(5),
    marginTop: hp(2),
    letterSpacing: 2,
  },
  inputEmail: {
    paddingVertical: hp(2),
    width: wp(90),
    height: hp(7),
    paddingHorizontal: wp(5),
    borderColor: '#000000',
    borderTopWidth: 2,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: wp(4.5),
    backgroundColor: '#22272B',
    marginTop: hp(3),
    color: "white",
    shadowColor: "white",
    letterSpacing: 2,
    shadowOffset: {
      width: wp(5),
      height: hp(12),
    },
    shadowOpacity: 1.4,
    shadowRadius: 10,
    elevation: 8,
  },
  inputPassword: {
    paddingVertical: hp(2),
    width: wp(90),
    height: hp(7),
    paddingHorizontal: wp(5),
    borderColor: '#000000',
    borderTopWidth: 2,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: wp(4.5),
    backgroundColor: '#22272B',
    marginTop: hp(3),
    color: "white",
    shadowColor: "white",
    letterSpacing: 2,
    shadowOffset: {
      width: wp(5),
      height: hp(12),
    },
    shadowOpacity: 1.4,
    shadowRadius: 10,
    elevation: 8,
  },
  forget: {
    color: '#cccccc',
    marginTop: hp(2),
    fontSize: wp(4),
    textDecorationLine: "underline",
    marginLeft: wp(50),
  },
  buttonspace: {
    marginTop: hp(5),
  },
  button: {
    backgroundColor: "#ff7d00",
    borderRadius: 12,
    width: wp(50),
    height: hp(6),
    marginTop: hp(4),
  },
  Submitbutton: {
    color: '#FFFFFF',
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: hp(1),
  },
  lap: {
    marginBottom: hp(1),
  },
  log: {
    marginTop: hp(5),
    color: "#FFFFFF",
    textAlign: 'center',
    fontSize: wp(4.5),
    marginTop: hp(6),
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(30),
    height: hp(7),
    marginTop: hp(1),
  },
  google: {
    backgroundColor: '#262626',
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    padding: hp(1.8),
    flexDirection: 'row',
  },
  facebook: {
    backgroundColor: '#262626',
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    padding: hp(1.8),
    flexDirection: 'row',
  },
  iconImage: {
    width: wp(10),
    height: hp(5),
    marginLeft: wp(-1.5),
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10, 
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    justifyContent: "flex-start"
  },
  // cardBackground: {
  //   backgroundColor: '#fff', // Set to your desired color
  // },
})
