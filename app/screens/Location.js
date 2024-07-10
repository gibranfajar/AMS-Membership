import { View, Text, StatusBar, StyleSheet, Image, Pressable, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, RefreshControl, TextInput } from 'react-native-gesture-handler'
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview'


export default function Location({ navigation }) {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState([]);
    const [List, setList] = useState([]);
    const [locationInput, setLocationInput] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFilters, setModalFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [brandFilter, setBrandFilter] = useState("all");
    const [refreshing, setRefreshing] = useState(false);
    const [htmlContent, setHtmlContent] = useState(null);


    // fungsi untuk memeriksa koneksi internet
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    // fungsi untuk memuat data list location
    const locationList = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/location/list?id_member=${idMember}`).then((res) => {
                const filterBrand = res.data.storeLocationData.filter(item => item.brand === brandFilter);

                if (brandFilter === "all") {
                    setList(res.data.storeLocationData)
                } else {
                    setList(filterBrand)
                }
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            setLoadingFilters(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        locationList();
    }, []);



    // fungsi untuk memuat data list detail
    const fetchDataById = async (id) => {
        try {
            setLoading(true);
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(
                `https://golangapi-j5iu.onrender.com/api/member/mobile/location/detail?id_member=${idMember}&id_store=${id}`
            );
            setData(response.data.storeLocationData);
            setModalVisible(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // tamplan list
    const layout = (item) => {
        return (
            <View key={item.storeID}>
                <Pressable onPress={() => fetchDataById(item.storeID)}>
                    <View style={styles.list}>
                        <Text style={{ fontSize: 14 }}>{item.brand} {item.kota}</Text>
                        <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                    </View>
                </Pressable>
            </View>
        )
    }

    const filterData = (item) => {
        if (brandFilter === "all") {
            if (locationInput === "") {
                return layout(item);
            } else {
                const combinedString = `${item.brand} ${item.kota}`.toLowerCase();
                const locationInputLower = locationInput.toLowerCase();
                if (combinedString.includes(locationInputLower)) {
                    return layout(item);
                }
            }
        } else if (brandFilter === item.brand) {
            if (locationInput === "") {
                return layout(item);
            } else {
                const combinedString = `${item.brand} ${item.kota}`.toLowerCase();
                const locationInputLower = locationInput.toLowerCase();
                if (combinedString.includes(locationInputLower)) {
                    return layout(item);
                }
            }
        }
    };


    const closeModal = () => {
        setModalFilters(false);
    };

    const clearInput = () => {
        setLocationInput('');
    };

    const onRefresh = () => {
        setRefreshing(true);
        locationList();
    };

    useEffect(() => {
        if (data.mapStoreUrl) {
            // Mengambil URL dari data
            const encodedHTML = data.mapStoreUrl;

            // Fungsi untuk mendekode HTML entities
            const decodeHTMLEntities = (html) => {
                return html.replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'");
            };

            // Decode HTML entities
            const decodedHTML = decodeHTMLEntities(encodedHTML);

            // Bungkus decodedHTML dalam template HTML yang sederhana
            const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          ${decodedHTML}
        </body>
        </html>
      `;

            setHtmlContent(content);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [data.mapStoreUrl]);


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
                            <FontAwesome6 name='bell' color={'#fff'} size={20} style={{ justifyContent: 'flex-end', alignSelf: 'center', marginHorizontal: 10 }} />
                        </Pressable>
                    </View>

                    <View style={styles.searchContainer}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="search" size={20} color={'#C3C3C3'} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Cari....."
                                onChangeText={(text) => setLocationInput(text)}
                                style={styles.input}
                                value={locationInput}
                            />
                            {locationInput.length > 0 && (
                                <TouchableOpacity onPress={clearInput} style={styles.closeIconContainer}>
                                    <Ionicons name="close" size={20} color={'#C3C3C3'} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Pressable
                            onPress={() => {
                                // Implementasi logika filter di sini
                                setModalFilters(!modalFilters);
                            }}
                            style={styles.filterButton}
                        >
                            <Feather name="sliders" color={'#fff'} size={20} />
                        </Pressable>
                    </View>

                    {/* modals filters */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalFilters}
                        onRequestClose={() => {
                            setModalFilters(!modalFilters);
                        }}
                    >
                        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={() => setModalFilters(!modalFilters)}>
                            <View style={styles.modalView}>
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>Filter</Text>
                                    <Pressable
                                        style={styles.closeButton}
                                        onPress={() => setModalFilters(!modalFilters)}
                                    >
                                        <MaterialIcons name='close' color={'#1d1d1d'} size={24} />
                                    </Pressable>
                                </View>
                                <View style={{ marginHorizontal: 5 }}>
                                    <Text style={styles.modalText}>Pilih Brand</Text>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        setBrandFilter('all');
                                        closeModal(); // Panggil fungsi untuk menutup modal di sini
                                    }}>
                                        <Text style={styles.filterOptionText}>Semua</Text>
                                    </Pressable>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        locationList();
                                        setBrandFilter('AEESHA');
                                        closeModal()
                                    }}>
                                        <Text style={styles.filterOptionText}>Aeesha</Text>
                                    </Pressable>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        locationList();
                                        setBrandFilter('CELCIUS');
                                        closeModal()
                                    }}>
                                        <Text style={styles.filterOptionText}>Celcius</Text>
                                    </Pressable>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        locationList();
                                        setBrandFilter('CELCIUS WOMAN');
                                        closeModal()
                                    }}>
                                        <Text style={styles.filterOptionText}>Celcius Woman</Text>
                                    </Pressable>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        locationList();
                                        setBrandFilter('MISSISSIPPI');
                                        closeModal()
                                    }}>
                                        <Text style={styles.filterOptionText}>Mississippi</Text>
                                    </Pressable>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        locationList();
                                        setBrandFilter('QUEENSLAND');
                                        closeModal()
                                    }}>
                                        <Text style={styles.filterOptionText}>Queensland</Text>
                                    </Pressable>
                                    <Pressable style={styles.filterOption} onPress={() => {
                                        locationList();
                                        setBrandFilter('FLIES');
                                        closeModal()
                                    }}>
                                        <Text style={styles.filterOptionText}>Flies</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    </Modal>

                    {/* modals */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                                    <View style={styles.containerMaps}>
                                        <WebView
                                            originWhitelist={['*']}
                                            source={{ html: htmlContent }}
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                    <Text
                                        style={{ fontSize: 16, marginVertical: 15 }}
                                    >
                                        {data.brand} {data.kota}
                                    </Text>
                                    <View
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <Text style={{ marginVertical: 14 }}>
                                        Alamat
                                    </Text>
                                    <Text style={{ marginBottom: 12, fontSize: 12, color: "#a1a1a1" }}>
                                        {data.storeAddress}
                                    </Text>
                                    {/* <Pressable
                                        onPress={() => Linking.openURL(data.mapStoreUrl)}
                                        style={{ marginBottom: 15, textDecorationLine: "underline" }}
                                    >
                                        <Text>
                                            Berikan petunjuk arah
                                        </Text>
                                    </Pressable> */}
                                    <Text style={{ marginBottom: 12 }}>{data.noTelpon}</Text>
                                    <View
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <Text style={{ marginTop: 14, marginBottom: 5 }}>
                                        Jam toko
                                    </Text>
                                    <Text style={{ marginVertical: 1, color: "#a1a1a1" }}>Senin - Sabtu</Text>
                                    <Text style={{ marginVertical: 1, marginBottom: 10, color: "#a1a1a1" }}>
                                        10:00 - 22:00
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </Modal>
                    {/* modals */}

                    {loadingFilters ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#021D43" />
                        </View>
                    ) : (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={List}
                            keyExtractor={(item) => String(item.storeID)}
                            renderItem={({ item, index }) => filterData(item)}
                            removeClippedSubviews={true} // Menghapus elemen di luar jendela tampilan
                            disableVirtualization={false} // Mengaktifkan virtualization
                            initialNumToRender={10} // Jumlah elemen awal yang ditampilkankan
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                        />
                    )}
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#021D43" />
                </View>
            )
            }
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 13,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#021D43",
    },
    containerMaps: {
        width: '100%',
        height: 210,
    },
    logo: {
        width: 100,
        height: 35,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 17,
        fontWeight: "bold",
    },
    closeButton: {
        marginBottom: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C3C3C3',
        borderRadius: 5,
        flex: 1, // Menyesuaikan agar TextInput bisa mengambil ruang yang tersedia
    },
    searchIcon: {
        marginLeft: 10,
    },
    input: {
        flex: 1, // agar TextInput dapat mengisi sisa ruang yang tersedia
        paddingVertical: 5,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#021D43',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    filterOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    filterOptionText: {
        fontSize: 14,
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
        marginHorizontal: 15,
        marginVertical: 5,
        borderColor: "#C3C3C3",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
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
    closeIconContainer: {
        padding: 5,
    },
});