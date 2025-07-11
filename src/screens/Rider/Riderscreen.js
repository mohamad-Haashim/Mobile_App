import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image,BackHandler,ScrollView,Linking  } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from "../common/responsive";
import profile from '../../assets/images/profile.png';
import netaImage from "../../assets/images/neto.png";
import { fonts } from "../../components/customfont";
import Peace from "../../assets/images/peaceiconVector.svg"
import Tick from '../../assets/images/tick.svg';
import Cash from "../../assets/images/cash.svg"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../../environments/environment';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; 
import RBSheet from "react-native-raw-bottom-sheet";
import FooterMenu from '../footer/footer';
import klassride from '../../assets/images/klassride1.png';
import Payment from '../payment/payment';
import { Animated,Easing} from "react-native";

export default function  Riderscreen({ closeRiderScreen,SelectedRide,Requestdata,Raiderdata}) {
    const [showInitialContent, setShowInitialContent] = useState(true);
    const [paymentContent, setPaymentContent] = useState(true);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [isRouteViewed, setIsRouteViewed] = useState(false);
    const [isPaymentRequired, setIsPaymentRequired] = useState(false);
    const [hasCardDataSaved, setHascardsaved] = useState(false);
    const bottomSheetRef = useRef(null);
    const [activeSheet, setActiveSheet] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [paymentURL, setPaymentURL] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInitialContent(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

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

    const CardDetailes = async () => {      
        try {
          // const storedCardData = await AsyncStorage.getItem("CardData");
          const storedCardData = true

          if (storedCardData) {
            const parsedData = JSON.parse(storedCardData);
            setHascardsaved(parsedData)
            console.log(parsedData, "parsedData");  
        } 
      }catch (e) {
        console.error("Error fetching card details:", e);
        }
    }

  //  const handleAddcard = async () => {
  //   try {
  //     const email = await AsyncStorage.getItem("emailId");
  //     const phoneNumber = await AsyncStorage.getItem("phoneNumber");

  //     if (!email || !phoneNumber) {
  //       console.warn("Email or phone number is missing");
  //       return;
  //     }

  //     const response = await fetch(ENDPOINTS.payment, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email,
  //         phoneNumber,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log(data,"data in raiderscreen")
  //     const url = data?.paymentURL;
  //     console.log(url,"Raiderscreen")
  //     if (!response.ok) {
  //       throw new Error(data?.message || "Failed to add card");
  //     }

  //     console.log("Card added successfully:", data);
  //      navigation.navigate("PaymentNetopia",{ Netopiapayment: url });
  //   } catch (e) {
  //     console.error("Error adding card:", e);
  //   }
  // };

    useEffect(() => {
        CardDetailes();
    }, []);     
    
    useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      // Reset your state to initial
      setShowInitialContent(true);
      setIsBookingConfirmed(false);
      setIsPaymentRequired(false);
      setIsRouteViewed(false);
      // Return true to prevent default back action (like navigating back)
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [])
);

  const onHome = () => {
      console.log("Navigating to Mapsearch");
    
      setMenuVisible(false);
      Keyboard.dismiss();
      navigation.navigate("Mapsearch");
  };

  const handleRefresh = () => {
      console.log("handleRefresh")
      setRefreshKey(prev => prev + 1);
  };

    return (
        <View style={styles.container}>
        {showInitialContent ? (
          <View style={styles.initialcontent}>
            <View style={styles.iconimage}>
              <Peace />
            </View>
            <Text style={styles.texttitle}>Searching for Rider</Text>
            <Text style={styles.text}>Please wait a few seconds for the rider to confirm your order!</Text>
            <View style={styles.buttonspace}>
              <LinearGradient
                colors={['#FF6200', '#4800AC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorderbutton}
              >
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={closeRiderScreen}>
                  <Text style={styles.submitbuttonlogin}>Cancel Order</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <View style={styles.cardlay}>
            {/* {hasCardDataSaved ? (
              !isBookingConfirmed ? (
                <>
                  <View style={styles.rowContainer}>
                    <View style={styles.driverInfo}>
                      <View style={styles.drivername}>
                        <Image source={profile} style={styles.profile} />
                        <Text style={styles.driverText}>Hermon Solution</Text>
                      </View>
                      <View style={styles.carDetails}>
                        <View style={styles.leftAlign}>
                          <Text style={styles.cartext}>Bolt (premium)</Text>
                          <Text style={styles.carnum}>B - 543 FEX</Text>
                          <Text style={styles.price}>Price:</Text>
                        </View>
                        <View style={styles.rightAlign}>
                          <Text style={styles.cartime}>Arriving in</Text>
                          <Text style={styles.carestimation}>10 min.</Text>
                          <Text style={styles.carestimation}>21.85 lei.</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.buttonspace}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.continueButton} onPress={() => setIsBookingConfirmed(true)}>
                      <LinearGradient
                        colors={['#FF6200', '#4800AC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBorderbutton}
                      >
                        <Text style={styles.submitbuttonlogin}>Confirm Rider</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )  */}
              
              {hasCardDataSaved ? (
              !isPaymentRequired ? (
                !isRouteViewed ? (
                  <>
                    <View>
                      <Tick />
                    </View>
                    <Text style={styles.texttitle}>Booking Successful</Text>
                    <Text style={styles.text}>Your booking has been confirmed</Text>
                    <Text style={styles.text}>Driver will pick you up in {SelectedRide?.eta}</Text>
                    <View style={styles.buttonspace}>
                      <LinearGradient
                        colors={['#FF6200', '#4800AC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBorderbutton}
                      >
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setIsRouteViewed(true);
                            if (Requestdata?.urlRideForCustomer) {
                              Linking.openURL(Requestdata.urlRideForCustomer);
                            }
                          }}
                        >
                          <Text style={styles.submitbuttonlogin}>View Route</Text>
                      </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  </>
                ) : (
                  <View style={styles.rowContainer}>
                    <View style={styles.driverInfo}>
                      <View style={styles.drivername}>
                        <Image source={profile} style={styles.profile} />
                        <Text style={styles.driverText}>{Requestdata?.driverName} </Text>
                      </View>
                      <View style={styles.carDetails}>
                        <View style={styles.leftAlign}>
                          {/* <Text style={styles.cartext}>Bolt (premium)</Text> */}
                          <Text style={styles.cartext}>{SelectedRide?.companyId} ({SelectedRide?.name})</Text>
                          <Text style={styles.carnum}>{Requestdata?.carDetailsBlock} </Text>
                        </View>
                        <View style={styles.rightAlign}>
                          <Text style={styles.cartime}>Arriving in</Text>
                          <Text style={styles.carestimation}>{SelectedRide?.eta} </Text>
                        </View>
                      </View>
                      <View style={styles.buttonalign}>
                        <View style={styles.space1}>
                          <LinearGradient
                            colors={['#FF6200', '#4800AC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBorderbutton}
                          >
                            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={closeRiderScreen}>
                              <View style={styles.buttoncotainer}>
                                <EvilIcons name="close" size={18} color="#FFFFFF" style={styles.cancelicon} />
                                <Text style={styles.cancelbutton}>Cancel Order</Text>
                              </View>
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>
                        <View style={styles.space}>
                          <LinearGradient
                            colors={['#FF6200', '#4800AC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.callgradientBorderbutton}
                          >
                            <TouchableOpacity
                              activeOpacity={0.8}
                              style={styles.callbutton}
                              onPress={() => {
                                // setIsPaymentRequired(true);
                                setIsRouteViewed(false);
                              }}
                            >
                              <Feather name="phone-call" size={30} color="#FFFFFF" style={styles.phoneicon} />
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              ) : null
            ) : (
              paymentContent && (
                <View style={styles.paymentContainer}>
                  <View style={styles.cash}>
                    <Cash />
                  </View>
                  <Text style={styles.texttitlepay}>Before confirming your order</Text>
                  <Text style={styles.text}>Please add a payment method</Text>
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Add Card via</Text>
                    <LinearGradient
                      colors={["#FF6200", "#4800AC"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.imageBorder}
                    >
                      <View style={styles.imageBorderInner}>
                        <TouchableOpacity onPress={() => {
                          setActiveSheet('payment');
                          bottomSheetRef.current.open();
                        }}>
                          <Image source={netaImage} style={styles.netaImage} />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              )
            )}

           < RBSheet
            ref={bottomSheetRef}
            height={600}
            openDuration={250}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
              container: {
                backgroundColor: '#0D0D2B',
                borderTopLeftRadius: wp(10),
                borderTopRightRadius: wp(10),
              },
              draggableIcon: {
                backgroundColor: "white",
              },
            }}
          >
            <View key={refreshKey} style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetHandle} />
              <ScrollView>
                {activeSheet === 'payment' && <Payment  setLoading={setIsLoading} startSpin={startSpin} />}
              </ScrollView>
              <FooterMenu  onHome={onHome} onRefreshPress={handleRefresh}  />
              <View style={styles.footer}>
                <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.backTopLine} />
                <TouchableOpacity onPress={() => bottomSheetRef.current.close()}>
                  <Text style={styles.bottomSheetClose}>Back</Text>
                </TouchableOpacity>

                <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.backBottomLine} />
                <View style={styles.footerContainer}>
                  <Image source={klassride} style={styles.footerLogo} />
                </View>
              </View>
            </View>
            {isLoading && (
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

          </RBSheet>
          </View>
        )}        
      </View>
      
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(3),
    },
    initialcontent:{
        marginBottom:wp(12)
    },
    profile:{
        width:wp(18),
        height:hp(9),
        flexDirection: 'row',
        borderRadius:20,
        alignSelf:"center",
        resizeMode:"contain"
      },
      paymentContainer:{
        paddingTop:hp(10)
      },
      cash:{
        width:wp(18),
        height:hp(9),
        flexDirection: 'row',
        // borderRadius:20,
        alignSelf:"center",
        resizeMode:"contain",
        // marginTop:wp(4)
      },
    text: {
        color: "white",
        textAlign: "center",
        // marginBottom: hp(1.5),
        fontSize: wp(3.7),
        fontFamily: fonts.montseratSemiBold,
        // fontWeight:"800"
    },
    iconimage:{
        // width:wp(50),
        // height:hp(6),
        resizeMode:"contain",
        marginBottom: hp(1.5),
        alignSelf:"center",
        
    },
    texttitle: {
        color: "white",
        fontSize: wp(7),
        textAlign: "center",
        fontFamily: fonts.montseratBold,
       
    },
    texttitlepay: {
        color: "white",
        fontSize: wp(5.4),
        textAlign: "center",
        fontFamily: fonts.montseratBold,
       
    },
    // icon: {
    //     marginBottom: hp(1.5),
    // },
    
    buttonspace: {
        marginTop: hp(2),
    },
    space1: {
        marginTop: hp(4),
    },
    space: {
        marginTop: hp(2),
    },
    buttonalign:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    buttoncotainer:{
        flexDirection: 'row', // This arranges children in a row
        alignItems: 'center', // Vertically center items
        justifyContent: 'center', 
        padding:wp(3),
        marginTop:wp(-0.5)
    },
    button: {
        backgroundColor: "#000000",
        borderRadius: 20,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    callbutton: {
        backgroundColor: "#000000",
        borderRadius: 80,
        width:wp(17.5),
        height:hp(7.7),
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneicon: {
        alignSelf:"center",
        
    },    
    gradientBorderbutton: {
        borderRadius: 20,
        padding: 1,
        width: wp(50),
        height: hp(5),
        alignSelf: 'center',
      },
    callgradientBorderbutton: {
        borderRadius: 80,
        padding: 1,
        width:wp(18),
        height:hp(8),
        alignSelf: 'center',
      },
    submitbuttonlogin: {
        color: '#ffffff',
        fontSize: wp(4),
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign:"center",
        paddingVertical:hp(1),
        flexDirection: 'row',  
        alignItems: 'center',
        justifyContent: 'center',  
        fontFamily: fonts.montseratBold,
    },
    cancelbutton: {
        color: '#ffffff',
        fontSize: wp(3.5),       
        letterSpacing: 1,
        textAlign:"center",
        fontFamily: fonts.montseratBold,
        // marginBottom:wp(1)
    },
    cardlay: {
        alignItems: 'center',
        marginTop: hp(-7),
        // padding: wp(4),
        // backgroundColor: '#222',
        borderRadius: wp(4),
        width: '90%',
        flexDirection: 'column',
    },
    rowContainer: {
        justifyContent: "space-around",
        width: '100%',
    },
    driverInfo: {
        // alignItems: 'center',
        // flexDirection:"row",
        justifyContent:"space-around",
        marginBottom: hp(2),
    },
    carDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    drivername: {
        marginBottom: hp(3),
        alignSelf:"flex-start",
        flexDirection: 'row',
    },
    driverText: {
        fontSize: wp(5),
        color: "white",
        // fontWeight: 'bold',
        // marginBottom: hp(2),
        alignSelf:"flex-start",
        paddingHorizontal:wp(5),
        fontFamily: fonts.montseratBold,
    },
    carname: {
        // fontSize: wp(4.5),
        // color: "white",
        alignSelf:"flex-start",
    },
    leftAlign: {
        alignItems: 'flex-start',
    },
    rightAlign: {
        alignItems: 'flex-end',
    },
    cartext: {
        fontSize: wp(4.5),
        color: "white",
        alignSelf:"flex-start",
        fontFamily: fonts.montseratSemiBold,
    },
    carnum: {
        fontSize: wp(4),
        color: 'white',
        marginTop: hp(1),
        fontFamily: fonts.montseratSemiBold ,
        
    },
    price:{
        fontSize: wp(4.3),
        color: 'white',
        marginTop: hp(1),
        // fontWeight:"bold",
        fontFamily: fonts.montseratBold,
    },
    cartime: {
        fontSize: wp(4),
        color: "white",
        // alignContent:"flex-end",
        alignSelf:"flex-end",
        fontWeight:"bold",
        fontFamily: fonts.montseratSemiBold,
    },
    carestimation: {
        fontSize: wp(4),
        color: "white",
        // alignContent:"flex-end",
        alignSelf:"flex-end",
        marginTop:hp(1),
        fontFamily: fonts.montseratSemiBold,
    },
    continueButton: {
        // backgroundColor: "#FF6200",
        borderRadius: 20,
        width: wp(50),
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        // marginTop: 40,
      },
      footerText: {
        color: "white",
        fontSize:wp(4),
        fontFamily: fonts.montseratSemiBold,
        alignSelf:"center"
      },
      imageBorder: {
        borderRadius: 28,
        padding: 1,
        alignSelf:"center",
        backgroundColor: "#FF6200",
        width:wp(45),
        height: hp(10),
        marginTop:6
      },
      imageBorderInner: {
        borderRadius: 28,
        backgroundColor: "#000",
        padding: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      },
      netaImage: {
        width: wp(50),
        height: wp(32),
        borderRadius: 60,
        resizeMode: "contain",
      },
      bottomSheetContainer: {
        // padding: 30,
        height: 50,
        flex: 1,
        backgroundColor: '#0D0D2B',
      },

      bottomSheetHandle: {
        width: 90,
        height: 2,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 10,
      },
      footer: {
        marginBottom: wp(16),
      },
      backTopLine: {
        width: '85%',
        height: 1,
        // marginTop:wp(34),
        // marginTop: height * 0.1,
        alignSelf: "center"
        // marginTop:9,
      },

      bottomSheetClose: {
        // marginBottom: 100,
        color: 'white',
        // fontWeight: 'bold',
        textAlign: 'center',
        fontSize: wp(4.7),
        padding: wp(2),
        fontFamily:fonts.montseratSemiBold,
      },

      backBottomLine: {
        width: '70%',
        height: 1,
        // marginTop: 120,
        marginEnd: 100,
        marginStart: 100,
        alignSelf: "center",
        marginBottom:wp(4)
      },
       footerContainer: {
        // marginBottom: hp(10),
        padding: wp(1),
        backgroundColor: '#0D0D2B',
      },

      footerLogo: {
        width: wp(50),
        height: hp(7),
        resizeMode: 'contain',
        // marginBottom: wp(40),
        alignSelf: "center",
        // marginTop:wp(90),
      },
loaderOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},

});

