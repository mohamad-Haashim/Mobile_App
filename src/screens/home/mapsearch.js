import 'react-native-get-random-values';
import { useState, useRef, useEffect, useCallback, useMemo ,useContext } from "react";
import React from 'react';
import { Modal, Dimensions, StyleSheet, Text, TextInput, View, Image, Animated, SafeAreaView, TouchableOpacity, ScrollView, Button, PermissionsAndroid, Platform, Alert, Linking, 
  Keyboard, BackHandler, ToastAndroid, ActivityIndicator,Easing} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { fonts } from "../../components/customfont";
import { wp, hp } from "../common/responsive";
import MySidebar from "../common/sidebar";
import MyAccount from "../profile/myaccount";

import FastestImage from "../../assets/images/fastest_svg.svg";
import EconomyImage from "../../assets/images/economy_svg.svg";
import XlImage from "../../assets/images/xl_svg.svg";
import PetImage from "../../assets/images/pet_svg.svg";
import DeliveryImage from "../../assets/images/delivery_svg.svg";
import AssistImage from "../../assets/images/assist_svg.svg";
import WomenImage from "../../assets/images/women_svg.svg";
import PremiumImage from "../../assets/images/premium_svg.svg";
import ElectricImage from "../../assets/images/electric_svg.svg";
import ComfortImage from "../../assets/images/comfort_svg.svg";
import LocationIcon from "../../assets/images/location_svg.svg";
import DestinationIcon from "../../assets/images/destination_svg.svg";
import ChooseOnMapIcon from "../../assets/images/chooseOnMap_svg.svg";
import SearchLocationIcon from "../../assets/images/searchLocation_svg.svg";
import SearchHistoryIcon from "../../assets/images/searchHistory_svg.svg";
import BoltIcon from "../../assets/images/bolt_svg.svg";
import UberIcon from "../../assets/images/uber_svg.svg";
import LocationOvalIcon from "../../assets/images/locationOval_svg.svg";
import LocationOvalDotIcon from "../../assets/images/locationOvalDot_svg.svg";


import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import klassride from '../../assets/images/klassride1.png';
// import car from '../../assets/images/car.png';
import { FlatList, GestureHandlerRootView, PanGestureHandler, TapGestureHandler, TouchableWithoutFeedback, NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation'
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { ENDPOINTS } from "../../environments/environment";
// import IntentLauncher from 'react-native-intent-launcher';
import API from "./mapserach.json";
import mapStyle from './mapstyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Riderscreen from '../Rider/Riderscreen';
import FooterMenu from '../footer/footer';
import { BlurView } from "@react-native-community/blur";
import ChooseOnMapScreen from './ChooseOnMapScreen';
// import MaskedView from '@react-native-masked-view/masked-view';
import { RefreshControl } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import Payment from '../payment/payment';
import Feather from "react-native-vector-icons/Feather";
import profile from '../../assets/images/profile.png';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { OrientationContext } from '../common/OrientationContext';
import Orientation from 'react-native-orientation-locker';

export default function Mapsearch() {
  const route = useRoute();
  const { promoData } = route.params || {};
  const { campaignId, discount, deepLink, expires,title,body } = promoData || {};
  const [ridesData, setRidesData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [boltData, setBoltData] = useState([]);
  const [uberData, setUberData] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  // const [filteredData, setRidesData] = useState([]);

  const [sheetIndex, setSheetIndex] = useState(0);
  const [location, setLocation] = useState();  // Current location
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState();
  const [destination, setDestination] = useState(null);  // Destination
  const [origin, setOrigin] = useState(null);
  const [isSettingOrigin, setIsSettingOrigin] = useState(true);
  const [routeParamdata,setRouteParamdata] = useState([]);
  const [loading, setLoading] = useState();
  const [uberLoading, setUberLoading] = useState(false);
  const [boltLoading, setBoltLoading] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const [ridesData, setRidesData] = useState([]);
  const navigation = useNavigation();
  const [selectedData, setSelectedData] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null); // Selected option for sorting
  const [sortOptions, setSortOptions] = useState([
    { label: "Time", value: "Time" },
    { label: "Price", value: "Price" },
  ]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState(null); // Selected provider filter
  const [providerFilterOptions, setProviderFilterOptions] = useState([
    { label: "All", value: "all" },
    { label: "Uber", value: "Uber" },
    { label: "Bolt", value: "Bolt" },
  ]);
  const [selectedCategory1, setSelectedCategory1] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [translateY] = useState(new Animated.Value(0));
  const [lastOffset, setLastOffset] = useState(0);
  const mapRef = useRef(null);
  const watchId = useRef(null);
  const inputRef = useRef(null);
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);
  const bottomSheetRef = useRef(null);
  const RBbottomSheetRef = useRef(null);
  // const [originInput, setOriginInput] = useState("");
  // const [destinationInput, setDestinationInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const routeParams = useRoute();

  const [refreshKey, setRefreshKey] = useState(0);
  const [LocationIndex, setLocationIndex] = useState(0);

  const [productId,setProductId] = useState ("");
  const [companyId, setCompanyId] = useState ("");
  const [cancelRide,setCancelRide] = useState("");
  const [requestRide,setRequestRide] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [refreshsidebar, setRefreshsidebar] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [conformationmodel, setConformationmodel] = useState(false);
  const [cancelnmodel, setcancelnmodel] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [Loading, setgobalLoading] = useState(false);
  const [drivermodal, setdrivermodal] = useState(false);

  const [ADSnmodel, setADSnmodel] = useState(false);
  // const [isRouteViewed, setIsRouteViewed] = useState(false);
  useFocusEffect(
  useCallback(() => {
    setKeyboardVisible(false);

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
  }, [])
);


   useEffect(() => {
    console.log("Received promo params:", {
      campaignId,
      discount,
      deepLink,
      expires,
      body,
      title
    });

    // Show modal for 5 seconds if campaign data is received
    if (promoData?.campaignId) {
      setADSnmodel(true);
      const timer = setTimeout(() => setADSnmodel(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [promoData]);

  const toggleSidemenu = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // State to track alert visibility
  const alertShownRef = useRef(false);
  const addressSetRef = useRef(false);
  const locationRef = useRef(false);
  const animateToRegionRef = useRef(false);
  const destinationRef = useRef(null);
  // const [origin, setOrigin] = useState(null);
  // const [destination, setDestination] = useState(null);
  // const [route, setRoute] = useState([]);

  // const mapRef = useRef(null);

  const handleSheetChanges = useCallback(() => {
    console.log('handleSheetChanges');
  }, []);

  useEffect(() => {
  alertShownRef.current = false; // Allow alert to show again on new visit
}, []);


  //romania
  const defaultLocation = {
    latitude: 45.9432,
    longitude: 24.9668,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };

  // //india
  // const defaultLocation = {
  //   latitude: 20.5937, 
  //   longitude: 78.9629, 
  //   latitudeDelta: 10.0,
  //   longitudeDelta: 10.0, 
  // };
  const [raidermodal, setRaidermodal] = useState(false);
  const slideAnim = useRef(new Animated.Value(800)).current;
  const [shouldFetchCards, setShouldFetchCards] = useState(false);
  const [showDriverIcon, setShowDriverIcon] = useState(false);

  const fetchcombined = async (ride) => {
  setSelectedRide(ride);
  setRaidermodal(true);
  startSpin?.();
  setgobalLoading(true);
  
  const selectedCompanyId = ride.companyId ? ride.companyId : "";
  const selectedProductId = ride.name ? ride.name : "";

  console.log(selectedCompanyId, "selectedCompanyId : 1");
  console.log(selectedProductId, "selectedProductId : 2");

  try {
    // startSpin?.();
    // setgobalLoading(true);
    const email = (await AsyncStorage.getItem("emailId"));
    const phoneNumber = (await AsyncStorage.getItem("phoneNumber"));
    // const hardcodedPhoneNumber = "+40756163006";

     const cardListResponse = await fetch(ENDPOINTS.CardList, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phoneNumber }), 
    });

    const cardListData = await cardListResponse.json();
    console.log("Card list response:", cardListData);
    
    // setgobalLoading(false);
    if (!Array.isArray(cardListData) || cardListData.length === 0) {
      setgobalLoading(false);
      RBbottomSheetRef.current?.open();
      setShouldFetchCards(true);
      setRaidermodal(false);
      setIsDestinationFocused(false);
      setIsOriginFocused(false);
      setSelectedRide([]);
      setRidesData([])
      setOriginalData([])
      handleClearOrigin()
      handleClearDestination()
      return; 
    } else {
      setShouldFetchCards(false);
    }

    console.log(
      "response in uber response combined-------",
      "email:", email,
      "phoneNumber:", phoneNumber,
      "pickup_lat:", origin.latitude,
      "pickup_long:", origin.longitude,
      "dropoff_lat:", destination.latitude,
      "dropoff_long:", destination.longitude,
      "productName:",selectedProductId,
      "companyId:",selectedCompanyId 
    );

    const response = await fetch(ENDPOINTS.combined, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        phoneNumber: phoneNumber,
        pickup_lat: origin.latitude,
        pickup_long: origin.longitude,
        dropoff_lat: destination.latitude,
        dropoff_long: destination.longitude,
        productName: selectedProductId,
        companyId: selectedCompanyId,
      }),
    });
      const data = await response.json();
      if (response.ok) {
      setLoading(false);
      setShowDriverIcon(true);
      setRequestRide(data);
      setCancelRide(data.urlRideForBackend || "");
      console.log("cancelRide:", data.urlRideForBackend);
      console.log("response in combined fetch:", data);
    } else {
      // Handle error response from server
      setRaidermodal(false);
      console.error("API responded with error:", data?.errorMessage || "Unknown error");
      ToastAndroid.show(data?.errorMessage || "Something went wrong", ToastAndroid.SHORT);
    }
  } catch (error) {
    // Handle network error or unexpected issues
    console.error("Error fetching combined data:", error.message || error);
    setRaidermodal(false);
    ToastAndroid.show("Unable to fetch ride data. Please try again.", ToastAndroid.SHORT);
    } finally {
      setgobalLoading(false);
      setUberLoading(false);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
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
  }

  

const handleCancelRide = async () => {
  try {
    startSpin?.();
    setgobalLoading(true);

    const email = await AsyncStorage.getItem("emailId");
    const phoneNumber = await AsyncStorage.getItem("phoneNumber");

    if (!email || !phoneNumber) {
      throw new Error("Missing required information to cancel the ride.");
    }

    console.log(
      "Sending cancel request —",
      "email:", email,
      "phoneNumber:", phoneNumber,
      "urlRideForBackend:", cancelRide,
    );

    const response = await fetch(ENDPOINTS.cancelRide, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phoneNumber,
        urlRideForBackend: cancelRide,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errorMessage || "Cancellation failed.");
    }
    setRaidermodal(true);

    console.log("Cancel ride response:", data);
    ToastAndroid.show(data.responseMessage || "Ride cancelled successfully", ToastAndroid.SHORT);

    setSelectedRide([]);
    closeRiderScreen()
  } catch (error) {
    console.error("Error cancelling ride:", error.message || error);
    ToastAndroid.show(error.message || "Failed to cancel ride", ToastAndroid.SHORT);
  } finally {
    setgobalLoading(false);
  }
};


