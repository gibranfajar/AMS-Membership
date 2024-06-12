import { View, Text, StyleSheet, SafeAreaView, StatusBar, Pressable, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FoundationIcons from '@expo/vector-icons/Foundation';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';

const Profile = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Contoh: Penyegaran palsu selama 2 detik
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        try {
            // Ambil token dari penyimpanan lokal (misalnya AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            // Kirim permintaan HTTP dengan menyertakan token dalam header Authorization
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`);

            // Set data yang diterima ke dalam state data
            setData(response.data.memberInfoData);
            setLoading(false);
        } catch (error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{error.message}</Text>
                </View>
            )
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchData, 1000);
        fetchData();
        return () => clearInterval(intervalId);
    }, []);

    // Tampilkan indikator loading jika data masih dimuat
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('idMember');
            navigation.replace('SignIn');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={'#021D43'} />
            {isConnected ? (
                <View>
                    <View style={styles.container}>
                        <Image
                            source={require("../../assets/logowhite.png")}
                            style={styles.logo}
                        />
                        <Pressable
                            onPress={() => navigation.navigate('Notification')}
                        >
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                        </Pressable>
                    </View>
                    <View style={styles.head}>
                        <View>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginBottom: 5,
                                }}
                            >
                                {data.namaMember}
                            </Text>
                            <Text style={{ color: "white" }}>{data.idMember}</Text>
                        </View>
                        <Pressable
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                navigation.navigate("EditProfile");
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "white", marginEnd: 5 }}>Edit</Text>
                                <FontAwesome6 name='edit' size={18} color={"#fff"} />
                            </View>
                        </Pressable>
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }>
                        {/* riwayat transaksi */}
                        <Pressable
                            onPress={() => {
                                navigation.navigate("RiwayatTransaksi");
                            }}
                        >
                            <View style={styles.list}>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <FoundationIcons name='clipboard-notes' size={20} color={"#1d1d1d"} />
                                    <Text style={{ fontSize: 15, marginStart: 10 }}>
                                        Riwayat Transaksi
                                    </Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                            </View>
                        </Pressable>
                        {/* riwayat transaksi */}
                        {/* tentang kami */}
                        <Pressable
                            onPress={() => {
                                navigation.navigate("AboutUs");
                            }}
                        >
                            <View style={styles.list}>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <Octicons name='info' size={20} color={"#1d1d1d"} />
                                    <Text style={{ fontSize: 15, marginStart: 10 }}>
                                        Tentang Kami
                                    </Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                            </View>
                        </Pressable>
                        {/* tentang kami */}
                        {/* bantuan */}
                        <Pressable
                            onPress={() => {
                                navigation.navigate("Bantuan");
                            }}
                        >
                            <View style={styles.list}>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <Octicons name='question' size={25} color={"#1d1d1d"} />
                                    <Text style={{ fontSize: 15, marginStart: 10 }}>Bantuan</Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                            </View>
                        </Pressable>
                        {/* bantuan */}
                        {/* bantuan */}
                        <Pressable onPress={handleLogout}>
                            <View style={styles.list}>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <Feather name='log-out' size={20} color={"#1d1d1d"} />
                                    <Text style={{ fontSize: 15, marginStart: 10 }}>Logout</Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                            </View>
                        </Pressable>
                        {/* bantuan */}
                    </ScrollView>
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#021D43" />
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#021D43",
    },
    logo: {
        width: 100,
        height: 35,
    },
    head: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        paddingBottom: 50,
        backgroundColor: '#021D43',
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
        marginBottom: 10,
    },
    list: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginVertical: 5,
        borderColor: "#C3C3C3",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
});

export default Profile