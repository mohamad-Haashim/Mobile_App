//editaccount.js dropdown

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, Alert, ToastAndroid, Animated, Easing } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { wp, hp } from "../common/responsive";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import klassride from '../../assets/images/klassride.png';
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../components/customfont";
import Header from '../common/header';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { ENDPOINTS } from '../../environments/environment';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from "react-native-vector-icons/Feather";

export default function Editaccount() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [surname, setSurname] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [userData, setUserData] = useState({})
    const navigation = useNavigation();
    const [photo, setPhoto] = useState(null);
    const [profileImageUri, setProfileImageUri] = useState(null);
    const handleEdit = () => {
        navigation.navigate("")
    }
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownItems, setDropdownItems] = useState([
        { label: 'Time', value: 'Time' },
        { label: 'Price', value: 'Price' },
    ]);
    const [loading, setLoading] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;

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

    const getUserList = async () => {
        startSpin();
        setLoading(true)
        try {
            const userId = await AsyncStorage.getItem('userId')
            const response = await fetch(ENDPOINTS.userGetProfile + userId);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const userData = data;
            setUserData(userData);
            setDropdownValue(userData.gender);
            setGender(userData.gender);
        } catch (error) {
            console.error('Error fetching API:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getUserList();
    }, []);

    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setSurname(userData.surname || '');
            setEmail(userData.email || '');
            setGender(userData.gender || '');
            setDob(userData.dob || '');
            setPhone(userData.phone || '');
        }
    }, [userData]);

    useEffect(() => {
        // setTimeout(() => {
        //     setError('');
        // }, 3000);
    }, [error])

    const handleUpdate = async () => {
        try {
            if (!name || name.trim().length === 0) {
                setError("Name is required!");
                return;
            } else if (!surname || surname.trim().length === 0) {
                setError("Surname is required!");
                return;
            } else if (!email || email.trim().length === 0) {
                setError("Email is required!");
                return;
            } else if (!gender) {
                setError("Gender is required!");
                return;
            }

            setLoading(true);
            startSpin();
            const userId = await AsyncStorage.getItem('userId');
            const accesstoken = await AsyncStorage.getItem('accessToken');
            console.log("accesstoken", accesstoken)
            const payload = {
                name: name.trim(),
                surname: surname.trim(),
                email: email.trim().toLowerCase(),
                gender: gender
            };
            console.log("payload", payload)
            const response = await fetch(ENDPOINTS.userUpdateProfile + userId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });


            if (response.ok) {
                const data = await response.json();
                console.log('Profile updated successfully');
                console.log('Response Data:', data);
                setError('')
                ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT)
                // Navigate to the next screen
                // navigation.navigate('Mapsearch');
            } else {
                // API registration failed, handle error
                const errorData = await response.json();
                console.log(errorData.message || 'updation failed');
                console.error('API Error Response:', errorData);
            }

        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false)
        }
    };


    const handleChoosePhoto = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            cropping: true, // Enable cropping
            compressImageQuality: 0.8, // Compress the image for uploading
            // includeBase64: false,
            // cameraType: 'front',
        })
            .then((image) => {
                const uri = image.path; // Get the path of the selected and cropped image
                setProfileImageUri(uri); // Update the profile image URI state
                uploadProfilePicture(uri); // Upload the selected picture
            })
            .catch((error) => {
                if (error.code === 'E_PICKER_CANCELLED') {
                    console.log('User canceled image picker');
                } else {
                    console.log('ImagePicker Error: ', error);
                    Alert.alert('Error', 'Failed to pick image');
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
            startSpin()
            setLoading(true)
            const token = await AsyncStorage.getItem("refreshToken");
            const response = await fetch(ENDPOINTS.userUpdateProfilePhote, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                console.log("respone in upload image", result)
                setError('')
                setProfileImageUri(result.photoUrl);
                getUserList();
                ToastAndroid.show("Profile picture updated successfully", ToastAndroid.SHORT)
            } else {
                // Alert.alert('Error', 'Failed to upload profile picture');
                console.log('Upload Error: ', result.message);
            }
        } catch (error) {
            console.error('Upload Error: ', error);
            // Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false)
        }


    };
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView >
                <ScrollView >

                    <View style={styles.headerlay}>
                        <View style={styles.arrowlay}>
                            <Header />
                        </View>
                        <Text style={styles.headerText}>Edit Account</Text>
                    </View>
                    <View style={styles.imagelay}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleChoosePhoto}
                            style={styles.profilePictureContainer}
                        >
                            <View style={styles.profilePictureWrapper}>
                                {userData.profilePicture || profileImageUri ? (
                                    <Image
                                        source={{ uri: userData.profilePicture || profileImageUri }}
                                        style={styles.profilePicture}
                                    />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Icon name="camera" size={10} color="#999" />
                                        <Text style={styles.placeholderText}>Upload Image</Text>
                                    </View>
                                )}
                                <MaterialCommunityIcons
                                    name="pencil"
                                    size={15}
                                    color="#fff"
                                    style={styles.editIcon}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.inputlay, { marginTop: error ? hp(1) : hp(4) }]}>
                        {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
                        <View style={styles.inputContainer}>
                            <Icon name="person" size={wp(5)} color="#D3770C" style={styles.icon} />
                            <Text style={styles.inputLabel} placeholderTextColor="#ccc">Name</Text>
                            <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setName}> {userData.name || "N/A"}</TextInput>
                            {/* <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setSurname} maxLength={25} >Larry</TextInput> */}
                        </View>

                        <View style={styles.inputContainer}>
                            <MaterialIcons name="person-pin" size={wp(5)} color="#D3770C" style={styles.icon} />
                            <Text style={styles.inputLabel} placeholderTextColor="#ccc">Surname</Text>
                            <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setSurname}> {userData.surname || "N/A"}</TextInput>
                            {/* <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setSurname} maxLength={25} >Devis</TextInput> */}
                        </View>

                        <View style={styles.genderInputContainer}>
                            <Icon name="wc" size={wp(5)} color="#D3770C" style={styles.icon} />
                            <Text style={styles.inputLabel} placeholderTextColor="#ccc">Gender</Text>
                            <DropDownPicker
                                open={dropdownOpen}
                                value={dropdownValue}
                                items={[
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Other', value: 'Other' },
                                ]}
                                setOpen={(isOpen) => {
                                    if (isOpen) {
                                        setDropdownOpen(false); // Ensure only one dropdown is open
                                    }
                                    setDropdownOpen(isOpen);
                                }}
                                setValue={setDropdownValue}
                                setItems={setDropdownItems}
                                placeholder="Choose"
                                style={[styles.dropdown, (dropdownOpen || selectedCategory === 'dropdownOpen') && styles.activeCategory]}
                                containerStyle={styles.dropdownContainer}
                                dropDownContainerStyle={styles.dropdownListContainer}
                                textStyle={styles.dropdownText}
                                listItemLabelStyle={styles.listItemLabel}
                                arrowIconStyle={styles.arrowIcon}
                                activeOpacity={0.8}
                                onPress={() => setSelectedCategory('dropdownOpen')}
                                onSelectItem={(item) => {
                                    setDropdownValue(item.value);
                                    setGender(item.value); // Update gender state when an item is selected
                                }}
                                showTickIcon={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="mail" size={wp(5)} color="#D3770C" style={styles.icon} />
                            <Text style={styles.inputLabel} placeholderTextColor="#ccc" keyboardType="email-address" >Email</Text>
                            <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" keyboardType="email-address" onChangeText={setEmail}>{userData.email || "N/A"}</TextInput>
                            {/* <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setSurname}> larrydevis@gmail.com</TextInput> */}
                        </View>

                        {/* <View style={styles.inputContainer}>
                            <Icon name="calendar-today" size={wp(5)} color="#D3770C" style={styles.icon} />
                            <Text style={styles.inputLabel} placeholderTextColor="#ccc" >DOB</Text>
                            <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" editable={false}>{userData.dob}</TextInput>
                            <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setSurname}> 12/06/1987</TextInput>
                            <Icon name="edit-off" size={wp(4.5)} color="#D3770C" style={styles.icon} />
                        </View> */}

                        <View style={styles.inputContainer}>
                            <Icon name="phone" size={wp(5)} color="#D3770C" style={styles.icon} />
                            <Text style={styles.inputLabel} placeholderTextColor="#ccc" keyboardType="phone-pad">Phone</Text>
                            <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" keyboardType="phone-pad" editable={false}>{userData.phoneNumber || "N/A"}</TextInput>
                            {/* <TextInput style={[styles.input, { top: 4 }]} placeholderTextColor="#ccc" onChangeText={setSurname}> 9876543210</TextInput> */}
                            <Icon name="edit-off" size={wp(4.5)} color="red" style={[styles.nonEditIcon, { marginRight: wp(-2) }]} />
                        </View>
                        <View style={styles.buttonspace}>
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                    <TouchableOpacity onPress={() => setError('')}>
                                        <Icon name="close" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleUpdate}>
                                <Text style={styles.Submitbutton} >UPDATE PROFILE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202020',
        padding: wp(5),
        alignItems: 'center',
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: hp(2),
    },
    profilePictureWrapper: {
        width: wp(30),
        height: wp(30),
        borderRadius: wp(15),
        borderWidth: 3,
        borderColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profilePicture: {
        width: '100%',
        height: '100%',
        borderRadius: wp(15),
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#D3770C',
        borderRadius: 25,
        padding: 5,
    },
    arrowlay: {
        marginRight: wp(80)
    },
    imagelay: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
    },
    uploadedImage: {
        width: 100,
        height: 100,
        borderRadius: 300,
        borderWidth: 2,
        borderColor: "white",
        alignItems: 'center',
    },
    photoButton: {
        backgroundColor: '#D3770C',
        borderRadius: 10,
        alignItems: 'center',
        width: wp(35),
        height: hp(4),
        borderRadius: 12,
        textAlign: "center",
        marginTop: hp(3)
    },
    photoButtonText: {
        color: '#fff',
        // fontWeight: 'bold',
        textAlign: "center",
        // marginTop:wp(1),
        fontFamily: fonts.NATS,
        fontSize: wp(5.5),
        bottom: 7,
    },
    headerlay: {
        // flexDirection:"row",
        marginBottom: wp(1),
        alignItems: 'center',
        // marginRight:wp(40)
    },
    inputlay: {
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 15,

    },
    headerText: {
        color: '#FFFFFF',
        fontSize: wp(6),
        fontWeight: 'bold',
        marginBottom: hp(2),
        // textAlign: 'center',
        // alignItems: 'center',
        // left:70
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#333333',
        borderRadius: wp(2),
        paddingHorizontal: wp(5),
        // paddingVertical: hp(),
        marginBottom: hp(1.5),
        // height: hp(6)
        height: hp(6.5),
        // zIndex: -1

    },
    genderInputContainer: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: '#333333',
        borderRadius: wp(2),
        paddingHorizontal: wp(5),
        // paddingVertical: hp(),
        marginBottom: hp(1.5),
        // height: hp(6)
        height: hp(6.5),
        zIndex: 999
    },
    icon: {
        marginRight: wp(2),
        // top: 8
    },
    nonEditIcon: {
    },
    input: {
        // flex: 1,
        color: '#FFFFFF',
        fontSize: wp(4),
        // width:wp(10),
        height: wp(10),
        alignItems: "center",
        // justifyContent: "center",
        // textAlign: 'center',
        // marginTop:hp(1.9)
        // backgroundColor: "",
        // top: 7,
    },
    inputLabel: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: wp(4),
        fontWeight: 'bold',
        // width:wp(10),
        // height: wp(10),
        alignItems: "center",
        justifyContent: "center",
        // textAlign: 'center',
        // marginTop:hp(1.9)
        // backgroundColor: "",
        // top: 7,
    },
    buttonspace: {
        marginTop: hp(5),
        marginLeft: wp(5)
    },
    button: {
        backgroundColor: "#D3770C",
        borderRadius: 12,
        width: wp(50),
        height: hp(5),
        alignSelf: 'center'
    },
    Submitbutton: {
        color: '#FFFFFF',
        fontSize: wp(4.5),
        fontWeight: 'bold',
        textAlign: "center",
        // fontFamily: fonts.NATS,
        justifyContent: "center",
        // paddingHorizontal:wp(1)
        marginTop: hp(0.9),
        // letterSpacing:1
    },
    dropdownContainer: {
        // marginVertical: hp(2), // Adjust vertical spacing for consistency
        width: wp(40), // Match the width of other input fields
        height: hp(-20),
        padding: -10,
        borderRadius: wp(2), // Ensure the border radius matches other inputs
        marginRight: wp(-5)
    },

    dropdown: {
        backgroundColor: '#333333',
        borderColor: '#D3770C',
        // borderWidth: 1,
        // backgroundColor: 'red',
        // height: hp(-10),
        minHeight: hp(6),
        borderRadius: wp(2), // Border radius matches other input fields
        // paddingHorizontal: wp(5), // Consistent padding with other input fields
        // height: hp(-11), // Adjust height to match other inputs
    },

    dropdownListContainer: {
        backgroundColor: '#222222',
        borderColor: '#D3770C',
        borderWidth: 1,
        borderRadius: wp(2),
        // paddingVertical: 5,
        marginTop: 5,
    },

    dropdownText: {
        fontSize: wp(3.5), // Adjust font size for consistency with inputs
        fontWeight: '600',
        color: '#FFFFFF',
    },

    listItemLabel: {
        fontSize: wp(4), // Adjust font size for consistency with inputs
        color: '#FFFFFF',
        paddingHorizontal: 10,
    },

    arrowIcon: {
        tintColor: '#FFFFFF',
        marginRight: wp(2), // Align arrow properly within the dropdown
    },
    errorContainer: {
        backgroundColor: "#800020",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
        marginBottom: 5,
        borderColor: 'grey',
        borderWidth: 1,
        gap: 1
    },
    errorText: {
        color: "white",
        fontSize: wp(3.5),
        flexShrink: 1,
    },
    loaderOverlay: {
        // flexGrow: 1,
        width: wp(-10),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 3000,
    },
});