const closeRiderScreen = () => {
  Animated.timing(slideAnim, {
    toValue: 800,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setRaidermodal(false);
    setdrivermodal(false);
  });
};


  const categories = [
    { label: "Fastest", SvgComponent: FastestImage, key: "Fastest" },
    { label: "Economy", SvgComponent: EconomyImage, key: "Economy" },
    { label: "Comfort", SvgComponent: ComfortImage, key: "Comfort" },
    { label: "Electric", SvgComponent: ElectricImage, key: "Electric" },
    { label: "Premium", SvgComponent: PremiumImage, key: "Premium" },
    { label: "Delivery", SvgComponent: DeliveryImage, key: "Delivery", subLabel: "Max 15 Kg" },
    { label: "Pet", SvgComponent: PetImage, key: "PET" },
    { label: "XL", SvgComponent: XlImage, key: "XL", subLabel: "Max 6 Pers." },
    { label: "Assist", SvgComponent: AssistImage, key: "Assist" },
    { label: "Women", SvgComponent: WomenImage, key: "Women" },

  ];

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
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) return;

    console.log('has permission');

    // Try low accuracy first
    const position = await getLocation(false);
    if (position?.coords) {
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
  } catch (lowAccuracyError) {
    console.warn("Low accuracy location fetch failed:", lowAccuracyError);
  }

  // Fallback to high accuracy if low fails
  try {
    const position = await getLocation(true);
    if (position?.coords) {
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
  } catch (highAccuracyError) {
    console.error("High accuracy location fetch failed:", highAccuracyError);
  }

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
};


  useEffect(() => {
    if (routeParamdata.params?.triggerLocationFetch) {
      getCurrentLocation(); // Call the function locally
    }
  }, [routeParamdata.params?.triggerLocationFetch]);

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


  // Check if location services are enabled and handle blue dot visibility
  const checkLocationServices = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setIsLocationEnabled(true);
        console.log('location is enabled with low accuracy');
        // console.log('Coords in check location services:', position.coords);
      },
      (error) => {
        // console.error("Low accuracy location check failed:", error);

        // If low accuracy fails, try again with high accuracy
        if (error.code === 2 || error.code === 3) {
          Geolocation.getCurrentPosition(
            (position) => {
              setIsLocationEnabled(true); // Location is enabled
              console.log('location is enabled with high accuracy');
              console.log('Coords:', position.coords);
            },
            (highAccuracyError) => {
              // console.error("High accuracy location check failed:", highAccuracyError);
              setIsLocationEnabled(false);
              // setLocation(null);
            },
            { enableHighAccuracy: true, timeout: 10000 } // High accuracy options
          );
        } else {
          setIsLocationEnabled(false);
          // setLocation(null);
        }
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
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

  // const fetchBoltData = async () => {
  //   setBoltLoading(true)
  //   try {
  //     const email = await AsyncStorage.getItem("emailId")
  //     const phoneNumber = await AsyncStorage.getItem('phoneNumber')
  //     console.log("eamil in sssssssssssssssssssssssssssssssstoasf", email)
  //     const response = await fetch(ENDPOINTS.getBoltProductList, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: email,
  //         phoneNumber: phoneNumber,
  //         pickup_lat: origin.latitude,
  //         pickup_long: origin.longitude,
  //         dropoff_lat: destination.latitude,
  //         dropoff_long: destination.longitude
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log("response in bolt", data);

  //     if (Array.isArray(data) && data.length > 0) {
  //       // If data is returned, stop loading
  //       setBoltLoading(false);
  //       setLoading(false);
  //     }

  //     // Add the provider identifier
  //     const formattedData = data.map((ride) => ({
  //       ...ride,
  //       provider: "Bolt",
  //     }));
  //     setRidesData((prevData) => [...prevData, ...formattedData]);
  //     setOriginalData((prevData) => [...prevData, ...formattedData]);

  //   } catch (error) {
  //     console.error("Error fetching Bolt data:", error);
  //     setBoltLoading(false);
  //   } finally {
  //     setBoltLoading(false)
  //   }
  // };


  const fetchBoltandUber = async () => { 
    setRidesData([])
    setOriginalData([])
  try {
  setRefreshKey(true)
  setBoltLoading(true)
    const email = await AsyncStorage.getItem("emailId");
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');

    const response = await fetch(ENDPOINTS.getBoltandUberList, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          email: email,
          phoneNumber: phoneNumber,
          pickup_lat: origin.latitude,
          pickup_long: origin.longitude,
          dropoff_lat: destination.latitude,
          dropoff_long: destination.longitude
        }),
    });

    const data = await response.json(); 

     console.log("response in uber respone-------", 
        "email:", email,
        "phoneNumber:", phoneNumber,
        "pickup_lat:", origin.latitude,
        "pickup_long:", origin.longitude,
        "dropoff_lat:", destination.latitude,
        "dropoff_long:", destination.longitude
      )

    console.log("API response:", data);

    const uberOptions = (data?.uberOptions || []).map((ride) => ({
      ...ride,
      provider: "Uber",
    }));

    const boltOptions = (data?.boltOptions || []).map((ride) => ({
      ...ride,
      provider: "Bolt",
    }));

    const allRides = [...uberOptions, ...boltOptions];
    if (allRides.length > 0) {
      setBoltLoading(false);
      setCompanyId(allRides[0].companyId);
      setProductId(allRides[0].name);
      setRidesData(allRides);
      setOriginalData(allRides);
    } else {
      console.warn("No rides returned from Uber or Bolt");
    }

  } catch (error) {
    console.error("Error fetching Uber and Bolt data:", error);
  } finally {
    setBoltLoading(false)
    setLoading(false);
  }
};

  // const fetchUberData = async () => {
  //   setUberLoading(true)
  //   try {
  //     const email = await AsyncStorage.getItem("emailId")
  //     const phoneNumber = await AsyncStorage.getItem('phoneNumber')
  //     const response = await fetch(ENDPOINTS.getUberProductList, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: email,
  //         phoneNumber: phoneNumber,
  //         // pickUpLocation: pickupLocation,
  //         // dropOffLocation: dropoffLocation,
  //         pickup_lat: origin.latitude,
  //         pickup_long: origin.longitude,
  //         dropoff_lat: destination.latitude,
  //         dropoff_long: destination.longitude
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log("response in uber respone-------", "email:", email,
  //       "phoneNumber:", phoneNumber,
  //       "pickup_lat:", origin.latitude,
  //       "pickup_long:", origin.longitude,

  //       "dropoff_lat:", destination.latitude,
  //       "dropoff_long:", destination.longitude
  //     )
  //     console.log("response in uber", data);
  //     if (Array.isArray(data) && data.length > 0) {
  //       // If data is returned, stop loading
  //       console.log("uber is returned success---------------------")
  //       setCompanyId(data[0].companyId);
  //       setProductId(data[0].name)
  //       console.log("name:", data[0].name);
  //       console.log("companyId:", data[0].companyId);
  //       setUberLoading(false);
  //       setLoading(false);
  //     }

  //     // Add the provider identifier
  //     const formattedData = data.map((ride) => ({
  //       ...ride,
  //       provider: "Uber",
  //     }));
  //     setRidesData((prevData) => [...prevData, ...formattedData]);
  //     setOriginalData((prevData) => [...prevData, ...formattedData]);

  //   } catch (error) {
  //     console.error("Error fetching Uber data:", error);
  //     setUberLoading(false); // Stop loading in case of error
  //   } finally {
  //     setUberLoading(false)
  //   }
  // };
  

  const fetchAllRideData = async () => {
    setLoading(true);
    setSelectedProviderFilter(null)
    setSelectedSortOption(null)
    // setSelectedCategories([])

    setRidesData([]); // Clear previous ride data
    setOriginalData([]); // Clear previous original data
    // Start fetching data from both APIs
    // fetchBoltData();
    // fetchUberData();
    fetchBoltandUber();

    // console.dir("APIDARA------", API);
    // const formattedData = API.map((ride) => ({
    //   ...ride,
    //   provider: "Uber",
    // }));

    // setRidesData((prevData) => [...prevData, ...formattedData]);
    // setOriginalData((prevData) => [...prevData, ...formattedData]);
    // Set a timeout for 20 seconds to stop loading if both fail
    setTimeout(() => {
      if (uberLoading || boltLoading) {
        console.log("Both APIs failed or took too long, stopping loading after 20 seconds");
        setLoading(false);
        setUberLoading(false);
        setBoltLoading(false);
      }
    }, 15000);
  };


  useEffect(() => {
    // Stop loading if either Uber or Bolt data is fetched
    if (!uberLoading && !boltLoading) {
      setLoading(false);
    }
  }, [uberLoading, boltLoading]);

  const reverseGeocode = async (latitude, longitude) => {
    const API_KEY = ENDPOINTS.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error("No address found");
    }
  };


  // Start watching location
  const startWatchingLocation = () => {
    watchId.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(currentLocation);
        setIsLocationEnabled(true);

        if (mapRef.current) {
          mapRef.current.animateToRegion(currentLocation, 1000);
        }
      },
      (error) => {
        console.error("Error watching location:", error);

        // If location services are off (code 2), handle the error
        if (error.code === 2) {
          setIsLocationEnabled(false);
          setLocation(null);
        }
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  };

  // Stop watching location when no longer needed
  const stopWatchingLocation = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const snapToRoad = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${latitude},${longitude}&key=${ENDPOINTS.GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.snappedPoints && data.snappedPoints.length > 0) {
        const snappedLocation = data.snappedPoints[0].location;
        return {
          latitude: snappedLocation.latitude,
          longitude: snappedLocation.longitude,
        };
      } else {
        console.error("No roads found for the given location.");
        return { latitude, longitude };
      }
    } catch (error) {
      console.error("Error snapping to road:", error);
      return { latitude, longitude };
    }
  };


  const searchLocation = async (query) => {
    if (!query) return;

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${ENDPOINTS.GOOGLE_API_KEY}`);
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setDestinationCoordinates({ latitude: lat, longitude: lng });

        // Update the map region to the searched location
        setLocation({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert('Error', 'Location not found.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch location.');
    }
  };

  // On Change text in the "Your Location" input field
  const handleLocationChange = (text) => {
    setSearchText(text);
    if (text.length > 3) {
      searchLocation(text);
    }
  };

  // Handle location selection from the map
  const handleMapSelect = () => {
    if (selectedField === 'origin') {
      setOrigin(tempLocation);
      setOriginInput(''); // Clear the input if selecting manually
    } else if (selectedField === 'destination') {
      setDestination(tempLocation);
      setDestinationInput(''); // Clear the input if selecting manually
    }
    setMapVisible(false);
  };

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;

    if (isSettingOrigin) {
      setOrigin(coordinate);
      console.log("Origin set:", coordinate);
    } else {
      setDestination(coordinate);
      console.log("Destination set:", coordinate);
    }

    // If both origin and destination are set, fetch the route
    if (origin && destination) {
      fetchRoute(origin, destination);
    }
  };

  const handleClear = () => {
    // Clear origin and destination
    setOrigin(null);
    setDestination(null);
    setRouteParamdata([]); // Clear the route as well
  };

  const fetchDirections = async (originCoords, destinationCoords) => {
    try {
      console.log("Fetching directions...");

      const originString = `${originCoords.latitude},${originCoords.longitude}`;
      const destinationString = `${destinationCoords.latitude},${destinationCoords.longitude}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${ENDPOINTS.GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        // console.log("Route points decoded:", decodedPoints);

        setRouteParamdata(decodedPoints);

        // Fit the route on the map
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(originString, {
            edgePadding: { top: 100, right: 40, bottom: 300, left: 40 },
            animated: true,
          });

          // Optionally adjust the camera to have the origin appear higher on the map
          const midLat = (originCoords.latitude + destinationCoords.latitude) / 2;
        const midLng = (originCoords.longitude + destinationCoords.longitude) / 2;

        mapRef.current.animateToRegion(
          {
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: Math.abs(originCoords.latitude - destinationCoords.latitude) * 1.5,
            longitudeDelta: Math.abs(originCoords.longitude - destinationCoords.longitude) * 1.5,
          },
          1000
        );
      }
    } else {
      console.error("No routes found:", data);
    }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };


  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };


  // Clear origin input
  const handleClearOrigin = () => {
    setOriginInput('');
    setOriginSuggestions([]);
    setOrigin(null);
    setRouteParamdata([]);
    setShowSuggestions(true)
     setRidesData([]);
    setOriginalData([]);
  };

  // Clear destination input
  const handleClearDestination = () => {
    setDestinationInput('');
    setDestinationSuggestions([]);
    setDestination(null);
    setRouteParamdata([]);
     setRidesData([]);
    setOriginalData([]);
  };

  const [nearbyTaxis, setNearbyTaxis] = useState([]);

  useEffect(() => {
    if (origin) {
      generateMockTaxis(origin);
    } else if (location) {
      generateMockTaxis(location);
    }
  }, [location, origin]);


  const generateMockTaxis = (referenceLocation) => {
    const { latitude, longitude } = referenceLocation;

    const mockTaxis = Array.from({ length: 8 }, (_, index) => {
      const randomOffsetLat = (Math.random() - 0.5) * 0.005; // Smaller random offset for closer grouping
      const randomOffsetLng = (Math.random() - 0.5) * 0.005; // Smaller random offset for closer grouping
      const randomBearing = Math.floor(Math.random() * 360); // Random bearing for rotation
      const taxiTypes = ['economy', 'premium', 'comfort', 'luxury', 'ceden'];
      const randomType = taxiTypes[Math.floor(Math.random() * taxiTypes.length)]; // Randomly assign a type

      return {
        id: index + 1,
        latitude: latitude + randomOffsetLat,
        longitude: longitude + randomOffsetLng,
        bearing: randomBearing,
        type: randomType,
      };
    });

    setNearbyTaxis(mockTaxis);
  };

  const snapPoints = useMemo(() => ["35%", "50%", "75%"], []);
  // const snapPoints = useMemo(() => {
  //   if (origin && destination) {
  //     return ["5%", "50%", "75%",];
  //   }
  //   else {
  //     return ["3.3%", "3.5%"];
  //   }
  // }, [origin, destination]);

  // const bottomSheetStyle = useMemo(() => {
  //   const hasData = ridesData && ridesData.length > 0;
  //   return {
  //     ...styles.contentContainer,
  //     // marginTop: origin && destination && hasData ? hp(30) : hp(0), 
  //   };
  // }, [origin, destination, ridesData]);


