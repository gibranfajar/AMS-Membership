import {
    View,
    Text,
    Pressable,
    Modal,
    Image,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { Ionicons } from '@expo/vector-icons';


const Voucher = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [List, setList] = useState([]);
    const [data, setData] = useState({});
    const [dataCount, setDataCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Ambil token dari penyimpanan lokal (misalnya AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher?id_member=${idMember}`);
            setList(response.data.voucherData);
            setDataCount(response.data.voucherData.length);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    };

    const fetchDataById = async (id) => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/detail?id_member=${idMember}&no_voucher=${id}`);
            setData(response.data.voucherData);
            setModalVisible(true);
        } catch (error) {
            console.log(error);
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{dataCount == "" ? 0 : dataCount}</Text>
                    <Text>Voucher</Text>
                </Pressable>
                <Pressable
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                        navigation.navigate("RiwayatVoucher");
                    }}
                >
                    <Ionicons name="document-text-outline" size={24} color={'#1d1d1d'} />
                    <Text>Riwayat</Text>
                </Pressable>
            </View>

            <View
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
            >
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
                                    <Text style={{ color: "white", fontSize: 16 }}>Voucher</Text>
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
                                            // justifyContent: "center",
                                            paddingLeft: 15,
                                        }}
                                    >
                                        <Text style={{ fontSize: 25 }}>Rp. {item.nominal}</Text>
                                        <Text style={{ marginTop: 5 }}>Berlaku Sampai : <Text style={{ color: 'red', fontWeight: '700' }}>{item.tanggalExpired}</Text></Text>
                                    </View>
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
                        </Pressable>
                    )}
                />
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
                        <Pressable
                            style={{ marginBottom: 5 }}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <MaterialIcons name="close" color={'#1d1d1d'} size={24} style={{ alignSelf: "flex-end" }} />
                            {/* <Text style={{ alignSelf: "flex-end" }}>Close</Text> */}
                        </Pressable>
                        <View
                            style={{
                                margin: 20,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ borderColor: "black", borderWidth: StyleSheet.hairlineWidth }}>
                                <Barcode
                                    format="CODE128"
                                    value={data.noVoucher}
                                    style={{ margin: 10 }}
                                />
                            </View>
                            <Text style={{ marginVertical: 10, fontWeight: "bold" }}>
                                Barcode scan
                            </Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: "black",
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                margin: 20,
                            }}
                        />
                        <Text
                            style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}
                        >
                            {data.noVoucher}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                marginVertical: 5,
                            }}
                        >
                            Voucher Code
                        </Text>
                        <Text
                            style={{ textAlign: "center", marginVertical: 20, marginTop: 50 }}
                        >
                            Gunakan kode barcode untuk pembelian pada store atau voucher code
                            untuk pembelian pada website
                        </Text>
                    </View>
                </Pressable>
            </Modal>
            {/* modals */}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 5,
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

export default Voucher