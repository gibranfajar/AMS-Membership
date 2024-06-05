import { View, Text, StyleSheet, ScrollView, TextInput, Image, ToastAndroid, Pressable, StatusBar, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ValidasiForm = ({ navigation }) => {
    // untuk menampung data dari inputan
    const [data, setData] = useState({
        userAccount: '',
    });

    // untuk menerima data dari inputan
    const handleChange = (key, value) => {
        setData({ ...data, [key]: value });
    };

    // untuk menjalankan tombol validasi
    const handleValidation = async () => {

        // cek apakah inputan terisi atau tidak
        if (!data.userAccount.trim()) {
            ToastAndroid.show(
                "Inputan tidak boleh kosong!",
                ToastAndroid.SHORT
            );
            return;
        }

        try {
            // kirim permintaan HTTP dengan menyertakan data yang diterima
            const response = await axios.post('https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/Verify', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // mengecek response code dari API
            if (response.data.responseCode == "2002500") {
                // menyimpan idMember ke local storage
                AsyncStorage.setItem('idMember', response.data.loginData.idMember);

                // alert dengan toast android
                ToastAndroid.show(
                    "Validasi Berhasil!",
                    ToastAndroid.SHORT
                );

                // navigasi ke halaman Home
                navigation.navigate("Home");
            } else {
                // alert dengan toast android
                ToastAndroid.show(
                    "Validasi Gagal!",
                    ToastAndroid.SHORT
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <SafeAreaView style={{ flex: 1, margin: 10 }}>
                <StatusBar backgroundColor={'#021D43'} />

                <View style={styles.container}>
                    <Image
                        source={require("../../assets/logo.png")}
                        style={styles.logoAms}
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Image
                            source={require("../../assets/validasi.png")}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.title}>
                        Validasi
                    </Text>

                    <View style={styles.form}>
                        <Text>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={data.userAccount}
                            onChangeText={(text) => handleChange('userAccount', text)}
                        />
                    </View>


                    <Pressable onPress={handleValidation}>
                        <Text style={styles.buttonValidasi}>
                            Validasi
                        </Text>
                    </Pressable>
                </ScrollView>

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    logoAms: {
        width: 150,
        height: 50,
    },
    image: {
        marginVertical: 40,
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginVertical: 10,
        fontWeight: "bold",
    },
    form: {
        marginHorizontal: 10,
        marginVertical: 15,
    },
    input: {
        borderBottomWidth: 1, borderBottomColor: "#C3C3C3"
    },
    buttonValidasi: {
        backgroundColor: "#021D43",
        color: "white",
        textAlign: "center",
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 80,
    }
});

export default ValidasiForm