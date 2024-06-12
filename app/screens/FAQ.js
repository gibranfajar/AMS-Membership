import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const FAQ = () => {
    return (
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} >
            <View style={styles.container}>
                <Text style={styles.heading}>FAQ Aplikasi Membership PT Aditya Mandiri Sejahtera</Text>
                <Text style={styles.question}>1. Apa itu aplikasi membership PT Aditya Mandiri Sejahtera?</Text>
                <Text style={styles.answer}>Aplikasi membership PT Aditya Mandiri Sejahtera adalah platform digital yang dirancang untuk memberikan berbagai keuntungan eksklusif kepada pelanggan yang terdaftar sebagai anggota. Keuntungan ini meliputi diskon khusus, penawaran spesial, akses prioritas, dan program loyalitas.</Text>

                <Text style={styles.question}>2. Bagaimana cara mendaftar menjadi anggota?</Text>
                <Text style={styles.answer}>Anda dapat mendaftar menjadi anggota melalui aplikasi dengan mengisi formulir pendaftaran yang tersedia. Pastikan Anda mengisi semua informasi yang dibutuhkan dengan benar dan lengkap.</Text>

                <Text style={styles.question}>3. Apa saja keuntungan menjadi anggota?</Text>
                <Text style={styles.answer}>Sebagai anggota, Anda akan mendapatkan akses ke penawaran khusus, diskon eksklusif, program loyalitas, notifikasi personalisasi, serta berbagai pembaruan dan berita terkini dari PT Aditya Mandiri Sejahtera.</Text>

                <Text style={styles.question}>4. Apakah ada biaya untuk menjadi anggota?</Text>
                <Text style={styles.answer}>Biaya keanggotaan mungkin bervariasi. Silakan periksa detail dalam aplikasi untuk informasi lebih lanjut tentang biaya dan paket keanggotaan yang tersedia.</Text>

                <Text style={styles.question}>5. Bagaimana cara menggunakan diskon atau penawaran khusus?</Text>
                <Text style={styles.answer}>Setelah Anda menjadi anggota, Anda dapat melihat dan menggunakan diskon atau penawaran khusus langsung melalui aplikasi. Cukup tunjukkan kode diskon atau penawaran saat melakukan pembelian atau gunakan saat berbelanja online.</Text>

                <Text style={styles.question}>6. Apa itu program loyalitas dan bagaimana cara kerjanya?</Text>
                <Text style={styles.answer}>Program loyalitas adalah fitur yang memungkinkan Anda mengumpulkan poin setiap kali melakukan pembelian atau menggunakan layanan PT Aditya Mandiri Sejahtera. Poin yang terkumpul dapat ditukarkan dengan berbagai reward menarik yang tersedia dalam aplikasi.</Text>

                <Text style={styles.question}>7. Bagaimana cara mendapatkan poin?</Text>
                <Text style={styles.answer}>Anda bisa mendapatkan poin dengan melakukan pembelian produk atau menggunakan layanan PT Aditya Mandiri Sejahtera. Poin akan otomatis ditambahkan ke akun Anda setelah transaksi selesai.</Text>

                <Text style={styles.question}>8. Bagaimana cara menukarkan poin?</Text>
                <Text style={styles.answer}>Untuk menukarkan poin, masuk ke akun Anda di aplikasi, pilih menu "Tukar Poin," dan pilih reward yang Anda inginkan. Ikuti instruksi yang diberikan untuk menyelesaikan proses penukaran.</Text>

                <Text style={styles.question}>9. Bagaimana cara menukar voucher di toko?</Text>
                <Text style={styles.answer}>Setelah menukarkan poin dengan voucher melalui aplikasi, Anda akan menerima kode voucher. Tunjukkan kode voucher ini saat melakukan pembelian di toko fisik PT Aditya Mandiri Sejahtera untuk mendapatkan diskon atau reward sesuai dengan nilai voucher.</Text>

                <Text style={styles.question}>10. Bagaimana saya bisa mendapatkan notifikasi tentang penawaran terbaru?</Text>
                <Text style={styles.answer}>Pastikan Anda mengaktifkan notifikasi dalam pengaturan aplikasi. Anda akan menerima pemberitahuan tentang penawaran terbaru, promo eksklusif, dan informasi penting lainnya sesuai dengan preferensi dan riwayat transaksi Anda.</Text>

                <Text style={styles.question}>11. Apa yang harus dilakukan jika saya mengalami masalah dengan aplikasi?</Text>
                <Text style={styles.answer}>Jika Anda mengalami masalah dengan aplikasi, Anda dapat menghubungi tim layanan pelanggan kami melalui fitur dukungan yang tersedia dalam aplikasi. Kami siap membantu menyelesaikan masalah Anda secepat mungkin.</Text>

                <Text style={styles.question}>12. Bagaimana cara memperbarui informasi pribadi saya di aplikasi?</Text>
                <Text style={styles.answer}>Anda dapat memperbarui informasi pribadi Anda dengan masuk ke akun Anda di aplikasi dan mengedit profil. Pastikan untuk menyimpan perubahan yang telah Anda buat.</Text>

                <Text style={styles.question}>13. Apakah informasi pribadi saya aman di aplikasi ini?</Text>
                <Text style={styles.answer}>PT Aditya Mandiri Sejahtera berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. Kami menggunakan teknologi keamanan terbaru untuk memastikan data Anda tetap aman dan terlindungi.</Text>

                <Text style={styles.question}>14. Bagaimana cara membatalkan keanggotaan?</Text>
                <Text style={styles.answer}>Untuk membatalkan keanggotaan, Anda bisa menghubungi layanan pelanggan kami melalui aplikasi atau mengikuti instruksi pembatalan yang tersedia di bagian pengaturan akun Anda.</Text>

                <Text style={styles.question}>15. Apa yang tersedia di Pusat Bantuan?</Text>
                <Text style={styles.answer}>Pusat Bantuan menyediakan dua layanan utama: FAQ (pertanyaan yang sering diajukan) dan layanan chat melalui WhatsApp.</Text>

                <Text style={styles.question}>16. Bagaimana cara mengakses FAQ?</Text>
                <Text style={styles.answer}>FAQ dapat diakses melalui menu Pusat Bantuan di aplikasi. Di sana Anda akan menemukan jawaban untuk berbagai pertanyaan umum terkait dengan aplikasi dan keanggotaan.</Text>

                <Text style={styles.question}>17. Bagaimana cara menghubungi layanan pelanggan melalui chat?</Text>
                <Text style={styles.answer}>Anda bisa menghubungi layanan pelanggan kami melalui WhatsApp. Cukup buka aplikasi dan pilih opsi "Hubungi Kami" atau "Chat dengan Kami" di Pusat Bantuan, lalu Anda akan diarahkan ke chat WhatsApp dengan nomor official PT Aditya Mandiri Sejahtera.</Text>

                <Text style={styles.question}>18. Apa nomor WhatsApp resmi untuk layanan pelanggan?</Text>
                <Text style={styles.answer}>Nomor WhatsApp resmi untuk layanan pelanggan adalah [nomor WhatsApp resmi PT Aditya Mandiri Sejahtera]. Anda dapat mengirim pesan kapan saja, dan tim kami akan merespons secepat mungkin.</Text>
            </View>
        </ScrollView>
    )
}

export default FAQ

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    answer: {
        fontSize: 16,
        marginTop: 5,
    },
})