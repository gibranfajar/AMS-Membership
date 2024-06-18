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

const Gift = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState(null);
    const [giftInput, setgiftInput] = useState("");
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



    // fungsi untuk memuat data gift
    const gift = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/gift?id_member=7B0792985D584A5C9BDA85469662C58E`).then((res) => {
                setData(res.data.giftData)
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
        gift()
    }, []);



    // Fungsi untuk memfilter data
    const filterData = (item) => {
        if (giftInput === "") {
            return (
                <Pressable
                    onPress={() => {
                        navigation.navigate("GiftDetails", { itemId: item.ID });
                    }}
                >
                    <View style={styles.card}>
                        <Image
                            source={`https://web.amscorp.id:3060/imagestorage/gift/${item.imageUrl}`}
                            style={styles.gift}
                        />
                        <Text style={{ padding: 10, fontSize: 15, fontWeight: "bold" }}>
                            {item.giftTitle}
                        </Text>
                    </View>
                </Pressable>
            )
        }

        if (item.giftTitle.toLowerCase().includes(giftInput.toLowerCase()) || item.giftDetail.toLowerCase().includes(giftInput.toLowerCase())) {
            return (
                <Pressable
                    onPress={() => {
                        navigation.navigate("GiftDetails", { itemId: item.ID });
                    }}
                >
                    <View style={styles.card}>
                        <Image
                            source={`https://web.amscorp.id:3060/imagestorage/gift/${item.imageUrl}`}
                            style={styles.gift}
                        />
                        <Text style={{ padding: 10, fontSize: 15, fontWeight: "bold" }}>
                            {item.giftTitle}
                        </Text>
                    </View>
                </Pressable>
            )
        }
    }


    const clearInput = () => {
        setgiftInput('');
    };


    const onRefresh = () => {
        setRefreshing(true);
        gift();
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
                    <View style={styles.inputContainer}>
                        <Ionicons name="search" size={20} color={'#C3C3C3'} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search....."
                            onChangeText={(text) => setgiftInput(text)}
                            style={styles.input}
                            value={giftInput}
                        />
                        {giftInput.length > 0 && (
                            <TouchableOpacity onPress={clearInput} style={styles.closeIconContainer}>
                                <Ionicons name="close" size={20} color={'#C3C3C3'} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item) => String(item.ID)}
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
    gift: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        width: "auto",
        height: 100,
    },
    closeIconContainer: {
        padding: 5,
    },
});

export default Gift