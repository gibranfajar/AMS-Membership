import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const Chat = () => {
    const handlePress = () => {
        const phoneNumber = '6285780800199'; // Ganti dengan nomor WhatsApp resmi PT Aditya Mandiri Sejahtera
        const url = `https://wa.me/${phoneNumber}`;
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Hubungi Kami</Text>
            <Text style={styles.infoText}>
                Jika Anda memiliki pertanyaan atau membutuhkan bantuan, Anda dapat menghubungi layanan pelanggan kami melalui WhatsApp.
            </Text>
            <Text style={styles.infoText}>
                Nomor WhatsApp resmi kami adalah:
            </Text>
            <Text style={styles.phoneNumber}>+62 857-8080-0199</Text>
            <Pressable style={styles.button} onPress={handlePress}>
                <Ionicons name="logo-whatsapp" size={24} color="white" />
                <Text style={styles.buttonText}>Chat via WhatsApp</Text>
            </Pressable>
        </View>
    );
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    phoneNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#25D366',
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25D366',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
})