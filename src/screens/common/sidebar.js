import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, BackHandler, ScrollView, Modal,Keyboard } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import profile from '../../assets/images/profile.png';
import { wp, hp } from "./responsive";
import { fonts } from "../../components/customfont";
import { ENDPOINTS } from '../../environments/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import klassride from '../../assets/images/klassride1.png';
import RBSheet from "react-native-raw-bottom-sheet";
import Payment from '../payment/payment';
import Linked from '../linked/linked';
import Support from '../support/support';
import MyAccount from '../profile/myaccount';
import MyAccounticon from "../../assets/images/myaccountVector.svg"
import Paymenticon from "../../assets/images/paymenticonVector.svg"
import Linkedicon from "../../assets/images/linkediconVector.svg"
import Supporticon from "../../assets/images/supporticonVector.svg"
import Privacyicon from "../../assets/images/privacyiconVector.svg"
import Deleteicon from "../../assets/images/deleteiconVector.svg"
import Logouticon from "../../assets/images/logouticonVector.svg"
import FooterMenu from '../footer/footer';
import { useCallback } from 'react';
import { Animated,Easing} from "react-native";
import { useIsFocused } from '@react-navigation/native';


const MySidebar = ({ isMenuVisible, setMenuVisible, onMyAccountPress,refreshsidebar,setRefreshsidebar}) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const accountSheetRef = useRef(null); // Reference for account RBSheet
  const [activeSheet, setActiveSheet] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userData, setUserData] = useState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false); 

  const [isLoading, setIsLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  

  const showDeleteModal = () => setDeleteModalVisible(true);
  const hideDeleteModal = () => setDeleteModalVisible(false);

  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false); 

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      bottomSheetRef.current?.close(); 
    }
  }, [isFocused]);

  const handleDeleteAccount = () => {
    console.log("Account Deleted");
    hideDeleteModal();
  };

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

  useEffect(() => {
  // Reset loading state when opening the payment sheet
  if (activeSheet !== 'payment') {
    setIsLoading(false);
  }
}, [activeSheet]);
  
//     console.log(refreshsidebar,"setRefvfvfvreshsidebar")
//   useEffect(() => {
//     if(refreshsidebar === 1) 
//   getUserList()
      
