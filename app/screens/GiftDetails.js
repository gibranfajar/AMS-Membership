import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GiftDetails = ({ navigation, route: { params: { itemId } } }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // fungsi untuk memuat data gift
    const fetchGift = async () => {
        try {
            const idMember = await AsyncStorage.getItem('idMember');
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/gift?id_member=7B0792985D584A5C9BDA85469662C58E`);
            const giftDetail = response.data.giftData.find(item => item.ID === itemId);
            setData(giftDetail);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGift();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Data gift tidak ditemukan.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: `https://web.amscorp.id:3060/imagestorage/gift/${data.imageUrl}` }}
                style={styles.gift}
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>
                    {data.giftTitle}
                </Text>
                <Text style={styles.description}>
                    {data.giftDetail}
                </Text>
                <View style={styles.codeGiftContainer}>
                    <Text style={styles.codeGift}>
                        Code Gift : {data.codeGift}
                    </Text>
                    <Text style={styles.codeGift}>
                        Nominal : {data.nominal}
                    </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.expiryContainer}>
                    <Text>Berlaku Sampai</Text>
                    <Text>{data.expiredDate}</Text>
                </View>
            </View>
        </View>
    )
}

export default GiftDetails

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        margin: 25,
    },
    gift: {
        width: '100%',
        height: 150,
    },
    detailsContainer: {
        marginVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginVertical: 10,
    },
    codeGiftContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    codeGift: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 10,
    },
    expiryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
