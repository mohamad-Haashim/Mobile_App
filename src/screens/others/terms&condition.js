import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Image, SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import taxilogo from '../../assets/images/taxilogo.png';
import { useNavigation } from "@react-navigation/native";
import Header from "../common/header";
import CheckBox from '@react-native-community/checkbox';
import { wp, hp } from "../common/responsive";
import { fonts } from "../../components/customfont";

export default function Termscondition() {
    const [isChecked, setChecked] = useState(false);
    const [isSelected, setSelected] = useState(false);

    const navigation = useNavigation();

    const handleAccept = () => {
        if (isChecked && isSelected) {
            navigation.navigate('Mapsearch'); 
        } else {
            alert("Please accept the terms and privacy policy.");
        }
    };

    const handleDecline = () => {
        navigation.navigate('Resetpassword'); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.overlay}>
                <Image source={taxilogo} style={styles.logo} />
                <Text style={styles.heading}>TERMS AND CONDITION</Text>
                <View style={{marginTop:200}}>

                <View style={styles.checkboxContainer}>
                    <CheckBox 
                        value={isChecked}
                        onValueChange={setChecked}
                        style={styles.checkbox}
                        tintColors={{ true: '#FCFFFF', false: '#D3770C' }}
                    />
                    <Text style={styles.label}>Accept the Terms and Condition</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox 
                        value={isSelected}
                        onValueChange={setSelected}
                        style={styles.checkbox}
                        tintColors={{ true: '#FCFFFF', false: '#D3770C' }}
                    />
                    <Text style={styles.label}>Accept the privacy policy</Text>
                </View>
                </ View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.Decline} onPress={handleDecline}>
                        <Text style={styles.submitDecline}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.Accept} onPress={handleAccept}>
                        <Text style={styles.submitAccept}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#303336",
        alignItems: 'center',
        justifyContent: 'center',
      },
      overlay: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        width: wp(45),
        height: hp(14),
        marginTop: hp(2),
      },
      heading: {
        color: "white",
        fontSize: wp(5),
        marginTop: hp(2),
        letterSpacing: 2,
      },
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(-8),
        marginRight: wp(10),
        marginTop: hp(2),
      },
      checkbox: {
        marginRight: wp(2),
        marginTop: hp(6),
        color: "#D3770C",
      },
      label: {
        color: "white",
        marginTop: hp(6),
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: hp(20),
      },
      Decline: {
        backgroundColor: "#FCFFFF",
        borderRadius: 5,
        width: wp(40),
        height: hp(5),
        justifyContent: "center",
        alignItems: "center",
        marginRight: wp(5),
      },
      Accept: {
        backgroundColor: "#ff7d00",
        borderRadius: 5,
        width: wp(40),
        height: hp(5),
        justifyContent: "center",
        alignItems: "center",
      },
      submitDecline: {
        color: '#D3770C',
        fontSize: wp(5),
        fontWeight: 'bold',
        textAlign: "center",
      },
      submitAccept: {
        color: '#FCFFFF',
        fontSize: wp(5),
        fontWeight: 'bold',
        textAlign: "center",
      },
});

