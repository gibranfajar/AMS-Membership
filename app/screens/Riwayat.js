import { View, Text, StyleSheet, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TextInput } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RiwayatDetail from './RiwayatDetail'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Riwayat = () => {
    const [status, setStatus] = React.useState('');
    const [List, setList] = useState([])
    const [riwayatInput, setRiwayatInput] = useState('');
    const [loading, setLoading] = useState(true);


    // fungsi untuk memuat data riwayat
    useEffect(() => {
        const fetchData = async () => {
            try {
                const idMember = await AsyncStorage.getItem('idMember');
                axios.get(`https://golangapi-j5iu.onrender.com/api/member/mobile/transaction/history?id_member=${idMember}`).then((res) => {
                    setList(res.data.transactionData);
                }).catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
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

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // fungsi untuk menampilkan data riwayat
    const layout = (item) => {
        return (
            <Pressable
                onPress={() => setStatus(item.invoice)}
            >
                <View style={styles.list}>
                    <View>
                        <Text style={{ fontSize: 14, marginBottom: 3 }}>
                            {item.invoice}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#a1a1a1" }}>{formatDate(item.tanggalTransksi)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ alignItems: "flex-end", marginEnd: 5 }}>
                            <Text style={{ fontSize: 14, marginBottom: 3 }}>Total</Text>
                            <Text style={{ fontSize: 12, color: "#a1a1a1" }}>{formatNumber(item.total)}</Text>
                        </View>
                        <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
                    </View>
                </View>
            </Pressable>
        )
    }

    const filterData = (item) => {
        if (riwayatInput === "") {
            return layout(item);
        } else {
            const combinedString = `${item.invoice} ${item.tanggalTransksi} ${item.total}`.toLowerCase();
            const riwayatInputLower = riwayatInput.toLowerCase();
            if (combinedString.includes(riwayatInputLower)) {
                return layout(item);
            }
        }
    }

    const clearInput = () => {
        setRiwayatInput('');
    };

    if (loading === true) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Ionicons name="search" size={20} color={'#C3C3C3'} style={styles.searchIcon} />
                <TextInput
                    placeholder="Cari....."
                    onChangeText={(text) => setRiwayatInput(text)}
                    style={styles.input}
                    value={riwayatInput}
                />
                {riwayatInput.length > 0 && (
                    <TouchableOpacity onPress={clearInput} style={styles.closeIconContainer}>
                        <Ionicons name="close" size={20} color={'#C3C3C3'} />
                    </TouchableOpacity>
                )}
            </View>

            {!List ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Tidak ada riwayat transaksi</Text>
                </View>
            ) : (

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={List}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item, index }) => filterData(item)}
                />
            )}
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
        marginHorizontal: 20,
        marginBottom: 10,
        borderColor: "#C3C3C3",
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C3C3C3',
        margin: 20,
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
    closeIconContainer: {
        padding: 5,
    },
});

export default Riwayat