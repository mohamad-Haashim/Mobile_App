import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, Image, SafeAreaView, ToastAndroid, BackHandler, Keyboard } from "react-native";
import { TouchableOpacity } from "react-native";
import klassride from '../../assets/images/klassride1.png'
import { CommonActions, useNavigation } from "@react-navigation/native";
import Header from "../common/header";
import { wp, hp } from "../common/responsive";
import CheckBox from '@react-native-community/checkbox';
import { fonts } from "../../components/customfont";
import { ENDPOINTS } from "../../environments/environment";
import { Animated, Easing } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import CountryPicker from 'react-native-country-picker-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ImageBackground } from "react-native";
import Blue from "../../assets/images/blue.png"



export default function Register() {
  const [name, setname] = useState('');
  const [surname, setsurname] = useState('');
  const [gender, setgender] = useState(''); // Initialize gender as empty string
  const [number, setNumber] = useState('');
  const [email, setemail] = useState('');
  const [Password, setpassword] = useState('');
  const [conpassword, setconpassword] = useState('');
  const navigation = useNavigation();
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [countryCode, setCountryCode] = useState('RO');
  const [callingCode, setCallingCode] = useState('+40');
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showconPassword, setShowconPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    gender: '',
    number: '',
    password: '',
    conpassword: '',
    isChecked:'',
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const phoneInputRef = useRef(null);

  const resetFields = () => {
    [setname, setsurname, setgender, setNumber, setemail, setpassword, setconpassword,setChecked].forEach(setState => setState(''));
    setErrors({
      name: '',
      surname: '',
      email: '',
      gender: '',
      number: '',
      password: '',
      conpassword: '',
      isChecked:'',
    });
  };
 const [messageType, setMessageType] = useState(null);


 const showMessage = (type, message) => {
  setMessageType(type);

  // Clear after 3 seconds
  setTimeout(() => {
    setMessageType(null);
  }, 3000);
};


  const handlelog = () => {
    resetFields();
    navigation.navigate('Signup');
  };



  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(`+${country.callingCode[0]}`);
    setModalVisible(false);

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



  const handleInputChange = (field, value) => {
    if (field === 'name') setname(value);
    if (field === 'lastname') setsurname(value);
    if (field === 'gender') {
        setgender(value);
        // Clear gender error immediately when a value is selected
        if (value) {
            setErrors(prev => ({ ...prev, gender: '' }));
        }
    }
    if (field === 'number') setNumber(value);
    if (field === 'email') setemail(value);
    if (field === 'password') setpassword(value);
    if (field === 'conpassword') setconpassword(value);
    if (field === 'isChecked') setChecked(value);

    // Clear specific errors when the corresponding input field is being typed into (except for gender)
    switch (field) {
        case 'name':
            setErrors(prev => ({ ...prev, name: '' }));
            break;
        case 'lastname':
            setErrors(prev => ({ ...prev, surname: '' }));
            break;
        case 'email':
            setErrors(prev => ({ ...prev, email: '' }));
            break;
        case 'number':
            setErrors(prev => ({ ...prev, number: '' }));
            break;
        case 'password':
            setErrors(prev => ({ ...prev, password: '' }));
            break;
        case 'conpassword':
            setErrors(prev => ({ ...prev, conpassword: '' }));
            break;
        case 'isChecked':
            setErrors(prev => ({ ...prev, isChecked: '' }));
            break;
        default:
            break;
    }
  };



  const handleBlur = (field) => {
    switch (field) {
      case 'name':
        if (!name.trim()) {
          setErrors(prev => ({ ...prev, name: 'Name is required' }));
        }
        break;
      case 'surname':
        if (!surname.trim()) {
          setErrors(prev => ({ ...prev, surname: 'Lastname is required' }));
        }
        break;
      case 'email':
        if (!email.trim()) {
          setErrors(prev => ({ ...prev, email: 'Email is required' }));
        } else {
          const emailRegex = /\S+@\S+\.\S+/;
          if (!emailRegex.test(email.trim())) {
            setErrors(prev => ({ ...prev, email: 'Enter a valid email' }));
          }
        }
        break;
      case 'number':
        if (!number.trim()) {
          setErrors(prev => ({ ...prev, number: 'Phone number is required' }));
        } else if (number.length < 9) {
          setErrors(prev => ({ ...prev, number: 'Enter a valid phone number' }));
        }
        break;
      case 'password':
        if (!Password.trim()) {
          setErrors(prev => ({ ...prev, password: 'Password is required' }));
        }
        break;
      case 'conpassword':
        if (!conpassword.trim()) {
          setErrors(prev => ({ ...prev, conpassword: 'Confirm your password' }));
        } else if (Password.trim() !== conpassword.trim()) {
          setErrors(prev => ({ ...prev, conpassword: 'Passwords do not match' }));
        }
        break;
      case 'isChecked':
        if (!isChecked.trim()) {
          setErrors(prev => ({ ...prev, isChecked: '' }));
        } else if (isChecked.trim() !== isChecked.trim()) {
          setErrors(prev => ({ ...prev, isChecked: 'You must agree to the terms and conditions.' }));
        }
        break;
      case 'gender':
        // Only show gender error on blur if no gender is selected
        if (!gender) {
            setErrors(prev => ({ ...prev, gender: 'Gender is required' }));
        }
        break;
      default:
        break;
    }
  };



  const handleReset = (input) => {
    if (input === 'name') setname('');
    if (input === 'lastname') setsurname('');
    if (input === 'email') setemail('');
    if (input === 'number') setNumber('');
  };



  const handleRegister = async () => {
  let valid = true;
  const newErrors = {};

  // Field validations
  if (!name.trim()) {
    newErrors.name = 'Name is required';
    valid = false;
  }
  if (!surname.trim()) {
    newErrors.surname = 'Lastname is required';
    valid = false;
  }
  if (!email.trim()) {
    newErrors.email = 'Email is required';
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
    newErrors.email = 'Enter a valid email';
    valid = false;
  }

  if (!gender) {
    newErrors.gender = 'Gender is required';
    valid = false;
  }

  if (!number.trim()) {
    newErrors.number = 'Phone number is required';
    valid = false;
  } else if (number.trim().length < 9) {
    newErrors.number = 'Enter a valid phone number';
    valid = false;
  }

  if (!Password.trim()) {
    newErrors.password = 'Password is required';
    valid = false;
  }

  if (!conpassword.trim()) {
    newErrors.conpassword = 'Confirm your password';
    valid = false;
  } else if (Password.trim() !== conpassword.trim()) {
    newErrors.conpassword = 'Passwords do not match';
    valid = false;
  }
  if (!isChecked) {
  newErrors.isChecked = 'You must agree to the terms and conditions.';
  valid = false;
}

  setErrors(newErrors);
  if (!valid) return;

  try {
    setLoading(true);
    startSpin();

    const fullnumber = callingCode + number.trim();
    
    const response = await fetch(ENDPOINTS.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: fullnumber,
        gender,
        password: Password.trim(),
        confirmPassword: conpassword.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful:', data);
      showMessage(data.message);
        setname('');
        setsurname('');
        setgender('');
        setNumber('');
        setemail('');
        setpassword('');
        setconpassword('');
        setChecked(false);
      navigation.navigate('numberverify', { RegisterNumber: fullnumber });
      console.log( "RegisterNumber", fullnumber )
    } else {
      const apiErrors = {};

      if (Array.isArray(data.details)) {
        data.details.forEach((detail) => {
          const lower = detail.toLowerCase();
          if (lower.includes('email')) {
            apiErrors.email = detail;
          } else if (lower.includes('phone') || lower.includes('number')) {
            apiErrors.number = detail;
          } else {
            apiErrors.register = detail;
          }
        });
      } else {
        apiErrors.register = data.message || 'Registration failed';
      }

      setErrors(apiErrors);
    }

  } catch (error) {
    setErrors({ register: error?.message || 'Registration failed!' });
  } finally {
    setLoading(false);
  }
};





  const handleverfication = async (number) => {

    try {

      setLoading(true);

      const response = await fetch(ENDPOINTS.whatsappValidation(number), {

        method: 'POST',

      });

      let responseData = await response.json();
      console.log(responseData,"responseData")
      if (response.ok) {

        setNumber('');

        navigation.navigate('numberverify', { phonenumber: number });

      }

    } catch (error) {

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    setLoading(false);

  }, []);



  useEffect(() => {
    const backAction = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Signup' }],
        })
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      // Focus the first input when the keyboard shows
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Optionally clear the focus of input when keyboard is hidden
      Keyboard.dismiss();
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled"showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(10) }}>
          <View style={styles.container}>
            {/* <View style={styles.header}> */}
            <ImageBackground source={Blue} style={styles.imageBackground}>
              <Image source={klassride} style={styles.logo} />
              <Text style={styles.heading}> Create account</Text>
            </ImageBackground>
            {/* </View> */}

            <View style={styles.overlay}>
              <View style={styles.inputWrapper}>
                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(value) => handleInputChange('name', value)}
                      onBlur={() => handleBlur('name')}
                      value={name}
                      placeholder="First name"
                      keyboardType="default"
                      placeholderTextColor="#CBC0C099"
                      autoComplete="name" // Add autoComplete for autofill hints
                      textContentType="givenName" // Add textContentType for iOS autofill
                    />
                    {name.length > 0 && (
                      <TouchableOpacity onPress={() => handleReset('name')} style={styles.closeIcon}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#cccccc" />
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
                {errors.name && <Text style={styles.errorTextRight}>{errors.name}</Text>}
              </View>
              <View style={styles.inputWrapper}>
                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(value) => handleInputChange('surname', value)}
                      onBlur={() => handleBlur('surname')}
                      value={surname}
                      placeholder="Last name"
                      keyboardType="default"
                      placeholderTextColor="#CBC0C099"
                      autoComplete="family-name" // Add autoComplete for autofill hints
                      textContentType="familyName" // Add textContentType for iOS autofill
                    />
                    {surname.length > 0 && (

                      <TouchableOpacity onPress={() => handleReset('Lastname')} style={styles.closeIcon}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#cccccc" />
                      </TouchableOpacity>
                    )}
                  </View>

                </LinearGradient>

                {errors.surname && <Text style={styles.errorTextRight}>{errors.surname}</Text>}

              </View>

              <View style={styles.inputWrapper}>
                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.textInput} onChangeText={(value) => handleInputChange('email', value)}

                      onBlur={() => handleBlur('email')} value={email} placeholder="E-mail address" keyboardType="email-address" placeholderTextColor="#CBC0C099"
                      autoComplete="email" // Add autoComplete for autofill hints
                      textContentType="emailAddress" // Add textContentType for iOS autofill
                    />
                    {email.length > 0 && (
                      <TouchableOpacity onPress={() => handleReset('email')} style={styles.closeIcon}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#cccccc" />
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
                {errors.email && <Text style={styles.errorTextRight}>{errors.email}</Text>}
              </View>



              <View style={styles.inputWrapper}>

                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <DropDownPicker open={open} value={gender} items={items} setOpen={setOpen} setValue={setgender} setItems={setItems} placeholder="Gender" placeholderStyle={{ color: '#CBC0C099', fontSize: wp(4) }}
                    style={styles.dropDown} dropDownContainerStyle={{ ...styles.dropDownContainer, zIndex: open ? 2000 : 0 }}

                    arrowIconStyle={styles.arrowIcon} textStyle={styles.textStyle} tickIconStyle={styles.tickIcon} listItemLabelStyle={{ color: '#CBC0C099', fontSize: wp(4) }} onBlur={() => handleBlur('gender')} onChangeValue={(value) => handleInputChange('gender', value)} // Added onChangeValue
                  />
                </LinearGradient>
                {errors.gender && <Text style={styles.errorTextRight}>{errors.gender}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <View style={styles.innerContainer}>
                    <TouchableOpacity

                      onPress={() => setModalVisible(true)}
                      style={styles.countryCodeSelector}>
                      <CountryPicker countryCode={countryCode} withFilter withFlag withAlphaFilter withCallingCode onSelect={onSelectCountry} visible={modalVisible} onClose={() => setModalVisible(false)} />
                      <Text style={styles.countryCode}>{callingCode}</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={[styles.input]} value={number} onChangeText={(text) => { const numericText = text.replace(/[^0-9]/g, ''); handleInputChange('number', numericText); }}
                      onBlur={() => handleBlur('number')}
                      keyboardType="numeric"
                      placeholder="Phone number"
                      placeholderTextColor="#CBC0C099"
                      maxLength={13}
                      autoComplete="tel-national" // Add autoComplete for phone number
                      textContentType="telephoneNumber" // Add textContentType for iOS phone number autofill
                    />
                    {number.length > 0 && (
                      <TouchableOpacity onPress={() => {
                        handleReset('number')
                        setTimeout(() => phoneInputRef.current?.focus(), 0);
                      }}

                        style={styles.closeIcon}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#cccccc" />
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
                {errors.number && <Text style={styles.errorTextRight}>{errors.number}</Text>}
              </View>


              <View style={styles.inputWrapper}>
                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.textInput} onChangeText={(value) => handleInputChange('password', value)} onBlur={() => handleBlur('password')} value={Password}

                      placeholder="Password" secureTextEntry={!showPassword} placeholderTextColor="#CBC0C099"
                      autoComplete="new-password" // Hint for new password
                      textContentType="newPassword" // iOS hint for new password
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                      <Icon name={showPassword ? "eye" : "eye-off"} size={19} color="#cccccc" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
                {errors.password && <Text style={styles.errorTextRight}>{errors.password}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <LinearGradient colors={['#FF6200', '#4800AC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBorder}>
                  <View style={styles.inputContainer}>
                    <TextInput

                      style={styles.textInput} onChangeText={(value) => handleInputChange('conpassword', value)} onBlur={() => handleBlur('conpassword')} value={conpassword} placeholder="Confirm Password" secureTextEntry={!showconPassword} placeholderTextColor="#CBC0C099"
                      autoComplete="new-password" // Hint for confirming new password
                      textContentType="newPassword" // iOS hint for confirming new password
                    />
                    <TouchableOpacity onPress={() => setShowconPassword(!showconPassword)} style={styles.eyeIcon}>
                      <Icon name={showconPassword ? "eye" : "eye-off"} size={19} color="#cccccc" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
                {errors.conpassword && <Text style={styles.errorTextRight}>{errors.conpassword}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.checkboxContainer}>
                  <CheckBox value={isChecked} onValueChange={setChecked}
                    style={styles.checkbox} tintColors={{ true: '#FCFFFF', false: '#D3770C' }} />
                  <Text style={[styles.label]}>
                    By signing up, you agree to the{' '}
                    <Text style={{ color: '#FF8336', textDecorationLine: 'underline' }}>
                      Terms & Condition
                    </Text>{' '}
                    and{' '}
                    <Text style={{ color: '#FF8336', textDecorationLine: 'underline' }}>
                      Privacy Policy
                    </Text>
                  </Text>
                      {errors.isChecked && <Text style={styles.errorTextCheckbox}>{errors.isChecked}</Text>}
                </View>

              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
      {!isKeyboardVisible && (
        <View style={styles.fixedButtonContainer}>
      <Text style={styles.credentialerrorText}>{messageType}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
            <LinearGradient
              colors={['#FF6200', '#4800AC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorderbutton}
            >
              <Text style={styles.submitbutton}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.Acc} onPress={handlelog}>
              Already have an account?{' '}
              <Text style={styles.code}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}



      {loading && (
        <View style={styles.loaderOverlay}>
          <Animated.View style={{ transform: [{ rotate: spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
            <Feather name="loader" size={40} color="#ff7d00" />
          </Animated.View>
        </View>
      )}

    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    // justifyContent: "flex-start",
    // elevation: 15,
    // padding: hp(2),
  },

  header: {
    // position: "absolute",
    top: wp(5),
    // left: wp(5.5),
    padding: wp(1),
  },



  imageBackground: {
    justifyContent: "center",
    alignItems: "center",
    height: hp(20),
    width: wp(90),
    // position:"relative",
    borderRadius: 30,
    zIndex: 999
  },

  code: {
    color: "#FF8336",
    textDecorationLine: "underline",
    fontSize: wp(3.5),
  },

  logo: {
    width: wp(27.5),
    height: hp(7),
    resizeMode: "contain",
    zIndex: 999
  },

  dropDownContainer: {
    backgroundColor: "#2B2E32",
    borderColor: "transparent",
    width: "100%",
    height: hp(11),
    marginTop: wp(0.3),
    fontFamily: fonts.montseratSemiBold
  },

  heading: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: wp(5),
    marginTop: hp(2),
    // marginBottom: hp(1),
    letterSpacing: 2,
    fontFamily: fonts.montseratBold,

  },
  overlay: {
    // padding:wp(1),
    justifyContent: "center",
    marginBottom:hp(5)
  },

  inputWrapper: {
    // position: "relative",
    width: wp(90),
    marginTop: hp(4.5),
    height: hp(8),
    // top:0
  },

  gradientBorder: {
    borderRadius: 30,
    padding: 1,
    width: "100%",
    alignSelf: "center",

  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 30,
    height: hp(7),
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 30,
    width: "100%",
    paddingHorizontal: wp(3),
    height: hp(7),
  },

  textInput: {
    flex: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    fontSize: wp(4),
    color: "#cccccc",
    // letterSpacing: 2,
    height: hp(7),
    fontFamily: fonts.montseratSemiBold,
  },
  eyeIcon: {
    paddingHorizontal: wp(3),
  },
  countryCodeSelector: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 1,
    alignItems: "center",
    color: "#cccccc",
  },

  countryCode: {
    fontSize: wp(4),
    color: "#cccccc",
    fontFamily: fonts.montseratSemiBold
  },

  input: {
    fontSize: wp(4),
    // letterSpacing: 2,
    color: "#cccccc",
    backgroundColor: "#000000",
    fontFamily: fonts.montseratSemiBold,
    width: wp(50)
  },

  dropDown: {
    width: "100%",
    minHeight: hp(6),
    backgroundColor: "#000000",
    borderRadius: 30,
    borderWidth: 0,
    justifyContent: "center",
    height: hp(7),
    paddingHorizontal: wp(8),
    fontFamily: fonts.montseratSemiBold
  },

  textStyle: {
    color: "#cccccc",
    fontSize: wp(4),
    // letterSpacing: 2,
    fontFamily: fonts.montseratSemiBold,
  },

  arrowIcon: {
    tintColor: "#EB963F",
  },
  tickIcon: {
    tintColor: "#EB963F",
  },

  eyecon: {
    position: "absolute",
    right: wp(4),
  },
  Acc: {
    color: "#FFFFFF",
    fontSize: wp(3.5),
    marginTop: hp(1),
    fontFamily: fonts.montseratMedium,
    fontWeight: "500"
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // top:0,
    paddingVertical: hp(2),
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
  },

  gradientBorderbutton: {
    borderRadius: 30,
    padding: 1,
    width: wp(50),
    height: hp(5),
    alignSelf: "center",
  },

  submitbutton: {
    color: "#ffffff",
    fontSize: wp(4.5),
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 1,
    padding: wp(1.5),
    fontFamily: fonts.montseratSemiBold
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: hp(-8),
    // marginRight: wp(1),
    marginTop: hp(-2),
  },

  checkbox: {
    marginRight: wp(-10),
    marginTop: hp(-1),
    color: "#D3770C",
  },

  label: {
    color: "white",
    marginLeft: wp(11),
    fontSize: wp(3.5),
    fontFamily: fonts.montseratRegular,
    fontWeight: "400"
  },

  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 3000,
  },

  errorTextRight: {
    position: 'absolute',
    color: "#FF4D4D",
    fontSize: wp(3.5),
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: wp(16),
    // marginTop:hp(0.5)
    flexShrink: 1,
    
  },
  errorTextCheckbox: {
    position: 'absolute',
    right: 5,
    top: wp(-5),
    color: "#FF4D4D",
    fontSize: wp(3.5),
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: wp(15),
    // marginTop:hp(0.5)
     flexShrink: 1,
     alignContent:"flex-end"
  },

  closeIcon: {
    position: "absolute",
    right: wp(4),
  },
  credentialerrorText: {
    color: "green",
    fontSize: wp(3.5),
    // flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom:wp(1),
    // paddingRight:wp(6)
  },

});