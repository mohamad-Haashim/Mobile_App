import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, BackHandler,Alert,Linking } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import mapStyle from './mapstyle';
import { ENDPOINTS } from "../../environments/environment";
import FooterMenu from '../footer/footer';
import LocationIcon from "../../assets/images/location_svg.svg";
import { wp, hp } from "../common/responsive";
import klassride from '../../assets/images/klassride1.png';
import ChooseOnMapIcon from "../../assets/images/chooseOnMap_svg.svg";
import { BlurView } from '@react-native-community/blur';
import LocationOvalIcon from "../../assets/images/locationOval_svg.svg";
import LocationOvalDotIcon from "../../assets/images/locationOvalDot_svg.svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation'

const API_KEY = ENDPOINTS.GOOGLE_API_KEY;
Geocoder.init(API_KEY);

const ChooseOnMapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { choosingFor, initialRegion,setSidebarVisible } = route.params;

  const [region, setRegion] = useState(initialRegion);
  const [address, setAddress] = useState('');
  const mapRef = useRef(null);
  const alertShownRef = useRef(false);
  const addressSetRef = useRef(false);
  const animateToRegionRef = useRef(false);
  const locationRef = useRef(false);
  const [location, setLocation] = useState(); 
  const [isLocationEnabled, setIsLocationEnabled] = useState();
   const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchAddress(region.latitude, region.longitude);
  }, []);

    useEffect(() => {
    alertShownRef.current = false; // Allow alert to show again on new visit
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await Geocoder.from(lat, lng);
      const addr = res.results[0]?.formatted_address || 'Unknown';
      setAddress(addr);
    } catch {
      setAddress('Unable to fetch address');
    }
  };

  const openLocationSettings = () => {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:root=LOCATION_SERVICES')
      } else {
        Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
      }
    }
  
    const openBlockedLocationSettings = () => {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:root=LOCATION_SERVICES')
      } else {
        Linking.openSettings();
      }
    }

    const getLocation = (enableHighAccuracy = true) => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            console.log('Got position:', position);
            resolve(position);
          },
          error => {
            console.error('Location error:', error);
            reject(error);
          },
          {
            enableHighAccuracy,
            timeout: 15000,
            maximumAge: 10000,
            forceRequestLocation: true, 
            showLocationDialog: true,  
          }
        );
      });
    };

    const initializeLocationChecks = async () => {
    let interval;
    console.log('initial location checks');

    // Request permission at the start
    let permissionGranted = await requestLocationPermission();

    const checkPermissionAndStartInterval = () => {
      // If permission is granted, start checking location services
      if (permissionGranted) {
        console.log('useEffect permission granted');
        // Start getting the current location

        getCurrentLocation();
        // Set an interval to check location services periodically (every 1 second)
        // interval = setInterval(() => {
        //   console.log('useEffect interval 5000 running');
        //   checkLocationServices();
        // }, 5000);
      }
    };

    // If permission is granted, start immediately
    checkPermissionAndStartInterval();

    // If permission is not granted, retry every 5 seconds
    if (!permissionGranted) {
      console.log('Permission not granted, retrying...');
      interval = setInterval(async () => {
        // Request permission again
        permissionGranted = await requestLocationPermission();

        if (permissionGranted) {
          console.log('useEffect permission granted');
          getCurrentLocation();
          clearInterval(interval);
          checkPermissionAndStartInterval();
        }
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  };

  useEffect(() => {
      console.log('initial useEffect calls');
      initializeLocationChecks();
    }, []);

    const requestLocationPermission = async () => {
        const permission =
          Platform.OS === "android"
            ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    
        try {
          const result = await request(permission);
    
          if (result === RESULTS.GRANTED) {
            console.log("Location permission granted");
            return true;
          } else if (result === RESULTS.DENIED) {
            if (!alertShownRef.current) {
              alertShownRef.current = true;
              Alert.alert(
                "Permission Denied",
                "Location permission is required to use this feature.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Open Settings", onPress: openBlockedLocationSettings },
                ]
              );
            }
    
          } else if (result === RESULTS.BLOCKED) {
            if (!alertShownRef.current) {
              alertShownRef.current = true;
              Alert.alert(
                "Permission Blocked",
                "You have blocked location access. Please enable it in settings.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Open Settings", onPress: openBlockedLocationSettings },
                ]
              );
            }
    
          }
        } catch (err) {
          console.error("Permission request error:", err);
        }
      };

  const getCurrentLocation = async () => {
  let location = false;

  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    console.log('Has location permission');

    // Try low accuracy first
    const position = await getLocation(false);
    if (position?.coords) {
      location = true;
      const { latitude, longitude } = position.coords;
      const quickLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(quickLocation);
      setIsLocationEnabled(true);

      const address = await reverseGeocode(latitude, longitude);
      setOriginInput(address);
      setOrigin({ latitude, longitude, description: address });
      setOriginSuggestions([]);
      mapRef.current?.animateToRegion(quickLocation, 1000);
      return;
    }
  } catch (err) {
    console.warn("Low accuracy failed:", err);
  }

  // Fallback to high accuracy
  try {
    const position = await getLocation(true);
    if (position?.coords) {
      location = true;
      const { latitude, longitude } = position.coords;
      const preciseLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(preciseLocation);
      setIsLocationEnabled(true);

      const address = await reverseGeocode(latitude, longitude);
      setOriginInput(address);
      setOrigin({ latitude, longitude, description: address });
      setOriginSuggestions([]);
      mapRef.current?.animateToRegion(preciseLocation, 1000);
      return;
    }
  } catch (err) {
    console.error("High accuracy failed:", err);
  }

  // Show alert only if both attempts failed
  if (!location) {
    setIsLocationEnabled(false);

    if (!alertShownRef.current) {
      alertShownRef.current = true;
      Alert.alert(
         "Location unavailable",
         "Please enable location for better experience.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openLocationSettings },
        ]
      );
    }
  }
};


    useEffect(() => {
      if (route.params?.triggerLocationFetch) {
        getCurrentLocation(); // Call the function locally
      }
    }, [route.params?.triggerLocationFetch]);

     useEffect(() => {
        console.log('this is from is location enabled')
        addressSetRef.current = false;
        animateToRegionRef.current = false;
        getCurrentLocation()
      }, [isLocationEnabled])
    
      useEffect(() => {
        console.log('location is off')
        // setOriginInput('')
        // setOrigin(null)
        // nearbyTaxis.length === 0
        setLocation(null)
      }, [!isLocationEnabled])

  useEffect(() => {
    const backAction = () => {
      // Navigate back if possible
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

    };

    // Add hardware back press listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Cleanup on component unmount
    return () => {
      backHandler.remove();
      // clearTimeout(backPressTimeout.current);
    };
  }, [navigation]);

  const onHome = () => {
      console.log("Navigating to Mapsearch");    
      navigation.navigate("Mapsearch");
    };

  const handleRefresh = () => {
    console.log("handleRefresh for chooseonmap")
  setRefreshKey(prev => prev + 1);
};

