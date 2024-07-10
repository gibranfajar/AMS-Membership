import { ActivityIndicator, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NetInfo from '@react-native-community/netinfo';

const Validasi = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);

    // mengambil informasi koneksi internet
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <SafeAreaView style={styles.container}>

            <StatusBar backgroundColor={'#021D43'} />

            {/* Jika terhubung ke internet */}
            {isConnected ? (
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/validasi.png')}
                        style={styles.images}
                    />

                    <Text style={styles.text}>
                        Apakah Anda sudah pernah terdaftar sebagai member?
                    </Text>

                    <Pressable onPress={() => { navigation.navigate("ValidasiForm") }} >
                        <Text style={styles.buttonColor}>
                            Sudah
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => { navigation.navigate("SignUp") }}
                    >
                        <Text style={styles.noColorButton}>
                            Belum
                        </Text>
                    </Pressable>
                </View>
            ) : ( // Jika tidak terhubung ke internet
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#021D43" />
                </View>
            )}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    images: {
        width: 300,
        height: 300,
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        paddingVertical: 5
    },
    buttonColor: {
        backgroundColor: "#021D43",
        color: "white",
        paddingHorizontal: 80,
        padding: 8,
        borderRadius: 25,
        marginVertical: 15,
        fontSize: 12,
    },
    noColorButton: {
        paddingHorizontal: 80,
        padding: 8,
        borderRadius: 25,
        borderColor: "#021D43",
        borderWidth: 1,
        fontSize: 12,
    }
});

export default Validasi