import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { wp, hp } from "../common/responsive";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// Images
// import round from "../../assets/images/round.png";
import Blue from "../../assets/images/blue.png"
// import klassride from '../../assets/images/klassride.png';
// import klassride from '../../assets/images/klassride1.png';
import klassride from '../../assets/images/klassride1.png';
import Feather from "react-native-vector-icons/Feather"

export default function Welcome() {
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const checkNetworkAndToken = async () => {
      try {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          setIsModalVisible(true);
          return;
        }

        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          console.log("Token exists:", token);
          setInitialRoute("Mapsearch");
        } else {
          console.log("No token found.");
          setInitialRoute("Signup");
        }
      } catch (error) {
        console.error("Error checking network/token:", error);
        setInitialRoute("Signup");
      }
    };

    checkNetworkAndToken();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        console.log("Internet is back, checking token again...");
        await checkNetworkAndToken();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initialRoute) {
      const timer = setTimeout(() => {
        navigation.navigate(initialRoute);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [initialRoute, navigation]);

  const hideModal = () => {
    setIsModalVisible(false);
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* No Internet Modal  */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>No Internet</Text>
            <Feather size={23}  name="wifi-off" color="#59599c" />
            <Text style={styles.modalMessage}>
              Please check your network connection and try again.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.roundWrapper}>
  <ImageBackground source={Blue} style={styles.imageBackground} resizeMode="contain">
    <View style={styles.innerContent}>
      <Image source={klassride} style={styles.klassImage} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.poweredBy}>Powered by Qpt</Text>
      </View>
    </View>
  </ImageBackground>
</View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },
  
textContainer: {
  // marginTop: hp(-4),
  alignItems: "center",
  // marginBottom:90,
},
  poweredBy: {
    marginBottom: hp(0),
    fontSize: wp(3.5),
    color: "#fff",
    fontWeight: "600",
    // paddingBottom:hp(9),
    // marginBottom:90,
    marginLeft:20,
    // marginBottom:90,
  },
  innerContent: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:9,

    // padding:90,
    // marginBottom:10,
  },
  roundWrapper: {
    width: wp(170),
    height: wp(140),
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  klassImage: {
    width: wp(38),
    height: wp(23),
    // backgroundColor: 'red',
    resizeMode: 'contain'
    // marginTop:90,
    // marginTop:90,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color:"black"
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color:"black"
  },
  modalButton: {
    padding: 7,
    width: wp(30),
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#D3770C",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: wp(4),
    fontWeight: "bold",
    color: "#ffffff",
  },
});
