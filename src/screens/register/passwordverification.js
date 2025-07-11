import React, { useState, useRef, useEffect } from "react";
import { StatusBar, TouchableOpacity, Text, TextInput, View, Image, SafeAreaView, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, Modal, BackHandler, Animated, Easing, ToastAndroid } from "react-native";
import taxilogo from '../../assets/images/taxilogo.png';
import { useRoute } from '@react-navigation/native';
import Header from "../common/header";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../common/responsive"
import klassride from "../../assets/images/klassride-white.png"
import { ENDPOINTS } from "../../environments/environment";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";

export default function Passwordverification() {
  const [value, setValue] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const [isDisabled, setIsDisabled] = useState(true);
  const route = useRoute();
  const { Email } = route.params;
  // const Email = "route.params@gmail.com";
  const formattedEmail = `${Email.slice(0, 2)}**********${Email.slice(Email.indexOf('@'))}`;
  const [timer, setTimer] = useState(45);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const spinValue = useRef(new Animated.Value(0)).current;

  const handleChange = (text, index) => {
    const newValue = [...value];
    newValue[index] = text;
    setValue(newValue);
    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackSpace = (event, index) => {
    setError('')
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      handleChange('', index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // const handleVerification = () => {
  //   // Navigation code here, if needed
  //   console.log("Verification code submitted:", value.join(''));
  // };

  const handleVerifyCode = async () => {
    // setLoading(true); // Start loading
    // startSpin();
    // setError(""); // Clear any previous errors
    if (value.join('').length !== 5) {
      console.log("no value entered");
      console.log(value);
      setError("Please enter a 5-digit code");
      // setTimeout(() => {
      //   setError('');
      // }, 3000);
      return;
    }
    if (value.length >= 5 && value !== "") {
      console.log(value);
      startSpin()
      setLoading(true)
      try {
        // Get the dynamic URL from ENDPOINTS.verifyToken
        const url = ENDPOINTS.verifyToken(value.join("")); // Pass the token as 'value'

        // Send GET request with token in the URL
        const response = await fetch(url, {
          method: "GET",
        });

        const responseData = await response.json();
        console.log("response in forgot ", responseData);

        if (response.status === 200) {
          console.log("msg", responseData.message);
          navigation.navigate("Resetpassword", { token: value.join("") });
          ToastAndroid.show("Code verified succesfully", ToastAndroid.SHORT);
        } else {
          const errorMessage = responseData?.message || "Something went wrong. Please try again.";
          setError('Invalid code'); // Set error message
        }
      } catch (error) {
        const errorMessage = error?.message || "Failed to send verification email.";
        setError(errorMessage); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  useEffect(() => {
    // setTimeout(() => {
    //   setError('');
    // }, 3000);
  }, [error])

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const handleResend = async () => {
    setLoading(true)
    setTimer(45);
    setIsDisabled(true);
    try {
      startSpin()
      setLoading(true)
      const response = await fetch(ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: Email }),
      });

      const responseData = await response.json();
      console.log("response in forgot ", responseData)
      if (response.status === 200) {
        console.log("msg", responseData.message)
        // setTimer(30);
        setIsDisabled(true);
        ToastAndroid.show("Code resent succesfully to your email!", ToastAndroid.SHORT);
      } else {
        const errorMessage = responseData?.message || 'Something went wrong. Please try again.';
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to send verification email.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  };

  const handleExit = () => {
    setShowModal(false);
    navigation.goBack();
  };

  const handleCancel = () => {
    setShowModal(false);
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


  useEffect(() => {
    const backAction = () => {
      setShowModal(true); // Show modal on back press
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Header /> */}
      </View>
      <StatusBar barStyle="light-content" />
      <Image source={klassride} style={styles.logo} />
      <View style={styles.overlay}>
        <Text style={styles.text}>ENTER VERIFICATION CODE</Text>
        <Text style={styles.text3}>We sent a 5-digits code to</Text>
        <Text style={styles.codenumber}>{formattedEmail}</Text>
        {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
        <View style={styles.inputContainer}>
          {value.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
              value={digit}
              maxLength={1}
              keyboardType="number-pad"
              selection={{ start: 1, end: 1 }}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(event) => handleBackSpace(event, index)}
            />
          ))}
        </View>
        <View>
          <TouchableOpacity activeOpacity={0.8} onPress={handleResend} disabled={isDisabled}>
            <Text style={styles.text4}>
              Didn't you receive any code?{' '}
              <Text style={[styles.code, isDisabled && { color: "grey" }]}>Resend Code</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.timer}>{isDisabled ? `00:${timer} ` + "Sec" : ""}</Text>
        </View>
        
        <View style={styles.buttonspace}>
        {error && (
          <View style={{alignItems: 'center'}}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
          </View>
        )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button,]}
            onPress={handleVerifyCode}

          >
            <Text style={styles.OTPbutton}>VERIFY NOW</Text>
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

      <Modal transparent={true} visible={showModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to go back?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalExitButton]}
                onPress={handleExit}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303336",
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    // flex:1,
    //  flexDirection:"row",
    // justifyContent: "flex-start",
    marginBottom: hp(14),
    // backgroundColor: "red",
    marginRight: wp(80),
    // borderRadius: 50
  },
  logo: {
    // width: wp(43),
    // height: hp(11.2),
    // marginBottom: hp(23),
    width: '100%',  // Use percentage-based width
    height: '10.5%',
    // aspectRatio: 1.5,  // Adjust as per your logo’s aspect ratio
    marginBottom: hp(3),
    marginTop: hp(-3),
    resizeMode: "contain",
  },
  overlay: {
    padding: wp(5),
    marginBottom: hp(10),
  },
  text: {
    // color: "#818181", //neat one
    color: "#CBC0C0",
    letterSpacing: 1,
    fontWeight: "bold",
    fontFamily: "Times New Roman",
    fontSize: wp(6),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2.5),
  },
  input: {
    padding: hp(1.5),
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 10,
    fontSize: wp(5),
    backgroundColor: '#22272B',
    color: "#ff7d00",
    textAlign: 'center',
    marginHorizontal: wp(1),
    width: wp(12),
    height: hp(7.5),
    elevation: 8,
    shadowColor: "white",
  },
  text3: {
    marginTop: hp(2.5),
    color: "white",
    fontSize: wp(4),
    textAlign: 'center',
  },
  codenumber: {
    color: "white",
    fontSize: wp(4),
    textAlign: 'center',
    marginTop: hp(1.5),
  },
  buttonspace: {
    marginTop: hp(15),
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#D3770C",
    borderRadius: 12,
    width: wp(50),
    height: hp(5),
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#ff7d00',
  },
  buttonDisabled: {
    backgroundColor: '#ffb976',
  },
  OTPbutton: {
    color: '#ffffff',
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: "center",
  },
  text4: {
    color: "white",
    textAlign: "center",
    marginTop: hp(1.5),
  },
  code: {
    color: "orange",
    marginTop: hp(1.5),
    textAlign: "center",
    textDecorationLine: "underline",
  },
  timer: {
    color: "white",
    marginLeft: wp(38)
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: wp(80),
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
    color: "#303336",
    marginBottom: 10,
  },
  modalText: {
    fontSize: wp(4),
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  modalExitButton: {
    backgroundColor: "#D3770C",
  },
  modalButtonText: {
    fontSize: wp(4),
    fontWeight: "bold",
    color: "#fff",
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
    zIndex: 3000,
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
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 1,
    gap: 1
  },
  errorText: {
    color: "white",
    fontSize: wp(3.5),
    flexShrink: 1,
  },
});
