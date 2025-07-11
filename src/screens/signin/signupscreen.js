import React, { useEffect, useState, useRef,useContext } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  ToastAndroid,
  Keyboard,
  BackHandler,
  StatusBar,
  Alert ,
  ScrollView// Import Alert for error messages
} from "react-native";
import klassride from "../../assets/images/klassride1.png";
import google from "../../assets/images/google_logo.png";
import facebook from "../../assets/images/facebook_logo.png";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CountryPicker from "react-native-country-picker-modal";
import { wp, hp } from "../common/responsive";
import { fonts } from "../../components/customfont";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Feather from "react-native-vector-icons/Feather";
import { Animated, Easing } from "react-native";
import { ENDPOINTS } from "../../environments/environment";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Blue from "../../assets/images/blue.png";
import auth from '@react-native-firebase/auth'; // Import Firebase auth
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'; // Import Facebook SDK
import { OrientationContext } from "../common/OrientationContext";

export default function Signup() {
  const navigation = useNavigation();
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("RO");
  const [callingCode, setCallingCode] = useState("+40");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [inputValidationError, setInputValidationError] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
 const isLandscape = useContext(OrientationContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID_HERE", // Replace with your Web client ID
    });
  }, []);

  // Google Sign-In Integration
  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const { idToken } = signInResult;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      console.log('Google sign-in successful!');
      // Navigate to your desired screen after successful Google sign-in
      // navigation.navigate('Mapsearch'); // Example navigation
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
      Alert.alert('Google Sign-In Error', error.message || 'An error occurred during Google sign-in.');
    }
  }

  // Facebook Sign-In Integration
  async function onFacebookButtonPress() {
    try {
      console.log("Attempting Facebook sign-in...");
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      await auth().signInWithCredential(facebookCredential);

      console.log("User signed in with Facebook successfully!");
      // Navigate to your desired screen after successful Facebook sign-in
      // navigation.navigate("Mapsearch"); // Example navigation

    } catch (error) {
      Alert.alert("Login Error", error.message || "An error occurred during Facebook sign-in");
      console.error("Facebook login error:", error);
    }
  }


  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      if (value.length > 0) validateEmail(value);
      else setEmailError(""); // Clear error if input is empty
    } else if (field === "password") {
      setPassword(value);
      if (value.length > 0) validatePassword(value);
      else setPasswordError(""); // Clear error if input is empty
    } else if (field === "number") {
      const numericText = value.replace(/[^0-9]/g, "");
      setNumber(numericText);
      if (numericText.length > 0) validatePhone(numericText);
      else setPhoneError(""); // Clear error if input is empty
    }
  };

  const handlePhoneFocus = () => {
    setActiveInput("phone");
    setPhoneError(""); // Clear any existing phone error
  };

  const handleEmailPasswordFocus = () => {
    setActiveInput("email-password");
    validateEmail(email);
    validatePassword(Password);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError("Please enter your email");
      return false;
    } 
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Please enter your password");
      return false;
    }
    if (password.length < 2) {
      setPasswordError("Please enter your password");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.length < 7) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = () => {
    setInputValidationError("");
    let isValid = true;

    if (activeInput === "email-password") {
      if (!validateEmail(email)) isValid = false;
      if (!validatePassword(Password)) isValid = false;
    } else if (activeInput === "phone") {
      if (!validatePhone(number)) isValid = false;
    }

    // Check if all required fields are filled
    if (!email && !number && !Password) {
      setInputValidationError("Please enter a phone or email and password.");
      setTimeout(() => {
        setInputValidationError(""); // Hide the error after 3 seconds
      }, 3000);
      return;
    }

    // Ensure necessary validations have passed
    if (!isValid) {
      return;
    }

    if (activeInput === "phone") {
      handleVerification(callingCode + number);
    } else if (activeInput === "email-password") {
      handleLogin();
    }
  };

  const handleVerification = async (number) => {
    startSpin();
    try {
      setLoading(true);
      //    
      const response = await fetch(ENDPOINTS.whatsappValidation(number), {
        method: "POST",
      });

      if (!response.ok) {
        const responseData = await response.json();
        ToastAndroid.show(responseData.message || "Failed to send verification code.", ToastAndroid.SHORT);
        return;
      }

      setNumber("");
      navigation.navigate("numberverify", { phonenumber: number });
    } catch (error) {
      const errorMessage = error?.message || "Failed to send verification code.";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const signInValidation = async (number) => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.phoneValidationSignIn(number), {
        method: "POST",
      });

      if (!response.ok) {
        const responseData = await response.json();
        ToastAndroid.show(responseData.message || "Sign-in validation failed", ToastAndroid.SHORT);
        return false;
      }

      return true;
    } catch (error) {
      const errorMessage = error?.message || "Failed to proceed sign-in!";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 3000);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    setActiveInput(null);
    setNumber("");
    setEmail("");
    setPassword("");
    setError("");
    navigation.navigate("Register");
  };

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(`+${country.callingCode[0]}`);
    setModalVisible(false);
  };

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

  const handleLogin = async () => {
    startSpin();
    if (!validateEmail(email) || !validatePassword(Password)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: Password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("accessToken", responseData.accessToken);
        await AsyncStorage.setItem("refreshToken", responseData.refreshToken);
        await AsyncStorage.setItem("userId", responseData.userId);
        await AsyncStorage.setItem("emailId", email);
        // setError("Logged in successfully");
        ToastAndroid.show("Sign-in in successfully", ToastAndroid.SHORT);
        setEmail("");
        setPassword("");
        navigation.navigate("Mapsearch");
      } else {
        setError(responseData.error || "Login failed");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error?.message || "Login failed!";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleForget = () => {
    setActiveInput(null);
    setNumber("");
    setEmail("");
    setPassword("");
    setError("");
    navigation.navigate("forgetpassword");
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
        return true;
      }

      if (activeInput) {
        setActiveInput(null);
        setNumber("");
        setEmail("");
        setPassword("");
        return true;
      }

      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => backHandler.remove();
  }, [activeInput]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setNumber("");
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordError("");
        setPhoneError("");
      };
    }, [])
  );
  return (
    <SafeAreaView style={[flex= 1, isLandscape ? styles.landscape : styles.portrait]}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: wp(1) }}>
        <View style={styles.container}>
      <View style={styles.content}>
        <ImageBackground source={Blue} style={styles.blueimage}>
          <Image source={klassride} style={styles.logo} />
          <Text style={styles.text}>Welcome to Klass Ride!</Text>
          <Text style={styles.text1}>Find the best ride at the best price,</Text>
          <Text style={styles.text1}>all in one place</Text>
        </ImageBackground>
      </View>

      <View style={[styles.overlay, { backgroundColor: isInputFocused ? 'transparent' : '#000000' }]}>
        <View>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0.28, y: 0 }}
            end={{ x: 0.94, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.innerContainer}>
              <TouchableOpacity
                onPress={() => {
                  setActiveInput("phone");
                  setModalVisible(true);
                }}
                style={styles.countryCodeSelector}
              >
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withAlphaFilter
                  withCallingCode
                  onSelect={onSelectCountry}
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                />
                <Text style={styles.countryCode}>{callingCode}</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.numberinput}
                value={number}
                onChangeText={(text) => handleInputChange("number", text)}
                onFocus={handlePhoneFocus}
                keyboardType="numeric"
                placeholder="Phone number"
                placeholderTextColor="#CBC0C099"
                maxLength={15}
                editable={!(email.length > 0 || Password.length > 0)}
              />
              {number.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setNumber("");
                    setActiveInput(null);
                  }}
                  style={styles.icon1}
                >
                  <MaterialCommunityIcons name="close-circle" size={18} color="#cccccc" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
          {(activeInput === "phone" && number.length > 0 && phoneError) && (
            <Text style={styles.errorText}>{phoneError}</Text>
          )}
        </View>

        <Text style={styles.login}>or login with</Text>

        <View style={styles.EmailinputContainer}>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0.28, y: 0 }}
            end={{ x: 0.94, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.innerContainer}>
              <TextInput
                style={styles.inputEmail}
                value={email}
                onChangeText={(value) => handleInputChange("email", value)}
                placeholder="E-mail address"
                keyboardType="email-address"
                placeholderTextColor="#CBC0C099"
                onFocus={handleEmailPasswordFocus}
                editable={number.length === 0}
                // Disable spell check to avoid keyboard crash
                autoCorrect={false}
              />
              {email.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setEmail("");
                    setActiveInput(null);
                  }}
                  style={styles.icon1}
                >
                  <MaterialCommunityIcons name="close-circle" size={18} color="#cccccc" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
          {(activeInput === "email-password") && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
        </View>

        <View style={{ borderRadius: 10, overflow: "hidden", marginTop: wp(2) }}>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                value={Password}
                onChangeText={(value) => handleInputChange("password", value)}
                placeholder="Password"
                keyboardType="default"
                secureTextEntry={!showPassword}
                placeholderTextColor="#CBC0C099"
                onFocus={handleEmailPasswordFocus}
                editable={number.length === 0}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="#cccccc" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          {(activeInput === "email-password") && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
        </View>

        <View style={styles.usertab}>
          <TouchableOpacity onPress={handleForget}>
            <Text style={styles.forget}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View>
          {inputValidationError ? <Text style={styles.credentialerrorText}>{inputValidationError}</Text> : null}
        </View>
        {error && (
            // <View style={styles.errorContainer}>
            <View>
              <Text style={styles.credentialerrorText}>{error}</Text>
              </View>
              // <TouchableOpacity onPress={() => setError("")} style={styles.closeIcon}>
              //   <Icon name="close" size={20} color="white" />
              // </TouchableOpacity>
            // </View>
          )}

        <View style={[styles.buttonspace1, { marginTop: error ? 0 : hp(2) }]}>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorderbutton}
          >
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSubmit}>
              <Text style={styles.submitbuttonlogin}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.Acc}>Don't have an account? </Text>
          <View style={styles.buttonspace}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
              <LinearGradient
                colors={["#FF6200", "#4800AC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorderbutton}
              >
                <Text style={styles.submitbutton}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lap}>
          <Text style={[styles.log,{ fontFamily: fonts.montseratSemiBold}]}>Sign up with</Text>
          <View style={styles.socialButtons}>
            {/* Google Sign-In Button */}
            <TouchableOpacity activeOpacity={0.8} style={styles.google} onPress={onGoogleButtonPress}>
              <Image source={google} style={styles.iconImage} />
            </TouchableOpacity>
            {/* Facebook Sign-In Button */}
            <TouchableOpacity activeOpacity={0.8} style={styles.facebook} onPress={onFacebookButtonPress}>
              <Image source={facebook} style={styles.iconImage} />
            </TouchableOpacity>
          </View>
          
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
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <Feather name="loader" size={40} color="#ff7d00" />
          </Animated.View>
        </View>
      )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: "#000000",
    //  alignItems: 'center',
    //  justifyContent: 'center',
     // elevation: 15,
     padding:wp(0.5)
   },
   content:{
    flex: 1,
    alignItems: "center",
    padding: wp(2),
   },
   ImageBackground: {
     width: 200,
     height: 200,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "rgba(31, 0, 167, 0.35)",
     borderRadius: 100,
     overflow: "hidden",
     ...Platform.select({
       ios: {
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 10 },
         shadowOpacity: 0.6,
         shadowRadius: 20,
       },
       android: {
         elevation: 15,
       },
     }),
   },
   blurOverlay: {
     ...StyleSheet.absoluteFillObject,
     position: "absolute",
   },
   gradient: {
     ...StyleSheet.absoluteFillObject,
     position: "absolute",
     opacity: 0.7,
   },
   blueimage:{
     width: wp(130),
     height: hp(30),
     resizeMode: "contain",
     // position:"absolute"
   },
   logo: {
     width: wp(40),
     height: hp(16),
     // marginTop: hp(2),
     resizeMode: "contain",
     alignSelf:"center"
   },
   imagebackground:{
     justifyContent:"center",
     alignSelf:"center"
   },
   // content:{
   //   padding:wp(1),
   //   marginTop:wp(1)
   //   width:wp(10),
   //   height:hp(1)
   //   flex:1
   // },
   overlay: {
     // elevation: 10,
     padding:wp(1),
     justifyContent:"center",
     // marginBottom:wp()
   },
   text: {
     color: "white",
     fontFamily: fonts.montseratBold,
     fontSize: wp(6),
     // marginRight: wp(5),
     textAlign:"center"
   },
   text1: {
     color: "white",
     fontFamily: fonts.montseratRegular,
     fontSize: 13,
     // marginRight: wp(5),
     // marginTop: hp(-2),
     // marginBottom:hp(1),
     textAlign:"center"
   },
   innerContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor:'#000000',
     borderRadius: 30,
     paddingVertical: 3,
     // width:wp(90)

   },
   numberinput:{
     color:"#cccccc",
     fontFamily:fonts.montseratSemiBold,
     width:wp(50)
   },
   gradientWrapper: {
     borderRadius: 20,
     overflow: 'hidden',
   },
   // inputContainer: {
   //   flexDirection: 'row',
   //   alignItems: 'center',
   //   backgroundColor: '#22272B',
   //   borderRadius: 20,
   //   fontFamily: fonts.NATS,
   //   color: '#ffffff',
   //   fontSize: hp(20),
   //   marginTop: hp(1),
   //   height: hp(6),
   //   overflow: 'hidden',
   // },
   countryCodeSelector: {
     flexDirection: 'row',
     paddingHorizontal: 10,
     paddingVertical: 1,
     alignItems: 'center',
     color: '#cccccc',

   },
   countryCode: {
     fontSize: wp(4),
     color: '#cccccc',
     fontFamily:fonts.montseratSemiBold,
   },
   input: {
     fontSize: wp(4),
     letterSpacing: 2,
     color: '#cccccc',
     backgroundColor: '#000000',
   },
   // numberinput: {
   //   flex: 1, // Make sure the input takes full space
   //   fontSize: 16,
   //   color: "#fff",
   //   paddingVertical: 8, // Prevent overflow
   //   paddingHorizontal: 10,
   // },
   gradientBorder: {
     padding: 1.1,
     borderRadius: 30,
   },
   inputEmail: {
     flex: 1,
     fontSize: wp(4),
     color: '#cccccc',
     // letterSpacing: 2,
     backgroundColor: '#000000',
     borderRadius: 30,
     paddingHorizontal:wp(9),
     fontFamily:fonts.montseratSemiBold
   },
   EmailinputContainer: {
    //  width: wp(95),
     marginTop: hp(2),
     marginBottom: hp(1),

   },
   passwordContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#000000',
     borderRadius: 30,
     paddingHorizontal: wp(3),
     height: hp(7),

   },
   icon: {
     // paddingHorizontal: wp(10),
     position: 'absolute',
     right: wp(7)
   },
   icon1: {
     position: 'absolute',
     right: wp(5)
     // paddingHorizontal: wp(4.5),
   },
   inputPassword: {
     flex: 1,
     fontSize: wp(4),
     color: '#cccccc',
     // letterSpacing: 2,
     paddingHorizontal:wp(6),
     fontFamily:fonts.montseratSemiBold,
   },
   forget: {
     color: "#FF8336",
     // marginTop: hp(1),
     fontSize: wp(3.5),
     textDecorationLine: "underline",
     // marginLeft: wp(58),
      fontFamily: fonts.montseratMedium,
      fontWeight:"500",
      marginTop:wp(1),
   },
   lap: {
     marginTop: hp(-4),
     alignItems: 'center',
     justifyContent: 'center'

   },
   login: {
     color: "white",
     alignSelf: "center",
     marginTop: hp(2),
     fontFamily: fonts.montseratSemiBold,
     color: '#cccccc',
   },
   usertab: {
     flexDirection: 'row',
     justifyContent: "flex-end"
   //   // bottom: 19,
   //   // alignItems: "flex-start",
   //   // flexDirection: "row"
   },
   Acc: {
     color: 'white',
     fontSize: wp(3.5),
     textAlign:"center",
      fontFamily: fonts.montseratMedium,
      fontWeight:"500"
   },
   code: {
     color: "orange",
     // textAlign: "center",
     textDecorationLine: "underline",
     // marginTop:hp
     // fontFamily: fonts.Poppins,
     fontSize: wp(3),
   },
   log: {
     marginTop: hp(6),
     color: "#ffffff",
     textAlign: 'center',
     fontSize: 13,
     marginBottom: hp(-3),
     fontFamily: fonts.montseratRegular,
   },
   gradientBorderbutton: {
     borderRadius: 20,
     padding: 1,
     width: wp(50),
     height: hp(5),
     alignSelf: 'center',
   },
   buttonspace: {
     marginTop: hp(1),
     // position: 'relative',
   },
   button: {
     backgroundColor: "#000000",
     borderRadius: 20,
     width: '100%',
     height: '100%',
     justifyContent: 'center',
     alignItems: 'center',
     alignContent:"center"
   },
   submitbuttonlogin: {
     color: '#ffffff',
     fontSize: wp(4),
     // fontWeight: 'bold',
     textAlign: "center",
     // marginTop: hp(0.9),
     letterSpacing: 1,
     padding:wp(2),
     fontFamily: fonts.montseratBold,
   },
   registerContainer:{
     marginTop:wp(3)
   },
   // registerbutton: {
   //   borderRadius: 12,
   //   width: wp(50),
   //   height: hp(5),
   //   justifyContent: 'center',
   // },

   submitbutton: {
     color: '#ffffff',
     fontSize: wp(4.4),
     // fontWeight: 'bold',
     textAlign:"center",
     letterSpacing: 1,
     padding:wp(1.5),
     fontFamily: fonts.montseratBold,
   },
   socialButtons: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     width: wp(30),
     height: hp(7),
     // marginLeft: wp(29),
     marginTop: hp(4),
   },
   google: {
     backgroundColor: '#262626',
     borderRadius: 10,
     width: '43%',
     alignItems: 'center',
     padding: wp(4),
     flexDirection: 'row',
   },
   facebook: {
     backgroundColor: '#262626',
     borderRadius: 10,
     width: '43%',
     alignItems: 'center',
     padding: wp(4),
     flexDirection: 'row',
   },
   reg: {
     color: 'white',
     marginLeft: wp(31),
     marginTop: hp(2),
     fontSize: wp(3.5),
   },
   buttonText: {
     fontSize: wp(4.5),
     color: '#000000',
     marginLeft: wp(2),
   },
   iconImage: {
     width: wp(10),
     height: wp(10),
     marginLeft: wp(-2.5),
   },
   registerText: {
     color: "#0066ff",
     marginLeft: wp(35),
     textDecorationColor: "blue",
     textDecorationLine: "underline",
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

  errorContainer: {
    backgroundColor: "#800020",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'grey',
    borderWidth: 1,
    gap: 1,
  },

    errorText: {
      color: "red",
      fontSize: wp(3.5),
      flexShrink: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      alignSelf: "flex-end",
      // marginBottom:wp(2),
      // paddingRight:wp(6)
    },
    credentialerrorText: {
      color: "red",
      fontSize: wp(3.5),
      // flexShrink: 1,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginBottom:wp(1.5),
      // paddingRight:wp(6)
    },
  closeIcon: {
    position: "absolute",
    right: wp(4),
  },
});