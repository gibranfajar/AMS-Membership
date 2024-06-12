import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PromoDetails = ({ route }) => {
    const { itemId } = route.params;
    const [itemDetail, setItemDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    {itemDetail.promoTitle}
                </Text>
                <Text style={{ textAlign: "center", marginVertical: 10 }}>
                    {itemDetail.promoDetail}
                </Text>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Lokasi : {itemDetail.promoLocation}
                </Text>
                <View
                    style={{
                        borderBottomColor: "black",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 10,
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text>Berlaku Sampai</Text>
                    <Text>{itemDetail.promoEndDate}</Text>
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
