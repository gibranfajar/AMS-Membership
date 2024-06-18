import { View, Text, StatusBar, StyleSheet, Pressable, ActivityIndicator, Linking, Dimensions, ToastAndroid, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import * as Brightness from 'expo-brightness';

const Home = ({ navigation }) => {
    const widthScreen = Dimensions.get('window').width
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState("");
    const [point, setPoint] = useState(0);
    const [promoData, setPromoData] = useState();
    const originalBrightness = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const flatlistRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
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
            await AsyncStorage.removeItem('otp');
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`);
            setData(response.data.memberInfoData);
            setPoint(response.data.memberInfoData.sisaPoint);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    // Fungsi untuk mengambil data promo
    const promoCarousel = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/promo?id_member=${idMember}`);
            setPromoData(response.data.dashboardPromoData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
            setRefreshing(false);
        }
    };

    useEffect(() => {
        promoCarousel();
    }, []);



    // Fungsi untuk menyimpan point
    const savePoints = async () => {
        try {
            await AsyncStorage.setItem('userPoints', point.toString());
        } catch (error) {
            console.error('Failed to save points to AsyncStorage', error);
        }
    };

    useEffect(() => {
        savePoints();
    }, [point]);



    // Fungsi untuk mengatur brightness
    useEffect(() => {
        const adjustBrightness = async () => {
            if (modalVisible) {
                if (originalBrightness.current === null) {
                    originalBrightness.current = await Brightness.getBrightnessAsync();
                }
                const { status } = await Brightness.requestPermissionsAsync();
                if (status === 'granted') {
                    await Brightness.setBrightnessAsync(5);
                } else {
                    console.warn("WRITE_SETTINGS permission not granted");
                }
            } else {
                if (originalBrightness.current !== null) {
                    await Brightness.setBrightnessAsync(originalBrightness.current);
                    originalBrightness.current = null;
                }
            }
        };

        adjustBrightness();
    }, [modalVisible]);



    // Fungsi untuk mengatur interval promo slide
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
        offset: widthScreen * index,
        index: index,
    });

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = scrollPosition / widthScreen;
        setActiveIndex(index);
    };

    // Fungsi untuk refresh
    const onRefresh = () => {
        setRefreshing(true);
        savePoints();
        fetchData();
        promoCarousel();
    };

    // post notification to server
    useEffect(() => {
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
                console.log('Error sending token to backend:', error);
            }
        }

        tokenExpo();
    }, []);


    // Tampilkan indikator loading jika data masih dimuat / masih bernilai true
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    // Fungsi untuk menyalin teks
    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show('Copied to Clipboard', ToastAndroid.SHORT);
    };

    // Render data promo ke dalam FlatList
    const renderPromo = ({ item }) => {
        return (
            <Pressable onPress={() => navigation.navigate("PromoDetails", { itemId: item.id })}>
                <Image source={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`} style={{ width: widthScreen, height: 200 }} />
            </Pressable>
        )
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };


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
                                <Pressable onPress={() => copyToClipboard(data.idMember)}>
                                    <Text style={{ color: "white" }}>{data.idMember}</Text>
                                </Pressable>
                            </View>
                            <Pressable
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialCommunityIcons name="barcode" size={26} color="#fff" />
                                </View>
                            </Pressable>
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
                                    </Pressable>
                                    <View
                                        style={{
                                            margin: 20,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ marginBottom: 20, fontWeight: "bold", fontSize: 20 }}>
                                            {data.namaMember}
                                        </Text>
                                        <View style={{ borderColor: "black", borderWidth: StyleSheet.hairlineWidth }}>
                                            <Barcode
                                                format="CODE128"
                                                value={data.idMember}
                                                style={{ margin: 10 }}
                                                width={1.5}
                                                height={80}
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
                                        style={{ fontSize: 18, textAlign: "center" }}
                                    >
                                        {data.idMember}
                                    </Text>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            marginVertical: 5,
                                        }}
                                    >
                                        ID Member
                                    </Text>
                                    <Text
                                        style={{ textAlign: "center", marginVertical: 20, marginTop: 30 }}
                                    >
                                        Perlihatkan ID Member anda pada kasir
                                    </Text>
                                </View>
                            </Pressable>
                        </Modal>
                        {/* modals */}


                        {/* cardMenu */}
                        <View style={{ backgroundColor: '#ffffff', marginBottom: 15, marginHorizontal: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingHorizontal: 20, zIndex: 1, marginTop: -30 }}>
                            {/* Active Point */}
                            <View style={styles.cardMenu}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{formatNumber(point)}</Text>
                                <Text>Active Point</Text>
                            </View>

                            {/* Voucher */}
                            <Pressable style={styles.cardMenu} onPress={() => { navigation.navigate("Voucher") }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.totalVoucher}</Text>
                                <Text>Voucher</Text>
                            </Pressable>


                            {/* Gift */}
                            <Pressable style={styles.cardMenu} onPress={() => { navigation.navigate("Gift") }}>
                                <Ionicons name='gift-outline' color={'#1d1d1d'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                                <Text>Gift</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default Home