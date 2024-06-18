import 'react-native-gesture-handler';
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// screens
import SpalshScreen from '../app/screens/Splash';
import ValidasiScreen from '../app/screens/Validasi';
import ValidasiFormScreen from '../app/screens/ValidasiForm';
import SignUpScreen from '../app/screens/SignUp';
import SignInScreen from '../app/screens/SignIn';
import HomeScreen from '../app/screens/Home';
import RedeemScreen from '../app/screens/Redeem';
import PromoScreen from '../app/screens/Promo';
import LocationScreen from '../app/screens/Location';
import ProfileScreen from '../app/screens/Profile';
import RedeemDetailsScreen from '../app/screens/RedeemDetails';
import PromoDetailsScreen from '../app/screens/PromoDetails';
import RiwayatTransaksiScreen from '../app/screens/Riwayat';
import EditProfileScreen from '../app/screens/EditProfile';
import VoucherScreen from '../app/screens/Voucher';
import NotificationScreen from '../app/screens/Notification';
import NotificationDetailsScreen from '../app/screens/NotificationDetails';
import RiwayatVoucherScreen from '../app/screens/RiwayatVoucher';
import InputOTP from '../app/screens/InputOTP';
import AboutUs from '../app/screens/AboutUs';
import Bantuan from '../app/screens/Bantuan';
import FAQ from '../app/screens/FAQ';
import Chat from '../app/screens/Chat';
import Gift from '../app/screens/Gift';
import GiftDetails from '../app/screens/GiftDetails';


// Stack Navigator untuk bagian tab Home
const HomeStack = () => (
    <Tab.Navigator screenOptions={{
        tabBarActiveTintColor: "#021D43",
        headerShown: true,
    }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
            headerShown: false,
            title: "Home",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }} />
        <Tab.Screen name="Redeem" component={RedeemScreen} options={{
            headerShown: false,
            title: "Redeem",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <Ionicons name="gift-outline" size={24} color={color} />,
        }} />
        <Tab.Screen name="Promo" component={PromoScreen} options={{
            headerShown: false,
            title: "Promo",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <Ionicons name="megaphone-outline" size={24} color={color} />,
        }} />
        <Tab.Screen name="Location" component={LocationScreen} options={{
            headerShown: false,
            title: "Location",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <Ionicons name="location-outline" size={24} color={color} />,
        }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{
            headerShown: false,
            title: "Profile",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }} />
    </Tab.Navigator>
);


const index = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Spalsh" component={SpalshScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Validasi" component={ValidasiScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ValidasiForm" component={ValidasiFormScreen} options={{ headerShown: false }} />
                <Stack.Screen name="InputOTP" component={InputOTP} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
                <Stack.Screen name="RedeemDetails" component={RedeemDetailsScreen} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Redeem",
                }} />
                <Stack.Screen name="Voucher" component={VoucherScreen} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Voucher",
                }} />
                <Stack.Screen name="RiwayatVoucher" component={RiwayatVoucherScreen} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Riwayat Voucher",
                }} />
                <Stack.Screen name="PromoDetails" component={PromoDetailsScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: "#021D43",
                        },
                        headerTintColor: "white",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTitle: "Promo",
                    }} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: "#021D43",
                        },
                        headerTintColor: "white",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTitle: "Edit Profile",
                    }} />
                <Stack.Screen name="RiwayatTransaksi" component={RiwayatTransaksiScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: "#021D43",
                        },
                        headerTintColor: "white",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTitle: "Riwayat Transaksi",
                    }} />
                <Stack.Screen name="Notification" component={NotificationScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: "#021D43",
                        },
                        headerTintColor: "white",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTitle: "Notification",
                    }} />
                <Stack.Screen name="NotificationDetails" component={NotificationDetailsScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: "#021D43",
                        },
                        headerTintColor: "white",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTitle: "Notification",
                    }} />
                <Stack.Screen name="AboutUs" component={AboutUs} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Tentang Kami",
                }} />
                <Stack.Screen name="Bantuan" component={Bantuan} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Pusat Bantuan",
                }} />
                <Stack.Screen name="FAQ" component={FAQ} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Pusat Bantuan",
                }} />
                <Stack.Screen name="Chat" component={Chat} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Pusat Bantuan",
                }} />
                <Stack.Screen name="Gift" component={Gift} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Gift",
                }} />
                <Stack.Screen name="GiftDetails" component={GiftDetails} options={{
                    headerStyle: {
                        backgroundColor: "#021D43",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Gift",
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default index