import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Header from "../common/header";
import klassride from '../../assets/images/klassride.png';
import { wp, hp } from "../common/responsive";
import sucessfully from "../../assets/images/successful.png";

const { width, height } = Dimensions.get('window');

export default function  BookingSuccessScreen () {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
      <Header />
      </View>

      {/* Logo with Marker Icon */}
      <View style={styles.logoContainer}>
      <Image source={klassride} style={styles.logo} />
      </View>

      {/* Confirmation Box */}
      <View style={styles.confirmationBox}>
        <View style={styles.iconContainer}>
          <Image source={sucessfully} style={styles.checkIcon} />
        </View>
        <Text style={styles.title}>Booking Successful</Text>
        <Text style={styles.message}>
          Your booking has been confirmed. Driver will pick you up in 10 min.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
      },
      header: {
        marginTop: hp(-20),
      },
      logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: hp(8), 
      },
      logo: {
        width: wp(40),
        height: hp(11),
        marginBottom: hp(2),
      },
      confirmationBox: {
        width: wp(85),
        paddingVertical: hp(3),
        paddingHorizontal: wp(5),
        backgroundColor: '#333333',
        borderRadius: wp(4),
        alignItems: 'center',
        marginTop: hp(30),
        marginBottom: hp(5),
      },
      iconContainer: {
        width: wp(15),
        height: wp(15),
        // backgroundColor: '#FFA500',
        borderRadius: wp(7.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(2),
      },
      checkIcon: {
        width: wp(10),
        height: wp(10),
        // tintColor: '#FFFFFF',
      },
      title: {
        fontSize: wp(5.5),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: hp(1.5),
      },
      message: {
        fontSize: wp(4),
        color: '#DDDDDD',
        textAlign: 'center',
        paddingHorizontal: wp(4),
      },
});