//   // const rideOptionsContainerStyle = useMemo(() => {
//     // const hasData = ridesData && ridesData.length > 0;
//     console.log("ridesdata", JSON.stringify(originalData, null,2))
//     const rideOptionsContainerStyle = {
//   ...styles.rideOptionsContainer1,
//   // marginBottom: origin && destination && hasData ? hp(4.5) : hp(0),
// };
//   // }, [origin, destination, ridesData]);

  const rideOptionsContainerStyle = useMemo(() => {
    const hasData = originalData && originalData.length > 0;
    console.log("ridesdata", JSON.stringify(originalData, null, 2));

    return {
      ...styles.rideOptionsContainer1,
      // marginBottom: origin && destination && hasData ? hp(4.5) : hp(0),
    };
  }, [origin, destination, originalData]);

  useEffect(() => {
    if (origin && destination) {
      // fetchRidesData(origin, destination);
      console.log("Fetching Origin for:", origin);
      console.log("Fetching Destination for:", destination);
      // setSheetIndex(1)
      fetchDirections(origin, destination);
      fetchAllRideData()
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setShowSuggestions(false);
      Keyboard.dismiss();
    } else {
      console.log('no origin & destination')
      // setSheetIndex(0)
      setRidesData([]);
      setOriginalData([])
    }
  }, [origin, destination]);

  useEffect(() => {
    if (originInput && destinationInput) {
      setSheetIndex(1)
    } else {
      setSheetIndex(0)
    }
  }, [originInput, destinationInput])

 const convertToMinutes = (timeStr) => {
  if (!timeStr || timeStr === "Busy") return Infinity;

  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
  
};
const [economySortDirection, setEconomySortDirection] = useState("asc");

const Price = (priceStr) => {
  return parseFloat(priceStr.replace(/[^\d.]/g, ""));
};

