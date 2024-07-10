import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, ActivityIndicator, StatusBar, TouchableOpacity, FlatList, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Redeem = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(null);
    const [data, setData] = useState([]);
    const [point, setPoint] = useState(0);
    const [redeemInput, setRedeemInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loadingCategory, setLoadingCategory] = useState(false);

    // Check internet connectivity
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Fetch voucher data
    const fetchData = useCallback(async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/voucher/tukar?id_member=${idMember}`);
            const { voucherData } = response.data;

            // Filter vouchers that are enabled
            const filteredVouchers = voucherData.filter(voucher => voucher.status_Voucher === 'enabled');

            // Get unique categories
            const uniqueCategories = ['Semua', ...new Set(response.data.voucherData.map(voucher => voucher.category))];
            setCategories(uniqueCategories);

            // Filter by selected category or show all if 'Semua' is selected
            const categoryToFilter = selectedCategory || 'Semua';
            const filteredByCategory = categoryToFilter === 'Semua' ? filteredVouchers : filteredVouchers.filter(voucher => voucher.category === categoryToFilter);

            setData(filteredByCategory);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoadingCategory(false);
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // Load user points from AsyncStorage
    const loadPoints = useCallback(async () => {
        try {
            const savedPoints = await AsyncStorage.getItem('userPoints');
            if (savedPoints !== null) {
                setPoint(parseInt(savedPoints));
            }
        } catch (error) {
            console.error('Failed to load points from AsyncStorage', error);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(loadPoints, 1000);
        return () => clearInterval(intervalId);
    }, [loadPoints]);

    // Format number with thousand separators
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Clear search input
    const clearInput = () => {
        setRedeemInput('');
    };

    // Handle refresh action
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        loadPoints();
    }, [fetchData, loadPoints]);

    // Handle category selection
    const handleCategory = (category) => {
        setLoadingCategory(true);
        setSelectedCategory(category === selectedCategory ? 'Semua' : category);
    };

    // Render category filter buttons
    const renderCategoryFilters = () => {
        return categories.map((category, index) => (
            <Pressable
                key={index}
                style={[styles.categoryButton, { backgroundColor: category === selectedCategory ? '#021D43' : '#fff' }]}
                onPress={() => handleCategory(category)}
            >
                <Text style={[styles.categoryText, { color: category === selectedCategory ? '#fff' : '#000' }]}>{category}</Text>
            </Pressable>
        ));
    };

    // Render individual voucher item
    const renderItem = ({ item }) => {
        const isDisabled = point < item.pointVoucher;

        return (
            <Pressable
                onPress={() => {
                    if (!isDisabled) {
                        navigation.navigate('RedeemDetails', { voucherCode: item.voucherCode });
                    }
                }}
                disabled={isDisabled}
            >
                <View style={[styles.card, isDisabled && styles.cardDisabled]}>
                    <View style={styles.topCard}>
                        <Text style={styles.cardTitle}>Voucher</Text>
                        <Text style={styles.cardPoints}>{item.pointVoucher} Poin</Text>
                    </View>
                    <Text style={styles.cardAmount}>Rp {formatNumber(item.nominal)}</Text>
                </View>
            </Pressable>
        );
    };

    const renderEmptyComponent = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginTop: 10 }}>Tidak ada data redeem</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#021D43" />

            {isConnected ? (
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/logowhite.png')}
                            style={styles.logo}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                            <FontAwesome5 name="bell" color="#fff" size={20} style={styles.notificationIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#C3C3C3" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Cari....."
                            onChangeText={text => setRedeemInput(text)}
                            style={styles.input}
                            value={redeemInput}
                        />
                        {redeemInput.length > 0 && (
                            <TouchableOpacity onPress={clearInput} style={styles.closeIconContainer}>
                                <Ionicons name="close" size={20} color="#C3C3C3" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.categoryListContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryList}
                        >
                            {renderCategoryFilters()}
                        </ScrollView>
                    </View>

                    {loadingCategory ? (
                        <ActivityIndicator color="#021D43" />
                    ) : (
                        <FlatList
                            style={styles.voucherList}
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            ListEmptyComponent={renderEmptyComponent}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#021D43']}
                                />
                            }
                        />
                    )}

                </View>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#021D43" />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 13,
        backgroundColor: '#021D43',
    },
    logo: {
        width: 100,
        height: 35,
    },
    notificationIcon: {
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    searchContainer: {
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
        flex: 1,
        padding: 5,
        fontSize: 16,
    },
    closeIconContainer: {
        padding: 5,
    },
    categoryListContainer: {
        marginHorizontal: 10,
        marginBottom: 10,
    },
    categoryList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryButton: {
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#a1a1a1',
    },
    categoryText: {
        fontSize: 12,
        padding: 5,
    },
    card: {
        marginHorizontal: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 11,
        borderColor: '#C3C3C3',
    },
    topCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#021D43',
        padding: 10,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },
    cardDisabled: {
        backgroundColor: '#C3C3C3',
        opacity: 0.6,
    },
    cardTitle: {
        color: 'white',
        fontSize: 14,
    },
    cardPoints: {
        fontSize: 12,
        color: 'yellow',
        fontWeight: 'bold',
    },
    cardAmount: {
        fontSize: 20,
        padding: 20,
    }
});

export default Redeem;