useEffect(() => {
//  getCurrentLocation();
}, [refreshKey]);

 const toggleSidebar = () => {
    console.log(' toggleSidebar is called')
    setSidebarVisible(false);
};

  return (
    <View style={{ flex: 1 }}>
      {/* Map */}
      <MapView
        ref={mapRef}
        key={isLocationEnabled}
        provider={PROVIDER_GOOGLE}
        showsCompass={false}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={(reg) => {
          setRegion(reg);
          fetchAddress(reg.latitude, reg.longitude);
        }}
        customMapStyle={mapStyle}
      />
            <TouchableOpacity
              style={styles.customLocationButton}
                onPress={() => {
                  if (location) {
                    console.log('location is avail: ', location)
                    getCurrentLocation()
                    mapRef.current.animateToRegion(location, 1000);
                  } else {
                    console.log("Location not available", "Unable to fetch your location.");
                    // requestLocationPermission()
                    alertShownRef.current = false;
                    locationRef.current = false;
                    getCurrentLocation()
                  }
                }}
              >
              <MaterialIcons name="my-location" size={30} color="#D3770C" style={styles.customIcon} />
            </TouchableOpacity>
      {/* Center Pin Icon */}
      <View style={styles.pinContainer}>
        {/* <FontAwesome name="map-marker-alt" size={40} color="#FF6200" /> */}
        <View style={{ position: 'relative' }}><LocationOvalIcon /></View>
        <View style={{ position: 'absolute', left: 10.5, top: 6 }}><LocationOvalDotIcon /></View>
      </View>


      {/* Top: Your Location Button */}
      <View style={styles.topLocationBtn}>

        <View style={[styles.inputHead, {
        },]}>
          <Image source={klassride} style={styles.TopLogo} />

          {/* Origin Input */}
          <LinearGradient
            colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
            start={{ x: 0.28, y: 0 }}
            end={{ x: 0.94, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.textInputContainer}>
              {/* <MaterialCommunityIcons name="map-marker-radius-outline" size={25} color="rgba(252, 255, 255, 1)" /> */}
              <LocationIcon />
              <TextInput
                // ref={inputRef}
                style={styles.input}
                placeholder={choosingFor === "origin" ? "Your Location" : "Destination"}
                placeholderTextColor="rgba(252, 255, 255, 1)"
                returnKeyType="done"
                editable={false}
              />
              {/* {originInput ? (
                              <TouchableOpacity onPress={handleClearOrigin}>
                                <Icon name="close-circle" size={20} color="gray" />
                              </TouchableOpacity>
                            ) : null} */}
            </View>
          </LinearGradient>

          

        </View>
        
      </View>


      {/* Bottom: Address Display */}
      {/* <BlurView
        intensity={10}
        tint="dark"
        style={[styles.addressBar, { position: 'absolute', bottom: 160 }]}
      >
        <ChooseOnMapIcon />
        <Text numberOfLines={1} style={styles.addressText}>
          {address}
        </Text>
      </BlurView> */}

      <View style={styles.bottomTrasparent}>
        <LinearGradient
          colors={["#E96C1F", "#1F00A7"]}
          start={{ x: 0.28, y: 0 }}
          end={{ x: 0.94, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.transparentInner}>
            <ChooseOnMapIcon />
            <Text numberOfLines={1} style={styles.addressText}>
              {address}
            </Text>
          </View>
        </LinearGradient>

        <View style={[styles.confirmContainer, styles.confirmBtn]}>
          {/* <LinearGradient colors={['#FF6200', '#4800AC']} style={styles.confirmBtn}> */}
          <LinearGradient
            colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
            start={{ x: 0.28, y: 0 }}
            end={{ x: 0.94, y: 1 }}
            style={styles.gradientContainer}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate({
                  name: 'Mapsearch',
                  params: {
                    selectedLocation: region,
                    selectedAddress: address,
                    choosingFor,
                  },
                  merge: true,
                });
              }}
            >
              <Text style={styles.confirmText}>Confirm location</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      {/* Confirm Button */}

      <FooterMenu 
        // onAccountPress={toggleSidebar} 
        onHome={onHome} 
        onRefreshPress={handleRefresh} 
      />

    </View>
  );
};

