import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Modal, Image, ToastAndroid } from 'react-native';

import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { Ionicons } from '@expo/vector-icons';

const RedeemDetails = ({ route, navigation }) => {
    const { voucherCode } = route.params;
    const [user, setUser] = useState(null);
    const [itemDetail, setItemDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // fungsi untuk memuat data user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const idMember = await AsyncStorage.getItem('idMember');
                const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`);
                setUser(response.data.memberInfoData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user token:', error);
            }
        };

        fetchUser();
    }, []);

    // fungsi untuk memuat data voucher
    const fetchData = async () => {
        try {
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/tukar`).then((res) => {
                const filteredData = res.data.voucherData.filter(item => item.voucherCode === voucherCode);
                setItemDetail(filteredData[0]);
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    // fungsi untuk redeem
    const handleRedeem = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const ipDevice = await Network.getIpAddressAsync();
            let url = "https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/redeem"
            axios({
                method: "POST",
                url: url,
                data: {
                    "id_member": idMember,
                    "voucher_code": voucherCode,
                    "ip_address": ipDevice
                },
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                if (response.data.responseCode == "2002500") {
                    setIsPressed(false);
                    ToastAndroid.show(
                        "Redeem Berhasil!",
                        ToastAndroid.SHORT
                    );
                    modalVisible ? setModalVisible(false) : setModalVisible(true);
                } else if (response.data.responseCode == "4002500") {
                    ToastAndroid.show(
                        "Point Tidak Cukup / Voucher tidak sesuai!",
                        ToastAndroid.SHORT
                    );
                } else {
                    ToastAndroid.show(
                        "Redeem Gagal!",
                        ToastAndroid.SHORT
                    )
                }
            }).catch(function (error) {
                setIsPressed(false);
                console.log(error);
            });
        } catch (error) {
            setIsPressed(false);
            console.log(error);
        }
    }

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


    if (isLoading || loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, margin: 20 }}>
            <Text style={{ fontSize: 16 }}>
                Poin Aktif:{" "}
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{formatNumber(user.sisaPoint)} poin</Text>
            </Text>
            <View style={styles.card}>
                <View style={styles.topCard}>
                    <Text style={{ color: "white", fontSize: 14 }}>Voucher</Text>
                    <Text style={{ fontSize: 12, color: "yellow", fontWeight: "bold" }}>{itemDetail.pointVoucher} Poin</Text>
                </View>
                <Text style={{ fontSize: 20, padding: 20 }}>Rp {formatNumber(itemDetail.nominal)}</Text>
            </View>
            {/* card */}
            <View style={styles.details}>
                <Text>Voucher</Text>
                <Text style={{ color: "#a1a1a1" }}>{formatNumber(itemDetail.nominal)}</Text>
            </View>
            <View style={styles.details}>
                <Text>Poin</Text>
                <Text style={{ color: "#a1a1a1" }}>{itemDetail.pointVoucher}</Text>
            </View>
            <View style={styles.details}>
                <Text>Berlaku hingga</Text>
                <Text style={{ color: "#a1a1a1" }}>{formatDate(itemDetail.toDate)}</Text>
            </View>
            <View
                style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginVertical: 5,
                    marginBottom: 10,
                    marginTop: 20,
                }}
            />
            <View
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
            >
                <Octicons name='info' color={'#1d1d1d'} size={20} style={{ marginEnd: 5 }} />
                <Text style={{ fontSize: 16 }}>Informasi</Text>
            </View>
            <Text style={{ color: "#a1a1a1", fontSize: 14 }}>
                Voucher dapat berlaku untuk pembelian produk distore terdekat.
            </Text>
            <Pressable
                onPress={() => {
                    setIsPressed(true);
                    handleRedeem();
                }}
                style={({ pressed }) => [styles.buttonRedeem, { opacity: pressed ? 0.5 : 1 }]}
            >

                {isPressed ? <ActivityIndicator size="small" color="white" /> : <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Redeem</Text>}

            </Pressable>

            {/* modals */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={{ marginBottom: 5 }}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <MaterialIcons name='close' color={'#1d1d1d'} size={24} style={{ alignSelf: "flex-end" }} />
                            {/* <Text style={{ alignSelf: "flex-end" }}>Close</Text> */}
                        </Pressable>
                        <View style={{ marginHorizontal: 5 }}>
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    marginVertical: 15,
                                    textAlign: "center",
                                }}
                            >
                                Selamat!
                            </Text>
                            <Text
                                style={{ marginTop: 5, marginBottom: 15, textAlign: "center", fontSize: 14 }}
                            >
                                Anda berhasil menukarkan{" "}
                                <Text style={{ fontWeight: "bold", fontSize: 14 }}>{itemDetail.pointVoucher}</Text> poin dengan
                                voucher senilai
                            </Text>
                            {/* card */}
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
                                    <Text style={{ fontSize: 20, padding: 20 }}>Rp {formatNumber(itemDetail.nominal)}</Text>
                                    <View
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 10,
                                            marginVertical: 5,
                                        }}
                                    >
                                        <Ionicons name="barcode-outline" size={30} color="black" />
                                        <Text>Show Barcode</Text>
                                    </View>
                                </View>
                            </View>
                            {/* card */}
                            <Pressable
                                style={{ justifyContent: "center", alignItems: "center" }}
                                onPress={() => {
                                    navigation.replace("Voucher");
                                }}
                            >
                                <Text
                                    style={{
                                        marginVertical: 15,
                                        backgroundColor: "#021D43",
                                        color: "white",
                                        textAlign: "center",
                                        padding: 8,
                                        borderRadius: 25,
                                        fontSize: 12,
                                        width: 250,
                                    }}
                                >
                                    Lihat Voucher
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* modals */}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 20,
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
    details: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    modalView: {
        top: 100,
        margin: 10,
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
    buttonRedeem: {
        backgroundColor: "#021D43",
        color: "white",
        padding: 8,
        borderRadius: 25,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    }
});

export default RedeemDetails;
