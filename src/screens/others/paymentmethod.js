import { useState, useRef } from "react";
import { Modal,Button, StyleSheet, Text, TextInput, View, Image, Animated, SafeAreaView, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../components/customfont";
import { wp, hp } from "../common/responsive";
import MySidebar from "../common/sidebar";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Foundation from 'react-native-vector-icons/Foundation';;
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BookingSuccessScreen from "./sucessfullyscreen";

export default function Paymentmethod() {
    // const navigation = useNavigation(); 
    const [selectedPayment, setSelectedPayment] = useState(null);
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const handleRadioButtonPress = (option) => {
        setSelectedPayment(option);
      };
      handlecontinue
      const handlecontinue = () =>{
        navigation.navigate('BookingSuccessScreen'); 
      }
      const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
  
    return (
      <SafeAreaView style={styles.container}>
      <MySidebar style={styles.sidebar} />
      <Text style={[styles.brand, { fontFamily: fonts.NATS }]}>PAYMENT METHOD</Text>

      {/* <View style={styles.cardlay}>
          <Image source={cardbackground} style={styles.cardbackgroundimage} />
        </View> */}
        <View>
        <View style={styles.cash}>
          <TouchableOpacity>
            <Icon name="cash" size={24} color="#ff7d00" style={styles.icon} />
            <View style={styles.cashTextContainer}>
                <Text style={styles.cashcontent}>Cash</Text>
                <Text style={styles.cashSubtext}>Prepare your cash</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRadioButtonPress('cash')}style={styles.radioButtonContainer}>
            <View style={[styles.radioButton,  selectedPayment === 'cash'  && styles.radioButtonSelected]} />
        </TouchableOpacity>
        </View>
        <View style={styles.wallet}>
        <TouchableOpacity>
            <Icon name="wallet" size={24} color="#ff7d00" style={styles.icon} />
            <View style={styles.cashTextContainer}>
                <Text style={styles.cashcontent}>My Wallet</Text>
                <Text style={styles.cashSubtext}>Prepare your Wallet</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRadioButtonPress('wallet')} style={styles.walletradioButtonContainer}>
            <View style={[styles.radioButton,  selectedPayment ===  "wallet" && styles.radioButtonSelected]} />
        </TouchableOpacity>
        </View>
        <View style={styles.card}>
        <TouchableOpacity>
            <Foundation name="credit-card" size={30} color="#ff7d00" style={styles.icon} />
            <View style={styles.cashTextContainer}>
                <Text style={styles.cashcontent}>Credit or debit card</Text>
                <Text style={styles.cashSubtext}>Prepare your card</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRadioButtonPress('card')} style={styles.cardradioButtonContainer}>
            <View style={[styles.radioButton, selectedPayment ===  "card" && styles.radioButtonSelected]} />
        </TouchableOpacity>
        </View>
        <View style={styles.banking}>
        <TouchableOpacity>
            <MaterialCommunityIcons name="credit-card-wireless" size={30} color="#ff7d00" style={styles.icon} />
            <View style={styles.cashTextContainer}>
                <Text style={styles.cashcontent}>Net Banking</Text>
                <Text style={styles.cashSubtext}>Prepare your Bank Account</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRadioButtonPress('banking')} style={styles.bankingradioButtonContainer}>
            <View style={[styles.radioButton, selectedPayment === "banking" && styles.radioButtonSelected]} />
        </TouchableOpacity>
        </View>
        <View style={styles.paypal}>
        <TouchableOpacity>
            <Foundation name="paypal" size={30} color="#ff7d00" style={styles.icon} />
            <View style={styles.cashTextContainer}>
                <Text style={styles.cashcontent}>Paypal</Text>
                <Text style={styles.cashSubtext}>Prepare your Bank Account</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRadioButtonPress('paypal')} style={styles.paypalradioButtonContainer}>
            <View style={[styles.radioButton, selectedPayment === "paypal" && styles.radioButtonSelected]} />
        </TouchableOpacity>
        </View>

        </View>
          <View style={styles.buttonspace}>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handlecontinue}>
                <Text style={styles.Submitbutton} >Continue</Text>
            </TouchableOpacity>
      </View>
      {/* <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        
        <View style={styles.modalOverlay}>
        <View style={styles.Imagelay}>
        <Image source={klassride} style={styles.logo} />
        </View>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>
              <Icon name="arrow-back" size={24} color="#fff" style={styles.icon} />
              </Text>
            </TouchableOpacity>
           <BookingSuccessScreen/>
          </View>
        </View>
      </Modal> */}
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
//   cardlay: {
//       alignItems: 'center',
//       marginTop: hp(30), 
//   },
//   cardbackgroundimage: {
//       resizeMode: 'contain',
//       width: wp(110),
//       height: hp(35),
//       marginBottom: hp(2), 
//       position: 'absolute',
//   },
cash: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424648',
    width: wp(90),
    height: hp(8),
    paddingHorizontal: wp(4),
    borderRadius: 10,
  },
  icon: {
    marginRight: wp(4),
    marginTop:hp(0.5)
  },
  cashTextContainer: {
    marginLeft: wp(10),
    justifyContent: 'center',
    marginTop:hp(-5),
    
  },
  cashcontent: {
    fontSize: wp(5),
    color: 'white',
    fontWeight: 'bold',
  },
  wallet:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424648',
    width: wp(90),
    height: hp(8),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    marginTop:wp(3),
  },
  walletradioButtonContainer:{
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft:wp(33)
  },
  banking:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424648',
    width: wp(90),
    height: hp(8),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    marginTop:wp(3),
  },
  bankingradioButtonContainer:{
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft:wp(20)
  },
  paypal:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424648',
    width: wp(90),
    height: hp(8),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    marginTop:wp(3),
  },
  paypalradioButtonContainer:{
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft:wp(20)
  },
  card:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424648',
    width: wp(90),
    height: hp(8),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    marginTop:wp(3),
  },
  cardradioButtonContainer:{
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft:wp(20)
  },
  cashSubtext: {
    color: 'white',
    fontSize: wp(3.5),
    marginTop: hp(0.5),
  },
  radioButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft:wp(35)
  },
  radioButton: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: '#ff7d00',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: '#ff7d00',
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

button: {
  backgroundColor: "#ff7d00",
  borderRadius: 10,
  width: wp(80),
  height: hp(6),
  marginTop: hp(4),
},
buttonspace: {
  marginTop: hp(5),
},
Submitbutton: {
  color: '#FFFFFF',
  fontSize: wp(5),
  fontWeight: 'bold',
  textAlign: "center",
  marginTop: hp(1),
},


});
