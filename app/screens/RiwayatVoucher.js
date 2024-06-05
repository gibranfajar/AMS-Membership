import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';

import Foundation from '@expo/vector-icons/Foundation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiwayatVoucher = ({ navigation }) => {

    const [dataVoucher, setDataVoucher] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
        fetchDataRiwayat();
    }, []);

    const fetchData = async () => {
        try {
            // Ambil token dari penyimpanan lokal (misalnya AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher?id_member=${idMember}`);
            setDataVoucher(response.data.voucherData.length);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    };

    const fetchDataRiwayat = async () => {
        try {
            // Ambil token dari penyimpanan lokal (misalnya AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/history?id_member=${idMember}`);
            setData(response.data.voucherData);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
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
        <View style={{ flex: 1, margin: 20 }}>
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{dataVoucher == "" ? 0 : dataVoucher}</Text>
                    <Text>Voucher</Text>
                </Pressable>
                <Pressable
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                        navigation.navigate("RiwayatVoucher");
                    }}
                >
                    <Foundation name='clipboard-notes' color={'#1d1d1d'} size={20} />
                    <Text>Riwayat</Text>
                </Pressable>
            </View>


            <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => String(item.noVoucher)}
                renderItem={({ item, index }) => {
                    return (
                        <>
                            <View style={styles.list}>
                                <View>
                                    <Text style={{ fontWeight: "bold" }}>Points</Text>
                                    <Text style={{ fontSize: 16 }}>{item.pointVoucher} pts</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ alignItems: "flex-end", marginEnd: 5 }}>
                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>On Store : {item.storeTransaksi}</Text>
                                        <Text>{item.tanggalPenggunaan}</Text>
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