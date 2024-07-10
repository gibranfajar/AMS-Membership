import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, ActivityIndicator, Pressable, Linking } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQ = ({ navigation, route }) => {
    const { category } = route.params;
    const [expanded, setExpanded] = useState({});
    const [faqs, setFaqs] = useState([]);
    const [contactInfo, setContactInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to toggle accordion item
    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded({ ...expanded, [index]: !expanded[index] });
    };

    // fungsi untuk memuat data faq
    const fetchFaqs = async () => {
        try {
            const response = await axios.get('https://golangapi-j5iu.onrender.com/api/member/mobile/faq');
            const filter = response.data.faqData.filter((faq) => faq.CATEGORY === category);
            setFaqs(filter);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDataContact = async () => {
            try {
                const response = await axios.get(
                    "https://golangapi-j5iu.onrender.com/api/member/mobile/contactinfo"
                );
                setContactInfo(response.data.contactData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataContact();
    }, []);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleContact = () => {
        if (contactInfo) {
            const url = `https://wa.me/62${contactInfo.phoneNumber}`;
            Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#021D43" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>{category}</Text>
            {Array.isArray(faqs) && faqs.length > 0 ? (
                faqs.map((faq, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.questionContainer}
                        onPress={() => toggleExpand(index)}
                    >
                        <View style={styles.questionHeader}>
                            <Text style={styles.question}>{faq.TITLE}</Text>
                            <MaterialIcons name={expanded[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} style={styles.icon} />
                        </View>
                        {expanded[index] &&
                            <>
                                <Text style={styles.answer}>{faq.DESCRIPTION}</Text>
                                <View style={{ margin: 10, marginTop: 20 }}>
                                    <Text>Memerlukan bantuan lebih lanjut?</Text>
                                    <Pressable style={styles.contactButton} onPress={() => handleContact()}>
                                        <Text style={styles.contactButtonText}>Hubungi kami</Text>
                                    </Pressable>
                                </View>
                            </>
                        }
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noFaqsText}>Tidak ada data.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    heading: {
        fontSize: 20,
        marginBottom: 10,
    },
    questionContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden',
        paddingHorizontal: 10,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    question: {
        fontSize: 14,
        flex: 1, // Ensure the text takes up the remaining space
    },
    answer: {
        fontSize: 12,
        marginTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    icon: {
        marginLeft: 10,
    },
    noFaqsText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    contactButton: {
        marginVertical: 10,
        alignSelf: 'flex-start', // This makes the button wrap to the text size
        backgroundColor: '#021D43',
        padding: 10,
        borderRadius: 5,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 12,
    },
});

export default FAQ;
