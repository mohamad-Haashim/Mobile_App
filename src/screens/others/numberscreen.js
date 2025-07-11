import React, { useState } from "react";
import { StatusBar, TouchableOpacity, Text, TextInput, View, Image, SafeAreaView, StyleSheet, ImageBackground } from "react-native";
import taxilogo from '../../assets/images/taxilogo.png';
import google from '../../assets/images/google_logo.png';
import facebook from '../../assets/images/facebook_logo.png';
import Linking from 'react-native/Libraries/Linking/Linking';
import { useNavigation } from "@react-navigation/native";
import Header from "../common/header";
import { wp, hp } from "../common/responsive";

export default function Numberscreen () {
  const [number, setNumber] = useState('');
  const navigation = useNavigation();

  const handleGoogleLogin = () => {
    const googleSignupURL = "https://accounts.google.com/v3/signin/identifier";
    Linking.openURL(googleSignupURL); 
  };

  const handleFacebookLogin = () => {
    const facebookSignupURL = "https://www.facebook.com/reg/";
    Linking.openURL(facebookSignupURL);
  };

  const handleverfication = () => {
    navigation.navigate('verify',{phonenumber:number}); 
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Header />
      </View>
      <Image source={taxilogo} style={styles.logo} />
      <View style={styles.overlay}>
        <Text style={[styles.text, { marginTop: 10 }]}>
         ENTER YOUR PHONE 
        </Text>
        <Text style={styles.text1}>
        NUMBER
        </Text>
        <TextInput
          style={[styles.input, { fontFamily: "Times New Roman" }]}
          value={number}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setNumber(numericText);
          }}
          keyboardType="numeric"
          placeholder="+91 xxx-xxxx-xxx"
          placeholderTextColor="white" 
          maxLength={15}
        />
        <View style={styles.buttonspace}>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} >
              <Text style={styles.OTPbutton}>Send OTP</Text>
            </TouchableOpacity>
            <View>
      
        <View style={styles.lap}>
          <Text style={styles.log}>or sign up with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity activeOpacity={0.8} style={styles.google} onPress={handleGoogleLogin}>
              <Image source={google} style={styles.iconImage} />
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.facebook} onPress={handleFacebookLogin}>
              <Image source={facebook} style={styles.iconImage} />
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>
          </View>
          </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303336",
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
  },
  header: {
    marginBottom: hp(-1),
  },
  logo: {
    width: wp(45),
    height: hp(15),
    marginTop: hp(5),
  },
  overlay: {
    padding: wp(5),
    elevation: 10,
  },
  text: {
    color: "#818181",
    letterSpacing: 1,
    fontWeight: "bold",
    fontFamily: "Times New Roman",
    fontSize: wp(6),
  },
  text1: {
    letterSpacing: 1,
    color: "#818181",
    fontWeight: "bold",
    fontSize: wp(6),
    marginLeft: wp(18),
  },
  input: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(12),
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 10,
    fontSize: wp(5),
    backgroundColor: '#22272B',
    marginTop: hp(6),
    color: "white",
    shadowColor: "white",
    shadowOffset: {
      width: wp(5),
      height: hp(12),
    },
    shadowOpacity: 1.4,
    shadowRadius: 10,
    elevation: 8,
  },
  lap: {
    marginBottom: hp(1),
  },
  log: {
    marginTop: hp(6),
    color: "#ffffff",
    textAlign: 'center',
    fontSize: wp(4.5),
  },
  buttonspace: {
    marginTop: hp(5),
    position: 'relative',
  },
  button: {
    backgroundColor: "#ff7d00",
    borderRadius: 10,
    width: wp(50),
    height: hp(5.5),
    alignSelf: 'center',
  },
  OTPbutton: {
    color: '#ffffff',
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: hp(1),
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(30),
    height: hp(6),
    marginLeft: wp(18),
    marginTop: hp(5),
  },
  google: {
    backgroundColor: '#262626',
    borderRadius: 10,
    width: '43%',
    alignItems: 'center',
    padding: hp(2),
    flexDirection: 'row',
  },
  facebook: {
    backgroundColor: '#262626',
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    padding: hp(2),
    flexDirection: 'row',
  },
  reg: {
    color: 'white',
    marginLeft: wp(33),
    marginTop: hp(3),
    fontSize: wp(3.5),
  },
  buttonText: {
    fontSize: wp(4.5),
    color: '#000000',
    marginLeft: wp(2),
  },
  iconImage: {
    width: wp(10),
    height: hp(5),
    marginLeft: wp(-2.5),
  },
  registerText: {
    color: "#0066ff",
    marginLeft: wp(37),
    textDecorationColor: "blue",
    textDecorationLine: "underline",
  }
});
