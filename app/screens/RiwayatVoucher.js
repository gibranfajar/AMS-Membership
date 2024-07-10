import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiwayatVoucher = ({ navigation }) => {
    const [dataVoucher, setDataVoucher] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fungsi untuk memuat data riwayat voucher
    const fetchData = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher?id_member=${idMember}`);
            setDataVoucher(response.data.voucherData.length);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk memuat data riwayat
    const fetchDataRiwayat = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/history?id_member=${idMember}`);
            setData(response.data.voucherData);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataRiwayat();
    }, []);

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

    if (loading) {
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
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{dataVoucher == "" ? 0 : dataVoucher}</Text>
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

            {!data ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Tidak ada riwayat voucher</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data}
                    keyExtractor={(item) => String(item.noVoucher)}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                                <View style={styles.list}>
                                    <View>
                                        <Text style={{ fontSize: 12 }}>Point</Text>
                                        <Text style={{ fontSize: 12 }}>{item.pointVoucher}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ alignItems: "flex-end", marginEnd: 5 }}>
                                            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Toko: {item.storeTransaksi}</Text>
                                            <Text style={{ fontSize: 12 }}>{formatDate(item.tanggalPenggunaan)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                    }}
                                />
                            </>
                        )
                    }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8,
        padding: 10,
        borderRadius: 5,
    },
});

export default RiwayatVoucher