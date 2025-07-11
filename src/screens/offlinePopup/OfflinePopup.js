import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { wp, hp } from '../common/responsive'
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { fonts } from "../../components/customfont";

const OfflinePopup = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check and handle network connectivity
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
            if (!state.isConnected) {
                setShowModal(true);
            } else {
                setShowModal(false)
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Modal
            visible={showModal}
            transparent
            animationType="none"
            onRequestClose={() => setShowModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <MaterialIcons name="wifi-off" size={20} color="#EB963F" />
                    <Text style={styles.modalText}>No internet connection.</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                        <Ionicons name="close-circle" size={23} color="#EB963F" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flexDirection: 'row',
        gap: wp(3),
        width: wp(90),
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
        fontFamily: fonts.PoppinsSemiBold
    },
    closeButton: {
        position: 'absolute',
        right: 2,
        top: 0,
        // backgroundColor: '#FFBD50',
        // width: wp(7),
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },

});

export default OfflinePopup;
