import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../components/customfont";
import { wp, hp } from "../common/responsive";
import MySidebar from "../common/sidebar";

import profile from '../assets/images/profile.png';
export default function Driver() {
    const [Location, setLocation] = useState('');
    const [destination, setdestication] = useState('');
    const navigation = useNavigation();

    const handleVerify = () => {
        // if (Password && confirmPassword && Password === confirmPassword) {
        //     navigation.navigate('Termscondition'); 

        //     alert("Passwords do not match!");
        // }
        navigation.navigate('');
    }



    return (
      <SafeAreaView style={styles.container}>
      <MySidebar style={styles.sidebar} />
      <Text style={[styles.brand, { fontFamily: fonts.NATS }]}>TAXIGO</Text>
      
      <View style={styles.inputContainer}>
          <TextInput
              style={styles.inputsearch}
              onChangeText={setLocation}
              value={Location}
              placeholder="Your Location"
              placeholderTextColor="#cccccc"
          />
      </View>

      <View style={styles.inputContainer1}>
          <TextInput
              style={styles.inputsearch}
              onChangeText={setdestication}
              value={destination}
              placeholder="Enter Destination"
              placeholderTextColor="#ff7d00"
          />
      </View>
      
     <View style={styles.cardlay}>
     <View style={styles.rowContainer}>
  <Image source={cardbackground} style={styles.cardbackgroundimage} />
  <Image source={profile} style={styles.profile} />
  
  <View style={styles.drivernamelay}>
    <Text style={styles.drivername}>Hermon Solution</Text>
  </View>
  <View style={styles.carnamelay}>
    <Text style={styles.carname}>
      honda - city
    </Text>
    <Text style={styles.carnum}>
      TN-82-M-8282
    </Text>
  </View>
  <Text style={styles.cartime}>
      Arriving in 10 min
    </Text>
  </View>
  
  <View style={styles.buttonspace}>
    <TouchableOpacity activeOpacity={0.8} style={styles.button}>
      <Text style={styles.Submitbutton}>Continue</Text>
    </TouchableOpacity>
  </View>
</View>
  </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#303336",
      alignItems: 'center',
      paddingVertical: hp(2), 
  },
  brand: {
      fontSize: wp(10),
      letterSpacing: wp(0.8),
      color: "#ff7d00",
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
      marginTop: hp(5),
      fontFamily: fonts.NATS,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  cardlay: {
      alignItems: 'center',
      marginTop: hp(30), 
      position: 'relative',
  },
  cardbackgroundimage: {
      resizeMode: 'contain',
      width: wp(110),
      height: hp(35),
      marginBottom: hp(2), 
      position: 'absolute',
  },
  carnum:{
    fontSize:wp(5),
    color:'white'
  },
  profile:{
    marginBottom:hp(17),
    marginLeft:wp(5),
    width:wp(15),
    height:hp(8),
    flexDirection: 'row',
  },
  drivernamelay:{
    marginBottom: hp(10), 
    justifyContent: 'center',
    marginRight:wp(-60),
  },
  drivername:{
    fontSize:wp(6),
    color:"white",
    marginBottom:wp(20),
    textAlign: 'center',
    // marginRight:wp(1),
    marginLeft:wp(3)
  },
  carname:{
    fontSize:20,
    color:"white",
    marginRight:wp(30),
    // marginLeft:wp(20)
  },
  carnamelay:{
    marginRight:wp(40),
    // marginTop:wp(1),
    // marginLeft:wp(1)
  },
  cartime:{
    fontSize:wp(5),
    color:"white",
    marginLeft:wp(-40),
  },
  inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: '#22272B',
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: hp(1), 
      shadowColor: '#000',
      elevation: 8,
      width: wp(80),
      paddingHorizontal: wp(2),
  },
  inputContainer1: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: '#22272B',
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: hp(1), 
      shadowColor: '#000',
      elevation: 8,
      width: wp(80),
      height: hp(6.5), 
      paddingHorizontal: wp(2),
  },
  inputsearch: {
      flex: 1,
      paddingVertical: hp(1.5),
      fontSize: wp(4.5),
      color: "white",
  },
  sidebar: {
      position: "absolute",
      top: hp(2),
      left: wp(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(100),
    marginTop: hp(3),
},
buttonImage: {
    width: wp(20),
    height: hp(10),
    resizeMode: 'contain',
},
gradientStyle: {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10, 
},
button: {
  backgroundColor: "#ff7d00",
  borderRadius: 10,
  width: wp(70),
  height: hp(5),
  marginTop: hp(4),
},
buttonspace: {
  marginTop: hp(-7),
},
Submitbutton1: {
  color: '#FFFFFF',
  fontSize: wp(4.5),
  fontWeight: 'bold',
  textAlign: "center",
  marginTop: hp(1),
},
});
