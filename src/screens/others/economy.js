//economy.js 

import { useState } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity} from "react-native";
import { wp, hp } from "../common/responsive";
// import ecoimg from '../assets/images/sedan.png';

export default function Economy({ handleEconomySelection }) {
    const data = { category: "Economy", image: ecoimg }; // Data to pass to mapsearch

    const handleSelect = () => {
        handleEconomySelection(data); // Pass data directly to mapsearch
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.categorytab}>
                <TouchableOpacity onPress={handleSelect}>
                    <Image source={ecoimg} style={styles.ecoimg} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#303336",
        alignItems: 'center',
        paddingVertical: hp(2), 
    },
    categorytab: {
        backgroundColor: "#424648",
        width: wp(96),
        height: hp(9),
        marginTop: hp(20),
        borderTopStartRadius: 15,
        borderTopRightRadius: 15,
        flexDirection: 'row',
    },
    ecoimg: {
        width: wp(36),
        height: hp(10),
        marginBottom: wp(25),
    },
});