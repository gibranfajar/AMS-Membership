import { View, Text, Pressable, StyleSheet, Image, TextInput, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioGroup } from 'react-native-radio-buttons-group';

const EditProfile = ({ navigation }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
    const [prov, setProv] = useState(null);
    const [city, setCity] = useState(null);

    const [data, setData] = useState({
        id_member: '',
        namaLengkap: '',
        namaPanggilan: '',
        notelpon: '',
        email: '',
        password: '',
        provinsi: '',
        kota: '',
        alamat: '',
        kelamin: '',
        tglLahir: '',
        minatKategori: '-',
    });

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


    useEffect(() => {
        if (prov) {
            handleState(prov);
        }
    }, [prov]);

    useEffect(() => {
        const selectedCountry = countryData.find(item => item.value === data.provinsi);
        const selectedCity = stateData.find(item => item.value === data.kota);
        if (selectedCountry) {
            setProv(selectedCountry.value);
        }
        if (selectedCity) {
            setCity(selectedCity.value);
        }
    }, [countryData, data.provinsi, stateData, data.kota]);


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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const idMember = await AsyncStorage.getItem('idMember');
                const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/profile?id_member=${idMember}`);
                setData({
                    id_member: idMember,
                    namaLengkap: response.data.memberData.nama,
                    namaPanggilan: response.data.memberData.namaPanggilan,
                    notelpon: response.data.memberData.notelpon,
                    email: response.data.memberData.email,
                    provinsi: response.data.memberData.idProvinsi,
                    kota: response.data.memberData.idKota,
                    alamat: response.data.memberData.alamat,
                    kelamin: response.data.memberData.jenisKelamin === 'PRIA' ? 'l' : 'p',
                    tglLahir: response.data.memberData.tanggalLahir,
                    minatKategori: '-',
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // update data ke backend
    const handleUpdate = async () => {
        // cek apakah inputan terisi atau tidak
        if (!data.namaLengkap.trim() || !data.namaPanggilan.trim() || !data.notelpon.trim() || !data.email.trim() || !data.kelamin.trim() || !data.tglLahir.trim()) {
            setIsPressed(false);
            ToastAndroid.show(
                "Inputan tidak boleh kosong!",
                ToastAndroid.SHORT
            );
            return;
        }

        let url = "https://golangapi-j5iu.onrender.com/api/member/mobile/profile"
        axios({
            method: "PUT",
            url: url,
            data: data,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(function (response) {
            if (response.data.responseCode == "2002500") {
                console.log(response.data);
                setIsPressed(false);
                ToastAndroid.show(
                    "Ubah Data Berhasil!",
                    ToastAndroid.SHORT
                );
                navigation.navigate("Home");
            } else {
                console.log(response.data);
                setIsPressed(false);
                ToastAndroid.show(
                    "Ubah Data Gagal!",
                    ToastAndroid.SHORT
                );
            }
        }).catch(function (response) {
            console.log(response.data);
            setIsPressed(false);
        });
    };

    // Tampilkan indikator loading jika data masih dimuat
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.head}>
                <Pressable
                    onPress={() => {
                        navigation.navigate("EditProfile");
                    }}
                >
                    <Image
                        source={require("../../assets/profile.png")}
                        style={styles.profile}
                    />
                </Pressable>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: 10 }}
            >
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
                        keyboardType="numeric"
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
                            placeholder={!isFocus ? 'Pilih Provinsi' : ''}
                            searchPlaceholder="Search"
                            value={prov}
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
                            value={city}
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
                            selectedId={data.kelamin}
                            layout="row"
                        />
                    </View>
                    <View style={styles.form}>
                        <Text>Tanggal Lahir</Text>
                        <TextInput
                            style={styles.input}
                            value={data.tglLahir}
                            onChangeText={(text) => handleChange("tglLahir", text)}
                            placeholder="yyyy-mm-dd"
                        />
                    </View>
                </View>

                <Pressable
                    onPress={() => {
                        setIsPressed(true);
                        handleUpdate();
                    }}
                    style={({ pressed }) => [styles.buttonEdit, { opacity: pressed ? 0.5 : 1 }]}
                >
                    <Text style={{ textAlign: "center", color: "white" }}>
                        {isPressed ? <ActivityIndicator size="small" color="white" /> : 'Ubah'}
                    </Text>
                </Pressable>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    profile: {
        width: 75,
        height: 75,
        borderRadius: 100,
        backgroundColor: 'white'
    },
    head: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 20,
        paddingBottom: 30,
        backgroundColor: "#021D43",
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
        marginBottom: 10,
    },
    form: {
        flex: 1,
        marginHorizontal: 25,
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
    buttonEdit: {
        backgroundColor: "#021D43",
        color: "white",
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 80,
    }
});

export default EditProfile