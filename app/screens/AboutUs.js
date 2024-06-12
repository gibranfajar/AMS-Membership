import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const AboutUs = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.header}>Tentang Kami</Text>
                <Text style={styles.text}>Aplikasi membership PT Aditya Mandiri Sejahtera adalah platform digital yang dirancang untuk memudahkan pelanggan dalam mengakses layanan dan manfaat yang disediakan oleh perusahaan tersebut. Aplikasi ini memungkinkan pengguna untuk menjadi anggota yang terdaftar dan menikmati berbagai keuntungan eksklusif, seperti diskon khusus, penawaran spesial, akses prioritas, dan program loyalitas.</Text>
                <Text style={styles.subheader}>Fitur Utama</Text>
                <View style={styles.featureContainer}>
                    <Text style={styles.featureItem}>1. Pendaftaran Anggota: Pengguna dapat mendaftar sebagai anggota dengan mengisi formulir secara online atau melalui proses yang ditentukan perusahaan.</Text>
                    <Text style={styles.featureItem}>2. Informasi Produk dan Layanan: Aplikasi menyediakan informasi lengkap tentang produk dan layanan yang ditawarkan oleh PT Aditya Mandiri Sejahtera, termasuk deskripsi, spesifikasi, dan harga.</Text>
                    <Text style={styles.featureItem}>3. Penawaran dan Diskon: Anggota akan mendapatkan akses ke penawaran khusus dan diskon eksklusif yang tidak tersedia bagi non-anggota.</Text>
                    <Text style={styles.featureItem}>4. Notifikasi Personalisasi: Aplikasi dapat mengirimkan notifikasi kepada anggota tentang penawaran terbaru, promo eksklusif, atau informasi penting lainnya berdasarkan preferensi dan riwayat transaksi mereka.</Text>
                    <Text style={styles.featureItem}>5. Program Loyalti: PT Aditya Mandiri Sejahtera mungkin menyediakan program loyalitas di dalam aplikasi, di mana anggota bisa mendapatkan poin atau reward setiap kali mereka menggunakan layanan perusahaan atau melakukan pembelian.</Text>
                    <Text style={styles.featureItem}>6. Pembaruan dan Berita Terkini: Pengguna akan mendapatkan pembaruan terkait dengan produk baru, layanan, atau acara melalui fitur berita atau blog dalam aplikasi.</Text>
                    <Text style={styles.featureItem}>7. Layanan Pelanggan: Aplikasi dapat menyediakan saluran komunikasi langsung dengan tim layanan pelanggan PT Aditya Mandiri Sejahtera, memungkinkan anggota untuk mengajukan pertanyaan atau memberikan umpan balik.</Text>
                </View>
                <Text style={styles.footer}>Aplikasi membership PT Aditya Mandiri Sejahtera bertujuan untuk meningkatkan pengalaman pelanggan, memperkuat hubungan antara perusahaan dan pelanggan, serta mendorong loyalitas pelanggan melalui berbagai manfaat dan kemudahan yang ditawarkan.</Text>
            </View>
        </ScrollView>
    );
}

export default AboutUs;

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        backgroundColor: '#f0f0f0',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    subheader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        textAlign: 'justify',
    },
    featureContainer: {
        marginLeft: 10,
    },
    featureItem: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
        lineHeight: 24,
    },
    footer: {
        fontSize: 16,
        color: '#666',
        marginTop: 20,
        textAlign: 'justify',
    },
});
