import { ActivityIndicator, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Redeem = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState(null);
    const [point, setPoint] = useState(0);
    const [redeemInput, setRedeemInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    // fungsi untuk memeriksa koneksi internet
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);



    // Fungsi untuk memuat data promo
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
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    // Fungsi untuk memuat point
    const loadPoints = async () => {
        try {
            const savedPoints = await AsyncStorage.getItem('userPoints');
            if (savedPoints !== null) {
                setPoint(parseInt(savedPoints));
            }
        } catch (error) {
            console.error('Failed to load points from AsyncStorage', error);
        }
    };

    useEffect(() => {
        loadPoints();
    }, []);



    // Fungsi untuk memfilter data
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
                        <Text style={{ fontSize: 25, padding: 20 }}>Rp. {formatNumber(item.nominal)}</Text>
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
                        <Text style={{ fontSize: 25, padding: 20 }}>Rp. {formatNumber(item.nominal)}</Text>
                    </View>
                </Pressable>
            )
        }
    }



    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const clearInput = () => {
        setRedeemInput('');
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData()
        loadPoints()
    }, []);


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

                    <View style={styles.inputContainer}>
                        <Ionicons name="search" size={20} color={'#C3C3C3'} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search....."
                            onChangeText={(text) => setRedeemInput(text)}
                            style={styles.input}
                            value={redeemInput}
                        />
                        {redeemInput.length > 0 && (
                            <TouchableOpacity onPress={clearInput} style={styles.closeIconContainer}>
                                <Ionicons name="close" size={20} color={'#C3C3C3'} />
                            </TouchableOpacity>
                        )}
                    </View>

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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C3C3C3',
        margin: 15,
        borderRadius: 5,
    },
    searchIcon: {
        width: 18,
        height: 24,
        marginHorizontal: 10,
    },
    input: {
        flex: 1, // agar TextInput dapat mengisi sisa ruang yang tersedia
        padding: 5,
        fontSize: 16,
    },
    closeIconContainer: {
        padding: 5,
    },
});

export default Redeem

