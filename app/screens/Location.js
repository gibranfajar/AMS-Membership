import { View, Text, StatusBar, StyleSheet, Image, Pressable, Modal, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Location = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [locationInput, setLocationInput] = useState("");
    const [List, setList] = useState([]);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const locationList = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/location/list?id_member=${idMember}`).then((res) => {
                setList(res.data.storeLocationData)
                setLoading(false)
            }).catch((error) => {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{error.message}</Text>
                    </View>
                )
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        locationList();
    }, []);

    const fetchDataById = async (id) => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(
                `https://golangapi-j5iu.onrender.com/api/member/mobile/location/detail?id_member=${idMember}&id_store=${id}`
            );
            setData(response.data.storeLocationData);
            setModalVisible(true);
        } catch (error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{error.message}</Text>
                </View>
            )
        }
    };

    const filterData = (item) => {
        if (locationInput === "") {
            return (
                <View key={item.storeID}>
                    <Pressable onPress={() => fetchDataById(item.storeID)}>
                        <View style={styles.list}>
                            <Text style={{ fontSize: 15 }}>{item.brand} {item.kota}</Text>
                            <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                        </View>
                    </Pressable>
                </View>
            );
        }

        const combinedString = `${item.brand} ${item.kota}`.toLowerCase();
        const locationInputLower = locationInput.toLowerCase();

        if (combinedString.includes(locationInputLower)) {
            return (
                <Pressable key={item.storeID} onPress={() => fetchDataById(item.storeID)}>
                    <View style={styles.list}>
                        <Text style={{ fontSize: 15 }}>{item.brand} {item.kota}</Text>
                        <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                    </View>
                </Pressable>
            );
        }
    }

    if (loading) {
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
                        onChangeText={(text) => setLocationInput(text)}
                        style={{
                            borderWidth: 1,
                            borderColor: "#C3C3C3",
                            margin: 10,
                            padding: 5,
                            borderRadius: 5,
                        }}
                    />

                    {/* modals */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={() => setModalVisible(!modalVisible)}>
                            <View style={styles.modalView}>
                                <Pressable
                                    style={{ marginBottom: 5 }}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <MaterialIcons name='close' color={'#1d1d1d'} size={24} style={{ alignSelf: "flex-end" }} />
                                </Pressable>
                                <View style={{ marginHorizontal: 5 }}>
                                    {/* <Image
                                        source={require("../../assets/maps.png")}
                                        style={styles.maps}
                                    /> */}
                                    <Text
                                        style={{ fontWeight: "bold", fontSize: 20, marginVertical: 15 }}
                                    >
                                        {data.brand} {data.kota}
                                    </Text>
                                    <View
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <Text style={{ marginVertical: 15, fontWeight: "bold" }}>
                                        Alamat
                                    </Text>
                                    <Text style={{ marginBottom: 15 }}>
                                        {data.storeAddress}
                                    </Text>
                                    <Pressable
                                        onPress={() => Linking.openURL(data.mapStoreUrl)}
                                        style={{ marginBottom: 15, textDecorationLine: "underline" }}
                                    >
                                        <Text>
                                            Berikan petunjuk arah
                                        </Text>
                                    </Pressable>
                                    <Text style={{ marginBottom: 15 }}>{data.noTelpon}</Text>
                                    <View
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <Text style={{ fontWeight: "bold", marginVertical: 15 }}>
                                        Jam toko
                                    </Text>
                                    <Text style={{ marginVertical: 1 }}>Senin - Sabtu</Text>
                                    <Text style={{ marginVertical: 1, marginBottom: 10 }}>
                                        10:00 - 22:00
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </Modal>
                    {/* modals */}

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={List}
                        keyExtractor={(item) => String(item.storeID)}
                        renderItem={({ item, index }) => filterData(item)}
                        removeClippedSubviews={true} // Menghapus elemen di luar jendela tampilan
                        disableVirtualization={false} // Mengaktifkan virtualization
                        initialNumToRender={10} // Jumlah elemen awal yang ditampilkankan
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
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#021D43",
    },
    logo: {
        width: 100,
        height: 35,
    },
    maps: {
        borderRadius: 5,
        width: "auto",
        height: 150,
    },
    card: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 5,
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
    list: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 5,
        borderColor: "#C3C3C3",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    modalView: {
        top: 100,
        margin: 10,
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


export default Location