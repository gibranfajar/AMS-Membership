import { View, Text, StatusBar, StyleSheet, Pressable, ActivityIndicator, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'expo-image';

const Home = ({ navigation }) => {
    // mengambil lebar layar
    const widthScreen = Dimensions.get('window').width

    // Menampung data koneksi
    const [isConnected, setIsConnected] = useState(null);

    // Menampung data user
    const [data, setData] = useState();

    // Menampung data promo
    const [promoData, setPromoData] = useState();

    // menampung data loading
    const [loading, setLoading] = useState(true);

    // Fungsi untuk memeriksa koneksi internet
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Fungsi untuk mengambil data user
    const fetchData = async () => {
        try {
            // Ambil idMember dari penyimpanan lokal (AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            // Kirim permintaan HTTP dengan menyertakan idMember
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`);

            // kirimkan data yang diterima ke dalam state data
            setData(response.data.memberInfoData);
            // ubah loading menjadi false
            setLoading(false);
        } catch (error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{error.message}</Text>
                </View>
            )
        }
    };

    // Fungsi untuk mengambil data promo
    const promoCarousel = async () => {
        try {
            // Ambil token dari penyimpanan lokal (misalnya AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            // Kirim permintaan HTTP dengan menyertakan token dalam API
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/promo?id_member=${idMember}`);

            // kirimkan data yang diterima ke dalam state promoData
            setPromoData(response.data.dashboardPromoData);
            // ubah loading menjadi false

            const timer = setTimeout(() => {
                setLoading(false);
            }, 5000);

            return () => clearTimeout(timer);

        } catch (error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{error.message}</Text>
                </View>
            )
        }
    };

    // Memuat data user dan promo
    useEffect(() => {
        const intervalId = setInterval(fetchData, 1000);
        fetchData();
        promoCarousel();
        return () => clearInterval(intervalId);
    }, []);

    // Tampilkan indikator loading jika data masih dimuat / masih bernilai true
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    // Render data promo ke dalam FlatList
    const renderPromo = ({ item }) => {
        return (
            <Pressable onPress={() => navigation.navigate("PromoDetails", { itemId: item.id })}>
                <Image source={`https://web.amscorp.id:3060/imagestorage/${item.imageUrl}`} style={{ width: widthScreen, height: 200 }} />
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <StatusBar backgroundColor={'#021D43'} />

            {/* Jika terhubung ke internet */}
            {isConnected ? (
                <View style={{ flex: 1 }}>

                    <View style={styles.container}>
                        <Image
                            source={require("../../assets/logowhite.png")}
                            style={styles.logoAms}
                        />
                        <Pressable onPress={() => navigation.navigate('Notification')}>
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.head}>
                            <View>
                                <Text style={styles.textHead}>
                                    {data.namaMember}
                                </Text>
                                <Text style={{ color: "white" }}>{data.idMember}</Text>
                            </View>
                        </View>


                        {/* cardMenu */}
                        <View style={{ backgroundColor: '#ffffff', marginBottom: 15, marginHorizontal: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingHorizontal: 20, zIndex: 1, marginTop: -30 }}>
                            {/* Active Point */}
                            <View style={styles.cardMenu}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.sisaPoint}</Text>
                                <Text>Active Point</Text>
                            </View>

                            {/* Voucher */}
                            <Pressable style={styles.cardMenu} onPress={() => { navigation.navigate("Voucher") }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.totalVoucher}</Text>
                                <Text>Voucher</Text>
                            </Pressable>


                            {/* Gift */}
                            <Pressable style={styles.cardMenu} onPress={() => { navigation.navigate("Voucher") }}>
                                <FontAwesome6 name='gift' color={'#1d1d1d'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                            </Pressable>
                        </View>


                        <View View style={styles.titleCols}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Exclusive Promo</Text>
                            <Pressable onPress={() => navigation.navigate('Promo')}>
                                <Text>View All</Text>
                            </Pressable>
                        </View >


                        {/* CAROUSEL PROMO */}
                        <FlatList data={promoData} renderItem={renderPromo} horizontal pagingEnabled showsHorizontalScrollIndicator={false} />


                        <View style={{ backgroundColor: '#021D43', marginBottom: 15, padding: 10, marginVertical: 20 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Explore member <Text style={{ color: 'yellow', fontStyle: 'italic' }}>benefit</Text></Text>
                        </View>


                        <View style={styles.titleCols}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Our Brands</Text>
                            <Text>View All</Text>
                        </View>

                        <View style={styles.brandsCols}>
                            <Pressable onPress={() => Linking.openURL('https://clcs.co.id')}>
                                <View style={styles.card}>
                                    <Image
                                        source={require('../../assets/logocls.png')}
                                        style={styles.clcs}
                                    />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => Linking.openURL('https://www.mississippiladies.com/')}>
                                <View style={styles.card}>
                                    <Image
                                        source={require('../../assets/logomsp.png')}
                                        style={styles.msp}
                                    />
                                </View>
                            </Pressable>
                        </View>

                        <View style={styles.brandsCols}>
                            <Pressable onPress={() => Linking.openURL('https://queensland.id/')}>
                                <View style={styles.card}>
                                    <Image
                                        source={require('../../assets/logoqsl.png')}
                                        style={styles.qs}
                                    />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => Linking.openURL('https://flies.co.id/')}>
                                <View style={styles.card}>
                                    <Image
                                        source={require('../../assets/logoflies.png')}
                                        style={styles.flies}
                                    />
                                </View>
                            </Pressable>
                        </View>

                    </ScrollView>
                </View >
            ) : ( // jika tidak terhubung ke internet
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#021D43" />
                </View>
            )}

        </SafeAreaView >

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
    head: {
        padding: 20,
        paddingBottom: 50,
        backgroundColor: '#021D43',
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
    },
    logoAms: {
        width: 100,
        height: 35
    },
    textHead: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    cardMenu: {
        justifyContent: 'center', alignItems: 'center'
    },
    titleCols: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 15
    },
    brandsCols: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    clcs: {
        width: 130,
        height: 25
    },
    msp: {
        width: 130,
        height: 20
    },
    qs: {
        width: 130,
        height: 20
    },
    flies: {
        width: 60,
        height: 20
    },
    head: {
        padding: 20,
        paddingBottom: 50,
        backgroundColor: '#021D43',
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
    },
    card: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 160,
        padding: 30,
        borderRadius: 5
    }
});

export default Home