import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RiwayatDetail from './RiwayatDetail'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Riwayat = () => {
    const [status, setStatus] = React.useState('');
    const [List, setList] = useState([])

    const { idMember } = AsyncStorage.getItem('idMember');


    useEffect(() => {
        axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/transaction/history?id_member=${idMember}`).then((res) => {
            setList(res.data.transactionData)
            setLoading(false)
        }).catch((error) => {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{error.message}</Text>
                </View>
            )
        })
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={List}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                    <Pressable
                        onPress={() => setStatus(item.invoice)}
                    >
                        <View style={styles.list}>
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                    {item.invoice}
                                </Text>
                                <Text>{item.tanggalTransksi}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ alignItems: "flex-end", marginEnd: 5 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Total</Text>
                                    <Text>{item.total}</Text>
                                </View>
                                <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
                            </View>
                        </View>
                    </Pressable>
                )}
            />
            {status && <RiwayatDetail setStatus={setStatus} status={status} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default Riwayat