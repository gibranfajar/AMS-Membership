import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const Bantuan = ({ navigation }) => {
    return (
        <ScrollView scrollEventThrottle={16} style={{ backgroundColor: "white" }}>

            <View style={styles.bgImage}>
                <Image source={require("../../assets/bantuan.png")} style={styles.images} />
                <View style={{ alignItems: "center", margin: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>Haii Sahabat, Ada yang bisa Kami Bantu?</Text>
                    <Text style={{ fontSize: 16, marginBottom: 15, textAlign: "center" }}>Silahkan pilih salah satu layanan yang pas untuk kendalamu</Text>
                </View>
            </View>

            <View style={{ backgroundColor: "#f0f0f0", paddingVertical: 10 }}></View>

            <View style={{ backgroundColor: "white", paddingVertical: 20 }}>
                <Pressable
                    onPress={() => {
                        navigation.navigate("FAQ");
                    }}
                >
                    <View style={styles.list}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <Ionicons name="chatbubbles-outline" size={24} color="black" />
                            <Text style={{ fontSize: 15, marginStart: 10 }}>
                                FAQ
                            </Text>
                        </View>
                        <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                    </View>
                </Pressable>
                <Pressable
                    onPress={() => {
                        navigation.navigate("Chat");
                    }}
                >
                    <View style={styles.list}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
                            <Text style={{ fontSize: 15, marginStart: 10 }}>
                                Chat
                            </Text>
                        </View>
                        <MaterialIcons name='keyboard-arrow-right' size={25} color={"#1d1d1d"} />
                    </View>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default Bantuan

const styles = StyleSheet.create({
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
    bgImage: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        marginBottom: 15
    },
    images: {
        width: 250,
        height: 200,
    }
});