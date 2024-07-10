import { View, Text, StatusBar, StyleSheet, Pressable, ActivityIndicator, Linking, Dimensions, ToastAndroid, Modal, Image, RefreshControl } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as Clipboard from 'expo-clipboard';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import * as Brightness from 'expo-brightness';

const Home = ({ navigation }) => {
    const widthScreen = Dimensions.get('window').width;
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState({});
    const [point, setPoint] = useState(0);
    const originalBrightness = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const flatlistRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [promoData, setPromoData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataProfile, setDataProfile] = useState({
        id_member: '',
        namaLengkap: '',
        namaPanggilan: '',
        notelpon: '',
        email: '',
        password: '',
        provinsi: '',
        kota: '',
        alamat: '',
        kelamin: '',
        tglLahir: '',
        minatKategori: '-',
    });

    // Check internet connection
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    // Fetch user data
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
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Fetch promo data
    const promoCarousel = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/promo?id_member=${idMember}`);
            setPromoData(response.data.dashboardPromoData || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        promoCarousel();
    }, []);

    // Save points to AsyncStorage
    const savePoints = async () => {
        try {
            await AsyncStorage.setItem('userPoints', point.toString());
        } catch (error) {
            console.error('Failed to save points to AsyncStorage', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(savePoints, 1000);
        return () => clearInterval(intervalId);
    }, [point]);

    // Adjust brightness based on modal visibility
    useEffect(() => {
        const adjustBrightness = async () => {
            if (modalVisible) {
                if (originalBrightness.current === null) {
                    originalBrightness.current = await Brightness.getBrightnessAsync();
                }
                const { status } = await Brightness.requestPermissionsAsync();
                if (status === 'granted') {
                    await Brightness.setBrightnessAsync(100);
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

    // Auto-scroll promo carousel
    useEffect(() => {
        let interval = setInterval(() => {
            if (activeIndex === promoData.length - 1) {
                setActiveIndex(0);
                flatlistRef.current?.scrollToIndex({ index: 0, animated: true });
            } else {
                setActiveIndex(prevIndex => prevIndex + 1);
                flatlistRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [activeIndex, promoData]);

    // Handle scroll event in promo carousel
    const handleScroll = (event) => {
        const index = Math.floor(event.nativeEvent.contentOffset.x / widthScreen);
        setActiveIndex(index);
    };

    // Handle push notification
    useEffect(() => {
        const expoPushNotif = async () => {
            const tokenDevice = await AsyncStorage.getItem('tokenDevice');
            const idMember = await AsyncStorage.getItem('idMember');
            if (tokenDevice) {
                try {
                    axios.post('https://golangapi-j5iu.onrender.com/api/member/mobile/token/notification', {
                        id_member: idMember,
                        ExpoPushToken: tokenDevice
                    }).then(res => {
                        console.log(res.data);
                    }).catch(err => {
                        console.log("CRM: ", err);
                    })
                } catch (error) {
                    console.log("CRM : ", error);
                }
            }
            if (tokenDevice) {
                try {
                    axios.post('https://crm.flies.co.id/public/api/notification', {
                        id_member: idMember,
                        ExpoPushToken: tokenDevice
                    }).then(res => {
                        console.log(res.data);
                    }).catch(err => {
                        console.log("Flies: ", err);
                    })
                } catch (error) {
                    console.log("Flies : ", error);
                }
            }
        }

        expoPushNotif();
    }, []);

    useEffect(() => {
        const fetchDataProfile = async () => {
            try {
                const idMember = await AsyncStorage.getItem('idMember');
                const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/profile?id_member=${idMember}`);
                setDataProfile({
                    id_member: idMember,
                    namaLengkap: response.data.memberData.nama,
                    namaPanggilan: response.data.memberData.namaPanggilan,
                    notelpon: response.data.memberData.notelpon,
                    email: response.data.memberData.email,
                    provinsi: response.data.memberData.idProvinsi,
                    kota: response.data.memberData.idKota,
                    alamat: response.data.memberData.alamat,
                    kelamin: response.data.memberData.jenisKelamin === 'PRIA' ? 'l' : 'p',
                    tglLahir: response.data.memberData.tanggalLahir,
                    minatKategori: '-',
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchDataProfile();
    }, []);


    // Refresh data
    const onRefresh = () => {
        setRefreshing(true);
        savePoints();
        fetchData();
        promoCarousel();
    };

    // Copy text to clipboard
    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show('Copied to Clipboard', ToastAndroid.SHORT);
    };

    // Render promo items in FlatList
    const renderPromo = ({ item }) => (
        <Pressable onPress={() => navigation.navigate("PromoDetails", { itemId: item.id })}>
            <Image source={{ uri: `https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}` }} style={{ width: widthScreen, height: 200 }} />
        </Pressable>
    );

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value;

        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 5) return phoneNumber;

        const formattedPhoneNumber = `${phoneNumber.slice(
            0,
            4
        )}-${phoneNumber.slice(4, 8)}`;

        if (phoneNumberLength < 9) return formattedPhoneNumber;

        return `${formattedPhoneNumber}-${phoneNumber.slice(8, 12)}`;
    };

    // Render loading indicator if still loading
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    // Render content if connected to the internet
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
                        <Pressable onPress={() => navigation.navigate('Notification')}>
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center', marginHorizontal: 10 }} />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >

                        {/* User Info Section */}
                        <View style={styles.head}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <View>
                                    <Text style={styles.textHead}>
                                        {data.namaMember}
                                    </Text>
                                    <Pressable onPress={() => copyToClipboard(data.idMember)}>
                                        <Text style={{ color: "white", fontSize: 12 }}>{data.idMember}</Text>
                                    </Pressable>
                                </View>
                                <Pressable
                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => {
                                        setModalVisible(true);
                                    }}
                                >
                                    <MaterialCommunityIcons name="barcode" size={26} color="#fff" />
                                </Pressable>
                            </View>
                        </View>

                        {/* Barcode Modal */}
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <Pressable style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }} onPress={() => setModalVisible(false)}>
                                <View style={styles.modalView}>
                                    <Pressable
                                        style={{ marginBottom: 5, margin: 10 }}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <MaterialIcons name="close" color={'#1d1d1d'} size={24} style={{ alignSelf: "flex-end" }} />
                                    </Pressable>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ marginBottom: 20, fontWeight: "bold", fontSize: 20 }}>
                                            {data.namaMember}
                                        </Text>

                                        <View style={{ backgroundColor: "#f8fafc", width: "100%", marginBottom: 24, justifyContent: "center", alignItems: "center", paddingVertical: 10 }}>
                                            <Text style={{ fontSize: 12, marginBottom: 5, color: "#a1a1aa" }}>
                                                Nomor Telepon Anda
                                            </Text>
                                            <Text style={{ fontSize: 16 }}>
                                                {formatPhoneNumber(dataProfile.notelpon)}
                                            </Text>
                                        </View>

                                        <Barcode
                                            format="CODE128"
                                            value={data.idMember}
                                            width={1.5}
                                            height={60}
                                        />
                                    </View>
                                    <Text style={{ textAlign: "center", marginTop: 20, color: "#a1a1aa", fontSize: 12 }}>
                                        ID Member
                                    </Text>
                                    <Text style={{ fontSize: 16, textAlign: "center" }}>
                                        {data.idMember}
                                    </Text>
                                    <Text style={{ textAlign: "center", marginVertical: 20, marginTop: 30, fontSize: 12 }}>
                                        Perlihatkan ID Member Anda pada kasir
                                    </Text>
                                </View>
                            </Pressable>
                        </Modal>

                        {/* Card Menu Section */}
                        <View style={{ backgroundColor: '#ffffff', marginBottom: 15, marginHorizontal: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingHorizontal: 20, zIndex: 1, marginTop: -30 }}>
                            <View style={styles.cardMenu}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{formatNumber(point)}</Text>
                                <Text style={{ fontSize: 12, color: '#a1a1a1' }}>Poin Aktif</Text>
                            </View>
                            <Pressable style={styles.cardMenu} onPress={() => navigation.navigate("Voucher")}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{data.totalVoucher}</Text>
                                <Text style={{ fontSize: 12, color: '#a1a1a1' }}>Voucher</Text>
                            </Pressable>
                            <Pressable style={styles.cardMenu} onPress={() => navigation.navigate("Gift")}>
                                <Ionicons name='gift-outline' color={'#1d1d1d'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                                <Text style={{ fontSize: 12, color: '#a1a1a1' }}>Gift</Text>
                            </Pressable>
                        </View>

                        {/* Exclusive Promo Section */}
                        <View style={styles.titleCols}>
                            <Text style={{ fontSize: 16 }}>Exclusive Promo</Text>
                            <Pressable onPress={() => navigation.navigate('Promo')}>
                                <Text style={{ fontSize: 12, color: '#a1a1a1' }}>Lihat Semua</Text>
                            </Pressable>
                        </View>

                        {/* Promo Carousel Section */}
                        <FlatList
                            data={promoData}
                            ref={flatlistRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id}
                            renderItem={renderPromo}
                            getItemLayout={(data, index) => ({ length: widthScreen, offset: widthScreen * index, index })}
                            onScroll={handleScroll}
                        />

                        {/* Additional Section */}
                        <View style={{ backgroundColor: '#021D43', marginBottom: 15, padding: 10, marginVertical: 20 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Explore member <Text style={{ color: 'yellow', fontStyle: 'italic' }}>benefit</Text></Text>
                        </View>

                        {/* Brands Section */}
                        <View style={styles.titleCols}>
                            <Text style={{ fontSize: 16 }}>Brands</Text>
                        </View>
                        <View style={styles.brandsCols}>
                            <Pressable onPress={() => Linking.openURL('https://clcs.co.id')}>
                                <View style={styles.card}>
                                    <Image source={require('../../assets/logocls.png')} style={styles.clcs} />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => Linking.openURL('https://www.mississippiladies.com/')}>
                                <View style={styles.card}>
                                    <Image source={require('../../assets/logomsp.png')} style={styles.msp} />
                                </View>
                            </Pressable>
                        </View>
                        <View style={styles.brandsCols}>
                            <Pressable onPress={() => Linking.openURL('https://queensland.id/')}>
                                <View style={styles.card}>
                                    <Image source={require('../../assets/logoqsl.png')} style={styles.qs} />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => Linking.openURL('https://flies.co.id/')}>
                                <View style={styles.card}>
                                    <Image source={require('../../assets/logoflies.png')} style={styles.flies} />
                                </View>
                            </Pressable>
                        </View>

                    </ScrollView>
                </View>
            ) : (
                // No Internet Connection View
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#021D43" />
                </View>
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#021D43'
    },
    head: {
        padding: 25,
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardMenu: {
        justifyContent: 'center', alignItems: 'center'
    },
    titleCols: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
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

export default Home;
