import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  ToastAndroid,
  BackHandler,
  StatusBar,
  Modal,
  Animated,
  Easing,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";

import netaImage from "../../assets/images/neto.png";
import Blue from "../../assets/images/blue.png";
import klassride from "../../assets/images/klassride1.png";
import { wp, hp } from "../common/responsive";
import { ENDPOINTS } from "../../environments/environment";
import { fonts } from "../../components/customfont";

export default function Resetpassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();

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

  const handleVerify = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter your password and confirm password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    startSpin();
    const resetToken = route?.params?.token || "";

    try {
      const response = await fetch(ENDPOINTS.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        ToastAndroid.show("Password reset successful!", ToastAndroid.SHORT);
        navigation.navigate("Signup");
      } else {
        setError(result?.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err?.message || "An error occurred while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      setShowModal(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleExit = () => {
    setShowModal(false);
    navigation.navigate("forgetpassword");
  };

  const handleCancel = () => setShowModal(false);

  // Function to clear error when input changes
  const clearError = () => {
    if (error) {
      setError("");
    }
  };

  return (
    <SafeAreaView style={flex=1}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: wp(1) }}>
      <View  style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.overlay}>
        <ImageBackground source={Blue} style={styles.headerBackground}>
          <Image source={klassride} style={styles.logo} />
          <Text style={styles.header}>RESET PASSWORD</Text>
        </ImageBackground>

        <View style={styles.inputGroup}>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0.28, y: 0 }}
            end={{ x: 0.94, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                placeholder="Enter new password"
                placeholderTextColor="#CBC0C099"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  clearError(); // Clear error on input change
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.inputGroup}>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0.28, y: 0 }}
            end={{ x: 0.94, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#CBC0C099"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError(); // Clear error on input change
                }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleVerify} activeOpacity={0.8}>
          <LinearGradient
            colors={["#FF6200", "#4800AC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </LinearGradient>
        </TouchableOpacity>
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

      <Modal visible={showModal} transparent animationType="fade">
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']} // Solid black with transparency for blur effect
          style={styles.modalBackground}
        >
          <LinearGradient
            colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalContent}
          >
            <Text style={styles.modalText}>Are you sure you want to cancel password reset?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.modalButton}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExit}>
                <Text style={styles.yesmodalButton}>Yes</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </LinearGradient>
      </Modal>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",

  },
  overlay: {
    flex: 1,
    alignItems: "center",
    padding: wp(5),
  },
  logo: {
    width: wp(39),
    height: hp(21),
    resizeMode: "contain",
    marginTop: hp(5),
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: wp(6),
    borderRadius: 17,
    width: "90%",
    alignItems: 'center',
    backgroundColor:'black',
    marginBottom:wp(3),
  },
  header: {
    color: "white",
    fontSize: wp(6),
    // fontWeight: "bold",
    fontFamily: fonts.montseratBold,

    // marginVertical: hp(2),
  },
  headerBackground: {
    width: wp(126),
    height: hp(39),
    alignItems: "center",
    paddingTop: hp(1),
    paddingBottom: hp(1),
    // Bottom:90,
  },
  inputGroup: {
    width: "100%",
    marginBottom: hp(2),
    // marginTop:hp(4)
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 1,
  },
  inputWrapper: {
    backgroundColor: "#000",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    height: hp(6.5),
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    // color: "#fff",
    color: '#cccccc',
    fontSize: wp(4),
    // marginTop:wp(9),
    // paddingTop: wp(2),
    fontFamily:fonts.montseratSemiBold,
    paddingHorizontal:wp(6),
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: wp(3.5),
    marginBottom: hp(1),
    textAlign: "center",
  },
  button: {
    marginTop: hp(2),
    width: "80%",
  },
  buttonGradient: {
    borderRadius: 20,
    padding: 1,
    width: wp(52),
    height: hp(5),
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: wp(1.5),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp(4.2),
    // fontWeight: "bold",
    alignItems: 'center',
    // paddingLeft: wp(11),
    marginLeft:wp(8),
    // marginRight:wp(6),

    fontFamily: fonts.montseratBold,
    
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
  modalText: {
    color: "#fff",
    fontSize: wp(4.5),
    textAlign: "center",
    marginBottom: hp(2),
    fontFamily:fonts.montseratSemiBold,
    
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  yesmodalButton: {
    color: "red",
    fontSize: wp(4),
    // fontWeight: "bold",
    marginLeft: wp(15),
    marginRight: wp(15),
    fontFamily:fonts.montseratSemiBold,
  },
  modalButton: {
    color: "white",
    fontSize: wp(4),
    // fontWeight: "bold",
    marginLeft: wp(15),
    marginRight: wp(15),
    fontFamily:fonts.montseratSemiBold,
  },
});