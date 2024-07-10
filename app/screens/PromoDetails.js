import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PromoDetails = ({ route }) => {
    const { itemId } = route.params;
    const [itemDetail, setItemDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // fungsi untuk memuat detail promo
    const promoDetail = async () => {
        const idMember = await AsyncStorage.getItem("idMember");
        axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/promo/detail?id_member=${idMember}&id_promo=${itemId}`).then((res) => {
            setItemDetail(res.data.promoData)
            setIsLoading(false);
        }).catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        promoDetail();
    }, [itemId]);

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, margin: 25 }}>
            <Image
                source={`https://web.amscorp.id:3060/imagestorage/promo/${itemDetail.imageUrl}`}
                style={styles.promo}
            />
            <View style={{ marginVertical: 20 }}>
                <Text style={{ fontSize: 16, textAlign: "center" }}>
                    {itemDetail.promoTitle}
                </Text>
                <Text style={{ textAlign: "center", marginVertical: 20, fontSize: 14 }}>
                    {itemDetail.promoDetail}
                </Text>
                <Text style={{ textAlign: "center", fontSize: 14 }}>
                    Lokasi: {itemDetail.promoLocation}
                </Text>
                <View
                    style={{
                        borderBottomColor: "black",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 20,
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ fontSize: 14 }}>Berlaku hingga</Text>
                    <Text style={{ fontSize: 14, color: "#a1a1a1" }}>{formatDate(itemDetail.promoEndDate)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    promo: {
        width: "auto",
        height: 150,
    },
});

export default PromoDetails;