const convertEtaToMinutes = (eta) => {
  if (!eta || eta.toLowerCase().includes("busy")) return 999; // Fallback for "Busy"

  const match = eta.match(/\d+/);
  return match ? parseInt(match[0]) : 999;
};

 const applyFilters = () => {
  let filteredRides = [...originalData];

  const actualCategories = selectedCategories.filter(
    cat => cat !== "Fastest" && cat !== "Economy"
  );

  // Category Filter
  if (actualCategories.length > 0) {
    filteredRides = filteredRides.filter((ride) => {
      if (actualCategories.includes("Comfort") && ride.category === "Comfort") return true;
      if (actualCategories.includes("Electric") && ride.category === "Electric") return true;
      if (actualCategories.includes("Premium") && ride.category === "Premium") return true;
      if (actualCategories.includes("Delivery") && ride.category === "Delivery") return true;
      if (actualCategories.includes("PET") && ride.category === "Pet") return true;
      if (actualCategories.includes("XL") && ride.category === "XL") return true;
      if (actualCategories.includes("Assist") && ride.name === "Assist") return true;
      if (actualCategories.includes("Women") && ride.category === "Women") return true;
      return false;
    });
  }

  // Provider Filter
  if (selectedProviderFilter && selectedProviderFilter !== "all") {
    filteredRides = filteredRides.filter((ride) => ride.companyId === selectedProviderFilter);
  }

  // Manual Sort Option
  if (selectedSortOption === "Price") {
    filteredRides = filteredRides.sort((a, b) => Price(a.price) - Price(b.price));
  } else if (selectedSortOption === "Time") {
    filteredRides = filteredRides.sort((a, b) => normalizeEta(a.eta) - normalizeEta(b.eta));
  }

  // Fastest Sort
  if (selectedCategories.includes("Fastest")) {
    filteredRides = filteredRides
      .filter(ride => ride.eta && !ride.eta.toLowerCase().includes("busy"))
      .sort((a, b) => convertEtaToMinutes(a.eta) - convertEtaToMinutes(b.eta));
  }

  // Economy Sort if no selectedSortOption
  if (selectedCategories.includes("Economy") && !selectedSortOption) {
    filteredRides = filteredRides.sort((a, b) => {
      return economySortDirection === "asc"
        ? Price(a.price) - Price(b.price)
        : Price(b.price) - Price(a.price);
    });
  }

  // Auto sort by price for other categories if no manual sort
  if (
    !selectedSortOption &&
    !selectedCategories.includes("Economy") &&
    (
      selectedCategories.includes("Comfort") ||
      selectedCategories.includes("Electric") ||
      selectedCategories.includes("Premium") ||
      selectedCategories.includes("Delivery") ||
      selectedCategories.includes("PET") ||
      selectedCategories.includes("XL") ||
      selectedCategories.includes("Assist") ||
      selectedCategories.includes("Women") 
    )
  ) {
    filteredRides = filteredRides.sort((a, b) => Price(a.price) - Price(b.price)); // ascending
  }

if (
  !selectedSortOption &&
  selectedCategories.includes("Fastest") &&
  selectedCategories.some(cat =>
    ["Comfort", "Electric", "Premium", "Delivery", "PET", "XL", "Assist", "Women"].includes(cat)
  )
) {
  const etaSortCategories = ["COMFORT", "ELECTRIC", "PREMIUM", "DELIVERY", "PET", "XL", "ASSIST", "WOMEN"];
  const normalize = str => str?.toLowerCase()?.trim().toUpperCase();

  // Include all filteredRides that match ETA + selected category
  const matchedRides = filteredRides.filter(
    ride =>
      ride.eta &&
      (
        etaSortCategories.includes(normalize(ride.category)) ||
        etaSortCategories.includes(normalize(ride.name))
      )
  );

  // Sort non-busy by ETA DESC
  const nonBusy = matchedRides
    .filter(ride => !ride.eta.toLowerCase().includes("busy"))
    .sort((a, b) => convertEtaToMinutes(a.eta) - convertEtaToMinutes(b.eta)); 

 const busy = matchedRides.filter(ride =>
  ride.eta?.trim().toUpperCase().includes("busy")
);

  // Add them back together
  const sortedMatchedRides = [...nonBusy, ...busy];

  // Inject only sorted matched rides back into main filteredRides
  const unmatchedRides = filteredRides.filter(
    ride => !matchedRides.includes(ride)
  );

  filteredRides = [...sortedMatchedRides, ...unmatchedRides];
}

    setRidesData(filteredRides);
    // setOriginalData(filteredRides);
  };


  // Normalizing Functions for Sorting
  const normalizePrice = (price) => {
    if (price === "Select Time" || price === "Busy") {
      return Number.MAX_VALUE;
    }
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ""));
    return isNaN(numericPrice) ? Number.MAX_VALUE : numericPrice;
  };

  const normalizeEta = (eta) => {
    const etaNumber = parseInt(eta.match(/\d+/));
    return isNaN(etaNumber) ? Number.MAX_VALUE : etaNumber;
  };

  const handleSortChange = (selectedValue) => {
    setSelectedSortOption(selectedValue); // Just update the state
  };

  const handleProviderFilterChange = (selectedValue) => {
    setSelectedProviderFilter(selectedValue); // Just update the state
  };
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedProviderFilter, selectedSortOption]);


  const fetchSuggestions = async (input, setSuggestions, location) => {
    if (input.length < 1) return;

    try {
      setLoading(true)
      let userLocation = location;

      // Check if location is unavailable, and request it dynamically
      if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        const hasPermission = await requestLocationPermission();

        if (hasPermission) {
          // Fetch user's current location
          userLocation = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              (position) => resolve(position.coords),
              (error) => {
                console.error("Error fetching location:", error);
                resolve(null);
              },
              { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
          });
        }
      }

      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${ENDPOINTS.GOOGLE_API_KEY}&language=en`;

      // Append location and radius if location data is available
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        const { latitude, longitude } = userLocation;
        url += `&location=${latitude},${longitude}&radius=5000`;
      } else {
        console.log("Location is unavailable. Falling back to global suggestions.");
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false)
    }
  };


  const handleSelectSuggestion = async (
    placeId,
    setLocation,
    clearSuggestions,
    isOrigin,
    setInputValue
  ) => {
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${ENDPOINTS.GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.result) {
        const { lat, lng } = data.result.geometry.location;
        const coords = { latitude: lat, longitude: lng };
        const formattedAddress = data.result.formatted_address;
        const addressComponents = data.result.address_components;

        // console.log("Raw Address Components:", JSON.stringify(addressComponents, null, 2));

        const getAddressPart = (type) => {
          const component = addressComponents.find((comp) => comp.types.includes(type));
          return component ? component.long_name : "";
        };

        // **Extract Address Components with Global Support**
        let streetName = getAddressPart("route"); // Primary street name
        let streetNumber = getAddressPart("street_number"); // House number
        let city =
          getAddressPart("locality") ||
          getAddressPart("administrative_area_level_2") || // Some countries use this instead of locality
          getAddressPart("administrative_area_level_3"); // Backup for city
        let country = getAddressPart("country"); // Country

        // **Fallback for Street Name**
        if (!streetName) {
          streetName =
            getAddressPart("sublocality_level_1") ||
            getAddressPart("sublocality_level_2") ||
            getAddressPart("sublocality"); // Some countries use sublocality instead of a named street
        }

        // **Ignore Plus Codes**
        if (streetName.includes("+")) {
          streetName = ""; // Remove Plus Codes if mistakenly assigned
        }

        // **Final Address Formatting**
        let ApiFormatted = `${streetName} ${streetNumber}, ${city}, ${country}`.trim();
        ApiFormatted = ApiFormatted.replace(/^,|,$/g, ""); // Remove extra commas if any value is missing

        // console.log("Formatted Address:", ApiFormatted);
        
        // setLocation(coords);
        clearSuggestions([]);
        setInputValue(formattedAddress);

        saveToHistory({
          place_id: placeId,
          description: formattedAddress,
          coords: coords,
          apiFormatted: ApiFormatted
        });

        if (isOrigin) {
          setOrigin(coords);
          // setPickupLocation(ApiFormatted);
          console.log("Origin formatted address:", ApiFormatted);
        } else {
          setDestination(coords);
          // setDropoffLocation(ApiFormatted);
          console.log("Destination formatted address:", ApiFormatted);
        }
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const saveToHistory = async (place) => {
    try {
      const existing = await AsyncStorage.getItem('locationHistory');
      const parsed = existing ? JSON.parse(existing) : [];

      const updated = [place, ...parsed.filter(p => p.place_id !== place.place_id)].slice(0, 5);
      await AsyncStorage.setItem('locationHistory', JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving location history:", error);
    }
  };

  const loadHistory = async () => {
    const history = await AsyncStorage.getItem('locationHistory');
    if (history) {
      setLocationHistory(JSON.parse(history));
    }
  };

  //prevent edit account open issue
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setModalVisible(false);
      };
    }, [])
  );

  const navigateToNextScreen = () => {
    setModalVisible(false);
    navigation.navigate('editaccount');
  };

  const handleFocus = (inputType) => {
    setShowSuggestions(true);
    if (inputType === 'origin') {
      setIsOriginFocused(true);
      setIsDestinationFocused(false);
    } else {
      setIsDestinationFocused(true);
      setIsOriginFocused(false);
    }
  };

  const handleTouchOutside = () => {
    console.log('handleTouchOutside')
    setShowSuggestions(false);
    setIsOriginFocused(false);
    setIsDestinationFocused(false);
    Keyboard.dismiss();
  };

  const [showExitNotice, setShowExitNotice] = useState(false);
  const backPressTimeout = useRef(null);
  const backPressCount = useRef(0);

  // Function to reset the exit logic
  const resetExitLogic = () => {
    console.log('Interaction detected, resetting exit logic');
    if (backPressTimeout.current) {
      clearTimeout(backPressTimeout.current);
      backPressTimeout.current = null;
    }
    setShowExitNotice(false);
    backPressCount.current = 0;
  };

 useEffect(() => {
  if (route.params?.from === 'payment') {
    console.log("Returned from payment screen, resetting...");

    // Reset required states
    setRidesData([]);
    setOriginalData([]);
    setIsOriginFocused(false);
    setIsDestinationFocused(false);
    setSidebarVisible(false);
    setShowSuggestions(false);
    setRaidermodal(false);
    setSelectedCategories([]);
    handleClearOrigin(false);
    handleClearDestination(false);

    // Optional: remove param after handling
    route.params.from = null;
  }
}, [route.params?.from]);

// BackHandler logic scoped to Mapsearch only
useFocusEffect(
  useCallback(() => {
    const handleBackPress = () => {
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
        console.log("Keyboard dismissed");
        return true;
      }

      if (isOriginFocused || isDestinationFocused) {
        setRidesData([]);
        setOriginalData([]);
        setIsOriginFocused(false);
        setIsDestinationFocused(false);
        setSelectedCategories([]);
        return true;
      }

      if (originInput || destinationInput || isSidebarVisible) {
        setRidesData([]);
        setOriginalData([]);
        setIsOriginFocused(false);
        setSidebarVisible(false);
        setIsDestinationFocused(false);
        setShowSuggestions(false);
        handleClearOrigin(false);
        handleClearDestination(false);
        setRaidermodal(false);
        setSelectedCategories([]);
        Keyboard.dismiss();
        return true;
      }

      if (backPressCount.current === 2) {
        BackHandler.exitApp();
        return true;
      }

      backPressCount.current += 1;
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

      backPressTimeout.current = setTimeout(() => {
        backPressCount.current = 0;
      }, 2000);

      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
      if (backPressTimeout.current) {
        clearTimeout(backPressTimeout.current);
      }
    };
  }, [
    originInput,
    destinationInput,
    isOriginFocused,
    isDestinationFocused,
    isSidebarVisible,
    handleClearOrigin,
    handleClearDestination,
  ])
);

  const onHome = () => {
    console.log("Navigating to Mapsearch");  
    setSidebarVisible(false);  
    setIsOriginFocused(false);
    setIsDestinationFocused(false);
    // setOriginInput('');
    // setDestinationInput('');
    setShowSuggestions(false);
    Keyboard.dismiss();  
    navigation.navigate("Mapsearch");
  };

  // const fetchAllData = async () => {
  // try {
  //   setLoading(true);
  //   await Promise.all([fetchBoltandUber()]);
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  // } finally {
  //   // Minimum 1 second delay for spinner
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   setLoading(false);
  // }
// };


  const handleRefresh = async () => {
  console.log("handleRefresh");
  setRefreshing(true); // 👈 Start refreshing

  setRidesData([]); 
  setOriginalData([]);
  setLoading(true);
  setBoltLoading(true);
  setRefreshing(true);
  setRefreshsidebar(false);
  fetchBoltandUber();

  try {
    setSelectedCategories([]);
    setSelectedRide([]);

    if (!origin || !destination) {
      setRidesData([]); 
      setOriginalData([]);
      await new Promise(resolve => setTimeout(resolve, 15000));
      return;
    }

    setRefreshKey(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 15000));
  } catch (error) {
    console.error("Refresh error:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
    setUberLoading(false);
    setBoltLoading(false);
    setRefreshing(false); // 👈 Stop refreshing
  }
};



  const toggleSidebar = () => {
    console.log(' toggleSidebar is called')
    
    if (isOriginFocused || isDestinationFocused) {
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setRidesData([]);
      setOriginalData([]);
    }
    // Clear origin and destination input fields if populated
    if (originInput || destinationInput) {
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setShowSuggestions(false);
      handleClearOrigin(false);
      handleClearDestination(false);
      Keyboard.dismiss();
    }
    setSidebarVisible((prev) => !prev); 
   // Toggle sidebar visibility
  };

  const CustomHandle = () => {
    return (
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      console.log("route params is calling")
      console.log("route params", routeParams.params)
      if (routeParams.params?.selectedAddress && routeParams.params?.choosingFor) {
        const { selectedAddress, choosingFor, selectedLocation } = routeParams.params;

        if (choosingFor === 'origin') {
          setOriginInput(selectedAddress);
          setOrigin(selectedLocation)
        } else {
          setDestinationInput(selectedAddress);
          setDestination(selectedLocation)
        }

        // Optionally reset route params to prevent re-triggering
        navigation.setParams({
          selectedAddress: undefined,
          choosingFor: undefined,
        });
      }
    }, [routeParams.params])
  );


  const CategoryGrid = ({ categories, selectedCategories, handleCategoryChange }) => {
    return (
      <>
        {categories.map(({ key, label, subLabel }) => (
          <View key={key} style={styles.categoryItem}>
            {selectedCategories.includes(key) ? (
              <View style={styles.shadowWrapper}>
                <LinearGradient
                  colors={['#FF6200', '#4800AC']}
                  locations={[0, 0.5]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.outerBorder}
                >
                  <View style={styles.innerContentshowdow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.categoryOverlay}
                      onPress={() => handleCategoryChange(key)}
                    >
                      <SvgComponent width={35} height={35} />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.shadowWrapper}>
                <View style={styles.innerContent}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.categoryOverlay}
                    onPress={() => handleCategoryChange(key)}
                  >
                    <SvgComponent width={35} height={35} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
  
            <Text style={styles.categoryText}>{label}</Text>
            {subLabel && <Text style={styles.categorySubText}>{subLabel}</Text>}
          </View>
        ))}
      </>
    );
  };

useEffect(() => {
    Orientation.lockToPortrait(); // Lock only this screen to portrait

    return () => {
      Orientation.unlockAllOrientations(); // Restore when navigating away
    };
  }, []);

  useEffect(() => {
  if (ridesData.length > 0 && sheetIndex !== 1) {
    setSheetIndex(1);
  }
}, [ridesData]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={resetExitLogic} accessible={false}>
        <GestureHandlerRootView style={styles.container1}>
          <View style={StyleSheet.absoluteFill}>
            <MapView
              key={isLocationEnabled}
              ref={mapRef}
              provider='google'
              style={[StyleSheet.absoluteFill, styles.mapView]}
              initialRegion={defaultLocation}
              region={location || undefined}
              showsUserLocation={isLocationEnabled}
              showsMyLocationButton={false}
              showsCompass={false}
              // onPress={handleMapPress}
              customMapStyle={mapStyle}
              minZoomLevel={5}
              maxZoomLevel={30}
            >
              {/* {location && isLocationEnabled && (
                <Marker
                  coordinate={location}
                  anchor={{ x: 0.5, y: 0.5 }}
                  flat={true}
                >
                  <View>
                  <Octicons name="dot-fill" size={12} color="blue" />
                </View>
                  <View style={styles.customBlueDot}>
                    
                    <View style={styles.outerCircle} />
                    
                    <View style={styles.innerCircle} />
                  </View>
                </Marker>
              )} */}

              {(origin && destination) && (
                // <Marker coordinate={origin} title="Your Location" pinColor="#4CE5B1" />
                <Marker coordinate={origin}>
                  <View>
                    {/* <Text style={styles.markerText}>O</Text> */}
                    <FontAwesome6 name="circle-dot" size={23} color="white" style={styles.originLocationIcon} />
                  </View>
                </Marker>
              )}
              {(origin && destination) && (
                // <Marker coordinate={destination} title="Destination" pinColor="#EB963F" />
                <Marker coordinate={destination}>
                  <View >
                    {/* <FontAwesome6 name="location-dot" size={30} color="#FF6200" style={styles.destinationLocationIcon} /> */}
                    <View style={{ position: 'relative' }}><LocationOvalIcon /></View>
                    <View style={{ position: 'absolute', left: 10.5, top: 6 }}><LocationOvalDotIcon /></View>

                  </View>
                </Marker>
              )}

              {/* show nearby taxi */}
              {/* {(location || origin) && nearbyTaxis.length > 0 && nearbyTaxis.map((taxi) => {
                // Determine the image source and size based on taxi type
                let taxiImage, imageStyle;

                switch (taxi.type) {
                  case 'economy':
                    taxiImage = economy;
                    imageStyle = { width: 46, height: 30 };
                    break;
                  case 'premium':
                    taxiImage = premium;
                    imageStyle = { width: 46, height: 40 };
                    break;
                  case 'comfort':
                    taxiImage = comfort;
                    imageStyle = { width: 45, height: 38 };
                    break;
                  case 'luxury':
                    taxiImage = luxury;
                    imageStyle = { width: 55, height: 45 };
                    break;
                  case 'ceden':
                    taxiImage = ceden;
                    imageStyle = { width: 50, height: 45 };
                    break;
                  default:
                    taxiImage = economy;
                    imageStyle = { width: 40, height: 40 };
                }

                return (
                  <Marker
                    key={taxi.id}
                    coordinate={{
                      latitude: taxi.latitude,
                      longitude: taxi.longitude,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    flat={true}
                  >
                    <Image
                      source={taxiImage}
                      style={{
                        ...imageStyle,
                        resizeMode: 'contain',
                      }}
                    />
                  </Marker>
                );
              })} */}

              {routeParamdata.length > 0 && (
                <Polyline
                  coordinates={routeParamdata}
                  strokeWidth={5}
                  strokeColor="#F9731FE5"
                />
              )}
            </MapView>
            {LocationIndex <= 0 && (
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
              <MaterialIcons name="my-location" size={28} color="#D3770C" style={styles.customIcon} />
            </TouchableOpacity>
             )} 
          
            <View style={styles.toggleButtonContainer}>
              {/* <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: isSettingOrigin ? "#4CE5B1" : "#EB963F" },
              ]}
              onPress={() => setIsSettingOrigin(!isSettingOrigin)}
            >
              <Text style={styles.toggleButtonText}>
                {isSettingOrigin ? "Set Origin" : "Set Destination"}
              </Text>
            </TouchableOpacity> */}
            </View>

            {/* <View style={styles.clearButtonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View> */}
          </View>

          {/* Full-Screen Overlay */}
          {(isOriginFocused || isDestinationFocused) ? (
            <>
              <View style={[
                styles.fullScreenOverlay,
                
                {
                  zIndex: (isOriginFocused || isDestinationFocused) ? 100 : 0, // Dynamic zIndex
                },
              ]}
              >

                <View
                  style={[
                    styles.inputWrapper,
                  ]}
                >
                  <View style={styles.originInputBox}>
                    {/* Origin Input */}
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={[styles.gradientContainer, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                    >
                      <View style={[styles.textInputContainer, { width: wp(85) }]}>
                        <LocationIcon />
                        <TextInput
                          ref={inputRef}
                          style={styles.input}
                          placeholder="Your Location"
                          placeholderTextColor="rgba(252, 255, 255, 1)"
                          value={originInput}
                          selection={!isOriginFocused && { start: 0, end: 0 }}
                          onFocus={() => {
                            setIsOriginFocused(true);
                            setIsDestinationFocused(false);
                            setShowSuggestions(true);
                          }}
                          // editable={!isOriginFocused}
                          onChangeText={(text) => {
                            setOriginInput(text);
                            if (text.length > 0) {
                              fetchSuggestions(text, setOriginSuggestions, location);
                              setShowSuggestions(true);
                            } else {
                              setOriginSuggestions([]);
                            }
                          }}
                          onSubmitEditing={() => {
                            // When the "Enter" key is pressed, automatically select the first suggestion
                            if (originSuggestions.length > 0) {
                              const firstSuggestion = originSuggestions[0]; // Select the first suggestion for now
                              handleSelectSuggestion(
                                firstSuggestion.place_id,
                                setOriginInput,
                                setOriginSuggestions,
                                true,
                                setOriginInput
                              );
                              setShowSuggestions(false); // Hide the suggestions after selection
                              setIsOriginFocused(false);
                              setIsDestinationFocused(false);
                             Keyboard.dismiss()
                            }
                          }}
                          returnKeyType="done"
                        />
                        {originInput ? (
                          <TouchableOpacity onPress={handleClearOrigin}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </LinearGradient>
                  </View>

                  <View style={styles.destinationInputBox}>
                    {/* Destination Input */}
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={[styles.gradientContainer, { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                    >
                      <View
                        style={[
                          styles.textInputContainer, { width: wp(85) }
                          // originInput.length === 0 && { backgroundColor: '#172733' }, // Disabled style
                        ]}
                      >
                        <DestinationIcon />
                        <TextInput
                          ref={destinationRef}
                          style={styles.input}
                          placeholder="Destination"
                          // placeholderTextColor={originInput.length === 0 ? "#877878" : "#EB963F"}
                          placeholderTextColor="rgba(252, 255, 255, 1)"
                          value={destinationInput}
                          // selection={isDestinationFocused ?
                          //   { start: destinationInput.length, end: destinationInput.length } :
                          //   { start: 0, end: 0 }}
                          selection={!isDestinationFocused && { start: 0, end: 0 }}
                          onFocus={() => {
                            // if (originInput) { // Only allow focus if originInput is valid
                            setIsDestinationFocused(true);
                            setIsOriginFocused(false);
                            setShowSuggestions(true);
                            if (destinationSuggestions.length === 0) {
                              loadHistory();
                            }
                            // }
                          }}
                          onChangeText={(text) => {
                            setDestinationInput(text);
                            if (text.length > 0) {
                              fetchSuggestions(text, setDestinationSuggestions, location);
                            } else {
                              setDestinationSuggestions([]);
                            }
                          }}
                          onSubmitEditing={() => {
                            // When the "Enter" key is pressed, automatically select the first suggestion for destination
                            if (destinationSuggestions.length > 0) {
                              const firstSuggestion = destinationSuggestions[0]; // Select the first suggestion for now
                              handleSelectSuggestion(
                                firstSuggestion.place_id,
                                setDestinationInput,
                                setDestinationSuggestions,
                                false,
                                setDestinationInput
                              );
                              if (originInput.length > 0 && destinationInput.length > 0) {
                                handleTouchOutside();  // Optional: Hide the suggestions after selecting
                              }
                            }
                          }}
                          returnKeyType="done"
                        // editable={originInput.length > 0}
                        />
                        {destinationInput ? (
                          <TouchableOpacity onPress={handleClearDestination}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </LinearGradient>


                  </View>
                </View>
                <View>
                  <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: '#FCFFFF', fontSize: 18, marginTop: hp(2) }}>{isOriginFocused ? "Choose your origin!" : "Choose your destination!"}</Text>
                  {/* Current Location and Choose on map */}
                  {/* <View style={{ width: wp(100), alignItems: 'center', justifyContent: 'center', marginTop: hp(2) }}>
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={{ borderRadius: 50 }}
                    >
                      <TouchableOpacity
                        style={[styles.suggestionItem, styles.currentLocationSuggestion]}
                        // onPress={handleUseCurrentLocation}
                        onPress={() => {
                          // handleUseCurrentLocation();
                          alertShownRef.current = false;
                          addressSetRef.current = false;
                          getCurrentLocation();
                          setShowSuggestions(false); // Hide the suggestions
                        }}
                      >
                        <FontAwesome6
                          name="location-dot"
                          size={20}
                          color="#FFFFFF"
                          style={styles.currentLocationIcon}
                        />
                        <Text style={[styles.suggestionText, styles.currentLocationText]}>
                          Current Location
                        </Text>
                      </TouchableOpacity>

                    </LinearGradient>
                  </View> */}

                  {/* Choose on Map  */}
                  <View style={{ width: wp(100), alignItems: 'center', justifyContent: 'center', marginTop: hp(2) }}>
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={{ borderRadius: 50 }}
                    >
                      <TouchableOpacity
                        style={[styles.suggestionItem, styles.currentLocationSuggestion]}
                        onPress={() => {
                          navigation.navigate('ChooseOnMap', {
                            onFetchLocation: getCurrentLocation,
                            choosingFor: isOriginFocused ? "origin" : "destination",
                            setSidebarVisible:{setSidebarVisible},
                            initialRegion: {
                              latitude: location?.latitude || 45.9432,
                              longitude: location?.longitude || 24.9668,
                              latitudeDelta: 0.01,
                              longitudeDelta: 0.01,
                            },
                            
                          });
                        }}
                      >
                        <ChooseOnMapIcon />
                        <Text style={[styles.suggestionText, styles.currentLocationText]}>
                          Choose on map
                        </Text>
                      </TouchableOpacity>

                    </LinearGradient>
                  </View>

                </View>
                {(originSuggestions.length > 0 || destinationSuggestions.length > 0 || locationHistory.length > 0) && (
                  <LinearGradient
                    colors={['#FF6200', '#4800AC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.separatorline} />
                )}

                <View>

                  {/* Search History */}
                  {((isOriginFocused && showSuggestions && originSuggestions.length === 0) ||
                    (isDestinationFocused && showSuggestions && destinationSuggestions.length === 0)) &&
                    locationHistory.length > 0 && (
                      <View>
                        <FlatList
                          data={locationHistory}
                          keyExtractor={(item, index) => item.place_id || `history-${index}`}
                          renderItem={({ item }) => {
                            const [heading, ...rest] = item.description.split(", ");
                            const subtext = rest.join(", ");

                            return (
                              <>
                                <TouchableOpacity
                                  style={styles.suggestionItem}
                                  onPress={() => {
                                    handleSelectSuggestion(
                                      item.place_id,
                                      isOriginFocused ? setOriginInput : setDestinationInput,
                                      isOriginFocused ? setOriginSuggestions : setDestinationSuggestions,
                                      isOriginFocused,
                                      isOriginFocused ? setOriginInput : setDestinationInput
                                    );
                                    setShowSuggestions(false);
                                  }}
                                >
                                  <View style={styles.suggestionRow}>
                                    <View style={styles.searchLocationIcon}>
                                      <SearchHistoryIcon />
                                    </View>
                                    <View style={styles.textContainer}>
                                      <Text numberOfLines={0} style={styles.headingText}>{heading}</Text>
                                      {subtext && (
                                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subtext}>
                                          {subtext}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                <LinearGradient
                                  colors={['#FF6200', '#4800AC']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={styles.separator} />
                              </>
                            );
                          }}
                          style={styles.originListView}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={true}
                          scrollEnabled={true}
                        />
                      </View>
                    )}


                  {/* Origin Suggestions */}
                  {isOriginFocused && showSuggestions && (
                    <FlatList
                      data={originSuggestions}
                      refreshing={refreshing} 
                      key={refreshKey}
                      keyExtractor={(item, index) => item.place_id || `current-location-${index}`}
                      renderItem={({ item }) => {

                        const [heading, ...rest] = item.description.split(", ");
                        const subtext = rest.join(", ");
                        return (
                          <>
                            <TouchableOpacity
                              style={styles.suggestionItem}
                              onPress={() => {
                                handleSelectSuggestion(
                                  item.place_id,
                                  setOriginInput,
                                  setOriginSuggestions,
                                  true,
                                  setOriginInput
                                );
                                setShowSuggestions(false);
                              }}
                            >
                              <View style={styles.suggestionRow}>
                                <View style={styles.searchLocationIcon}>
                                  <SearchLocationIcon />
                                </View>
                                <View style={styles.textContainer}>
                                  <Text numberOfLines={0} style={styles.headingText}>{heading}</Text>
                                  {subtext && (
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subtext}>
                                      {subtext}
                                    </Text>
                                  )}

                                </View>
                              </View>
                            </TouchableOpacity>
                            <LinearGradient
                              colors={['#FF6200', '#4800AC']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.separator} />
                          </>
                        );
                      }}
                      style={styles.originListView}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}

                  {/* Destination Suggestions */}
                  {isDestinationFocused && showSuggestions && (
                    <FlatList
                      data={destinationSuggestions}
                      keyExtractor={(item) => item.place_id}
                      renderItem={({ item }) => {
                        // Process description to split into heading and subtext
                        const [heading, ...rest] = item.description.split(", ");
                        const subtext = rest.join(", ");

                        return (
                          <>
                            <TouchableOpacity
                              style={styles.suggestionItem}
                              onPress={() => {
                                handleSelectSuggestion(
                                  item.place_id,
                                  setDestinationInput,
                                  setDestinationSuggestions,
                                  false,
                                  setDestinationInput
                                );
                                if (originInput.length > 0 && destinationInput.length > 0) {
                                  handleTouchOutside(); // Optional: Hide the suggestions after selecting
                                }
                              }}
                            >
                              <View style={styles.suggestionRow}>
                                <View style={styles.searchLocationIcon}>
                                  <SearchLocationIcon />
                                </View>
                                <View style={styles.textContainer}>
                                  <Text style={styles.headingText}>{heading}</Text>
                                  {subtext && (
                                    <Text numberOfLines={0} ellipsizeMode="tail" style={styles.subtext}>
                                      {subtext}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </TouchableOpacity>
                            <LinearGradient
                              colors={['#FF6200', '#4800AC']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.separator} />
                          </>
                        );
                      }}
                      style={styles.originListView}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}
                </View>
              </View>


            </>
          ) : (
            <>
              <MySidebar isMenuVisible={isSidebarVisible} setMenuVisible={setSidebarVisible} onMyAccountPress={toggleModal}/>
              <Image source={klassride} style={styles.TopLogo} />
              <View style={[styles.inputHead, {
                zIndex: (isOriginFocused || isDestinationFocused) ? 100 : 95, // Dynamic zIndex
              },]}>
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
                    {!isOriginFocused ? (
                      <TouchableOpacity
                      onPress={() => {
                        setIsOriginFocused(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                      }}
                      style={styles.input}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.textEllipsis}
                      >
                        {originInput || "Your Location"}
                      </Text>
                    </TouchableOpacity>
                    ):(
                     <>
                      <TextInput
                      ref={inputRef}
                      style={styles.input}
                      placeholder="Your Location"
                      placeholderTextColor="rgba(252, 255, 255, 1)"
                      value={originInput}
                      selection={!isOriginFocused && { start: 0, end: 0 }}
                      onFocus={() => {
                        setIsOriginFocused(true);
                        setIsDestinationFocused(false);
                        setShowSuggestions(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                        if (originSuggestions.length === 0) {
                          loadHistory();
                        }
                      }}
                      onChangeText={(text) => {
                        setOriginInput(text);
                        if (text.length > 0) {
                          fetchSuggestions(text, setOriginSuggestions, location);
                          setShowSuggestions(true);
                        } else {
                          setOriginSuggestions([]);
                        }
                      }}
                      onSubmitEditing={() => {
                        // When the "Enter" key is pressed, automatically select the first suggestion
                        if (originSuggestions.length > 0) {
                          const firstSuggestion = originSuggestions[0]; // Select the first suggestion for now
                          handleSelectSuggestion(
                            firstSuggestion.place_id,
                            setOriginInput,
                            setOriginSuggestions,
                            true,
                            setOriginInput
                          );
                          setShowSuggestions(false);
                          setIsOriginFocused(false);
                          setIsDestinationFocused(false);
                        }
                      }}
                      returnKeyType="done"
                    />
                    {originInput ? (
                      <TouchableOpacity onPress={handleClearOrigin}>
                        <Icon name="close-circle" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    ) : null}
                    </>
                    )}
                    
                    
                  </View>
                </LinearGradient>

              </View>
              <BottomSheet
                ref={bottomSheetRef}
                index={sheetIndex}
                snapPoints={snapPoints}
                handleComponent={CustomHandle}
                // enablePanDownToClose={true}
                enableDynamicSizing={false}
                enableContentPanningGesture={true}
                enableHandlePanningGesture={true}
                backgroundStyle={{ backgroundColor: 'transparent' }}
                onChange={(index) => setLocationIndex(index)}
                backgroundComponent={({ style }) => (
                  <View style={[style, styles.blurWrapper]}>
                    {/* <BlurView
                      style={StyleSheet.absoluteFill}
                      // blurType="dark"
                      // blurAmount={10}
                      intensity={10}
                      tint="dark"
                    // reducedTransparencyFallbackColor="black"
                    /> */}
                  </View>
                )}
              // style={styles.bottomSheetContainer}
              >
                <View style={styles.bottomSheetContainer}>
                  {/* Destination Input */}
                  <View style={{ width: wp(100), alignItems: 'center' }}>
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={styles.gradientContainer}
                    >
                      <View
                        style={[
                          styles.textInputContainer
                          // originInput.length === 0 && { backgroundColor: '#172733' }, // Disabled style
                        ]}
                      >
                        <DestinationIcon />
                        {!isDestinationFocused ? (
                          <TouchableOpacity
                          onPress={() => {
                            setIsDestinationFocused(true);
                            setTimeout(() => destinationRef.current?.focus(), 100);
                          }}
                          style={styles.input}
                        >
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.textEllipsis}
                          >
                            {destinationInput || "Destination"}
                          </Text>
                        </TouchableOpacity>
                        ):(
                           <>
                           <TextInput
                           ref={destinationRef}
                           style={styles.input}
                           placeholder="Destination"
                           // placeholderTextColor={originInput.length === 0 ? "#877878" : "#EB963F"}
                           placeholderTextColor="rgba(252, 255, 255, 1)"
                           value={destinationInput}
                           // selection={isDestinationFocused ?
                           //   { start: destinationInput.length, end: destinationInput.length } :
                           //   { start: 0, end: 0 }}
                           selection={!isDestinationFocused && { start: 0, end: 0 }}
                           onFocus={() => {
                             // if (originInput) { // Only allow focus if originInput is valid
                             setIsDestinationFocused(true);
                             setIsOriginFocused(false);
                             setShowSuggestions(true);
                             setTimeout(() => destinationRef.current?.focus(), 100);
                             if (destinationSuggestions.length === 0) {
                               loadHistory();
                             }
                             // }
                           }}
                           onChangeText={(text) => {
                             setDestinationInput(text);
                             if (text.length > 0) {
                               fetchSuggestions(text, setDestinationSuggestions, location);
                             } else {
                               setDestinationSuggestions([]);
                             }
                           }}
                           onSubmitEditing={() => {
                             // When the "Enter" key is pressed, automatically select the first suggestion for destination
                             if (destinationSuggestions.length > 0) {
                               const firstSuggestion = destinationSuggestions[0]; // Select the first suggestion for now
                               handleSelectSuggestion(
                                 firstSuggestion.place_id,
                                 setDestinationInput,
                                 setDestinationSuggestions,
                                 false,
                                 setDestinationInput
                               );
                               if (originInput.length > 0 && destinationInput.length > 0) {
                                 handleTouchOutside();  // Optional: Hide the suggestions after selecting
                               }
                             }
                           }}
                           returnKeyType="done"
                         // editable={originInput.length > 0}
                         />
                         {destinationInput ? (
                          <TouchableOpacity onPress={handleClearDestination}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        ) : null}</>
                        )}
                       
                        
                      </View>
                    </LinearGradient>

                    {/* category section */}
                    <NativeViewGestureHandler disallowInterruption={true} waitFor={bottomSheetRef}>
                      <ScrollView style={{ height: 'auto', marginTop: hp(1.3) }}
                        key={refreshKey}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        decelerationRate="fast"
                        snapToAlignment="center"
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.categoryTab}
                        keyboardShouldPersistTaps="handled"
                       
                      >
                        {categories.map(({ label, SvgComponent, key, subLabel }) => (
                          <View key={`${key}-${refreshKey}`} style={styles.categoryItem} >
                          {selectedCategories.includes(key) ? (
                            <View style={styles.shadowWrapper}  >
                              <LinearGradient
                                colors={['#FF6200', '#4800AC']}
                                locations={[0, 0.5]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.outerBorder}
                              >
                                <View style={styles.innerContentshowdow}>
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.categoryOverlay}
                                    onPress={() => handleCategoryChange(key)}
                                  >
                                    <SvgComponent width={35} height={35} />
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </View>
                          ) : (
                            <View style={styles.shadowWrapper}>
                              <View style={styles.innerContent}>
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  style={styles.categoryOverlay}
                                  onPress={() => handleCategoryChange(key)}
                                >
                                  <SvgComponent width={35} height={35} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        
                          <Text style={styles.categoryText}>{label}</Text>
                          {subLabel && <Text style={styles.categorySubText}>{subLabel}</Text>}
                        </View>
                        ))}
                      </ScrollView >
                    </NativeViewGestureHandler>

                  </View>

                  {/* Riders data */}
                  <BottomSheetScrollView
                    style={[{ padding: 0 }, rideOptionsContainerStyle]}
                    key={refreshKey}
                    showsVerticalScrollIndicator={false}
                  >
                    {loading ? (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                      </View>
                    ) : originInput.trim() && destinationInput.trim() ? (
                      ridesData.length > 0 ? (
                        ridesData.map((ride, index) => {
                          const isSelected = selectedRide?.name === ride.name;

                          return (
                            <View key={`${ride.name}-${ride.category}-${index}`} style={{ width: wp(95) }}>
                              <LinearGradient
                                colors={['#FF6200', '#4800AC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                  styles.gradientBorder,
                                  isSelected && styles.selectedGradientBorder,
                                ]}
                              >
                                <View
                                  style={[
                                    styles.innerRideContainer,
                                    isSelected && styles.selectedCard,
                                  ]}
                                >
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.rideOption}
                                    onPress={() => {
                                      setSelectedRide(ride);
                                      setConformationmodel(ride);
                                    }}
                                  >
                                    {ride.imageUrl && (
                                      <Image
                                        source={{ uri: ride.imageUrl }}
                                        style={styles.rideImage1}
                                      />
                                    )}

                                    <View style={styles.rideParent}>
                                      <View style={styles.nameContainer}>
                                        <Text style={styles.rideDrop}>{ride.name}</Text>
                                        <Text style={styles.capacityText}>
                                          {ride.category ? `(${ride.category})` : ''}
                                        </Text>
                                        <View style={styles.capacitycontainer}>
                                          <Text style={styles.capacityText}>{ride.eta}</Text>
                                          {ride.dropoffTime && (
                                            <Text style={styles.capacityText}>
                                              Drop by {ride.dropoffTime}
                                            </Text>
                                          )}
                                        </View>
                                      </View>

                                      <View style={styles.rideInfo}>
                                        <View style={styles.ridePriceContainer}>
                                          <Text style={styles.rideCurrency}>
                                            {ride.price ? ride.price.split(' ')[0] : 'NA'}
                                          </Text>
                                          <Text style={styles.rideAmount}>
                                            {ride.price ? ride.price.split(' ')[1] : 'NA'}
                                          </Text>
                                        </View>

                                        {ride.provider === 'Uber' ? <UberIcon /> : <BoltIcon />}
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </View>
                          );
                        })
                      ) : (
                        <View style={styles.noDataContainer}>
                          <Text style={styles.noDataText}>No rides available</Text>
                        </View>
                      )
                    ) : null}
                  </BottomSheetScrollView>
                </View>

              </BottomSheet>
            </>
          )}
          {/* <MySidebar isMenuVisible={isSidebarVisible} setMenuVisible={setSidebarVisible} /> */}

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {isSidebarVisible && <MyAccount onAccountPress={toggleModal} />}
                <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>
                    Back
                  </Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={['#FF6200', '#4800AC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.separatorbottom} />
                <View style={styles.Imagelay}>
                  <Image source={klassride} style={styles.logo} />
                </View>

              </View>
            </View>
          </Modal>
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
      {/* <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.categoryOverlay}
        onPress={handlerider}
      >
        <Text style={styles.buttonText}>Show Rider Modal</Text>
      </TouchableOpacity> */}

      {/* Pass modal visibility state to RiderScreen */}
      {conformationmodel && (
        <Modal
          transparent={true}
          visible={!!conformationmodel}
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
                Are you sure you want to Booking this vehicle {conformationmodel?.name}?
              </Text>

              {conformationmodel.imageUrl && (
                <Image
                  source={{ uri: conformationmodel.imageUrl }}
                  style={styles.rideImage2}
                />
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() => {
                    setConformationmodel(null)
                    setSelectedRide([]);
                  }}
                >
                  <Text style={styles.noButtonText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={() => {
                    fetchcombined(conformationmodel); 
                    setConformationmodel(null); 
                  }}
                >
                  <Text style={styles.yesButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      )}

 {cancelnmodel && (
      <Modal
          transparent={true}
          visible={!!cancelnmodel}
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
                Are you sure you want to Cancel this Ride?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() => {
                    setcancelnmodel(null)
                    // setSelectedRide([]);
                  }}
                >
                  <Text style={styles.noButtonText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={() => {
                    handleCancelRide(cancelRide); 
                    setcancelnmodel(null); 
                  }}
                >
                  <Text style={styles.yesButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
 )}
      {/* <View>

        <TouchableOpacity onPress={() => setRaidermodal(true)}>
          <Icon name="person" size={30} color="#000" />
        </TouchableOpacity> */}

      {raidermodal && (
        <GestureHandlerRootView style={styles.fullScreen}>
          <TapGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === 5) { // Tap detected
                closeRiderScreen();
              }
            }}
          >
            <View style={styles.overlay} />
          </TapGestureHandler>

          <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Riderscreen   closeRiderScreen={() => {setcancelnmodel(true)}} SelectedRide={selectedRide} Requestdata={requestRide}/>
          </Animated.View>
        </GestureHandlerRootView>
      )}

      {Loading && (
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

      <Modal
          transparent={true}
          visible={!!ADSnmodel}
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
               {title}
              </Text>
              <Text style={styles.modalTitle}>{body}</Text>

            </LinearGradient>
          </View>
        </Modal>

      {/* {showDriverIcon && !raidermodal && (
        <TouchableOpacity
          style={styles.driverIconButton}
          onPress={() => {
            setdrivermodal(true);       
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }}
        >
          <Text style={styles.driverIconText}>👤</Text>
        </TouchableOpacity>
      )} */}

    {/* {drivermodal && (
      <GestureHandlerRootView style={styles.fullScreen}>
        <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === 5) {
          closeRiderScreen();
        }
      }}
    >
      <View style={styles.overlay} />
    </TapGestureHandler>
  <Animated.View
    style={[
      styles.animatedContainer,
      {
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
{selectedRide.length > 0 ? (
  selectedRide.map((ride, index) => (
    <View key={index} style={styles.driverInfo}>
      <View style={styles.drivername}>
        <Image source={profile} style={styles.profile} />
        <Text style={styles.driverText}>
          {ride?.driverName || 'Hermon Solution'}
        </Text>
      </View>

      <View style={styles.carDetails}>
        <View style={styles.leftAlign}>
          <Text style={styles.cartext}>Bolt (premium)</Text>
          <Text style={styles.carnum}>
            {ride?.carDetailsBlock || 'B-543 FEX'}
          </Text>
        </View>
        <View style={styles.rightAlign}>
          <Text style={styles.cartime}>Arriving in</Text>
          <Text style={styles.carestimation}>
            {ride?.eta || '7 min.'}
          </Text>
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
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={closeRiderScreen}
            >
              <View style={styles.buttoncotainer}>
                <EvilIcons
                  name="close"
                  size={18}
                  color="#FFFFFF"
                  style={styles.cancelicon}
                />
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
              // onPress={() => {
              //   setIsPaymentRequired(true);
              //   setIsRouteViewed(false);
              // }}
            >
              <Feather
                name="phone-call"
                size={30}
                color="#FFFFFF"
                style={styles.phoneicon}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  ))
) : null}

  </Animated.View>
  </GestureHandlerRootView>
)} */}


        <RBSheet
                  ref={RBbottomSheetRef}
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
                  <View key={refreshKey} style={styles.RBbottomSheetContainer}>
                    <TouchableOpacity style={styles.bottomSheetHandle} onPress={() => bottomSheetRef.current.close()}/>
                    <ScrollView>
                      <Payment  setLoading={setIsLoading} startSpin={startSpin}  shouldFetchCards={shouldFetchCards} />
                    </ScrollView>
                    <View style={styles.footer}>
                      <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.backTopLine} />
                      <TouchableOpacity onPress={() => RBbottomSheetRef.current.close()}>
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
      
      {/* </View> */}
    {!isKeyboardVisible && !isSidebarVisible && (
        <FooterMenu 
          onAccountPress={toggleSidebar} 
          onHome={onHome} 
          onRefreshPress={handleRefresh} 
          isRefreshing={refreshing}
        />
      )}
 </SafeAreaView>
  );
}


const styles = StyleSheet.create({
   portrait: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddeeff',
  },
  landscape: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffeedd',
  },
  container: {
    flex: 1,
    // backgroundColor: "#121212",
    alignItems: 'center',
    width: wp(100),
  },
  separatorbottom: {
    height: 1,
    width: '70%',
    alignSelf: 'center',
    marginVertical: 5,
    // marginTop:hp(5)
  },
  mapView: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    // display: 'none'
  },
  fullscreenMapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    ...StyleSheet.absoluteFillObject,
    width: wp(100),
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    width: wp(100),
    borderTopStartRadius: 15,
    borderTopRightRadius: 15,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    width: wp(100),
    backgroundColor: "rgba(8, 18, 45, 0.7)",
    // backgroundColor: 'red',
    // zIndex: 95,
  },
  inputWrapper: {
    marginTop: hp(3),
    gap: 10,
  },
  originInputBox: {
    width: wp(100),
    alignItems: 'flex-start'
  },

  destinationInputBox: {
    width: wp(100),
    alignItems: 'flex-end'
  },

  backButton: {
    position: 'absolute',
    top: hp(3),
    left: wp(5),
    // padding: 10
    // zIndex: 1000
  },
  backButtonText: {
    fontSize: 18,
    color: '#EB963F',
    fontWeight: 'bold',
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: '#22272B',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: hp(1),
    shadowColor: '#000',
    elevation: 8,
    width: wp(70),
    height: hp(5),
    paddingHorizontal: wp(2),
    marginTop: hp(2.5),
    marginLeft: wp(10),
    backgroundColor: "blue",

  },
  inputContainer1: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#22272B',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: hp(1),
    shadowColor: '#000',
    elevation: 8,
    width: wp(70),
    height: hp(5),
    paddingHorizontal: wp(2),
    marginLeft: wp(10)
  },
  inputsearch: {
    flex: 1,
    paddingVertical: hp(1),
    fontSize: wp(3.5),
    color: "white",
  },
  blurWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(25, 25, 58, 0.6)'
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    width: wp(100),
    overflow: 'hidden'
  },
  handle: {
    width: wp(30),
    height: 3,
    backgroundColor: "#E2E7FF",
    borderRadius: 10,
  },
  categoryTab: {
    paddingHorizontal: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5, // space between each item
    justifyContent: 'flex-start',
    height: 100
  },

  shadowWrapper: {
    shadowColor: "rgba(255, 98, 0, 1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    // elevation: 10,
    
  },

  outerBorder:{
    borderRadius: 50,
    padding:1,
    // shadowColor: "rgba(255, 98, 0, 1)",
    // shadowOffset: { width: 10, height: 0 },
    // shadowOpacity: 0.9,
    // shadowRadius: 15,
    // elevation: 10,
  },
  
  innerContentshowdow: {
    backgroundColor: '#000', // or any background
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "rgba(255, 98, 0, 1)",
    shadowOffset: { width: -10, height: -16 },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 20,
  },
  
  innerContent: {
    backgroundColor: '#000', // or any background
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(17, 50, 132, 0.7)",
    borderRadius: 50,
    // elevation: 3,
    width: 60,
    height: 60,
  },

  activeCategory: {
    borderLeftColor: "#FF6200",
    borderLeftWidth: 1,
    borderTopColor: "#FF6200",
    borderTopWidth: 1.5,
    borderRightWidth: 1,
    borderRightColor: "#4800AC",  // Corrected: added #
    borderBottomColor: "#4800AC", // Corrected: added #
  //  borderBottomWidth: 1,
    shadowColor: '#FF6200',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 15,
  },
  

  categoryImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },

  categoryText: {
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Montserrat-Medium"
  },
  categorySubText: {
    fontSize: 9,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Montserrat-Medium"
  },
  loadingOverlay: {
    position: "absolute",
    top: hp(10),
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  gradientBorder: {
    padding: 1, // thickness of border
    paddingLeft: 0,
    borderTopRightRadius: 38,
    borderBottomRightRadius: 38,
    marginBottom: wp(5),
    zIndex: 99,
    // width: wp(95.1)
  },
  selectedGradientBorder: {
    transform: [{ translateX: 20 }],
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    paddingLeft: 1,
    // width: wp(100)
  },
  rideOptionsContainer1: {
    marginTop: hp(1),
    width: wp(100),
    // paddingRight: wp(5),
    // alignItems:'center',
    flexDirection: 'column',
    marginBottom: hp(7)

  },
  innerRideContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopRightRadius: 38,
    borderBottomRightRadius: 38,
    overflow: 'hidden',
    zIndex: 99,
    // width: wp(95)
  },
  rideOption: {
    flexDirection: "row",
  },
  selectedCard: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  rideImage1: {
    width: wp(16),
    height: hp(7),
    borderRadius: 5,
    resizeMode: "contain",
  },
  rideImage2: {
    width: wp(18),
    height: hp(8),
    borderRadius: 5,
    resizeMode: "contain",
  },
  rideParent: {
    flex: 1,
    flexDirection: 'row',
    // paddingHorizontal: 10,
    justifyContent: 'space-between',
    // width: wp(50),
    // backgroundColor:'yellow'
    padding: 8,
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection:"row",
    alignItems: 'center',
    gap: wp(1),
    maxWidth: 150, 
    flexWrap: 'wrap',

  },
  capacitycontainer:{
    flexDirection:"row",
    maxWidth: 150, 
    justifyContent: 'space-between',
     gap: wp(1),
  },
  capacityText: {
    fontSize: 13,
    fontWeight: "bold",
    color: '#ffffff',
    flexShrink: 0,
  },
  rideInBy: {
    flex: 1,
    flexDirection: 'row',
    gap: wp(3)
    // justifyContent: 'space-evenly',
  },
  rideDrop: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
    flexShrink: 1,
  },

  ridetime: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },

  rideInfo: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    // justifyContent: "flex-end",
    // backgroundColor:'red',
    // width: wp(50),
    paddingHorizontal: wp(6),
    gap: 3,
    maxWidth: 100, 
    marginRight:wp(2)
  },

  ridePriceContainer: {
  alignItems: 'center',
},

rideCurrency: {
  fontFamily: "Montserrat-Medium",
  color: '#FFFFFF',
  fontSize: 13,
},

rideAmount: {
  fontFamily: "Montserrat-Medium",
  color: '#FFFFFF',
},

  rideType: {
    color: "#FFFFFF",
    fontSize: 12,
    marginBottom: 4,
  },

  // ridePrice: {
  //   color: "#FFFFFF",
  //   // fontSize: 18,
  //   fontFamily: "Montserrat-Medium",
  // },

  cedenrideImage: {
    width: wp(17),
    height: hp(5)
  },
  cedenridetime: {
    color: "#ffff",
    fontSize: 12,
    // fontWeight:"bold",
    marginBottom: hp(-1),
    marginLeft: wp(-11),
    // justifyContent: "flex-end"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(90),
    height: hp(64),
    marginLeft: wp(1),
    marginTop: hp(-25),
  },
  closeButtonText: {
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeButton: {
    color: "white",
    alignItems: "center",
    alignSelf: "center"
  },
  icon: {
    marginLeft: 5,
    color: "white",
    backgroundColor: "#ff991f"
  },
  searchBackIcon: {
    // marginLeft: wp(1),
    color: "#CBC0C0",
    backgroundColor: "#D3770C",
    padding: 3,
    borderRadius: 8,
    // top: hp(1),
    // right: 3,
  },
  Imagelay: {
    // marginBottom: hp(20),
    alignItems: "center",
    resizeMode: "contain",
  },
  TopLogo: {
    marginTop: hp(1.5),
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
    // zIndex: 99
  },
  logo: {
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
  },
  rideLogo: {
    width: wp(10),
    // height: hp(10),
    resizeMode: "contain",
    borderRadius: 50
  },
  customLocationButton: {
    position: 'absolute',
    bottom: 300, 
    right: 10,
    // marginBottom:wp(20),
    // marginRight:wp(30),
    backgroundColor: '#2E333A',
    padding: 10,
    borderRadius: 15,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  customIcon: {
    // width: wp(7),
    // height: wp(8),
    backgroundColor: '#2E333A',
    tintColor: '#007AFF',
    
  },
  originLocationIcon: {
    backgroundColor: '#4800AC',
    // overflow: 'hidden',
    borderRadius: 50,
    border: 50
    // tintColor: 'white', // Optional: Adjust the color of the icon
  },
  destinationLocationIcon: {
    position: 'relative'
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -75 }], // Center the button
  },
  clearButton: {
    backgroundColor: '#D32F2F', // Red color for clear
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  inputHead: {
    // flex: 1,
    // width: wp(75),
    zIndex: 95,
    // marginLeft: wp(10),
    marginTop: hp(1.5),
  },
  gradientContainer: {
    border: 10,
    marginBottom: hp(1),
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
  textEllipsis:{
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    color: '#FCFFFF'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    // fontWeight: 'bold',
    paddingLeft: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: "transparent",
    color: '#FCFFFF'
  },
  bottomSheetContainer: {
    width: wp(100),
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-start',
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  originListView: {

    borderRadius: 5,
    width: wp(100),
    alignSelf: "center",
    position: "absolute",
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 3,
    paddingLeft: wp(5)
  },
  separator: {
    height: 1,
    width: wp(90),
    alignSelf: 'center',
    marginVertical: 5,
  },
  separatorline: {
    height: 1,
    width: wp(70),
    alignSelf: 'center',
    marginVertical: 5,
    marginTop: hp(3)
  },
  currentLocationSuggestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    padding: 8,
    width: wp(60),
    // display: 'none'
  },
  currentLocationText: {
    // fontSize: 18,
    // fontWeight: "bold", // Make the text bold
    color: "#FCFFFF", // White text for contrast
    marginLeft: 10,
    // color: "#D3770C",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold"
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'blue'
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
    // backgroundColor: 'red'
  },
  headingText: {
    fontSize: 15,
    // fontWeight: "bold",
    color: "#FCFFFF",
    fontFamily: "Montserrat-Medium"
  },
  subtext: {
    fontSize: 14,
    color: "#FCFFFF",
    fontFamily: "Montserrat-Light"
  },
  searchLocationIcon: {
    // width: 30,
    // height: 30,
    // backgroundColor: '#22272B',
    tintColor: '#007AFF',
    // padding: 2,
    borderRadius: 15,
    marginRight: 10
    // alignItems: 'center'
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: "#CBC0C0",
  },
  noDataContainer: {
    alignItems: "center",
  },
  noDataText: {
    // backgroundColor: 'red',
    fontSize: wp(4.5),
    fontFamily: "Montserrat-SemiBold",
    textAlign: 'center',
    color: "white"
  },
  fullScreen: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }, 
  overlay: {
    flex: 1,
    width: '100%',
  },
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  RBbottomSheetContainer: {
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
  bottomSheetClose: {
    // marginBottom: 100,
    color: 'white',
    // fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wp(4.7),
    padding: wp(2),
    fontFamily:fonts.montseratSemiBold,
  },
  backTopLine: {
    width: '85%',
    height: 1,
    // marginTop:wp(34),
    // marginTop: height * 0.1,
    alignSelf: "center"
    // marginTop:9,
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
    marginBottom: hp(10),
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
driverIconButton: {
  position: 'absolute',
  bottom: 80,
  right: 20,
  backgroundColor: '#000',
  padding: 10,
  borderRadius: 25,
},

driverIconText: {
  color: '#fff',
  fontSize: 16,
},
profile:{
  width:wp(18),
  height:hp(9),
  flexDirection: 'row',
  borderRadius:20,
  alignSelf:"center",
  resizeMode:"contain"
},
rowContainer: {
    justifyContent: "space-around",
    width: '100%',
},
 driverInfo: {
      // alignItems: 'center',
      // flexDirection:"row",
      justifyContent:"space-around",
      // marginBottom: hp(2),
      padding:wp(5),
  },
  drivername: {
      marginBottom: hp(3),
      alignSelf:"flex-start",
      flexDirection: 'row',
  },
   profile:{
    width:wp(18),
    height:hp(9),
    flexDirection: 'row',
    borderRadius:20,
    alignSelf:"center",
    resizeMode:"contain"
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
  carDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
  },
  leftAlign: {
        alignItems: 'flex-start',
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
rightAlign: {
      alignItems: 'flex-end',
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
  buttonalign:{
      flexDirection:"row",
      justifyContent:"space-between"
  },
space1: {
      marginTop: hp(4),
  },
  button: {
      backgroundColor: "#000000",
      borderRadius: 20,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      
  },
  buttoncotainer:{
      flexDirection: 'row', // This arranges children in a row
      alignItems: 'center', // Vertically center items
      justifyContent: 'center', 
      padding:wp(3),
      marginTop:wp(-0.5)
  },
  cancelbutton: {
      color: '#ffffff',
      fontSize: wp(3.5),       
      letterSpacing: 1,
      textAlign:"center",
      fontFamily: fonts.montseratBold,
      // marginBottom:wp(1)
  },
phoneicon: {
    alignSelf:"center",
    
}, 
  callbutton: {
      backgroundColor: "#000000",
      borderRadius: 80,
      width:wp(17.5),
      height:hp(7.7),
      justifyContent: 'center',
      alignItems: 'center',
  },
  callgradientBorderbutton: {
      borderRadius: 80,
      padding: 1,
      width:wp(18),
      height:hp(8),
      alignSelf: 'center',
    },
    space: {
      marginTop: hp(2),
  },
  gradientBorderbutton: {
        borderRadius: 20,
        padding: 1,
        width: wp(50),
        height: hp(5),
        alignSelf: 'center',
      },
});

