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
            const response = await axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/gift?id_member=${idMember}`);
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
                <Text style={styles.errorText}>Data Hadiah tidak ditemukan.</Text>
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
                        Kode Hadiah: {data.codeGift}
                    </Text>
                    <Text style={styles.codeGift}>
                        Nominal: {data.nominal}
                    </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.expiryContainer}>
                    <Text>Berlaku Sampai</Text>
                    <Text style={{ color: '#a1a1a1' }}>{formatDate(data.expiredDate)}</Text>
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
        fontSize: 16,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginVertical: 12,
        fontSize: 14,
    },
    codeGiftContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    codeGift: {
        textAlign: 'center',
        fontSize: 14,
        marginVertical: 12,
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 12,
    },
    expiryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