export default ChooseOnMapScreen;

const styles = StyleSheet.create({
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    zIndex: 10,
  },
  topLocationBtn: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  gradientContainer: {
    border: 10,
    marginBottom: hp(2),
    // padding: 3, 
    borderRadius: 30,
    shadowColor: "rgba(255, 98, 0, 1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 46.5,
    paddingHorizontal: wp(2),
    alignSelf: "center",
    justifyContent: 'center',
    marginLeft: wp(2),
    width: wp(74),
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    // fontWeight: 'bold',
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "transparent",
  },
  roundedButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomTrasparent: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: wp(100),
    height: 'auto',
    paddingVertical: hp(5),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  gradientBorder: {
    padding: 1.5,
    borderRadius: 40,
    width: wp(80),
    alignSelf: 'center'
  },
  transparentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: '#1E1E1E',
    backdropFilter: 'blur(10px)',
  },
  addressText: {
    color: '#FCFFFF',
    marginLeft: 10,
    flex: 1,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16
  },
  confirmContainer: {
    // position: 'absolute',
    // bottom: 80,
    alignSelf: 'center',
  },
  confirmBtn: {
    paddingVertical: hp(5),

  },
  confirmText: {
    color: '#FCFFFF',
    padding: wp(2.5),
    paddingHorizontal: 40,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16

  },
  inputHead: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    width: wp(100),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  TopLogo: {
    marginTop: hp(1),
    marginBottom: hp(1),
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
    zIndex: 99,
  },
  customLocationButton: {
    position: 'absolute',
    bottom: hp(35), // Adjust based on your layout
    right: 10,
    
    backgroundColor: '#2E333A',
    padding: 10,
    borderRadius: 15,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  customIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#2E333A',
    tintColor: '#007AFF', // Optional: Adjust the color of the icon
  },
});


