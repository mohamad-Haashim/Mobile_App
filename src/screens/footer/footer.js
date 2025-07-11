import React,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MySidebar from '../common/sidebar';
import Home from "../../assets/images/footerhomeVector.svg"
import Refresh from "../../assets/images/refreshVector.svg"
import Profile from "../../assets/images/profileVector.svg"
import { fonts } from '../../components/customfont';
import { useNavigation } from '@react-navigation/native';

const FooterMenu = ({onAccountPress,onHome,onRefreshPress,isRefreshing} ) => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const navigation = useNavigation();
    const [refreshKey, setRefreshKey] = useState(0);


    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
      };

      // const onHome = () => {
      //   console.log("Navigating to Mapsearch");
      //   navigation.navigate("Mapsearch");
      // };
    
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={onHome}>
        {/* <Entypo name="home" size={24} color="#FFFFFF" /> */}
        <Home/>
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, isRefreshing && { opacity: 0.5 }]}
        onPress={onRefreshPress}
        disabled={isRefreshing} // 👈 disable button when refreshing
      >
      <Refresh />
      <Text style={styles.menuText}>
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Text>
    </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={onAccountPress}
        >
        {/* <FontAwesome name="user-circle-o" size={24} color="#FFFFFF" /> */}
        <Profile/>
        <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>
        

    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222', // Change based on your theme
    paddingVertical: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
    fontFamily:fonts.montseratSemiBold
  },
});

export default FooterMenu;
