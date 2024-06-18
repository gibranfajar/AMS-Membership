import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQ = () => {
    const [expanded, setExpanded] = useState({});
    const [faqs, setFaqs] = useState([]);

    // Function to toggle accordion item
    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded({ ...expanded, [index]: !expanded[index] });
    };

    // fungsi untuk memuat data faq
    const fetchFaqs = async () => {
        try {
            const response = await axios.get('https://golangapi-j5iu.onrender.com/api/member/mobile/faq');
            setFaqs(response.data.faqData || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>FAQ Aplikasi Membership PT Aditya Mandiri Sejahtera</Text>
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
                        {expanded[index] && <Text style={styles.answer}>{faq.DESCRIPTION}</Text>}
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noFaqsText}>No FAQs available.</Text>
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
        fontWeight: 'bold',
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
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1, // Ensure the text takes up the remaining space
    },
    answer: {
        fontSize: 14,
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
});

export default FAQ;
