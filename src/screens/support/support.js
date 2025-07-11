import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
 
import { useNavigation } from "@react-navigation/native";
import klassride from "../../assets/images/klassride-white.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import { wp, hp } from "../common/responsive"
import { fonts } from '../../components/customfont';
import Supporticon from "../../assets/images/supportVector.svg"
import Chaticon from "../../assets/images/chaticonVector.svg"
 
const { width, height } = Dimensions.get('window');
 
const Support = () => {
  const navigation = useNavigation();
 
  return (
    <View style={styles.container}>
     
      {/* Top Horizontal Line Container */}
      {/* <View style={styles.topLineContainer}>
        <View style={styles.horizontalLine} />
      </View> */}
 
      {/* Header with Gradient and Border */}
      <LinearGradient
        colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBorder}
          >
            {/* <Icon name="chatbubble-outline" size={24} color="white" style={styles.supportIcon} /> */}
                    {/* <Ionicons name="close-circle" size={18} color="#cccccc" /> */}
                    {/* <Feather name="message-circle" size={20} color="#FFFFFF" style={styles.supportIcon}/> */}
                    <View style={styles.supportIcon}>
                    <Supporticon/>
                    </View>
   
           
            <Text style={styles.headerText}>Support</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
 
      {/* Help Center Section */}
      <View style={styles.helpCenterContainer}>
        {/* <View style={styles.horizontalLine} /> */}
      <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.helpTopLine} />
 
        <View style={styles.optionContainer}>
      {/* <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.helpTopLine} /> */}
 
          <Feather name="help-circle" size={24} color="white" />
          <Text style={styles.optionText}>Help Center</Text>
      {/* <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.helpBottomLine} /> */}
 
        </View>
        {/* <View style={styles.horizontalLine} /> */}
      <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.helpBottomLine} />
 
      </View>
 
      {/* Chat with Us */}
      <View style={styles.optionContain}>
        {/* <Icon name="chat" size={24} color="white" /> */}
        <View>
          <Chaticon width={35} height={22}  />
        </View>
        <Text style={styles.optionText}>Chat with Us</Text>
      </View>
 
      <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.creditTopLine} />
      {/* <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.creditBottomLine} />
     
      <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.backTopLine} />
     
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
 
      <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.backBottomLine} /> */}
 
      {/* <View style={styles.footer}>
        <Image source={klassride} style={styles.footerLogo} />
      </View> */}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D2B',
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  optionContain:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: '90%',
    marginVertical: 1,
    top:wp(-10)
  },
  topLineContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 60,
  },
  horizontalLine: {
    width: '25%',
    height: 2,
    backgroundColor: 'white',
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
  helpBottomLine:{
    width: '90%',
    height: 1,
    // marginTop: 0,
    marginEnd: 100,
    marginStart: 100,
    // marginBottom:10,
   
  },
  helpTopLine:{
    width: '70%',
    height: 1,
    marginTop: 10,
  },
  supportIcon: {
    justifyContent: "flex-start",
    // paddingLeft: wp(12),
   
  },
  headerText: {
    fontSize: wp(5),
    textAlign: 'center',
    color: 'white',
    marginTop:hp(-3),
    fontFamily:fonts.montseratBold,
    paddingLeft:wp(5)
  },
  helpCenterContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    top:wp(-10),
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    width: '90%',
    marginVertical: 1,
  },
  optionText: {
    color: 'white',
    fontSize: wp(4),
    marginLeft: wp(5),
    fontFamily:fonts.montseratExtraBold
   
  },
  creditTopLine: {
    width: '75%',
    height: 1,
    // marginBottom: 18,
    // marginTop: 7,
    top:wp(-9)
  },
  creditBottomLine: {
    width: '69%',
    height: 1,
    marginTop: 2,
    marginEnd: 10,
  },
  backTopLine: {
    width: '85%',
    height: 1,
    marginTop: 240,
  },
  backText: {
    color: 'white',
    fontSize: width * 0.05,
    textAlign: 'center',
    paddingVertical: height * 0.01,
  },
  backBottomLine: {
    width: '70%',
    height: 1,
    marginTop: 4,
    marginEnd: 100,
    marginStart: 100,
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.02,
    alignItems: 'center',
  },
  footerLogo: {
    width: width * 0.4,
    height: height * 0.08,
    resizeMode: 'contain',
    marginBottom: 70,
  },
});
 
export default Support;