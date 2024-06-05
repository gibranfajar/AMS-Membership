import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Image, StatusBar, ToastAndroid, } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import { RadioGroup } from "react-native-radio-buttons-group";

const SignUp = ({ navigation }) => {

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


    // untuk menerima data dari inputan
    const handleChange = (key, value) => {
        setData({ ...data, [key]: value });
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

    // menampung data jenis kelamin yang dipilih
    const [selectedId, setSelectedId] = useState();


    // menampung data provinsi serta kota
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [countryId, setCountryId] = useState(null);
    const [stateId, setStateId] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    // menampung data minat per satu satu
    const [busana, setToggleCheckBoxBusana] = useState("")
    const [olahraga, setToggleCheckBoxOlahraga] = useState("")
    const [hiburan, setToggleCheckBoxHiburan] = useState("")
    const [petualangan, setToggleCheckBoxPetualangan] = useState("")

    // menampung data minat keseluruhan yang dipilih
    const minat = [busana, olahraga, hiburan, petualangan];


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
                    Sign Up
                </Text>

                <View style={styles.form}>
                    <Text>Nama Lengkap</Text>
                    <TextInput
                        style={styles.input}
                        value={data.namaLengkap}
                        onChangeText={(text) => handleChange("namaLengkap", text)}
                    />
                </View>

                <View style={styles.form}>
                    <Text>Nama Panggilan</Text>
                    <TextInput
                        style={styles.input}
                        value={data.namaPanggilan}
                        onChangeText={(text) => handleChange("namaPanggilan", text)}
                    />
                </View>

                <View style={styles.form}>
                    <Text>No Handphone</Text>
                    <TextInput
                        style={styles.input}
                        value={data.notelpon}
                        onChangeText={(text) => handleChange("notelpon", text)}
                    />
                </View>

                <View style={styles.form}>
                    <Text>Email Aktif</Text>
                    <TextInput
                        style={styles.input}
                        value={data.email}
                        onChangeText={(text) => handleChange("email", text)}
                    />
                </View>

                <View style={styles.form}>
                    <Text>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={data.password}
                        onChangeText={(text) => handleChange("password", text)}
                    />
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
                            placeholder={!isFocus ? 'Select country' : ''}
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
                            placeholder={!isFocus ? 'Select state' : ''}
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
                    />
                </View>

                <View style={styles.inputCols}>
                    <View style={styles.form}>
                        <Text>Kelamin</Text>
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
                        <TextInput
                            style={styles.input}
                            value={data.tglLahir}
                            onChangeText={(text) => handleChange("tglLahir", text)}
                            placeholder="dd/mm/yyyy"
                        />
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

                <Pressable onPress={handleRegister} >
                    <Text style={styles.buttonDaftar}>
                        Daftar
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
        fontSize: 24,
        textAlign: "center",
        marginVertical: 10,
        fontWeight: "bold",
    },
    form: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 15,
    },
    input: {
        borderBottomWidth: 1, borderBottomColor: "#C3C3C3"
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