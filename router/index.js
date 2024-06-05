import 'react-native-gesture-handler';
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
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
            tabBarIcon: ({ color }) => <FontAwesome6 name="house" color={color} size={24} />,
        }} />
        <Tab.Screen name="Redeem" component={RedeemScreen} options={{
            headerShown: false,
            title: "Redeem",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <FontAwesome6 name="gift" color={color} size={24} />,
        }} />
        <Tab.Screen name="Promo" component={PromoScreen} options={{
            headerShown: false,
            title: "Promo",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <Foundation name="megaphone" color={color} size={24} />,
        }} />
        <Tab.Screen name="Location" component={LocationScreen} options={{
            headerShown: false,
            title: "Location",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <FontAwesome6 name="location-dot" color={color} size={24} />,
        }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{
            headerShown: false,
            title: "Profile",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <FontAwesome6 name="user-large" color={color} size={24} />,
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default index