import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import profile from '../../assets/images/profileAvatar.png';
import { wp, hp } from "../common/responsive";
import { ENDPOINTS } from '../../environments/environment';
import { fonts } from '../../components/customfont';
import ImagePicker from 'react-native-image-crop-picker';
import klassride from '../../assets/images/klassride1.png';

export default function MyAccount() {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [errortype, setErrortype] = useState("");
 const [messageType, setMessageType] = useState(null); 

  const setError = (type, message) => {
  // setErrortype(type);
  setErrorMessage(message);

  // Automatically clear error after 3 seconds
  setTimeout(() => {
    setErrorMessage(null);
    // setErrortype(null);
  }, 3000);
};

const showMessage = (type, message) => {
  setMessageType(type);
  setErrorMessage(message);

  // Clear after 3 seconds
  setTimeout(() => {
    setErrorMessage(null);
    setMessageType(null);
  }, 3000);
};
 
  const [items] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);

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

  const handleAccount = async () => {
    startSpin();
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(ENDPOINTS.userGetProfile + userId);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setUserData(data);
      setGender(data.gender);
    } catch (error) {
      console.error('Error fetching API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAccount();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleUpdate = async () => {
    if (!userData.name || !userData.surname || !userData.email || !gender) {
      setError("Error", "All fields must be filled.");
      return;
    }
    setLoading(true);
    const payload = {
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      gender,
    };

    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(ENDPOINTS.userUpdateProfile + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUserData(updatedUserData);
        ToastAndroid.show("Profile updated successfully.", ToastAndroid.SHORT);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
       setError('Error', errorData.message || 'Could not update profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Error', 'Could not save changes.');
      
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      "Select Image",
      "Choose your image from camera or gallery",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then((image) => {
        const uri = image.path;
        uploadProfilePicture(uri);
      })
      .catch((error) => {
        console.log('Camera Error: ', error);
        if (error.code !== 'E_PICKER_CANCELLED') {
          ToastAndroid.show("Error', 'Failed to take photo", ToastAndroid.SHORT);
        }
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then((image) => {
        const uri = image.path;
        uploadProfilePicture(uri);
      })
      .catch((error) => {
        console.log('Gallery Error: ', error);
        if (error.code !== 'E_PICKER_CANCELLED') {
          ToastAndroid.show('Error', 'Failed to pick image', ToastAndroid.SHORT);
        }
      });
  };

  const uploadProfilePicture = async (uri) => {
    const formData = new FormData();
    formData.append('profilePhoto', {
      uri: uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("refreshToken");
      const response = await fetch(ENDPOINTS.userUpdateProfilePhote, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(prev => ({ ...prev, profilePicture: result.photoUrl }));
        ToastAndroid.show("Profile picture updated successfully", ToastAndroid.SHORT);
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          errorData.message || "Could not upload profile picture.",
          ToastAndroid.SHORT
        );
      }
      } catch (error) {
        console.error('Upload Error: ', error);
        ToastAndroid.show("An unexpected error occurred while uploading the picture.", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 98, 0, 0.4)', 'rgba(72, 0, 172, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.profileImageContainer}>
      {/* Gradient border with profile image inside */}
      {/* <LinearGradient
        colors={['#FF6200', '#4800AC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.imagegradientsBorder}
      > */}
        <Image
          source={userData.profilePicture ? { uri: userData.profilePicture } : profile}
          style={styles.profileImage}
        />
      {/* </LinearGradient> */}

      {/* Show camera icon only when editing */}
      {isEditing && (
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.editIcon}>
          <Feather name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
          ) : (
            <Text style={[styles.input, { fontWeight: 'bold' }]} numberOfLines={1}>{userData.name || "N/A"}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Surname</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={userData.surname}
              onChangeText={(text) => setUserData({ ...userData, surname: text })}
            />
          ) : (
            <Text style={[styles.input, { fontWeight: 'bold' }]} numberOfLines={1}>{userData.surname || "N/A"}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gender</Text>
          {isEditing ? (
            <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientsBorder}>
              <DropDownPicker
                open={open}
                value={gender}
                items={items}
                setOpen={setOpen}
                setValue={setGender}
                placeholder="Gender"
                placeholderStyle={{ color: 'white', fontSize: wp(4) }} // Placeholder text color
                style={styles.dropDown}
                dropDownContainerStyle={{ ...styles.dropDownContainer, zIndex: open ? 2000 : 0 }}
                arrowIconStyle={styles.arrowIcon}
                textStyle={styles.textStyle}
                tickIconStyle={styles.tickIcon}
                listItemLabelStyle={{ color: 'white', fontSize: wp(4) }} // Text color for dropdown options
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
              />
            </LinearGradient>
          ) : (
            <Text style={[styles.input, { fontWeight: 'bold' }]} numberOfLines={1}>{userData.gender || "N/A"}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>E-mail</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
          ) : (
            <Text style={[styles.input, { fontWeight: 'bold' }]} numberOfLines={1}>{userData.email || "N/A"}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={[styles.input, { color: '#FFFFFF' }]}
            value={userData.phoneNumber}
            editable={false}
          />
          <MaterialCommunityIcons
            name="pencil-off"
            size={20}
            color="#D3770C"
            style={styles.nonEditableIcon}
          />
        </View>

        {loading && (
          <View style={styles.loaderOverlay}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            >
              <Feather name="loader" size={40} color="#ff7d00" />
            </Animated.View>
          </View>
        )}
      </LinearGradient>

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

      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={isEditing ? handleUpdate : handleEditToggle} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF6200', '#1F00A7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorderbutton}
          >
            <Text style={styles.submitbutton}>{isEditing ? 'Save Changes' : 'Edit Profile'}</Text>
          </LinearGradient>
        </TouchableOpacity>
     
        {/* <View style={styles.Imagelay}>
          <Image source={klassride} style={styles.logo} />
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginVertical: wp(2),
  },

  bottomSheetCloseaccount: {
    color: 'white',
    bottom: wp(3),
    fontSize: wp(4.5),
    marginBottom: wp(0),
    marginLeft: wp(45),
    fontFamily: fonts.montseratSemiBold,
  },
  separatoraccount: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(6),
  },
  creditBottomLine: {
    width: '75%',
    height: 1,
    marginLeft: wp(2),
    alignSelf: 'center',
    marginStart: wp(13),
  },
  logo: {
    marginVertical: wp(10),
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
  },
  Imagelay: {
    alignItems: "center",
    resizeMode: "contain",
  },

  gradientsBorder: {
    borderRadius: 10,
    justifyContent: 'center',
    width: wp(29.5),
    height: hp(5.4),
  },
  imagegradientsBorder: {
    borderRadius:wp(5),
    justifyContent: 'center',
    width: wp(20.3),
    height: hp(10.3),
    resizeMode: "contain",
  },
  gradientBorder: {
    borderRadius: 10,
    width: wp(85),
    justifyContent: "center",
    alignSelf: "center",
  },
  profileImageContainer: {
    position: 'relative',
    alignItems: 'flex-start',
    marginTop: wp(3.5),
    marginLeft:wp(2.5),
    marginBottom:wp(1)
  },
  profileImage: {
    width: wp(23),
    height: hp(13),
    margin: 0,
    // borderWidth: wp(0.2),
    borderRadius:wp(5),
    // borderColor:"white"
    alignSelf:"flex-start",
    resizeMode: "contain",
  },
  arrowIcon: {
    tintColor: "#EB963F",
  },
  textStyle:{
    color:"white"
  },
  tickIcon: {
    tintColor: "#EB963F",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    
  },
  inputLabel: {
    width: wp(30),
    color: '#FFFFFF',
    fontSize: wp(4),
    textAlign: 'left',
    fontFamily: fonts.montseratRegular,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: wp(4),
    textAlign: 'right',
    fontFamily: fonts.montseratBold,
    padding: wp(0.1),
  },
  dropDown: {
    width: wp(29),
    minHeight: hp(5),
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#000000",
  },
  dropDownContainer: {
    backgroundColor: '#222',
    zIndex: 2000,
    width: wp(29.5),
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 3000,
  },
  registerContainer: {
    marginTop: wp(5),
  },
  gradientBorderbutton: {
    borderRadius: wp(10),
    padding: 1,
    width: wp(50),
    height: hp(5),
    alignSelf: "center",
  },
  submitbutton: {
    color: "#ffffff",
    fontSize: wp(4),
    textAlign: 'center',
    // padding: wp(1),
    marginTop:wp(1.9),
    
    fontFamily: fonts.montseratExtraBold,
  },
  editIcon:{
    position:'absolute',
    bottom :0, // Position at the bottom edge of the profile image
    left :0,  // Position at the left edge of the profile image
    backgroundColor:'#D3770C',
    borderRadius :25,
    padding :1,
    paddingHorizontal:wp(0.5),
    marginLeft:wp(13),
    marginBottom:wp(5),
    zIndex: 1, // Ensure the icon is above the image
  },
  nonEditableIcon: {
    marginLeft: wp(2),
  },
  credentialerrorText: {
    color: "red",
    fontSize: wp(3.5),
    // flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop:wp(2),
    // paddingRight:wp(6)
  },
});