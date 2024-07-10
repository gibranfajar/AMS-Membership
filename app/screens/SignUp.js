import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Image, StatusBar, ToastAndroid, ActivityIndicator, Button, } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import { RadioGroup } from "react-native-radio-buttons-group";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from '@expo/vector-icons';

const SignUp = ({ navigation }) => {
    const [tglLahir, setTglLahir] = useState('');
    const [tglLahirFormatted, setTglLahirFormatted] = useState('');
    const [selectedId, setSelectedId] = useState();
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [countryId, setCountryId] = useState(null);
    const [stateId, setStateId] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [busana, setToggleCheckBoxBusana] = useState("")
    const [olahraga, setToggleCheckBoxOlahraga] = useState("")
    const [hiburan, setToggleCheckBoxHiburan] = useState("")
    const [petualangan, setToggleCheckBoxPetualangan] = useState("")
    const minat = [busana, olahraga, hiburan, petualangan];
    const [isPressed, setIsPressed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setData({ ...data, tglLahir: formatDate(currentDate) });
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        setShow(true);
        showMode('date');
    };

    // menampung semua data dari inputan
    const [data, setData] = useState({
        namaLengkap: "",
        namaPanggilan: "",
        notelpon: "",
        email: "",
        password: "",
        provinsi: "",
        kota: "",
        kelamin: "",
        tglLahir: "",
        minatKategori: "-",
        alamat: "",
    })

    const handleChange = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // menampung data jenis kelamin
    const radioButtons = useMemo(() => ([
        {
            id: 'l',
            label: 'Pria',
            value: 'l'
        },
        {
            id: 'p',
            label: 'Wanita',
            value: 'p'
        }
    ]), []);

    // menampilkan semua data provinsi
    useEffect(() => {
        axios.get('https://golangapi-j5iu.onrender.com/api/member/mobile/provinces')
            .then(response => {
                var count = Object.keys(response.data.provincesData).length;
                let countryArray = [];
                for (var i = 0; i < count; i++) {
                    countryArray.push({
                        value: response.data.provincesData[i].prov_id,
                        label: response.data.provincesData[i].prov_name,
                    });
                }
                setCountryData(countryArray);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // menampung semua data kota berdasarkan id provinsi
    const handleState = countryCode => {
        axios.get('https://golangapi-j5iu.onrender.com/api/member/mobile/cities?provID=' + countryCode)
            .then(function (response) {
                var count = Object.keys(response.data.citiesData).length;
                let stateArray = [];
                for (var i = 0; i < count; i++) {
                    stateArray.push({
                        value: response.data.citiesData[i].city_id,
                        label: response.data.citiesData[i].city_name,
                    });
                }
                setStateData(stateArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    // menjalankan tombol registrasi
    const handleRegister = async () => {


        // cek apakah inputan terisi atau tidak
        if (!data.namaLengkap.trim() || !data.namaPanggilan.trim() || !data.notelpon.trim() || !data.email.trim() || !data.password.trim() || !data.kelamin.trim() || !data.alamat.trim()) {
            setIsPressed(false);
            ToastAndroid.show(
                "Inputan tidak boleh kosong!",
                ToastAndroid.SHORT
            );
            return;
        }

        try {
            // kirim permintaan HTTP dengan menyertakan data yang diterima
            const response = await axios.post('https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // mengecek response code dari API
            if (response.data.responseMessage == "success") {
                // menyimpan idMember ke local storage
                AsyncStorage.setItem('idMember', response.data.memberData.idMember);
                const randomNumber = Math.floor(Math.random() * 900000) + 100000;

                await AsyncStorage.setItem('otp', randomNumber.toString());

                // kirim OTP melalui API Qiscus
                const sendOTP = await axios.post('https://omnichannel.qiscus.com/whatsapp/v1/dmvzl-wfbfx3bo5bbzrj1/3384/messages/', {
                    to: data.notelpon, // gunakan nomor telepon dari data
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

                // alert dengan toast android
                ToastAndroid.show(
                    "Daftar Berhasil!",
                    ToastAndroid.SHORT
                );

                // navigasi ke halaman Input OTP
                navigation.replace("InputOTP", { nohandphone: data.notelpon });
            } else {
                setIsPressed(false);
                // alert dengan toast android
                ToastAndroid.show(
                    "Daftar Gagal!",
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

                <Text style={styles.title} >
                    Daftar
                </Text>

                <View style={styles.form}>
                    <Text>Nama Lengkap</Text>
                    <TextInput
                        style={styles.input}
                        value={data.namaLengkap}
                        onChangeText={(text) => handleChange("namaLengkap", text)}
                        placeholder="Johan Saputra"
                    />
                </View>

                <View style={styles.form}>
                    <Text>Nama Panggilan</Text>
                    <TextInput
                        style={styles.input}
                        value={data.namaPanggilan}
                        onChangeText={(text) => handleChange("namaPanggilan", text)}
                        placeholder="Johan"
                    />
                </View>

                <View style={styles.form}>
                    <Text>No Handphone</Text>
                    <TextInput
                        style={styles.input}
                        value={data.notelpon}
                        onChangeText={(text) => handleChange("notelpon", text)}
                        placeholder="08123xxxxx"
                        keyboardType="number-pad"
                    />
                </View>

                <View style={styles.form}>
                    <Text>Email Aktif</Text>
                    <TextInput
                        style={styles.input}
                        value={data.email}
                        onChangeText={(text) => handleChange("email", text)}
                        placeholder="Johan@gmail.com"
                    />
                </View>

                <View style={styles.form}>
                    <Text>Password</Text>
                    <View style={styles.input}>
                        <TextInput
                            style={{ flex: 1 }}
                            secureTextEntry={!showPassword} // Use state to toggle visibility
                            value={data.password}
                            onChangeText={(text) => handleChange("password", text)}
                            placeholder="**********"
                        />
                        <Pressable onPress={toggleShowPassword}>
                            <Feather name={showPassword ? "eye" : "eye-off"} size={16} color="black" />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.inputCols}>

                    <View style={styles.form}>
                        <Text>Provinsi</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            data={countryData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Pilih Provinsi' : ''}
                            searchPlaceholder="Search"
                            value={country}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setCountry(item.value);
                                handleState(item.value);
                                setCountryId(item.value);
                                setData({ ...data, provinsi: item.value });
                                setIsFocus(false);
                            }}

                        />
                    </View>

                    <View style={styles.form}>
                        <Text>Kota</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            data={stateData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Pilih Kota' : ''}
                            searchPlaceholder="Search"
                            value={state}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setState(item.value);
                                setStateId(item.value);
                                setData({ ...data, kota: item.value });
                                setIsFocus(false);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.form}>
                    <Text>Alamat</Text>
                    <TextInput
                        style={styles.input}
                        value={data.alamat}
                        onChangeText={(text) => handleChange("alamat", text)}
                        placeholder="Jl. Merdeka No. 123, Jakarta"
                    />
                </View>

                <View style={styles.inputCols}>
                    <View>
                        <Text style={{ marginBottom: 5, marginLeft: 10, marginTop: 15 }}>Kelamin</Text>
                        <RadioGroup
                            radioButtons={radioButtons}
                            onPress={(selectedId) => {
                                setSelectedId(selectedId); // Mengatur nilai terpilih
                                handleChange("kelamin", selectedId); // Menangani perubahan nilai kelamin
                            }}
                            selectedId={selectedId}
                            layout="row"
                        />
                    </View>
                    <View style={styles.form}>
                        <Text>Tanggal Lahir</Text>
                        <Text onPress={showDatepicker} style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, paddingVertical: 10 }}>{formatDate(date)}</Text>
                        {show && (
                            <RNDateTimePicker mode="date" value={date} />
                        )}
                    </View>
                </View>

                {/* <View style={styles.form}>
                    <Text>Minat</Text>
                    <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                        <Checkbox
                            disabled={false}
                            value={busana}
                            onValueChange={(busana) => {
                                setToggleCheckBoxBusana(busana ? "Busana" : "")
                                setData({ ...data, minatKategori: busana ? "Busana" : "" });
                            }}
                            color={busana ? '#021D43' : undefined}
                        /><Text style={{ marginLeft: 10 }}>Busana</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                        <Checkbox
                            disabled={false}
                            value={olahraga}
                            onValueChange={(olahraga) => {
                                setToggleCheckBoxOlahraga(olahraga ? "Olahraga" : "")
                                setData({ ...data, minatKategori: olahraga ? "Olahraga" : "" });
                            }}
                            color={olahraga ? '#021D43' : undefined}
                        /><Text style={{ marginLeft: 10 }}>Olahraga</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                        <Checkbox
                            disabled={false}
                            value={hiburan}
                            onValueChange={(hiburan) => {
                                setToggleCheckBoxHiburan(hiburan ? "Hiburan" : "")
                                setData({ ...data, minatKategori: hiburan ? "hiburan" : "" });
                            }}
                            color={hiburan ? '#021D43' : undefined}
                        /><Text style={{ marginLeft: 10 }}>Hiburan</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                        <Checkbox
                            disabled={false}
                            value={petualangan}
                            onValueChange={(petualangan) => {
                                setToggleCheckBoxPetualangan(petualangan ? "Petualangan" : "");
                                setData({ ...data, minatKategori: petualangan ? "Petualangan" : "" });
                            }}
                            color={petualangan ? '#021D43' : undefined}
                        /><Text style={{ marginLeft: 10 }}>Petualangan</Text>
                    </View>
                </View> */}

                <Pressable
                    onPress={() => {
                        setIsPressed(true);
                        handleRegister();
                    }}
                    style={({ pressed }) => [styles.buttonDaftar, { opacity: pressed ? 0.5 : 1 }]}
                >
                    <Text style={{ textAlign: 'center', color: 'white' }}>
                        {isPressed ? <ActivityIndicator size="small" color="white" /> : 'Daftar'}
                    </Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    logoAms: {
        width: 150,
        height: 50,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginVertical: 10,
    },
    form: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 15,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#C3C3C3",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    inputCols: {
        flexDirection: "row", justifyContent: "space-between"
    },
    dropdown: {
        height: 30,
        borderColor: 'gray',
        borderBottomWidth: 0.5,
        marginBottom: 10,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'grey',
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    buttonDaftar: {
        backgroundColor: "#021D43",
        color: "white",
        textAlign: "center",
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 80,
    }
});

export default SignUp