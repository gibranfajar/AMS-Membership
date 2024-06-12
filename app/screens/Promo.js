import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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

    const onRefresh = () => {
        setRefreshing(true);
        promo();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Contoh: Penyegaran palsu selama 2 detik
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const promo = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/promo/list?id_member=${idMember}`).then((res) => {
                setData(res.data.promoData)
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        promo()
    }, []);


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
                        <Text style={{ padding: 10, fontSize: 15, fontWeight: "bold" }}>
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
                        <Text style={{ padding: 10, fontSize: 15, fontWeight: "bold" }}>
                            {item.promoTitle}
                        </Text>
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
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center' }} />
                        </Pressable>
                    </View>
                    <TextInput
                        placeholder="Search....."
                        onChangeText={(text) => setPromoInput(text)}
                        style={{
                            borderWidth: 1,
                            borderColor: "#C3C3C3",
                            margin: 15,
                            padding: 5,
                            borderRadius: 5,
                        }}
                    />

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
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#021D43'
    },
    logo: {
        width: 100,
        height: 35
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
});

export default Promo