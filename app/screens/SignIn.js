import { View, Text, StyleSheet, ScrollView, TextInput, Image, ToastAndroid, Pressable, StatusBar, ActivityIndicator, } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SignIn = ({ navigation }) => {

    const [isPressed, setIsPressed] = useState(false);
    // menampung data dari inputan
    const [data, setData] = useState({
        user: '',
        password: ''
    });

    // untuk menerima data dari inputan
    const handleChange = (key, value) => {
        setData({ ...data, [key]: value });
    };

    // menjalankan tombol login
    const handleLogin = async () => {

        // cek apakah inputan terisi atau tidak
        if (!data.user.trim() || !data.password.trim()) {
            ToastAndroid.show(
                "Inputan tidak boleh kosong!",
                ToastAndroid.SHORT
            );
            return;
        }


        try {
            // kirim permintaan HTTP dengan menyertakan data yang diterima
            const response = await axios.post('https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/login', data, {
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
                    "Login Berhasil!",
                    ToastAndroid.SHORT
                );
                // navigasi ke halaman Home
                navigation.replace("Home");
            } else {
                setIsPressed(false);
                // alert dengan toast android
                ToastAndroid.show(
                    "Login Gagal!",
                    ToastAndroid.SHORT
                );
            }
        } catch (error) {
            setIsPressed(false);
            console.log(error);
        }

    };


    return (
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
                        source={require("../../assets/login.png")}
                        style={styles.login}
                    />
                </View>

                <Text style={styles.title}>
                    Login
                </Text>

                <View style={styles.form}>
                    <Text>User</Text>
                    <TextInput
                        style={styles.input}
                        value={data.user}
                        onChangeText={(text) => handleChange('user', text)}
                        placeholder="Masukkan Email / No Handphone"
                    />
                </View>

                <View style={styles.form}>
                    <Text>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={data.password}
                        onChangeText={(text) => handleChange('password', text)}
                        placeholder="Masukkan Password"
                    />
                </View>

                <Pressable
                    onPress={() => {
                        setIsPressed(true);
                        handleLogin();
                    }}
                    style={({ pressed }) => [styles.buttonLogin, { opacity: pressed ? 0.5 : 1 }]}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        {isPressed ? <ActivityIndicator size="small" color="white" /> : 'Login'}
                    </Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
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
    login: {
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
    buttonLogin: {
        backgroundColor: "#021D43",
        color: "white",
        textAlign: "center",
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 80,
    }
});

export default SignIn