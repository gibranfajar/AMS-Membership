import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const Chat = () => {
    const [contactInfo, setContactInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // fungsi untuk memuat data kontak
    const fetchData = async () => {
        try {
            const response = await axios.get('https://golangapi-j5iu.onrender.com/api/member/mobile/contactinfo');
            setContactInfo(response.data.contactData);
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleWhatsAppPress = () => {
        if (contactInfo) {
            const phoneNumber = contactInfo.phoneNumber || '628123456789'; // Ganti dengan nomor default jika tidak tersedia
            const url = `https://wa.me/${phoneNumber}`;
            Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        }
    };

    const handleEmailPress = () => {
        if (contactInfo) {
            const email = contactInfo.email || 'support@example.com'; // Ganti dengan email default jika tidak tersedia
            const url = `mailto:${email}`;
            Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true); // Menandakan dimulainya penyegaran
        fetchData(); // Panggil fungsi fetchData untuk mendapatkan data terbaru
    };

    if (!contactInfo) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Memuat informasi kontak...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.heading}>Hubungi Kami</Text>
            <Text style={styles.infoText}>
                Jika Anda memiliki pertanyaan atau membutuhkan bantuan, Anda dapat menghubungi layanan pelanggan kami melalui WhatsApp, email, atau Instagram.
            </Text>
            <View style={styles.contactContainer}>
                <Text style={styles.contactLabel}>Nomor WhatsApp resmi kami:</Text>
                <Text style={styles.phoneNumber}>{contactInfo.phoneNumber}</Text>
                <Pressable style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]} onPress={handleWhatsAppPress}>
                    <Ionicons name="logo-whatsapp" size={24} color="white" />
                    <Text style={styles.buttonText}>Chat via WhatsApp</Text>
                </Pressable>
            </View>
            <View style={styles.contactContainer}>
                <Text style={styles.contactLabel}>Anda juga dapat menghubungi kami melalui email di:</Text>
                <Text style={styles.email}>{contactInfo.email}</Text>
                <Pressable style={({ pressed }) => [styles.button, { backgroundColor: '#4285F4', opacity: pressed ? 0.5 : 1 }]} onPress={handleEmailPress}>
                    <Ionicons name="mail" size={24} color="white" />
                    <Text style={styles.buttonText}>Email Kami</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    contactContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    contactLabel: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    phoneNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#25D366',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4285F4',
        marginBottom: 10,
    },
    instagram: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E4405F',
        marginBottom: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25D366',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
});
