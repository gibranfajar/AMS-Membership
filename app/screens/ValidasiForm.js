import { View, Text, StyleSheet, ScrollView, TextInput, Image, ToastAndroid, Pressable, StatusBar, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ValidasiForm = ({ navigation }) => {
    const [isPressed, setIsPressed] = useState(false);

    // untuk menampung data dari inputan
    const [data, setData] = useState({
        userAccount: '',
    });

    // untuk menerima data dari inputan
    const handleChange = (key, value) => {
        setData({ ...data, [key]: value });
    };

    const handleValidation = async () => {
        // cek apakah inputan terisi atau tidak
        if (!data.userAccount.trim()) {
            setIsPressed(false);
            ToastAndroid.show(
                "Inputan tidak boleh kosong!",
                ToastAndroid.SHORT
            );
            setTimeout(() => {
                setIsPressed(false);
            }, 2000);
            return;
        }

        try {
            // Menghasilkan angka acak 6 digit
            const randomNumber = Math.floor(Math.random() * 900000) + 100000;

            await AsyncStorage.setItem('otp', randomNumber.toString());

            // kirim permintaan HTTP dengan menyertakan data yang diterima
            const response = await axios.post(
                `https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/Verify?userAccount=${data.userAccount}`,
                {
                    randomNumber: randomNumber,
                }
            );

            // mengecek response code dari API
            if (response.data.responseCode == "2002500") {
                // menyimpan idMember ke local storage
                await AsyncStorage.setItem('idMember', response.data.loginData.idMember);
                // alert dengan toast android
                ToastAndroid.show(
                    "Validasi Berhasil!",
                    ToastAndroid.SHORT
                );
                // navigasi ke halaman Input OTP
                navigation.replace("InputOTP", { nohandphone: data.userAccount });
            } else {
                setIsPressed(false);
                ToastAndroid.show(
                    "No Handphone Tidak Terdaftar!",
                    ToastAndroid.SHORT
                );
            }
        } catch (error) {
            console.log(error);
            setIsPressed(false);
        }
    };

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
                        <Text>No Handphone</Text>
                        <TextInput
                            style={styles.input}
                            value={data.userAccount}
                            keyboardType="numeric"
                            onChangeText={(text) => handleChange('userAccount', text)}
                            placeholder="08123xxxxxx"
                        />
                    </View>


                    <Pressable
                        onPress={() => {
                            setIsPressed(true);
                            handleValidation();
                        }}
                        style={({ pressed }) => [styles.buttonValidasi, { opacity: pressed ? 0.5 : 1 }]}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>
                            {isPressed ? <ActivityIndicator size="small" color="white" /> : 'Validasi'}
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
        marginTop: 40,
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginVertical: 10,
    },
    form: {
        marginHorizontal: 10,
        marginVertical: 15,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#C3C3C3",
        marginTop: 10,
    },
    buttonValidasi: {
        backgroundColor: "#021D43",
        color: "white",
        padding: 8,
        borderRadius: 25,
        marginHorizontal: 80,
        fontSize: 12,
    }
});

export default ValidasiForm