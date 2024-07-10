import { View, Text, Pressable, Modal, Image, StyleSheet, ActivityIndicator, } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { Ionicons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness';

const Voucher = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false); // State untuk animasi loading
    const originalBrightness = useRef(null);
    const [List, setList] = useState([]);
    const [data, setData] = useState({});
    const [dataCount, setDataCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk mengambil data voucher
    const fetchData = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher?id_member=${idMember}`);
            const data = response.data.voucherData.filter((item) => item.statusPenggunaan === '0');
            setList(data);
            setDataCount(data.length);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fungsi untuk mengatur brightness
    useEffect(() => {
        const adjustBrightness = async () => {
            if (modalVisible) {
                if (originalBrightness.current === null) {
                    originalBrightness.current = await Brightness.getBrightnessAsync();
                }
                const { status } = await Brightness.requestPermissionsAsync();
                if (status === 'granted') {
                    await Brightness.setBrightnessAsync(5);
                } else {
                    console.warn("WRITE_SETTINGS permission not granted");
                }
            } else {
                if (originalBrightness.current !== null) {
                    await Brightness.setBrightnessAsync(originalBrightness.current);
                    originalBrightness.current = null; // Reset original brightness
                }
            }
        };

        adjustBrightness();
    }, [modalVisible]);

    // Fungsi untuk menampilkan detail voucher
    const fetchDataById = async (id) => {
        try {
            setLoadingModal(true); // Tampilkan loading
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher?id_member=${idMember}`);
            const filteredData = response.data.voucherData.filter(item => item.noVoucher == id);
            console.log(filteredData[0]);
            setData(filteredData[0]);
            setLoadingModal(false); // Sembunyikan loading
            setModalVisible(true);
        } catch (error) {
            console.log(error);
            setLoadingModal(false); // Sembunyikan loading jika ada error
        }
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatDate = (dateString) => {
        // Input validation
        if (!dateString || typeof dateString !== "string") {
            return "Invalid date";
        }

        let parts = dateString.split("/");
        if (parts.length !== 3) {
            return "Invalid date format. Please use dd/mm/yyyy";
        }

        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return "Invalid date components";
        }

        let dateObj = new Date(year, month - 1, day);

        let monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        let monthName = monthNames[dateObj.getMonth()];
        let formattedYear = dateObj.getFullYear();

        let formattedDate = `${day} ${monthName} ${formattedYear}`;

        return formattedDate;
    };

    if (loading || loadingModal) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, margin: 25 }}>
            <View
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    paddingHorizontal: 30,
                    marginBottom: 20,
                }}
            >
                <Pressable
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                        navigation.navigate("Voucher");
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{dataCount == "" ? 0 : dataCount}</Text>
                    <Text style={{ fontSize: 12, color: "#a1a1a1" }}>Voucher</Text>
                </Pressable>
                <Pressable
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                        navigation.navigate("RiwayatVoucher");
                    }}
                >
                    <Ionicons name="document-text-outline" size={20} color={'#1d1d1d'} />
                    <Text style={{ fontSize: 12, color: "#a1a1a1" }}>Riwayat</Text>
                </Pressable>
            </View>

            <View
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
            >
                {!List ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Tidak ada data</Text>
                    </View>
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={List}
                        keyExtractor={(item) => String(item.noVoucher)}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => fetchDataById(item.noVoucher)}
                            >
                                <View style={styles.card}>
                                    <View style={styles.topCard}>
                                        <Text style={{ color: "white", fontSize: 14 }}>Voucher</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                padding: 15,
                                            }}
                                        >
                                            <Text style={{ fontSize: 20 }}>Rp {formatNumber(item.nominal)}</Text>
                                            <Text style={{ marginTop: 5, fontSize: 12 }}>Berlaku Sampai: <Text style={{ color: 'red', fontWeight: '700', fontSize: 12 }}>{formatDate(item.tanggalExpired)}</Text></Text>
                                        </View>
                                        <View
                                            style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginRight: 10,
                                                marginVertical: 5,
                                            }}
                                        >
                                            <Ionicons name="barcode-outline" size={34} color="black" />
                                            <Text style={{ fontSize: 12, color: "#a1a1a1" }}>Show Barcode</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />
                )}
            </View>

            {/* modals */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Pressable style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }} onPress={() => setModalVisible(!modalVisible)}>
                    <View style={styles.modalView}>
                        {loadingModal ? (
                            <ActivityIndicator size="large" color="#021D43" />
                        ) : (
                            <>
                                <Pressable
                                    style={{ marginBottom: 5 }}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <MaterialIcons name="close" color={'#1d1d1d'} size={24} style={{ alignSelf: "flex-end" }} />
                                </Pressable>
                                <View
                                    style={{
                                        margin: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <View>
                                        <Barcode
                                            format="CODE128"
                                            value={data.noVoucher}
                                            width={1.5}
                                            height={80}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginHorizontal: 20,
                                        marginBottom: 20,
                                    }}
                                />
                                <Text
                                    style={{
                                        textAlign: "center",
                                        marginVertical: 5,
                                        fontSize: 12,
                                        color: "#a1a1a1",
                                    }}
                                >
                                    Kode Voucher
                                </Text>
                                <Text
                                    style={{ fontSize: 16, textAlign: "center" }}
                                >
                                    {data.noVoucher}
                                </Text>
                                <Text
                                    style={{ textAlign: "center", marginVertical: 24, fontSize: 12 }}
                                >
                                    Gunakan kode barcode untuk pembelian pada store
                                </Text>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>
            {/* modals */}
        </View >
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 11,
        borderColor: "#C3C3C3",
    },
    topCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#021D43",
        padding: 10,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },
    modalView: {
        top: 100,
        margin: 15,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Voucher;
