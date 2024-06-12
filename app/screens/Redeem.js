import { ActivityIndicator, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, RefreshControl } from 'react-native-gesture-handler'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/tukar?id_member=7B0792985D584A5C9BDA85469662C58E";

const Redeem = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redeemInput, setRedeemInput] = useState("");

    const [point, setPoint] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Contoh: Penyegaran palsu selama 2 detik
    };

    useEffect(() => {
        const loadPoints = async () => {
            try {
                const savedPoints = await AsyncStorage.getItem('userPoints');
                if (savedPoints !== null) {
                    setPoint(parseInt(savedPoints, 10));
                }
            } catch (error) {
                console.error('Failed to load points from AsyncStorage', error);
            }
        };

        loadPoints();
    }, []);



    // fungsi untuk memeriksa koneksi internet
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
            const idMember = AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/tukar?id_member=${idMember}`).then((res) => {
                setData(res.data.voucherData);
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

    useEffect(() => {
        axios.get(API_URL)
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                setData(data.voucherData);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, []);

    const filterData = (item) => {
        const isDisabled = point < item.pointVoucher;
        if (redeemInput === "") {
            return (
                <Pressable
                    onPress={() => {
                        if (!isDisabled) {
                            navigation.navigate("RedeemDetails", { voucherCode: item.voucherCode });
                        }
                    }}
                    disabled={isDisabled}
                >
                    <View style={[styles.card, isDisabled && styles.cardDisabled]}>
                        <View style={styles.topCard}>
                            <Text style={{ color: "white", fontSize: 16 }}>Voucher</Text>
                            <Text style={{ color: "yellow" }}>{item.pointVoucher} Point</Text>
                        </View>
                        <Text style={{ fontSize: 25, padding: 20 }}>Rp. {item.nominal}</Text>
                    </View>
                </Pressable>
            )
        }

        if (item.nominal.toString().toLowerCase().includes(redeemInput.toLowerCase()) || item.pointVoucher.toString().toLowerCase().includes(redeemInput.toLowerCase())) {
            return (
                <Pressable
                    onPress={() => {
                        if (!isDisabled) {
                            navigation.navigate("RedeemDetails", { voucherCode: item.voucherCode });
                        }
                    }}
                    disabled={isDisabled}
                >
                    <View style={[styles.card, isDisabled && styles.cardDisabled]}>
                        <View style={styles.topCard}>
                            <Text style={{ color: "white", fontSize: 16 }}>Voucher</Text>
                            <Text style={{ color: "yellow" }}>{item.pointVoucher} Point</Text>
                        </View>
                        <Text style={{ fontSize: 25, padding: 20 }}>Rp. {item.nominal}</Text>
                    </View>
                </Pressable>
            )
        }
    }

    if (isLoading) {
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
                <View style={{ flex: 1 }}>

                    <View style={styles.container}>
                        <Image
                            source={require("../../assets/logowhite.png")}
                            style={styles.logoAms}
                        />
                        <Pressable onPress={() => navigation.navigate('Notification')} >
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                        </Pressable>
                    </View>

                    <TextInput
                        placeholder="Search....."
                        onChangeText={(text) => setRedeemInput(text)}
                        style={styles.searchBar}
                    />

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={({ item }) => filterData(item)}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
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
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#021D43'
    },
    logoAms: {
        width: 100,
        height: 35
    },
    searchBar: {
        borderWidth: 1,
        borderColor: "#C3C3C3",
        margin: 15,
        padding: 5,
        borderRadius: 5,
    },
    card: {
        marginHorizontal: 15,
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
    cardDisabled: {
        backgroundColor: '#C3C3C3',  // Ganti warna untuk menunjukkan card ter-disable
        opacity: 0.6,
    },
});

export default Redeem

