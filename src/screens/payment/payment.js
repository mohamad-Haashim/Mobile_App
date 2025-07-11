import React, { useState, useEffect,useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  ToastAndroid ,
  Modal,
  Linking ,
  PanResponder// Import TouchableOpacity
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import gpay from '../../assets/images/gpay.png';
import visa from '../../assets/images/visa.png';
import master from '../../assets/images/master.png';
import { wp, hp } from '../common/responsive';
import { useNavigation } from '@react-navigation/native';
import { fonts } from '../../components/customfont';
import Paymenticon from '../../assets/images/paymentVector.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../../environments/environment';
import { Animated,Easing} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get('window');

const Payment = ({setLoading,startSpin,activeSheet,shouldFetchCards,refresh}) => {
  const [selectedMethod, setSelectedMethod] = useState('Apple Pay');
  const [Cards, setCards] = useState([]);
  const [CardId, setCardId] = useState("");

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCardIdToDelete, setSelectedCardIdToDelete] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); 

  const [deleteCardIndex, setDeleteCardIndex] = useState(null);
  const translateXRefs = useRef([]);
  const panResponderRefs = useRef([]);


  const navigation = useNavigation();

  useEffect(() => {
  setLoading(false);
}, [activeSheet]);

  useEffect(() => {
    const onBackPress = () => {
      navigation.goBack();
      return true;
    };
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove(); 
  }, [navigation]);

  // const paymentOptions = [
  //   { source: gpay, label: 'Apple Pay', value: 'Apple Pay' },
  //   { source: visa, label: '**** 4752', value: 'Visa' },
  //   { source: master, label: '**** 2542', value: 'Mastercard' },
  // ];

  const showMessage = (type, message) => {
  setMessageType(type);
  setErrorMessage(message);

  // Clear after 3 seconds
  setTimeout(() => {
    setErrorMessage(null);
    setMessageType(null);
  }, 3000);
};

const handleNavigateToWebView = () => {
  navigation.navigate('PaymentNetopia', {
    onGoBack: (data) => {
      console.log('Returned from WebView:', data);

      // Use the returned data
      if (data.openPaymentSheet) {
        openPaymentSheet(data.orderId); // your function to open the payment sheet
      }
    },
  });
};

 const handleAddcard = async () => {
  setSelectedMethod('Add Card');

  try {
    startSpin?.();
    setLoading(true);

    const email = await AsyncStorage.getItem("emailId");
    const phoneNumber = await AsyncStorage.getItem("phoneNumber");

    if (!email || !phoneNumber) {
      console.warn("Email or phone number is missing");
      return;
    }

    const response = await fetch(ENDPOINTS.addCard, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phoneNumber }),
    });

    const data = await response.json();
    const url = data?.paymentURL;

    console.log(data, "data in raiderscreen");
    console.log(url, "PaymentNetopia");

    if (!response.ok) {
      throw new Error(data?.message || "Failed to add card");
    }

    console.log("Card added successfully:", data);
    //  Linking.openURL(url);
    navigation.navigate("PaymentNetopia", { Netopiapayment: url });
  } catch (e) {
    ToastAndroid.show(e?.message ||"User not found", ToastAndroid.SHORT);
     setSelectedMethod(null);
  } finally {
    setLoading(false); 
  }
};

  const handleDeletecard = async () => {
    try {
      startSpin?.();
      setLoading(true)
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (!phoneNumber) {
        console.warn("phone number is missing");
        return;
      }

      const response = await fetch(ENDPOINTS.DeleteCard, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId:CardId,
         phoneNumber: phoneNumber,
        }),
      });

       const data = await response.text();

        if (response.ok) {
          ToastAndroid.show(data, ToastAndroid.SHORT);
          refresh?.();
        } else {
          console.error("Delete failed:", data);
          ToastAndroid.show("Delete failed", ToastAndroid.SHORT);
        }

        setDeleteModalVisible(null);
        setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error adding card:", e);
    }
  };

    const handleCardList = async () => {
    try {
      startSpin?.();
      setLoading(true);
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");

      // const hardcodedPhoneNumber = "+40756163005";
      if (!phoneNumber) {
        console.warn("Phone number is missing");
        setLoading(false);
        return;
      }

      console.log("Sending phoneNumber:", phoneNumber);

      const response = await fetch(ENDPOINTS.CardList, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber }),
      });

      const data = await response.json();
      setLoading(false);
      console.log("Raw API Response:", data);


      if (!response.ok) {
        throw new Error(data?.message || `HTTP error ${response.status}`);
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid or missing cards array in response");
      }

      setCards(data);
      if (Array.isArray(data) && data.length > 0) {
        const CardIdNo = data[0].cardId;
        setCardId(CardIdNo);
        console.log(CardIdNo, ": cardId");
      } else {
        console.warn("No cards found in response");
      }
    } catch (error) {
      console.error("Error fetching card list:", error.message || error);
    } finally {
      setLoading(false);
    }
    };

    useEffect(() => {
  if (shouldFetchCards) {
    handleCardList();
  }
}, [shouldFetchCards]);

