import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Modal, Image, ToastAndroid } from 'react-native';

import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

const RedeemDetails = ({ route, navigation }) => {
    const { voucherCode } = route.params;
    const [user, setUser] = useState(null);
    const [itemDetail, setItemDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Mengambil token pengguna dari penyimpanan lokal (misalnya AsyncStorage)
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

    const handleRedeem = async () => {

        try {
            // Mengambil token pengguna dari penyimpanan lokal (misalnya AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');
            // mengambil IP Address pengguna
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
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchItemDetail = async () => {
            const idMember = await AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/tukar?id_member=${idMember}`).then((res) => {
                const filteredData = res.data.voucherData.filter(item => item.voucherCode === voucherCode);
                setItemDetail(filteredData[0]);
                setIsLoading(false)
            }).catch((error) => {
                console.log(error);
            })
        }
        fetchItemDetail();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, margin: 15 }}>
            <Text style={{ fontSize: 20 }}>
                Active Points :{" "}
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>{user.sisaPoint} pts</Text>
            </Text>
            <View style={styles.card}>
                <View style={styles.topCard}>
                    <Text style={{ color: "white", fontSize: 16 }}>Voucher</Text>
                    <Text style={{ color: "yellow" }}>{itemDetail.pointVoucher} Point</Text>
                </View>
                <Text style={{ fontSize: 25, padding: 20 }}>Rp. {itemDetail.nominal}</Text>
            </View>
            {/* card */}
            <View style={styles.details}>
                <Text>Voucher</Text>
                <Text>{itemDetail.nominal}</Text>
            </View>
            <View style={styles.details}>
                <Text>Points</Text>
                <Text>{itemDetail.pointVoucher} pts</Text>
            </View>
            <View style={styles.details}>
                <Text>Berlaku Sampai</Text>
                <Text>{itemDetail.toDate}</Text>
            </View>
            <View
                style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginVertical: 5,
                }}
            />
            <View
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
            >
                <Octicons name='info' color={'#1d1d1d'} size={20} style={{ marginEnd: 5 }} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Information</Text>
            </View>
            <Text>
                Voucher dapat berlaku untuk pembelian produk distore.
            </Text>
            <Pressable
                style={styles.submitButton}
                onPress={handleRedeem}
            >
                <Text
                    style={{
                        backgroundColor: "#021D43",
                        color: "white",
                        textAlign: "center",
                        padding: 10,
                        borderRadius: 25,
                        fontWeight: "bold",
                        fontSize: 15,
                    }}
                >
                    Redeem
                </Text>
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
                                    fontSize: 24,
                                    marginVertical: 15,
                                    textAlign: "center",
                                }}
                            >
                                Selamat!!!
                            </Text>
                            <Text
                                style={{ marginTop: 5, marginBottom: 15, textAlign: "center" }}
                            >
                                Anda berhasil menukarkan{" "}
                                <Text style={{ fontWeight: "bold" }}>{itemDetail.pointVoucher}</Text> point dengan
                                voucher senilai
                            </Text>
                            {/* card */}
                            <View style={styles.card}>
                                <View style={styles.topCard}>
                                    <Text style={{ color: "white", fontSize: 16 }}>Voucher</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 25, padding: 20 }}>Rp. {itemDetail.nominal}</Text>
                                    <View
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 10,
                                            marginVertical: 5,
                                        }}
                                    >
                                        <Image source={require("../../assets/barcode.png")} />
                                        <Text>Tampilkan Barcode</Text>
                                    </View>
                                </View>
                            </View>
                            {/* card */}
                            <Pressable
                                style={{ justifyContent: "center", alignItems: "center" }}
                                onPress={() => {
                                    navigation.navigate("Voucher");
                                }}
                            >
                                <Text
                                    style={{
                                        marginVertical: 15,
                                        backgroundColor: "#021D43",
                                        color: "white",
                                        textAlign: "center",
                                        padding: 10,
                                        borderRadius: 25,
                                        fontWeight: "bold",
                                        fontSize: 15,
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
        marginVertical: 10,
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
    submitButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
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
});

export default RedeemDetails;
