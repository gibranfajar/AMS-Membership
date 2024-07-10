import { View, Text, StyleSheet, SafeAreaView, StatusBar, Pressable, ActivityIndicator, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const Profile = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // mengambil informasi koneksi internet
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    // Fungsi untuk memuat data profil
    const fetchData = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`);
            setData(response.data.memberInfoData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, []);


    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show('Copied to Clipboard', ToastAndroid.SHORT);
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('idMember');
        } catch (error) {
            console.error('Failed to log out', error);
        } finally {
            navigation.replace('SignIn');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

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
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center', marginHorizontal: 10 }} />
                        </Pressable>
                    </View>
                    <View style={styles.head}>
                        <View>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    marginBottom: 5,
                                }}
                            >
                                {data.namaMember}
                            </Text>
                            <Pressable onPress={() => copyToClipboard(data.idMember)}>
                                <Text style={{ color: "white", fontSize: 12 }}>{data.idMember}</Text>
                            </Pressable>
                        </View>
                        <Pressable
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                navigation.navigate("EditProfile");
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "white", marginEnd: 5, fontSize: 12 }}>Edit</Text>
                                <FontAwesome6 name='edit' size={16} color={"#fff"} />
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
                                    <Ionicons name="document-text-outline" size={20} color={'#1d1d1d'} />
                                    <Text style={{ fontSize: 14, marginStart: 10 }}>
                                        Riwayat Transaksi
                                    </Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
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
                                    <Ionicons name="information-circle-outline" size={20} color="black" />
                                    <Text style={{ fontSize: 14, marginStart: 10 }}>
                                        Tentang Kami
                                    </Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
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
                                    <Ionicons name="help-circle-outline" size={20} color="black" />
                                    <Text style={{ fontSize: 14, marginStart: 10 }}>Bantuan</Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
                            </View>
                        </Pressable>
                        {/* bantuan */}
                        {/* bantuan */}
                        <Pressable onPress={handleLogout}>
                            <View style={styles.list}>
                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                    <Ionicons name="log-out-outline" size={20} color="black" />
                                    <Text style={{ fontSize: 14, marginStart: 10 }}>Keluar</Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
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
        padding: 13,
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
        padding: 14,
        borderRadius: 5,
    },
});

export default Profile