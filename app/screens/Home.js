import { View, Text, StatusBar, StyleSheet, Pressable, ActivityIndicator, Linking, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'expo-image';

const Home = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const flatlistRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto Scroll

    useEffect(() => {
        let interval = setInterval(() => {
            if (activeIndex === promoData.length - 1) {
                flatlistRef.current.scrollToIndex({
                    index: 0,
                    animation: true,
                });
            } else {
                flatlistRef.current.scrollToIndex({
                    index: activeIndex + 1,
                    animation: true,
                });
            }
        }, 2000);

        return () => clearInterval(interval);
    });

    const getItemLayout = (data, index) => ({
        length: widthScreen,
        offset: widthScreen * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
        index: index,
    });

    // Handle Scroll
    const handleScroll = (event) => {
        // Get the scroll position
        const scrollPosition = event.nativeEvent.contentOffset.x;
        // Get the index of current active item

        const index = scrollPosition / widthScreen;

        // Update the index

        setActiveIndex(index);
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Lakukan logika penyegaran di sini
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Contoh: Penyegaran palsu selama 2 detik
    };

    // mengambil lebar layar
    const widthScreen = Dimensions.get('window').width

    // Menampung data koneksi
    const [isConnected, setIsConnected] = useState(null);

    // Menampung data user
    const [data, setData] = useState();
    const [point, setPoint] = useState(0);
    useEffect(() => {
        const savePoints = async () => {
            try {
                await AsyncStorage.setItem('userPoints', point.toString());
            } catch (error) {
                console.error('Failed to save points to AsyncStorage', error);
            }
        };

        savePoints();
    }, [point]);

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

    // Memuat data user dan promo
    useEffect(() => {
        const intervalId = setInterval(fetchData, 3000);
        fetchData();
        promoCarousel();
        return () => clearInterval(intervalId);
    }, []);

    // post notification to server
    const tokenExpo = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const token = await AsyncStorage.getItem('ExpoPushToken');
            const response = await axios.post('https://crm.flies.co.id/public/api/notification', {
                id_member: idMember,
                ExpoPushToken: token,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Token sent to backend:', response.data);
        } catch (error) {
            console.error('Error sending token to backend:', error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => {
        tokenExpo();
    }, []);


    // Fungsi untuk mengambil data user
    const fetchData = async () => {
        try {
            // hapus otp
            await AsyncStorage.removeItem('otp');
            // Ambil idMember dari penyimpanan lokal (AsyncStorage)
            const idMember = await AsyncStorage.getItem('idMember');

            // Kirim permintaan HTTP dengan menyertakan idMember
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`);

            // kirimkan data yang diterima ke dalam state data
            setData(response.data.memberInfoData);
            setPoint(response.data.memberInfoData.sisaPoint);
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
                <Image source={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`} style={{ width: widthScreen, height: 200 }} />
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >

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

                    <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }>
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
                                <Ionicons name='gift-outline' color={'#1d1d1d'} size={24} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                            </Pressable>
                        </View>


                        <View View style={styles.titleCols}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Exclusive Promo</Text>
                            <Pressable onPress={() => navigation.navigate('Promo')}>
                                <Text>View All</Text>
                            </Pressable>
                        </View >


                        {/* CAROUSEL PROMO */}
                        <FlatList
                            data={promoData}
                            ref={flatlistRef}
                            getItemLayout={getItemLayout}
                            renderItem={renderPromo}
                            keyExtractor={(item) => item.id}
                            horizontal={true}
                            pagingEnabled={true}
                            onScroll={handleScroll}
                        />


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
        padding: 25,
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
        marginHorizontal: 23,
        marginBottom: 15
    },
    brandsCols: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    clcs: {
        width: 90,
        height: 17
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
        width: 46,
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
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 160,
        padding: 33,
        borderRadius: 5
    }
});

export default Home