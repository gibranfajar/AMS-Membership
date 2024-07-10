import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


const RiwayatDetail = ({ setStatus, status }) => {
    const slide = React.useRef(new Animated.Value(300)).current;
    const [List, setList] = useState([])
    const [loading, setLoading] = useState(true);

    // fungsi untuk memuat data riwayat berdasarkan status(invoice)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const idmember = await AsyncStorage.getItem('idMember');
                axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/transaction/history?id_member=${idmember}`).then((res) => {
                    const filteredData = res.data.transactionData.filter(item => item.invoice === status);
                    setList(filteredData);
                    setLoading(false)
                }).catch((error) => {
                    return (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{error.message}</Text>
                        </View>
                    )
                })
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    const slideUp = () => {
        Animated.timing(slide, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slide, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };


    useEffect(() => {
        slideUp()
    })


    const closeModal = () => {
        slideDown();
        setTimeout(() => {
            setStatus(false);
        }, 200)
    }

    const formatDate = (dateString) => {
        // Input validation
        if (!dateString || typeof dateString !== "string") {
            return "Invalid date";
        }

        let parts = dateString.split("/");
        if (parts.length !== 3) {
            return "Invalid date format. Please use dd/mm/yyyy";
        }

        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return "Invalid date components";
        }

        let dateObj = new Date(year, month - 1, day);

        let monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        let monthName = monthNames[dateObj.getMonth()];
        let formattedYear = dateObj.getFullYear();

        let formattedDate = `${day} ${monthName} ${formattedYear}`;

        return formattedDate;
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <Pressable onPress={closeModal} style={styles.backdrop}>
            <Pressable style={{ width: '100%', height: '40%', }}>
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#1d1d1d" />
                        </View>
                    ) : (
                        <>
                            {
                                List.map(item =>
                                    <View key={item.id} style={{ marginTop: 10 }}>
                                        <View style={styles.list}>
                                            <Text style={{ fontSize: 12 }}>Faktur</Text>
                                            <Text style={{ fontSize: 12, color: '#a1a1a1' }}>{item.invoice}</Text>
                                        </View>
                                        <View style={styles.list}>
                                            <Text style={{ fontSize: 12 }}>Tanggal</Text>
                                            <Text style={{ fontSize: 12, color: '#a1a1a1' }}>{formatDate(item.tanggalTransksi)}</Text>
                                        </View>
                                        <View style={styles.list}>
                                            <Text style={{ fontSize: 12 }}>Toko</Text>
                                            <Text style={{ fontSize: 12, color: '#a1a1a1' }}>{item.idStore}</Text>
                                        </View>
                                        <View style={styles.list}>
                                            <Text style={{ fontSize: 12 }}>Produk</Text>
                                            <FlatList
                                                data={item.produk}
                                                renderItem={({ item, index }) => (
                                                    <View key={index}>
                                                        <View style={{ alignItems: 'flex-end' }}>
                                                            <Text style={{ marginVertical: 1, fontSize: 12, color: '#a1a1a1' }}>
                                                                {item.DESKRIPSI} ({formatNumber(item.Net)})
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                borderBottomColor: "gray",
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                                marginVertical: 15,
                                            }}
                                        />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Total</Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Rp {formatNumber(item.total)}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </>
                    )}
                </Animated.View>
            </Pressable>

        </Pressable>
    )
}


export default RiwayatDetail;


const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    bottomSheet: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bcbcbc',
        paddingHorizontal: 15,
        marginBottom: 10
    },
    list: {
        paddingVertical: 2,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})