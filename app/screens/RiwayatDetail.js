import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


const RiwayatDetail = ({ setStatus, status }) => {
    const slide = React.useRef(new Animated.Value(300)).current;
    const [List, setList] = useState([])

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

    return (
        <Pressable onPress={closeModal} style={styles.backdrop}>
            <Pressable style={{ width: '100%', height: '40%', }}>
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                    {List.map(item =>
                        <View key={item.id} style={{ marginTop: 10 }}>
                            <View style={styles.list}>
                                <Text>Invoice</Text>
                                <Text style={{ fontSize: 15 }}>{item.invoice}</Text>
                            </View>
                            <View style={styles.list}>
                                <Text>Tanggal</Text>
                                <Text style={{ fontSize: 15 }}>{item.tanggalTransksi}</Text>
                            </View>
                            <View style={styles.list}>
                                <Text>Toko</Text>
                                <Text style={{ fontSize: 15 }}>{item.idStore}</Text>
                            </View>
                            <View style={styles.list}>
                                <Text>Produk</Text>
                                <FlatList
                                    data={item.produk}
                                    renderItem={({ item, index }) => (
                                        <View key={index}>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ marginVertical: 1, fontSize: 15 }}>
                                                    {item.DESKRIPSI} ({item.Net})
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Total</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Rp. {item.total}</Text>
                            </View>
                        </View>
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