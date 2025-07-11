import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
    const navigation = useNavigation(); 

    return (
        <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    header: {
        // flex: 1,
        // flexDirection: "row",
        // alignItems: "flex-end",
        padding: 3,
        backgroundColor: "#D3770C",
        // marginRight: 330,
        borderRadius: 8
    },
    icon: {
        // marginLeft: 5,
        color: "white",
        fontWeight: "bold",
        fontSize :25,
        alignItems: 'center'
    },
});
