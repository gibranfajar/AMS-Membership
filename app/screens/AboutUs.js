import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.header}>Kebijakan Privasi</Text>
                <Text style={styles.text}>Terakhir update: 10 Juli 2024</Text>

                <Text style={styles.subheader}>Perkenalan</Text>
                <Text style={styles.text}>
                    Hello Member AMS, Kami sangat menjaga privasi yang anda berikan. Kebijakan privasi ini akan membantu anda memahami informasi apa yang kami kumpulkan di Member AMS dan bagaimana kami menggunakannya.
                </Text>
                <Text style={styles.text}>
                    Yang dimaksud dengan "kami" di dalam kebijakan privasi ini adalah PT Aditya Mandiri Sejahtera, perusahaan yang bergerak di bidang retail fashion ready to wear. Ketika kami membicarakan tentang "Layanan" di dalam kebijakan ini, yang kami maksud adalah Membership AMS yaitu platform digital mobile yang dikhususkan untuk para anggota yang terdaftar. Layanan kami saat ini tersedia untuk digunakan melalui aplikasi seluler khusus untuk perangkat seluler anda.
                </Text>

                <Text style={styles.subheader}>Informasi yang kami kumpulkan dan terima</Text>
                <Text style={styles.featureItem}>1. Data Pelanggan</Text>
                <Text style={styles.text}>
                    Konten dan informasi yang dikirimkan oleh pengguna ke Layanan dalam kebijakan ini disebut sebagai "Data Pelanggan". Sebagaimana dijelaskan lebih lanjut di bawah ini, Data Pelanggan dikendalikan oleh PT Aditya Mandiri Sejahtera yang membuat aplikasi. Jika anda mendaftar atau mendaftar melalui aplikasi dan membuat akun pengguna, anda menjadi "Pengguna", dan anda akan memiliki akses lebih lanjut ke lebih banyak fitur kami yang tersedia di aplikasi.
                </Text>

                <Text style={styles.featureItem}>2. Informasi Lainnya</Text>
                <Text style={styles.text}>
                    Kami juga dapat mengumpulkan dan menerima informasi berikut:
                    {'\n'}• Informasi pembuatan akun. Pengguna dapat memberikan informasi seperti alamat email, nomor telepon, PIN atau kata sandi untuk membuat akun.
                    {'\n'}• Informasi pengaturan ruang kerja. Saat Pelanggan mendaftar menggunakan platform, kami dapat mengumpulkan nama, nomor telepon, alamat email, tanggal lahir, dan kata sandi.
                    {'\n'}• Informasi penggunaan layanan. Ini adalah informasi tentang cara anda mengakses dan menggunakan Layanan, yang mungkin mencakup komunikasi administratif dan dukungan dengan kami dan informasi tentang saluran, fitur, konten, dan tautan yang berinteraksi dengan anda, dan integrasi pihak ketiga yang anda gunakan (jika ada).
                    {'\n'}• Kontak informasi. Dengan izin anda, informasi kontak apa pun yang anda pilih untuk diimpor dikumpulkan (seperti buku alamat dari perangkat) saat menggunakan Layanan.
                    {'\n'}• Mencatat data. Saat anda menggunakan Layanan, server kami secara otomatis mencatat informasi, termasuk informasi yang dikirimkan aplikasi seluler anda saat anda menggunakannya. Data log ini dapat mencakup tanggal dan waktu penggunaan Layanan oleh anda, informasi tentang konfigurasi dan plug-in anda, preferensi bahasa, dan data cookie.
                    {'\n'}• Informasi perangkat. Kami dapat mengumpulkan informasi tentang perangkat yang anda gunakan untuk menggunakan Layanan, termasuk jenis perangkatnya, sistem operasi yang anda gunakan, pengaturan perangkat, ID aplikasi, pengidentifikasi perangkat unik, dan data kerusakan.
                    {'\n'}• Informasi lokasi geografis. Lokasi GPS yang tepat dari perangkat seluler dikumpulkan hanya dengan izin anda. Wi-Fi dan alamat IP yang diterima dari browser atau perangkat anda mungkin digunakan untuk menentukan perkiraan lokasi.
                </Text>

                <Text style={styles.subheader}>Bagaimana kami menggunakan informasi anda</Text>
                <Text style={styles.featureItem}>1. Data Pelanggan</Text>
                <Text style={styles.text}>
                    AMS dapat mengakses dan menggunakan data pelanggan sebagaimana diperlukan secara wajar dan sesuai dengan instruksi pelanggan untuk (a) menyediakan, memelihara, dan meningkatkan Layanan; (b) untuk mencegah atau mengatasi masalah Layanan, keamanan, teknis atau atas permintaan pelanggan sehubungan dengan masalah dukungan pelanggan; (c) sebagaimana diwajibkan oleh hukum atau sebagaimana diizinkan oleh Kebijakan permintaan data.
                </Text>

                <Text style={styles.featureItem}>2. Informasi Lain</Text>
                <Text style={styles.text}>
                    Kami menggunakan jenis informasi lain dalam menyediakan Layanan, khususnya:
                    {'\n'}• Untuk memahami dan meningkatkan Layanan kami. Kami melakukan penelitian dan menganalisis tren untuk lebih memahami bagaimana pengguna menggunakan Layanan dan meningkatkannya.
                    {'\n'}• Untuk berkomunikasi dengan cara menanggapi permintaan anda. Jika anda menghubungi kami dengan masalah atau pertanyaan, kami akan menggunakan informasi anda untuk merespon.
                    {'\n'}• Mengirim email dan pesan melalui aplikasi. Kami mungkin mengirimi anda pemberitahuan, email, dan pesan. Kami juga dapat menghubungi anda untuk memberi tahu tentang perubahan dalam layanan kami, penawaran layanan kami, dan pemberitahuan penting terkait layanan, seperti pemberitahuan keamanan dan penipuan. Email dan pesan ini dianggap sebagai bagian dari Layanan dan anda tidak boleh memilih untuk tidak ikut serta. Selain itu, terkadang kami mengirim email tentang fitur produk baru atau berita lainnya.
                    {'\n'}• Berkomunikasi dengan anda dan pemasaran. Kami sering kali perlu menghubungi anda untuk pengelolaan akun dan alasan serupa. Kami juga dapat menggunakan informasi kontak anda untuk tujuan pemasaran atau periklanan kami sendiri. Anda dapat memilih untuk tidak ikut serta kapan saja.
                </Text>

                <Text style={styles.subheader}>Pilihan Anda</Text>
                <Text style={styles.featureItem}>1. Data pelanggan</Text>
                <Text style={styles.text}>
                    Pelanggan mempunyai banyak pilihan dan kendali atas data pelanggan. Misalnya, pelanggan dapat menyediakan atau membatalkan penyediaan akses ke Layanan, mengaktifkan atau menonaktifkan integrasi pihak ketiga, mengelola izin.
                </Text>

                <Text style={styles.featureItem}>2. Informasi lainnya</Text>
                <Text style={styles.text}>
                    Jika anda memiliki pertanyaan tentang informasi anda, penggunaan kami atas informasi ini, atau hak anda sehubungan dengan hal-hal di atas, hubungi kami di crm@amscorp.id
                </Text>

                <Text style={styles.featureItem}>Pilihan lain</Text>
                <Text style={styles.text}>
                    Perangkat seluler anda mungkin memberi anda pilihan mengenai bagaimana dan apakah lokasi atau data lainnya dikumpulkan dan dibagikan. AMS tidak mengontrol pilihan ini, atau pengaturan default, yang ditawarkan oleh pembuat sistem operasi perangkat seluler anda.
                </Text>

                <Text style={styles.subheader}>Berbagi dan Pengungkapan</Text>
                <Text style={styles.text}>
                    Ada kalanya informasi yang dijelaskan dalam Kebijakan Privasi ini dapat dibagikan oleh AMS. Bagian ini hanya membahas bagaimana AMS dapat membagikan informasi tersebut. Pelanggan menentukan kebijakan mereka sendiri untuk pembagian dan pengungkapan data pelanggan.
                </Text>

                <Text style={styles.featureItem}>1. Data pelanggan</Text>
                <Text style={styles.text}>
                    AMS dapat membagikan data pelanggan sesuai dengan perjanjian kami dengan Pelanggan dan instruksi pelanggan, antara lain:
                    {'\n'}• Dengan penyedia Layanan dan agen pihak ketiga. Kami dapat melibatkan perusahaan atau individu pihak ketiga untuk memproses data pelanggan.
                    {'\n'}• Dengan afiliasi. Kami dapat melibatkan afiliasi dalam grup perusahaan kami untuk memproses data pelanggan.
                    {'\n'}• Dengan integrasi pihak ketiga. AMS dapat bertindak atas nama pelanggan kami, membagikan data pelanggan dengan penyedia integrasi yang ditambahkan oleh pelanggan. AMS tidak bertanggung jawab atas cara penyedia integrasi mengumpulkan, menggunakan, dan membagikan data pelanggan.
                </Text>

                <Text style={styles.featureItem}>2. Informasi lainnya</Text>
                <Text style={styles.text}>
                    AMS dapat berbagi informasi lain sebagai berikut:
                    {'\n'}• Tentang anda dengan pelanggan. Mungkin ada saatnya anda menghubungi kami untuk membantu menyelesaikan masalah khusus pada Layanan di mana anda menjadi anggota. Untuk membantu menyelesaikan masalah dan mengingat hubungan kami dengan pelanggan kami, kami dapat menyampaikan kekhawatiran anda kepada pelanggan kami.
                    {'\n'}• Dengan penyedia Layanan dan agen pihak ketiga. Kami dapat melibatkan perusahaan atau individu pihak ketiga, seperti memproses pembayaran pihak ketiga, untuk memproses informasi atas nama kami.
                    {'\n'}• Dengan afiliasi. Kami mungkin melibatkan afiliasi dalam grup perusahaan kami untuk memproses informasi lainnya.
                </Text>

                <Text style={styles.featureItem}>3. Jenis pengungkapan lainnya</Text>
                <Text style={styles.text}>
                    AMS dapat membagikan atau mengungkapkan data pelanggan dan informasi lainnya sebagai berikut:
                    {'\n'}• Selama perubahan struktur bisnis kami. Jika kami terlibat dalam merger, akuisisi, kebangkrutan, pembubaran, reorganisasi, penjualan sebagian atau seluruh aset kami, pembiayaan, akuisisi seluruh atau sebagian bisnis kami, transaksi atau proses hukum serupa, atau langkah-langkah dalam mempertimbangkan aktivitas tersebut (misalnya uji tuntas).
                    {'\n'}• Untuk mematuhi persyaratan hukum atau peraturan dan untuk menanggapi permintaan yang sah, perintah pengadilan, dan proses hukum.
                    {'\n'}• Untuk menegakkan hak-hak kami, mencegah penipuan dan demi keamanan. Untuk melindungi dan membela hak, properti, atau keselamatan kami atau pihak ketiga, termasuk menegakkan kontrak atau kebijakan, atau sehubungan dengan penyelidikan dan mencegah penipuan.
                </Text>

                <Text style={styles.subheader}>Bagaimana kami melindungi informasi Anda?</Text>
                <Text style={styles.text}>
                    AMS memperhatikan keamanan dengan sangat serius. Kami mengambil berbagai langkah untuk melindungi informasi yang anda berikan kepada kami dari kehilangan, penyalahgunaan, dan akses atau pengungkapan tidak sah. Langkah-langkah ini mempertimbangkan sensitivitas informasi yang kami kumpulkan, proses, dan simpan, serta kondisi teknologi saat ini.
                </Text>

                <Text style={styles.subheader}>Informasi anak-anak</Text>
                <Text style={styles.text}>
                    Layanan kami tidak ditujukan untuk anak-anak di bawah 13 tahun. Jika Anda mengetahui bahwa seorang anak di bawah 13 tahun telah memberikan informasi pribadi kepada kami tanpa persetujuan, silakan hubungi kami.
                </Text>

                <Text style={styles.subheader}>Perubahan pada Kebijakan Privasi ini</Text>
                <Text style={styles.text}>
                    Kami dapat mengubah kebijakan ini dari waktu ke waktu, dan jika kami melakukannya, kami akan memposting perubahan apa pun di halaman ini. Jika Anda terus menggunakan Layanan setelah perubahan tersebut berlaku, anda menyetujui kebijakan yang direvisi.
                </Text>
            </View>
        </ScrollView>
    );
}

export default PrivacyPolicy;

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
    featureItem: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
        lineHeight: 24,
        fontWeight: 'bold',
    },
});
