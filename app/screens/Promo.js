import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Promo = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState(null);
    const [promoInput, setPromoInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    // Fungsi untuk memeriksa koneksi internet
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);



    // fungsi untuk memuat data promo
    const promo = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/promo/list?id_member=${idMember}`).then((res) => {
                setData(res.data.promoData)
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        promo()
    }, []);



    // Fungsi untuk memfilter data
    const filterData = (item) => {
        if (promoInput === "") {
            return (
                <Pressable
                    onPress={() => {
                        navigation.navigate("PromoDetails", { itemId: item.id });
                    }}
                >
                    <View style={styles.card}>
                        <Image
                            source={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`}
                            style={styles.promo}
                        />
                        <Text style={{ padding: 10, fontSize: 14 }}>
                            {item.promoTitle}
                        </Text>
                    </View>
                </Pressable>
            )
        }

        if (item.promoTitle.toLowerCase().includes(promoInput.toLowerCase()) || item.promoDetail.toLowerCase().includes(promoInput.toLowerCase()) || item.promoLocation.toLowerCase().includes(promoInput.toLowerCase())) {
            return (
                <Pressable
                    onPress={() => {
                        navigation.navigate("PromoDetails", { itemId: item.id });
                    }}
                >
                    <View style={styles.card}>
                        <Image
                            source={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`}
                            style={styles.promo}
                        />
                        <Text style={{ padding: 10, fontSize: 14 }}>
                            {item.promoTitle}
                        </Text>
                    </View>
                </Pressable>
            )
        }
    }


    const clearInput = () => {
        setPromoInput('');
    };


    const onRefresh = () => {
        setRefreshing(true);
        promo();
    };


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={'#021D43'} />
            {isConnected ? (
                <View style={{ flex: 1 }}>
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
                    <View style={styles.inputContainer}>
                        <Ionicons name="search" size={20} color={'#C3C3C3'} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Cari....."
                            onChangeText={(text) => setPromoInput(text)}
                            style={styles.input}
                            value={promoInput}
                        />
                        {promoInput.length > 0 && (
                            <TouchableOpacity onPress={clearInput} style={styles.closeIconContainer}>
                                <Ionicons name="close" size={20} color={'#C3C3C3'} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item) => String(item.id)}
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
        padding: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#021D43'
    },
    logo: {
        width: 100,
        height: 35
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
    card: {
        marginHorizontal: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#C3C3C3",
    },
    promo: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        width: "auto",
        height: 150,
    },
    closeIconContainer: {
        padding: 5,
    },
});

export default Promo