import { Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {

    const fetchData = async () => {
        try {
            // Ambil idMember dari penyimpanan lokal (AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            // Cek apakah idMember ada
            if (idMember) {
                setTimeout(() => {
                    navigation.navigate('Home');
                }, 2000); // Navigate setelah 2 detik
            } else {
                setTimeout(() => {
                    navigation.navigate('Validasi');
                }, 2000); // Navigate setelah 2 detik
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ImageBackground
            source={require("../../assets/bg-welcome.png")}
            style={styles.background}
        >
            <StatusBar backgroundColor={'#021D43'} />
            <View style={styles.container}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                />
            </View>
            <Text style={styles.text}>MEMBERSHIP</Text>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 220,
        height: 85,
    },
    text: {
        fontSize: 30,
        textAlign: 'center',
        bottom: 35,
        letterSpacing: 10,
        color: '#54585A',
    }
});

export default Splash