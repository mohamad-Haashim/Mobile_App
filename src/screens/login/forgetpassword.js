import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  Animated,
  Easing,
  ImageBackground,
  ScrollView,
} from "react-native";
import netaImage from "../../assets/images/neto.png";
import klassride from "../../assets/images/klassride1.png";
import Blue from "../../assets/images/blue.png";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../common/responsive";
import { ENDPOINTS } from "../../environments/environment";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import { fonts } from "../../components/customfont";

export default function Numberscreen() {
  const [email, setemail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const spinValue = useRef(new Animated.Value(0)).current;
  const backPressCount = useRef(0);
  const backPressTimeout = useRef(null);

  const handleInputChange = (value) => {
    setemail(value);
    if (value) setError("");
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

  const handleVerification = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    startSpin();

    try {
      const response = await fetch(ENDPOINTS.forgotPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();
      if (response.status === 200) {
        setemail("");
        navigation.navigate("numberverify", { EmailId: email },{
          Email: email,
          type: "forgetpassword",
        });
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
      } else {
        setError(responseData?.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    const backAction = () => {
      navigation.goBack(); // Go back to previous screen
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SafeAreaView style={flex= 1} >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: wp(1) }}>
        <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.overlay}>
          <Image source={klassride} style={styles.logo} />          
          <ImageBackground source={Blue} style={styles.headerBackground}>
          <Text style={[styles.text]}>FORGOT PASSWORD</Text>
        <View style={styles.inputcontainer}>
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
                onChangeText={handleInputChange}
                placeholder="E-mail address"
                keyboardType="email-address"
                placeholderTextColor="#CBC0C099"
              />
            </View>
          </LinearGradient>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>
        </View>
        </ImageBackground>
        <View style={[styles.buttonspace]}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleVerification}>
            <LinearGradient
              colors={["#FF6200", "#4800AC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorderbutton}
            >
              <Text style={styles.submitbutton}>Send OTP</Text>
            </LinearGradient>
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
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: wp(4),
  },
  headerBackground: {
    width: wp(115),
    height: hp(30),
    alignItems: "center",
    // marginBottom: wp(5),
    // paddingBottom: hp(1),
    position:"relative"
  },
  logo: {
    width: wp(35.5),
    height: hp(15),
    resizeMode: "contain",
    marginBottom:wp(-5),
    marginTop:wp(30),
    // backgroundColor:"red"
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Times New Roman",
    fontSize: wp(5),
    textAlign: "center",
    marginTop:wp(12)
  },
  inputcontainer:{
    marginTop:wp(5)
  },
  EmailinputContainer: {
    alignItems: "center",
    // width: "100%",
    // marginBottom: hp(0),
  },
  gradientBorder: {
    padding: 1,
    borderRadius: 20,
  },
  innerContainer: {
    backgroundColor: "#000000",
    borderRadius: 20,
    height: hp(6.5),
    width: wp(85),
  },
  inputEmail: {
    width: wp(85),
    height: hp(6),
    fontSize: wp(4),
    paddingHorizontal: wp(6),
    color: "white",
    letterSpacing: 2,
    top: wp(0.5),
    fontFamily:fonts.montseratSemiBold,
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: wp(3.5),
    marginTop: hp(1.2),
    textAlign: "left",
    // alignSelf: "flex-end",
    marginLeft: wp(30),
  },
  buttonspace: {
    marginBottom: hp(15),
  },
  gradientBorderbutton: {
    borderRadius: 20,
    padding: 1,
    width: wp(50),
    height: hp(5),
    alignSelf: "center",
    justifyContent: "center",
  },
  submitbutton: {
    color: "#fff",
    fontSize: wp(4.2),
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 3000,
  },
});
