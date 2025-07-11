import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions,
  TouchableOpacity, Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import bolt from '../../assets/images/bolt.png';
import uber from '../../assets/images/uber.png';
import cab from '../../assets/images/black.png';
import klassride from "../../assets/images/klassride-white.png";
import { wp, hp } from "../common/responsive";
import { useNavigation } from "@react-navigation/native";
import Linkedicon from "../../assets/images/linkedVector.svg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../../environments/environment';
import { fonts } from '../../components/customfont';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const Linked = () => {
  const navigation = useNavigation();
  const [loadingMethod, setLoadingMethod] = useState(null);
  const [disconnectingMethod, setDisconnectingMethod] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    if (loadingMethod || disconnectingMethod) {
      spin.start();
    } else {
      spin.stop();
      spinValue.setValue(0);
    }
  }, [loadingMethod, disconnectingMethod]);

  const paymentOptions = [
    { source: bolt, label: 'Bolt', value: 'Bolt' },
    { source: uber, label: 'Uber', value: 'Uber' },
    { source: cab, label: ' BlackCab', value: 'Blackcab' },
  ];

  const handlelinked = async (value) => {
    setDisconnectingMethod(value);
    setLoadingMethod(value);
    try {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const Email = await AsyncStorage.getItem("email");

      const response = await fetch(ENDPOINTS.linkedRequest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhoneNo: phoneNumber || Email,
        }),
      });

      const data = await response.json();
      console.log("Linked response11111:", data);
      navigation.navigate("numberverify",{ Linked: phoneNumber });
      console.log(phoneNumber,"phoneNumber1111111")
      setTimeout(() => {
        setLoadingMethod(null);        
      }, 500);
    } catch (error) {
      console.error('Error fetching API:', error);
      setLoadingMethod(null);
    }
  };

  const handleDisconnect = async (value) => {
    setDisconnectingMethod(value);
    // Simulate API call for disconnection
    setTimeout(() => {
      console.log(`Disconnecting ${value}...`);
      setDisconnectingMethod(null);
      navigation.navigate("numberverify" );
    }, 1000); // Simulate a 1-second disconnection process
  };


  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.linkedIcon}><Linkedicon /></View>
            <Text style={styles.headerText}>Linked Apps</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={['#FF6200', '#1F00A7']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.horizontalLine}
      />

      {paymentOptions.map((option, index) => (
        <View key={index} style={styles.paymentOptionContainer}>
          {option.value !== 'Bolt' && (
            <LinearGradient
              colors={['#FF6200', '#1F00A7']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.paymentOptionTopBorder}
            />
          )}
          <View style={styles.paymentOption}>
            {option.source && <Image source={option.source} style={styles.icon} />}
            <Text style={styles.text}>{option.label}</Text>

            {option.value === 'Bolt' ? (
              disconnectingMethod === option.value ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Feather name="loader" size={24} color="#808080" />
                </Animated.View>
              ) : (
                <TouchableOpacity onPress={() => handlelinked(option.value)}>
                  <Text style={styles.disconnectText}>Disconnect</Text>
                </TouchableOpacity>
              )
            ) : (
              loadingMethod === option.value ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Feather name="loader" size={24} color="#808080" />
                </Animated.View>
              ) : (
                <TouchableOpacity onPress={() => handlelinked(option.value)}>
                  <Text style={styles.connectText}>Connect</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      ))}

      <LinearGradient
        colors={['#FF6200', '#1F00A7']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.creditTopLine}
      />

      <View style={styles.creditOption}>
        <Text style={styles.creditText}>
          Link your ridesharing accounts to unlock exclusive discounts on the Klass Ride app,
          matching the discounts you enjoy on those platforms!
        </Text>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.04,
  },
  disconnectText: {
    color: 'white',
    fontSize: wp(4),
    fontFamily: fonts.montseratRegular,
    marginTop: wp(1.4),
  },
  connectText: {
    color: 'green',
    fontSize: wp(4),
    fontFamily: fonts.montseratRegular,
     marginTop: wp(1.5),
  },
  linkedIcon: {
    justifyContent: "flex-start",
     marginTop: wp(1)
  },
  horizontalLine: {
    width: '75%',
     height: 1,
     marginTop: wp(6),
     top:wp(-10)
  },
  headerContainer: {
    width: '48%',
    borderRadius: 80,
    padding: 1,
    flexDirection: "row",
    marginVertical: 10,
    top:wp(-10)
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70,
    backgroundColor: '#0D0D2B',
  },
  gradientBorder: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 70,
    width: '100%',
    height: 40,
  },
  headerText: {
    fontSize: wp(4.5),
    textAlign: 'center',
    color: 'white',
    marginTop: hp(-3),
    fontFamily: fonts.montseratBold,
    paddingLeft: wp(7)
  },
  paymentOptionContainer: {
    width: '90%',
    marginVertical: 1,
    top:wp(-10)
  },
  paymentOptionTopBorder: {
    width: '100%',
    height: 1,
    marginTop: 9,
    marginRight: wp(3),
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: height * 0.01,
    height: 40,
    backgroundColor: '#0D0D2B',
    padding: wp(5),
  },
  creditOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#0D0D2B',
    padding: wp(1.5),
    top:wp(-11)
  },
  icon: {
    width: width * 0.11,
    height: height * 0.03,
    marginRight: width * 0.03,
    borderRadius: 15,
    marginTop: wp(2),
  },
  text: {
    color: 'white',
    fontSize: wp(4),
    flex: 1,
    marginTop: wp(1.5),
    fontFamily: fonts.montseratBold,
  },
  creditText: {
    color: 'white',
    fontSize: wp(4.1),
    textAlign: 'center',
    marginHorizontal: wp(5),
    fontFamily: fonts.montseratMedium,
  },
  creditTopLine: {
    width: '75%',
    height: 1,
    marginBottom: wp(4),
    marginTop: wp(2),
    top:wp(-10)
  },
  creditBottomLine: {
    width: '75%',
    height: 1,
    marginTop: wp(2),
  },
});

export default Linked;