// }, [refreshsidebar]);

  const handleRefresh = () => {
    console.log("handleRefreshsidebar")

    setRefreshKey(prev => prev + 1);
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      closeMenu();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Signup' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const confirmLogout = () => {
    handleLogout(); 
    hideLogoutModal(); 
  };

  const getUserList = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await fetch(ENDPOINTS.userGetProfile + userId);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data?.phoneNumber && data?.email && data?.hasCardDataSaved !== undefined) {
        await AsyncStorage.setItem("phoneNumber", data.phoneNumber);
        await AsyncStorage.setItem("email", data.email);
        await AsyncStorage.setItem("CardData", JSON.stringify(data.hasCardDataSaved));
        console.log(data.phoneNumber, "phoneNumber");
        console.log(data.email, "email");
        // console.log(data.hasCardDataSaved, "CardData");
      }
      setUserData(data);
      // setRefreshsidebar(false)
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  };
 

  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();
      setMenuVisible(false);
      return () => {
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      getUserList();
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (isMenuVisible) {
            closeMenu();
            return true;
          }
          return false;
        }
      );

      return () => {
        backHandler.remove();
      };
    }, [isMenuVisible,])
  );

  if (!isMenuVisible) return null;

  const handleSaveAccountChanges = (updatedData) => {
    console.log('Updated User Data:', updatedData);
    // Handle the updated data here, e.g., send it to your server or update local state
  };

  const onHome = () => {
      console.log("Navigating to Mapsearch");
      setMenuVisible(false);
      Keyboard.dismiss();
      navigation.navigate("Mapsearch");
    };
    

   

  return (
    <View style={styles.sidebarContainer}>
      {isMenuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {!isMenuVisible && (
        <TouchableOpacity style={styles.iconContainer} onPress={toggleMenu}>
          <Icon name="menu" size={22} color="red" />
        </TouchableOpacity>
      )}

      {isMenuVisible && (
        <View style={styles.sidebar}>
          <View>
            <LinearGradient
              colors={['rgba(255, 98, 0, 0.68)', 'rgba(72, 0, 172, 0.6)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            >
              <View style={styles.profileSection}  key={refreshKey} >
                <Image
                  source={userData && userData.profilePicture ? { uri: userData.profilePicture } : profile}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName]} numberOfLines={1}>{userData?.name || 'N/A'}</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactText}>{userData?.phoneNumber || 'N/A'}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactText} numberOfLines={1}>{userData?.email || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separatorline} />

          {/* My Account Button */}
          <TouchableOpacity style={styles.menuItem} onPress={() => accountSheetRef.current.open()}>
            {/* <MaterialCommunityIcons name="account-details-outline" size={23} color="#FFFFFF" /> */}
            <MyAccounticon width={wp(7)} height={hp(3)} />
            <Text style={styles.menuText}>My Account</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separator} />


          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setActiveSheet('payment');
            bottomSheetRef.current.open();
          }}>
            {/* <MaterialIcons name="payment" size={20} color="#FFFFFF" /> */}
            <Paymenticon width={wp(7)} height={hp(3)} />
            <Text style={styles.menuText}>Payment Method</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separator} />

          {/* <LinearGradient colors={['#FF6200', '#4800AC']} style={styles.separator} /> */}
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setActiveSheet('linked');
            bottomSheetRef.current.open();
          }}>
            {/* <Entypo name="link" size={20} color="#FFFFFF" /> */}
            <Linkedicon width={wp(7)} height={hp(3)} />
            <Text style={styles.menuText}>Linked Apps</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separator} />



          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setActiveSheet('support');
            bottomSheetRef.current.open();
          }}>
            {/* <Feather name="message-circle" size={20} color="#FFFFFF" /> */}
            <Supporticon width={wp(7)} height={hp(3)} />
            <Text style={styles.menuText}>Support</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separator} />
          {/* <TouchableOpacity style={styles.menuItem} onPress={handlesupport}> */}
          <TouchableOpacity style={styles.menuItem} >

            {/* <Feather name="eye-off" size={20} color="#FFFFFF" /> */}
            <Privacyicon/>
            <Text style={styles.menuText}>Privacy</Text>
          </TouchableOpacity>

          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separator} />


          <TouchableOpacity style={styles.menuItem} onPress={showDeleteModal}>
            {/* <Icon name="settings" size={20} color="#FFFFFF" /> */}
            <Deleteicon width={wp(7)} height={hp(3)} />
            <Text style={styles.menuText}>Delete Account</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separator} />

          <Modal transparent={true} visible={isDeleteModalVisible} animationType="fade">
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['rgba(255, 98, 0, 0.77)', 'rgba(72, 0, 172, 0.77)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalContent}
              >
                <Text style={styles.modalTitle}>We are really sorry to see you go:(</Text>
                <Text style={styles.modalSubtitle}>Are you sure you want to delete your account?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.noButton} onPress={hideDeleteModal}>
                    <Text style={styles.noButtonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.yesButton} onPress={handleDeleteAccount}>
                    <Text style={styles.yesButtonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </Modal>

          <TouchableOpacity style={styles.menuItem} onPress={showLogoutModal}>
              <Logouticon width={wp(7)} height={hp(3)} />
              <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>

          <Modal transparent={true} visible={isLogoutModalVisible} animationType="fade">
                      <View style={styles.modalContainer}>
                        <LinearGradient
                          colors={['rgba(255, 98, 0, 0.77)', 'rgba(72, 0, 172, 0.77)']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.modalContent}
                        >
                          <Text style={styles.modalTitle}>Are you sure you want to log out?</Text>
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.noButton} onPress={hideLogoutModal}>
                              <Text style={styles.noButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.yesButton} onPress={confirmLogout}>
                              <Text style={styles.yesButtonText}>Yes</Text>
                            </TouchableOpacity>
                          </View>
                        </LinearGradient>
                      </View>
                    </Modal>

            <LinearGradient
            colors={['#FF6200', '#4800AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.separatorbottom}
          />

          <View style={styles.Imagelay}>
            <Image source={klassride} style={styles.logo} />
          </View>
          <View style={styles.footercontrol}>
          <FooterMenu 
              onHome={onHome} 
              onRefreshPress={handleRefresh} 
              onAccountPress={onHome}
            />
            </View>
        </View>
      )}
      

      <RBSheet
        ref={bottomSheetRef}
        height={650}
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
          <TouchableOpacity style={styles.bottomSheetHandle} onPress={() => bottomSheetRef.current.close()}/>
          <ScrollView>
            {activeSheet === 'payment' && <Payment setLoading={setIsLoading} startSpin={startSpin} activeSheet={activeSheet} refresh={handleRefresh}/> }
            {activeSheet === 'linked' && <Linked />}
            {activeSheet === 'support' && <Support />}
            {/* {accountSheetRef== 'myaccount' && </EditAccount>} */}
          </ScrollView>
          <FooterMenu  onHome={onHome} onRefreshPress={handleRefresh} onAccountPress={() => bottomSheetRef.current.close()}  />
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
        {isLoading && activeSheet === 'payment' && (
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
      {/* <View style={styles.bottomSheetHandle} /> */}

      {/* RBSheet for EditAccount */}
      <RBSheet
        ref={accountSheetRef}
        height={700}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            backgroundColor: '#0D0D2B',
            borderTopLeftRadius: wp(10),
            borderTopRightRadius: wp(10),
          },
        }}
      >
        <View key={refreshKey} style={styles.bottomSheetContainer}>
          <TouchableOpacity style={styles.bottomSheetHandle} onPress={() => accountSheetRef.current.close()} />
          <View style={styles.accountSheetContainer}>
            <MyAccount
              userData={userData}
              onClose={() => accountSheetRef.current.close()}
              onSave={handleSaveAccountChanges}
            />
            
            <FooterMenu onHome={onHome} onRefreshPress={handleRefresh} onAccountPress={() => accountSheetRef.current.close()} />
            <LinearGradient
              colors={['#FF6200', '#4800AC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.separatoraccount} />
            <TouchableOpacity onPress={() => accountSheetRef.current.close()}>
              <Text style={styles.bottomSheetCloseaccount}>Back</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#FF6200', '#4800AC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.separatorbottom}
            />
            <View style={styles.footerAccountContainer}>
              <Image source={klassride} style={styles.footerLogo} />
            </View>
          </View>
        </View>

        {/* <View style={styles.footer}>
            <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.backTopLine} />
            <TouchableOpacity onPress={() => bottomSheetRef.current.close()}>
              <Text style={styles.bottomSheetClose}>Back</Text>
            </TouchableOpacity>
         
            <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.backBottomLine} />
           
 
  {/* <View style={styles.footerLogoContainer}> */}
        {/* <Image source={klassride} style={styles.footerLogos} />
            </View> */}
        {/* </View> */}
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles remain here
  sidebarContainer: {
    position: 'absolute',
    left: wp(0),
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // width:wp(100)
  },
  
  footerAccountContainer: {
    marginBottom: hp(10),
    padding: wp(1),
    backgroundColor: '#0D0D2B',
  },
  footerContainer: {
    // marginBottom: hp(10),
    padding: wp(1),
    backgroundColor: '#0D0D2B',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // padding:wp(1)
  },
  modalContent: {
    padding: 20,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    // height: 150,
  },
  accountSheetContainer: {
    backgroundColor: "#0D0D2B",
    height: 50,
    flex: 1,
    // width:90,
    // height:180,
  },
  footerLogos: {
    width: wp(50),
    height: hp(7),
    resizeMode: 'contain',
    // marginBottom: wp(40),
    alignSelf: "center",
    // marginTop:wp(90),

  },

  // modalContent: {
  //   backgroundColor: '#282828',
  //   padding: 20,
  //   borderRadius: 10,
  //   width: '80%',
  //   alignItems: 'center',
  // },

  modalTitle: {
    fontSize: wp(4),
    // fontWeight: 'bold',
    color: '#fff',
    marginBottom: wp(4),
    fontFamily:fonts.montseratExtraBold
  },
  modalSubtitle: {
    fontSize: wp(3.5),
    color: 'white',
    marginBottom: wp(7),
    textAlign: 'center',
    fontFamily:fonts.montseratSemiBold
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
  noButtonText: {
    color: '#fff',
    // fontWeight: 'bold',
    textAlign: 'center',
    alignSelf:"center",
    fontFamily:fonts.montseratBold
  },
  yesButtonText: {
    color: '#fff',
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
     alignSelf:"center",
     fontFamily:fonts.montseratBold
  },

  Imagelay: {
    // marginBottom: hp(20),
    alignItems: "center",
    resizeMode: "contain",
  },
  footercontrol:{
    // bottom:wp(-20),
    alignItems: "center",
    marginTop: hp(13),
    position: "relative",
    width:wp(100),
    padding:wp(1),
    maxWidth: wp(100),
  },
  logo: {
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
  },
  iconContainer: {
    backgroundColor: '#202020',
    borderRadius: wp(3),
    padding: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: hp(2.5),
    marginLeft: wp(3.5)
  },
  sidebar: {
    // backgroundColor: '#202020',
    borderRadius: wp(2),
    padding: wp(3),
    // marginTop: hp(10),
    marginLeft: wp(10),
    zIndex: 99,
    width: wp(80),
    height: hp(110),
    justifyContent: "flex-start",
    alignItems: "center",
    // marginLeft: wp(-2.5),
    marginTop:hp(5)
  },
  separator: {
    height: 1,
    width: '110%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  separatoraccount: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  separatorline: {
    height: 1,
    width: '70%',
    alignSelf: 'center',
    marginVertical: 5,
    marginTop: hp(5)
  },
  separatorbottom: {
    height: 1,
    width: '70%',
    alignSelf: 'center',
    marginVertical: 5,
    // marginTop:hp(1),
    marginBottom:wp(4)
  },
  separatorline: {
    height: 1,
    width: '70%',
    alignSelf: 'center',
    marginVertical: 5,
    marginTop: hp(5)
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 1,
    width: wp(80),
    alignSelf: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    // backgroundColor: "#EB963F",
    padding: wp(1),
    // marginBottom: hp(2),
    width: wp(80),
    height: hp(16),
    marginLeft: wp(-2.5),
    marginTop: hp(-1.5),
  },
  profileImage: {
    width: wp(20),
    height: hp(10),
    borderRadius: wp(10),
    marginRight: wp(3),
    marginLeft: wp(3),
    marginTop: hp(3.5),
    // borderColor: "white",
    borderWidth: wp(0.5),
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: wp(4),
    // fontWeight: 'bold',
    marginBottom: hp(0.5),
    marginLeft: wp(3),
    fontFamily:fonts.montseratBold

  },
  contactInfo: {
    flexDirection: 'row',
    // justifyContent:"center",
    // alignSelf:"center",
    // marginBottom: hp(0.9),
    // marginTop: wp(1),
    width: wp(45),
    // backgroundColor:"red"
  },
  contactIcon: {
    // marginRight: wp(1),
    justifyContent: "center"
  },
  contactText: {
    color: '#FFFFFF',
    fontSize: wp(3.5),
    marginLeft: wp(3),
    fontFamily:fonts.montseratSemiBold
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),

  },
  menuText: {
    color: '#FFFFFF',
    fontSize: wp(4.5),
    marginLeft: wp(3),
    fontFamily:fonts.montseratSemiBold

  },
  closeButton: {
    // marginTop: wp(1),
    marginLeft: wp(66),
    fontWeight: wp(20),
  },
  closeButtonText: {
    color: 'black',
    alignSelf: 'flex-start',
    marginBottom: 15,
    fontSize: wp(7),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: wp(100),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // zIndex: 99, // Ensure overlay is above everything but below the sidebar
  },
  bottomSheetContainer: {
    // padding: 30,
    height: 50,
    flex: 1,
    backgroundColor: '#0D0D2B',

  },
  bottomSheetHandle: {
    width: 95,
    height: 5.5,
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
  bottomSheetCloseaccount: {
    // marginBottom: 100,
    color: 'white',
    // fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wp(4.5),
    padding: wp(1),
    marginTop:wp(1),
    fontFamily:fonts.montseratSemiBold
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
  footerLogo: {
    width: wp(50),
    height: hp(7),
    resizeMode: 'contain',
    // marginBottom: wp(40),
    alignSelf: "center",
    // marginTop:wp(90),
  },
  footerLogoContainer: {
    marginTop: wp(5),
    padding: wp(1),
    // marginTop:wp(90),
    //

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

export default MySidebar;