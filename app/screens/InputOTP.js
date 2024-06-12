import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView, KeyboardAvoidingView, StatusBar, Pressable, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const InputOTP = ({ navigation, route }) => {
    const [isPressed, setIsPressed] = useState(false);
    const { nohandphone } = route.params;
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    useEffect(() => {
        // Cek apakah semua TextInput terisi
        const isAllFilled = code.every((digit) => digit !== '');

        if (isAllFilled) {
            // Jika semua TextInput terisi, jalankan handleVerify setelah 5 detik
            const timeout = setTimeout(() => {
                handleVerify();
            }, 2000);

            // Hapus timeout jika komponen di-unmount atau jika terjadi perubahan pada kode
            return () => clearTimeout(timeout);
        }
    }, [code]); // Efek akan dijalankan ketika ada perubahan pada kode


    useEffect(() => {
        const loadOtp = async () => {
            // Add a 3-second delay before fetching OTP from AsyncStorage
            setTimeout(async () => {
                const initialOtp = await AsyncStorage.getItem('otp');
                if (initialOtp && typeof initialOtp === 'string') {
                    const otpArray = initialOtp.split('');
                    setCode(otpArray);
                    otpArray.forEach((digit, index) => {
                        if (digit && inputs.current[index]) {
                            inputs.current[index].focus();
                        }
                    });
                }
            }, 2000);
        };
        loadOtp();
    }, []);

    const handleInputChange = (text, index) => {
        const newCode = [...code];
        if (text.length === 0) {
            newCode[index] = '';
        } else {
            newCode[index] = text[0];  // Only take the first character
            if (index < 5) {
                inputs.current[index + 1].focus();
            }
        }
        setCode(newCode);
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (code[index] === '') {
                if (index > 0) {
                    inputs.current[index - 1].focus();
                }
            } else {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    const handleResendCode = async () => {
        // Menghasilkan angka acak 6 digit
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;

        await AsyncStorage.setItem('otp', randomNumber.toString());

        // kirim OTP melalui API Qiscus
        const sendOTP = await axios.post('https://omnichannel.qiscus.com/whatsapp/v1/dmvzl-wfbfx3bo5bbzrj1/3384/messages/', {
            to: nohandphone, // gunakan nomor telepon dari data
            type: "template",
            template: {
                namespace: "7a2ceabe_e950_4283_82ac_5909ac117bf6",
                name: "otpmember_1",
                language: {
                    policy: "deterministic",
                    code: "id"
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: randomNumber.toString() }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: 0,
                        parameters: [
                            { type: "text", text: randomNumber.toString() }
                        ]
                    }
                ]
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Qiscus-App-Id': 'dmvzl-wfbfx3bo5bbzrj1',
                'Qiscus-Secret-Key': '27a6859bc8065575a3a135408e262e6e'
            }
        });

        ToastAndroid.show(
            "Kode OTP Telah Dikirim!",
            ToastAndroid.SHORT
        );
    };

    const handleVerify = async () => {
        try {
            const otp = code.join('');
            const otpValue = await AsyncStorage.getItem('otp');
            if (otpValue === otp) {
                ToastAndroid.show(
                    "Akun Berhasil Diverifikasi!",
                    ToastAndroid.SHORT
                );
                navigation.navigate('Home');
            } else {
                ToastAndroid.show(
                    "Kode Tidak Sesuai!",
                    ToastAndroid.SHORT
                );
            }
        } catch (error) {
            console.log(error);
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
                        Verifikasi Akun
                    </Text>

                    <Text style={styles.message}>
                        Kami telah mengirimkan SMS dengan kode ke nomor Anda{'\n'}
                        Silakan tulis kode di bawah ini dan tekan tombol Kirim.
                    </Text>

                    <View style={styles.form}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.input}
                                keyboardType="numeric"
                                maxLength={1}
                                onChangeText={text => handleInputChange(text, index)}
                                onKeyPress={e => handleKeyPress(e, index)}
                                value={digit}
                                ref={el => (inputs.current[index] = el)}
                            />
                        ))}
                    </View>

                    <Text style={styles.resendText}>
                        Anda belum menerima kodenya?{' '}
                        <Text style={styles.resendLink} onPress={handleResendCode}>
                            Kirim Ulang!
                        </Text>
                    </Text>

                    <Pressable
                        onPress={() => {
                            setIsPressed(true);
                            handleVerify();
                        }}
                        style={({ pressed }) => [
                            styles.buttonValidasi,
                            { backgroundColor: pressed || isPressed ? '#00429F' : '#021D43' }, // Ganti warna saat tombol ditekan
                        ]}>
                        <Text style={{ textAlign: 'center', color: 'white' }}>
                            Kirim
                        </Text>
                    </Pressable>
                </ScrollView>

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default InputOTP

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
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    input: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#C3C3C3',
        textAlign: 'center',
        fontSize: 24,
        marginRight: 8,
        borderRadius: 4,
    },
    resendText: {
        textAlign: 'center',
        marginBottom: 16,
    },
    resendLink: {
        color: '#0000FF',
        textDecorationLine: 'underline',
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