const handleDefaultcardId = async (CardId) => {
  try {
    startSpin?.();
    setLoading(true);

    if (!CardId) {
      console.warn("CardId is missing");
      setLoading(false);
      return;
    }
    console.log("Setting default cardId:", CardId);
    const response = await fetch(ENDPOINTS.setDefaultCard, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: CardId }),
    });

    const data = await response.json();
    console.log("Raw API Response:", data);
    ToastAndroid.show(data.message, ToastAndroid.SHORT);
    if (!response.ok) {
      throw new Error(data?.message || `HTTP error ${response.status}`);
    }

    console.log("Default card set successfully");

  } catch (error) {
    console.error("Error setting default card:", error.message || error);
  } finally {
    setLoading(false);
  }
};

    useEffect(() => {
      handleCardList()
    },[])

    useEffect(() => {
  if (Cards && Cards.length > 0) {
    const defaultCard = Cards.find((card) => card.default === true);
    if (defaultCard) {
      setSelectedMethod(defaultCard.panMask);
      // handleDefaultcardId(defaultCard.cardId);
    }
  }
}, [Cards]);

useEffect(() => {
  translateXRefs.current = Cards.map(() => new Animated.Value(0));
  panResponderRefs.current = Cards.map((_, index) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateXRefs.current[index].setValue(gestureState.dx);
        }
      },

     onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.timing(translateXRefs.current[index], {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setDeleteCardIndex(index); // 👈 Store index
            setDeleteModalVisible(true);
          });
        } else {
          Animated.spring(translateXRefs.current[index], {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  );
}, [Cards]);


  return (

    <View style={styles.container}>    
      <LinearGradient
        colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}>
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBorder}>
            <View style={styles.paymentIcon}>
              <Paymenticon />
            </View>
            <View style={styles.headerdata}>
              <Text style={styles.headerText}>Payment Methods</Text>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    {Cards.length === 0 && (
      <LinearGradient
        colors={['#FF6200', '#1F00A7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.horiLine}
      />
    )}
      {/* Cards List */}
     {Cards.map((CardData, index) => {
  if (
    !translateXRefs.current[index] ||
    !panResponderRefs.current[index]
  ) {
    return null; // Skip rendering this item until refs are ready
  }

  return (
    <Animated.View
      key={index}
      {...panResponderRefs.current[index].panHandlers}
      style={[
        styles.paymentOptionContainer,
        {
          transform: [
            { translateX: translateXRefs.current[index] },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#FF6200', '#1F00A7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.paymentOptionTopBorder}
      />
      <View style={styles.paymentOption}>
        <TouchableOpacity
          style={styles.textTouchableArea}
          onPress={() => {
            setSelectedMethod(CardData.panMask);
            handleDefaultcardId(CardData.cardId);
          }}
        >
          <Text style={styles.text}>
            {CardData.panMask ?? 'Unknown'}
          </Text>
        </TouchableOpacity>

        <View style={styles.radioButtonContainer}>
          <RadioButton
            value={CardData.panMask}
            status={
              selectedMethod === CardData.panMask
                ? 'checked'
                : 'unchecked'
            }
            onPress={() => {
              setSelectedMethod(CardData.panMask);
              handleDefaultcardId(CardData.cardId);
            }}
            color="green"
            style={styles.radioButton}
          />
        </View>

        <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
          <MaterialIcons
            name="delete-sweep"
            size={23}
            color="#ff2163"
            style={styles.customIcon}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
})}




      {Cards.length > 0 && (
        <LinearGradient
          colors={['#FF6200', '#1F00A7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.paymentOptionBottomBorder}
        />
      )}
      
      <View style={styles.creditOption}>
        {/* Wrap Text in TouchableOpacity */}
        <TouchableOpacity
           style={styles.creditTextTouchableArea}
            onPress={() => {
              setSelectedMethod('Add Card');
              handleAddcard();
            }}
        >
           <Text style={styles.creditText}>Add debit/credit card</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.radioButtonsContainer,
             selectedMethod === 'Add Card' ? styles.creditOptionCenter : styles.creditOptionSpaceBetween,
          ]}>
          <RadioButton
            value="Add Card"
            status={selectedMethod === 'Add Card' ? 'checked' : 'unchecked'}
            onPress={async () => {
              // Set selection first
              setSelectedMethod('Add Card');

              const success = await handleAddcard(); // Assume it returns true/false
              if (!success) {
                setSelectedMethod(null); // Revert selection if failed
              }
            }}
            color="green"
            style={styles.radioButton}
          />
        </View>
      </View>
      <LinearGradient
        colors={['#FF6200', '#1F00A7']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.creditBottomLine}
      />  

      {errorMessage &&  (
              // <View style={styles.errorContainer}>
              <View>
                <Text 
                style={[
              styles.credentialerrorText,
              { color: messageType === "Success" ? "green" : "red" }
                ]}
                  >{errorMessage}</Text>
                </View>       
            )} 

            <Modal
                      transparent={true}
                      visible={isDeleteModalVisible}
                      animationType="fade"
                    >
                      <View style={styles.modalContainer}>
                        <LinearGradient
                          colors={['rgba(255, 98, 0, 0.78)', 'rgba(72, 0, 172, 0.75)']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.modalContent}
                        >
                          <Text style={styles.modalTitle}>
                            Are you sure you want to Delete this card?
                          </Text>

                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              style={styles.noButton}
                              onPress={() => {
                                // Reset swipe animation for the card that was swiped
                                if (typeof deleteCardIndex === 'number' && translateXRefs.current[deleteCardIndex]) {
                                  Animated.spring(translateXRefs.current[deleteCardIndex], {
                                    toValue: 0,
                                    useNativeDriver: true,
                                  }).start();
                                }

                                // Close modal
                                setDeleteModalVisible(false);
                                setDeleteCardIndex(null); // optional: reset the index
                              }}
                            >
                              <Text style={styles.noButtonText}>No</Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity
                              style={styles.yesButton}
                             onPress={() => {
                                handleDeletecard()
                              }}
                            >
                              <Text style={styles.yesButtonText}>Yes</Text>
                            </TouchableOpacity>
                          </View>
                        </LinearGradient>
                      </View>
            </Modal>
    </View>    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.05,
    backgroundColor: '#0D0D2B', // Added background color
  },

  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioButtonContainer: {
    marginTop: wp(2),
  },
  radioButtonsContainer: {
  //  paddingRight:wp(14)
  },

  horiLine: {
    width: '90%',
    height: 1,
    // marginTop: wp(9),
    marginEnd: 100,
    marginStart: 100,
     top:wp(-5)
  },
  headerContainer: {
    width: '65%',
    borderRadius: 80,
    padding: 1,
    flexDirection: 'row',
    top:wp(-10)
  },
  paymentIcon: {
    justifyContent: 'flex-start',
    marginTop: wp(3),
    paddingLeft: wp(5),
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70,
    backgroundColor: '#0D0D2B',
  },
  gradientBorder: {
    borderRadius: 70,
    width: wp(65),
    height: hp(6),
  },
  headerText: {
    fontSize: wp(4.8),
    textAlign: 'center',
    color: 'white',
    marginTop: wp(-6.5),
    fontFamily: fonts.montseratBold,
    paddingLeft: wp(9),
    padding: wp(1)
  },
  paymentOptionContainer: {
    width: '90%',
    marginVertical: 4,
    top:wp(-5)
  },
  paymentOptionBottomBorder: {
    width: '90%',
    height: 1,
    top:wp(-5)
  },
  paymentOptionTopBorder: {
    // marginTop: wp(5),
    width: '100%',
    height: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: height * 0.01,
    height: 40,
    backgroundColor: '#0D0D2B',
    paddingHorizontal: 10, // Use horizontal padding
  },
  icon: {
    width: width * 0.12,
    height: height * 0.03,
    marginRight: width * 0.03,
    borderRadius: 5,
    marginTop: wp(2),
  },

  radioButton:{
    alignItems:'center',
    paddingLeft:wp(30),
  },

  text: {
    color: 'white',
    fontSize: wp(4),
    fontFamily: fonts.montseratBold,
    textAlign:"left"
  },
  textTouchableArea: {
    flex: 1, // Make the touchable area take up available space
    justifyContent: 'center', // Center text vertically
  },
  creditOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0D0D2B',
    alignItems: 'center',
    height: 40,
    marginVertical: hp(0.5),
    width: '90%', // Added width for the credit option row
    paddingHorizontal: 10, 
    top:wp(-5)// Added horizontal padding
  },
  // creditText: {
    creditText: {
      color: 'white',
      fontSize: wp(4.2),
      textAlign: 'center',
      // paddingHorizontal: hp(10),
      fontFamily: fonts.montseratBold,
      // marginBottom: wp(4),
      // paddingTop:wp(2),
      // paddingLeft:wp(1),
    },
  
   creditTextTouchableArea: {
    flex: 1, // Make the touchable area take up available space
    justifyContent: 'center', // Center text vertically
   },
  creditTopLine: {
    width: '85%',
    height: 1,
    marginTop: wp(1.5),
  },
  creditBottomLine: {
    width: '75%',
    height: 1,
    marginEnd: 10,
    top:wp(-5)
  },

    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // padding:wp(1)
  },
   modalContent: {
    padding: 20,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    // height: 150,
  },
   modalTitle: {
    fontSize: wp(4),
    // fontWeight: 'bold',
    color: '#fff',
    marginBottom: wp(4),
    fontFamily:fonts.montseratExtraBold,
     textAlign: 'center',
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignSelf:"center",
    // width: '100%',
    // padding:hp(1),
    // marginTop:wp(-5)
  },
   noButton: {
    // backgroundColor: 'gray',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignSelf:"center"
    // marginRight: 5,
  },
   noButtonText: {
      color: '#fff',
      // fontWeight: 'bold',
      textAlign: 'center',
      alignSelf:"center",
      fontFamily:fonts.montseratBold
    },
     yesButton: {
    // backgroundColor: 'red',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignSelf:"center",
    justifyContent:"center"
    // marginLeft: 5,

  },
   yesButtonText: {
    color: '#fff',
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
     alignSelf:"center",
     fontFamily:fonts.montseratBold
  },
  // Styles for aligning radio button in credit option
  // creditOptionCenter: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingLeft:wp(8),
  // },
  // creditOptionSpaceBetween: {
  //   justifyContent: 'space-between',
  // }
  customIcon:{
    alignSelf:"center",
    paddingTop:wp(1)
  }
});

export default Payment;