import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';

const Bantuan = ({ navigation }) => {
    const [faqsCategory, setFaqsCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    // fungsi untuk memuat data faq
    const fetchFaqs = async () => {
        try {
            const response = await axios.get('https://golangapi-j5iu.onrender.com/api/member/mobile/faq');
            const uniqueCategories = [...new Set(response.data.faqData.map(faq => faq.CATEGORY))];
            setFaqsCategory(uniqueCategories);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const renderFaqsCategory = () => {
        return faqsCategory.map((category, index) => {
            return (
                <Pressable onPress={() => navigation.navigate('FAQ', { category: category })} key={index}>
                    <View style={styles.list}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <Text style={{ fontSize: 14, marginStart: 10 }}>
                                {category}
                            </Text>
                        </View>
                        <MaterialIcons name='keyboard-arrow-right' size={20} color={"#1d1d1d"} />
                    </View>
                </Pressable>
            );
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={16} style={{ padding: 20 }}>
            <Text style={styles.heading}>FAQ</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 40 }}>
                {renderFaqsCategory()}
            </ScrollView>

        </ScrollView>
    )
}

export default Bantuan

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        marginBottom: 10,
    },
    list: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
        borderColor: "#C3C3C3",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
});