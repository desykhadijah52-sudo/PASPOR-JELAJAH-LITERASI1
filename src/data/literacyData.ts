import { ReadingQuestion, RegionInfo } from '../types/game';

export const TITLE_BACKDROP_URL = '/src/assets/images/title_atlas_backdrop_1795050527835.jpg';

export const REGIONS: RegionInfo[] = [
  {
    id: 'bahari',
    name: 'Pesisir Nipah-Nipah',
    subtitle: 'Teluk Balikpapan & Pantai PPU',
    genre: 'Teks Deskripsi Pesisir',
    stampCode: 'PPU-BHR-01',
    stampTitle: 'PENJELAJAH PESISIR',
    accentHex: '#0284C7',
    imageUrl: '/src/assets/images/region_bahari_1795050528439.jpg',
    description: 'Menyusuri Pantai Nipah-Nipah, perahu kelotok di Teluk Balikpapan, dan sabuk hijau mangrove Penajam.',
  },
  {
    id: 'aksara',
    name: 'Lembah Benuo Taka',
    subtitle: 'Budaya & Kearifan Lokal Paser',
    genre: 'Teks Narasi & Budaya',
    stampCode: 'PPU-AKS-02',
    stampTitle: 'PENJAGA ADAT PASER',
    accentHex: '#059669',
    imageUrl: '/src/assets/images/region_aksara_1795050528882.jpg',
    description: 'Mengenal tradisi Nondoi, anyaman rotan, Tari Ronggeng Paser, dan kisah gotong royong warga lokal.',
  },
  {
    id: 'sains',
    name: 'Rimba Sepaku & Api-Api',
    subtitle: 'Konservasi & Alam Penajam',
    genre: 'Teks Eksplanasi Alam',
    stampCode: 'PPU-SNS-03',
    stampTitle: 'SAHABAT KONSERVASI',
    accentHex: '#D97706',
    imageUrl: '/src/assets/images/region_sains_1795050528698.jpg',
    description: 'Mengamati Penangkaran Rusa Sambar di Api-Api, Mangrove Mentawir, dan Goa Batu Tapak Raja di Sepaku.',
  },
  {
    id: 'warta',
    name: 'Warta Babulu & Penajam',
    subtitle: 'Fakta, Opini & Lumbung Padi',
    genre: 'Teks Berita Daerah',
    stampCode: 'PPU-WRT-04',
    stampTitle: 'ANALIS WARTA PPU',
    accentHex: '#0F766E',
    description: 'Memilah fakta dan opini dari kabar pertanian Babulu, Jembatan Pulau Balang, dan literasi pelajar.',
  },
  {
    id: 'pustaka',
    name: 'Jejak Sejarah Paser',
    subtitle: 'Sejarah PPU & Keteladanan',
    genre: 'Teks Sejarah & Biografi',
    stampCode: 'PPU-PST-05',
    stampTitle: 'PEWARIS BENUO TAKA',
    accentHex: '#B45309',
    description: 'Menelusuri makna semboyan Benuo Taka, sejarah berdirinya PPU, dan kiprah pegiat taman baca.',
  },
  {
    id: 'syair',
    name: 'Teluk Syair Penajam',
    subtitle: 'Puisi & Sastra Pesisir',
    genre: 'Puisi & Majas Daerah',
    stampCode: 'PPU-SYR-06',
    stampTitle: 'PUJANGGA PENAJAM',
    accentHex: '#B91C1C',
    description: 'Menangkap makna tersirat dan majas dalam syair senja Tanjung Jumlai hingga embun sawah Babulu.',
  },
];

export const QUESTIONS: ReadingQuestion[] = [
  // === PESISIR NIPAH-NIPAH (4 soal) ===
  {
    id: 'bhr-1',
    regionId: 'bahari',
    aspect: 'Ide Pokok',
    title: 'Sabuk Hijau Mangrove Kampung Baru',
    passage:
      'Kawasan hutan mangrove di Kampung Baru, Kecamatan Penajam, tumbuh rapat di sepanjang tepian Teluk Balikpapan. Akar napas dan akar tunjang pohon bakau menahan terjangan gelombang pasang sehingga daratan pesisir terlindungi dari abrasi. Selain menjaga garis pantai, rimbun akar mangrove menjadi tempat berkembang biak udang, kepiting bakau, dan ikan-ikan kecil andalan nelayan setempat.',
    question: 'Apa ide pokok yang paling tepat untuk paragraf di atas?',
    options: [
      'Pohon bakau di Penajam hanya memiliki akar napas yang pendek.',
      'Hutan mangrove Kampung Baru melindungi pesisir dari abrasi sekaligus menjadi habitat biota laut.',
      'Nelayan Penajam menangkap udang dan kepiting hanya di laut dalam.',
      'Gelombang pasang di Teluk Balikpapan selalu merusak permukiman warga.',
    ],
    correctIndex: 1,
    explanation: 'Paragraf menjelaskan dua peran utama hutan mangrove Kampung Baru: menahan abrasi pantai dan menjadi habitat biota laut bernilai bagi nelayan.',
  },
  {
    id: 'bhr-2',
    regionId: 'bahari',
    aspect: 'Kosakata',
    title: 'Denyut Pelabuhan Penyeberangan Penajam',
    passage:
      'Sejak matahari terbit, Pelabuhan Penajam ramai oleh warga yang hendak menyeberang menuju Balikpapan menggunakan kapal feri maupun perahu kelotok. Petugas dermaga mengatur antrean kendaraan secara tertib dan berkala demi menjamin kelancaran arus penyeberangan di selat yang padat tersebut.',
    question: 'Makna kata "berkala" pada teks di atas adalah...',
    options: [
      'Dilakukan hanya sekali dalam setahun',
      'Berulang secara teratur pada waktu tertentu',
      'Dikerjakan secara diam-diam tanpa jadwal',
      'Menggunakan kapal kayu berukuran sangat kecil',
    ],
    correctIndex: 1,
    explanation: 'Kata "berkala" berarti berlangsung secara berulang-ulang dan teratur pada selang waktu tertentu.',
  },
  {
    id: 'bhr-3',
    regionId: 'bahari',
    aspect: 'Inferensi',
    title: 'Senja di Pantai Nipah-Nipah',
    passage:
      'Menjelang pukul lima sore, banyak keluarga dari Penajam dan sekitarnya duduk berjajar di sepanjang tanggul Pantai Nipah-Nipah. Anak-anak berlarian di pasir yang mulai sejuk sambil menunggu pantulan cahaya jingga di permukaan air Teluk Balikpapan, sementara pedagang jagung bakar mulai menyalakan bara arangnya.',
    question: 'Berdasarkan bacaan, mengapa pengunjung memadati Pantai Nipah-Nipah pada sore hari?',
    options: [
      'Karena pantai hanya dibuka oleh petugas mulai pukul lima sore.',
      'Karena suasana sore lebih sejuk dan pengunjung ingin menikmati pemandangan matahari terbenam serta kuliner pantai.',
      'Karena kapal feri penyeberangan berhenti beroperasi pada sore hari.',
      'Karena di pagi hari seluruh area tanggul digunakan untuk menjemur padi.',
    ],
    correctIndex: 1,
    explanation: 'Pasir yang mulai sejuk, penantian cahaya jingga di permukaan teluk, dan pedagang jagung bakar menyiratkan daya tarik suasana senja di pantai.',
  },
  {
    id: 'bhr-4',
    regionId: 'bahari',
    aspect: 'Fakta & Opini',
    title: 'Pesona Pantai Tanjung Jumlai',
    passage:
      'Pantai Tanjung Jumlai terletak di Kelurahan Saloloang, Kecamatan Penajam, dan memiliki hamparan garis pantai berpasir putih sepanjang kurang lebih lima belas kilometer. Deretan pohon kelapa yang melambai membuat pantai ini terasa sebagai tempat rekreasi keluarga paling menenangkan di Kalimantan Timur.',
    question: 'Manakah pernyataan yang merupakan fakta dalam paragraf tersebut?',
    options: [
      'Pantai Tanjung Jumlai adalah tempat wisata paling menenangkan di Kalimantan Timur.',
      'Setiap keluarga wajib berlibur ke Pantai Tanjung Jumlai setiap akhir pekan.',
      'Pantai Tanjung Jumlai terletak di Kelurahan Saloloang, Kecamatan Penajam.',
      'Angin laut di pantai ini jauh lebih sejuk dibandingkan pegunungan.',
    ],
    correctIndex: 2,
    explanation: 'Letak geografis Pantai Tanjung Jumlai di Kelurahan Saloloang, Kecamatan Penajam adalah fakta yang dapat dibuktikan, sedangkan "paling menenangkan" merupakan opini.',
  },

  // === LEMBAH BENUO TAKA (4 soal) ===
  {
    id: 'aks-1',
    regionId: 'aksara',
    aspect: 'Pesan & Makna',
    title: 'Semangat Upacara Adat Nondoi',
    passage:
      'Masyarakat adat Paser di Penajam Paser Utara memiliki tradisi Nondoi yang digelar sebagai bentuk syukur atas hasil bumi sekaligus doa keselamatan bersama. Sebelum acara dimulai, warga bergotong royong membersihkan lingkungan kampung, menyiapkan sajian bersama, dan saling menyapa tanpa membeda-bedakan latar belakang.',
    question: 'Nilai utama yang tercermin dari tradisi Nondoi pada teks tersebut adalah...',
    options: [
      'Persaingan antarwarga untuk membuat hidangan paling mahal.',
      'Rasa syukur, kepedulian terhadap kebersihan lingkungan, dan kerukunan gotong royong.',
      'Kewajiban warga meninggalkan kampung selama upacara berlangsung.',
      'Larangan menerima tamu dari daerah lain saat acara adat.',
    ],
    correctIndex: 1,
    explanation: 'Teks menekankan rasa syukur, kerja sama membersihkan lingkungan, dan kebersamaan warga tanpa membeda-bedakan.',
  },
  {
    id: 'aks-2',
    regionId: 'aksara',
    aspect: 'Inferensi',
    title: 'Pengrajin Anyaman Rotan Waru',
    passage:
      'Di teras rumah panggungnya di Kecamatan Waru, Ibu Halimah tekun meraut bilah rotan hingga halus sebelum dianyam menjadi bakul dan tas tradisional khas Paser. Meski mesin cetak plastik kini menghasilkan wadah dengan harga lebih murah, pesanan tas rotannya tetap berdatangan karena pembeli menghargai kekuatan serat alami dan motif tenunan tangannya.',
    question: 'Mengapa kerajinan anyaman rotan Ibu Halimah tetap diminati di tengah banyaknya wadah plastik?',
    options: [
      'Karena tas rotan jauh lebih murah daripada kantong plastik.',
      'Karena kualitas serat rotan lebih kuat dan memiliki nilai seni motif khas Paser.',
      'Karena di Kecamatan Waru tidak ada toko yang menjual wadah plastik.',
      'Karena rotan dapat dibuat dalam waktu kurang dari lima menit.',
    ],
    correctIndex: 1,
    explanation: 'Pembeli memilih anyaman rotan karena kekuatan serat alami dan keunikan motif buatan tangan khas Paser.',
  },
  {
    id: 'aks-3',
    regionId: 'aksara',
    aspect: 'Kosakata',
    title: 'Harmoni Tari Ronggeng Paser',
    passage:
      'Dalam perhelatan budaya daerah di Penajam, para penari membawakan Tari Ronggeng Paser dengan gerakan langkah kaki yang luwes mengikuti irama gendang dan gambus. Penonton tampak antusias menyaksikan pertunjukan seni warisan leluhur tersebut.',
    question: 'Arti kata "luwes" pada bacaan di atas adalah...',
    options: [
      'Kaku dan sangat lambat',
      'Lentur, tidak canggung, dan mudah mengikuti irama',
      'Terputus-putus dan tergesa-gesa',
      'Sangat keras hingga mengguncang panggung',
    ],
    correctIndex: 1,
    explanation: 'Dalam konteks seni tari, "luwes" berarti gerakan yang lentur, anggun, dan tidak kaku.',
  },
  {
    id: 'aks-4',
    regionId: 'aksara',
    aspect: 'Ide Pokok',
    title: 'Kudapan Amplang Pesisir Penajam',
    passage:
      'Amplang merupakan kerupuk ikan khas pesisir Kalimantan Timur yang banyak diolah pelaku usaha mikro di Penajam. Olahan ikan tenggiri atau ikan pipih dicampur tepung tapioka dan rempah pilihan, lalu digoreng hingga renyah mengembang. Kemasan amplang yang praktis menjadikannya buah tangan favorit bagi tamu yang berkunjung ke Benuo Taka.',
    question: 'Gagasan utama paragraf tersebut adalah...',
    options: [
      'Ikan tenggiri hanya hidup di perairan Kalimantan Timur.',
      'Amplang merupakan kerupuk ikan khas olahan warga Penajam yang digemari sebagai buah tangan.',
      'Tepung tapioka lebih mahal daripada daging ikan segar.',
      'Semua tamu di Penajam wajib belajar menggoreng kerupuk.',
    ],
    correctIndex: 1,
    explanation: 'Seluruh paragraf membahas amplang sebagai kerupuk ikan khas yang diproduksi UMKM Penajam dan diminati sebagai oleh-oleh.',
  },

  // === RIMBA SEPAKU & API-API (4 soal) ===
  {
    id: 'sns-1',
    regionId: 'sains',
    aspect: 'Ide Pokok',
    title: 'Penangkaran Rusa Sambar di Api-Api',
    passage:
      'Kawasan Penangkaran Rusa Sambar di Desa Api-Api, Kecamatan Waru, Kabupaten Penajam Paser Utara merupakan pusat pelestarian satwa endemik Kalimantan yang berdiri sejak awal 1990-an. Di lahan padang rumput terbuka itu, rusa sambar dirawat agar populasinya tetap lestari sekaligus menjadi wahana edukasi bagi pelajar untuk mengenal perilaku satwa secara langsung.',
    question: 'Informasi utama yang disampaikan paragraf di atas adalah...',
    options: [
      'Rusa sambar berasal dari benua Afrika yang dibawa ke Kalimantan.',
      'Penangkaran Rusa Sambar di Desa Api-Api berfungsi sebagai pusat pelestarian satwa sekaligus edukasi pelajar.',
      'Desa Api-Api hanya boleh dikunjungi oleh peneliti satwa dewasa.',
      'Semua rusa di penangkaran dilepaskan ke jalan raya setiap pagi.',
    ],
    correctIndex: 1,
    explanation: 'Paragraf menjelaskan fungsi ganda Penangkaran Rusa Sambar di Desa Api-Api untuk pelestarian satwa dan edukasi pelajar.',
  },
  {
    id: 'sns-2',
    regionId: 'sains',
    aspect: 'Kosakata',
    title: 'Pusat Persemaian Mangrove Mentawir',
    passage:
      'Di Desa Mentawir, Kecamatan Sepaku, berdiri pusat persemaian skala besar yang memproduksi jutaan bibit pohon hutan tropis dan mangrove setiap tahun. Bibit-bibit tersebut ditanam untuk merehabilitasi lahan bekas tambang serta memulihkan kawasan hijau di sekitar Teluk Balikpapan.',
    question: 'Makna kata "merehabilitasi" pada teks tersebut adalah...',
    options: [
      'Menebang seluruh pohon tua agar lahan menjadi rata',
      'Memulihkan dan memperbaiki kembali kondisi alam yang rusak',
      'Mengubah kawasan hutan menjadi pusat perbelanjaan',
      'Menghitung jumlah daun pada setiap pohon bakau',
    ],
    correctIndex: 1,
    explanation: 'Merehabilitasi berarti memulihkan atau mengembalikan fungsi lingkungan ke keadaan baik semula.',
  },
  {
    id: 'sns-3',
    regionId: 'sains',
    aspect: 'Inferensi',
    title: 'Keunikan Goa Batu Tapak Raja',
    passage:
      'Goa Batu Tapak Raja di Desa Wonosari, Kecamatan Sepaku, terbentuk dari batuan kapur alami yang menyimpan stalaktit dan stalagmit meneteskan air jernih. Pengelola kawasan wisata selalu mengingatkan pengunjung untuk tidak menyentuh ujung stalaktit karena minyak dari tangan manusia dapat menghentikan proses pengendapan mineral kapur yang memakan waktu ratusan tahun.',
    question: 'Apa kesimpulan yang tepat jika pengunjung sembarangan menyentuh stalaktit di dalam goa?',
    options: [
      'Stalaktit akan tumbuh sepuluh kali lebih cepat dalam sehari.',
      'Pertumbuhan alami stalaktit terganggu dan kelestarian ornamen goa terancam.',
      'Air jernih di dalam goa berubah menjadi air laut asin.',
      'Batu kapur di Desa Wonosari akan langsung menguap.',
    ],
    correctIndex: 1,
    explanation: 'Minyak tangan menghentikan pengendapan mineral kapur yang berlangsung ratusan tahun, sehingga merusak pertumbuhan stalaktit.',
  },
  {
    id: 'sns-4',
    regionId: 'sains',
    aspect: 'Fakta & Opini',
    title: 'Bendungan Sepaku Semoi',
    passage:
      'Bendungan Sepaku Semoi dibangun di Kecamatan Sepaku untuk mendukung penyediaan air baku dan pengendalian banjir di wilayah Penajam Paser Utara serta kawasan sekitarnya. Pemandangan danau buatan di bendungan ini tampak luar biasa indah dan menyejukkan hati setiap kali difoto saat pagi.',
    question: 'Kalimat kedua pada bacaan di atas termasuk jenis kalimat...',
    options: [
      'Fakta sejarah pembangunan infrastruktur',
      'Data ukuran volume air bendungan',
      'Opini karena memuat penilaian rasa pribadi ("luar biasa indah dan menyejukkan hati")',
      'Laporan cuaca resmi dari stasiun pengamatan',
    ],
    correctIndex: 2,
    explanation: 'Penilaian "luar biasa indah" dan "menyejukkan hati" bersifat subjektif sehingga tergolong opini.',
  },

  // === WARTA BABULU & PENAJAM (4 soal) ===
  {
    id: 'wrt-1',
    regionId: 'warta',
    aspect: 'Ide Pokok',
    title: 'Babulu, Lumbung Padi Penajam',
    passage:
      'Kecamatan Babulu dikenal luas sebagai sentra pertanian padi utama di Kabupaten Penajam Paser Utara. Hamparan sawah tadah hujan dan irigasi di desa-desa seperti Babulu Darat, Gunung Intan, dan Labangka memasok kebutuhan beras tidak hanya bagi warga lokal, tetapi juga daerah tetangga di Kalimantan Timur.',
    question: 'Apa topik utama warta singkat tersebut?',
    options: [
      'Cara membangun dermaga feri di Kecamatan Babulu.',
      'Peran Kecamatan Babulu sebagai sentra penghasil padi utama di Penajam Paser Utara.',
      'Daftar harga beras impor di pulau Jawa.',
      'Larangan menanam sayuran di wilayah Gunung Intan.',
    ],
    correctIndex: 1,
    explanation: 'Seluruh kalimat menyoroti Kecamatan Babulu sebagai daerah penghasil padi utama di PPU.',
  },
  {
    id: 'wrt-2',
    regionId: 'warta',
    aspect: 'Fakta & Opini',
    title: 'Jembatan Pulau Balang Penghubung Teluk',
    passage:
      'Jembatan Pulau Balang yang membentang di atas Teluk Balikpapan menghubungkan wilayah Penajam Paser Utara dengan Kota Balikpapan melalui jalur darat. Kehadiran jembatan megah ini merupakan pencapaian teknik sipil paling membanggakan sepanjang masa bagi warga pesisir.',
    question: 'Manakah bagian teks yang merupakan fakta?',
    options: [
      'Jembatan Pulau Balang adalah pencapaian paling membanggakan sepanjang masa.',
      'Semua warga pasti lebih suka naik jembatan daripada naik kapal feri.',
      'Jembatan Pulau Balang membentang di atas Teluk Balikpapan dan menghubungkan Penajam dengan Balikpapan.',
      'Pemandangan dari atas jembatan jauh lebih bagus daripada dari pesawat.',
    ],
    correctIndex: 2,
    explanation: 'Letak dan fungsi penghubung Jembatan Pulau Balang adalah kenyataan objektif (fakta), bukan penilaian subjektif.',
  },
  {
    id: 'wrt-3',
    regionId: 'warta',
    aspect: 'Inferensi',
    title: 'Saring Informasi di Grup Pelajar',
    passage:
      'Sebuah unggahan tanpa nama penulis di media sosial mengabarkan bahwa seluruh sekolah di Penajam akan libur satu minggu penuh karena perbaikan jembatan. Ketika Ketua OSIS memeriksa pengumuman resmi dari Dinas Pendidikan Kabupaten Penajam Paser Utara, kegiatan belajar mengajar dinyatakan tetap berjalan normal seperti biasa.',
    question: 'Sikap literasi digital yang paling tepat dilakukan siswa setelah mengecek kabar tersebut adalah...',
    options: [
      'Tetap membagikan unggahan itu agar teman sekelas ikut bingung.',
      'Mengabaikan jadwal sekolah resmi dan bersiap berlibur.',
      'Tidak menyebarkan berita bohong tersebut dan merujuk pada pengumuman resmi Dinas Pendidikan.',
      'Menghapus seluruh kontak guru dari ponsel.',
    ],
    correctIndex: 2,
    explanation: 'Setelah diverifikasi ke sumber resmi dan terbukti tidak benar, siswa tidak boleh menyebarkan kabar hoaks tersebut.',
  },
  {
    id: 'wrt-4',
    regionId: 'warta',
    aspect: 'Kosakata',
    title: 'Pojok Baca Taman Alun-Alun Penajam',
    passage:
      'Pemerintah daerah menghadirkan layanan pustaka digital di ruang publik agar akses informasi bagi pelajar dari Penajam hingga Sepaku semakin inklusif tanpa terhalang jarak.',
    question: 'Makna kata "inklusif" pada kalimat di atas adalah...',
    options: [
      'Hanya terbatas untuk kalangan tertentu saja',
      'Terbuka dan dapat menjangkau semua kalangan secara merata',
      'Berbayar dengan tarif sangat tinggi',
      'Berlaku hanya pada hari libur nasional',
    ],
    correctIndex: 1,
    explanation: 'Inklusif berarti terbuka dan merangkul seluruh lapisan masyarakat tanpa kecuali.',
  },

  // === JEJAK SEJARAH PASER (4 soal) ===
  {
    id: 'pst-1',
    regionId: 'pustaka',
    aspect: 'Kosakata',
    title: 'Arti Semboyan Benuo Taka',
    passage:
      'Kabupaten Penajam Paser Utara memiliki semboyan daerah berbunyi "Benuo Taka" yang berasal dari bahasa daerah Paser. Ungkapan tersebut bermakna "Kampung Halaman Kita", sebagai pengingat bahwa seluruh masyarakat yang tinggal dan berkarya di wilayah ini memiliki tanggung jawab bersama untuk merawat daerahnya.',
    question: 'Berdasarkan bacaan, arti semboyan "Benuo Taka" adalah...',
    options: [
      'Gunung yang Tinggi',
      'Kampung Halaman Kita',
      'Pelabuhan Samudra Luas',
      'Hutan Rimba Abadi',
    ],
    correctIndex: 1,
    explanation: 'Teks menyatakan secara langsung bahwa Benuo Taka dalam bahasa Paser berarti "Kampung Halaman Kita".',
  },
  {
    id: 'pst-2',
    regionId: 'pustaka',
    aspect: 'Ide Pokok',
    title: 'Lahirnya Kabupaten Penajam Paser Utara',
    passage:
      'Kabupaten Penajam Paser Utara resmi berdiri sebagai daerah otonom baru pada tahun 2002 melalui pemekaran dari Kabupaten Paser. Pembentukan kabupaten ini bertujuan memperpendek rentang kendali pelayanan publik sekaligus mempercepat pembangunan di empat kecamatan: Penajam, Waru, Babulu, dan Sepaku.',
    question: 'Pernyataan yang paling sesuai dengan isi teks sejarah di atas adalah...',
    options: [
      'Penajam Paser Utara dimekarkan dari Kota Samarinda pada tahun 1990.',
      'Kabupaten Penajam Paser Utara berdiri tahun 2002 untuk mempercepat pelayanan dan pembangunan di empat kecamatannya.',
      'Wilayah Kabupaten Penajam Paser Utara hanya terdiri atas dua kecamatan.',
      'Pemekaran daerah bertujuan menutup akses transportasi darat antarkota.',
    ],
    correctIndex: 1,
    explanation: 'Teks menyebutkan PPU berdiri tahun 2002 hasil pemekaran Kabupaten Paser untuk mempercepat pelayanan dan pembangunan di 4 kecamatan.',
  },
  {
    id: 'pst-3',
    regionId: 'pustaka',
    aspect: 'Pesan & Makna',
    title: 'Perahu Baca di Pinggiran Teluk',
    passage:
      'Setiap akhir pekan, Kak Ardi bersama komunitas pemuda Penajam mengayuh sepeda motor membawa dua peti buku cerita ke permukiman pesisir yang jauh dari toko buku. Meski jalan berlumpur saat hujan turun, senyum anak-anak yang berebut membaca buku baru selalu membuat lelah mereka terbayar lunas.',
    question: 'Keteladanan yang patut dicontoh dari kisah Kak Ardi dan komunitasnya adalah...',
    options: [
      'Hanya mau membaca buku jika cuaca cerah sepanjang minggu.',
      'Kepedulian dan ketekunan berbagi akses literasi meski menghadapi medan sulit.',
      'Menjual buku cerita dengan harga tinggi ke desa pesisir.',
      'Mengoleksi sepeda motor untuk lomba balap di jalan berlumpur.',
    ],
    correctIndex: 1,
    explanation: 'Semangat mengantar buku ke wilayah pesisir meski jalan berlumpur menunjukkan ketekunan dan kepedulian sosial terhadap literasi.',
  },
  {
    id: 'pst-4',
    regionId: 'pustaka',
    aspect: 'Inferensi',
    title: 'Museum & Jejak Warisan Paser',
    passage:
      'Di ruang arsip kebudayaan Penajam, tersimpan salinan naskah silsilah Kesultanan Paser serta foto-foto pelabuhan kayu pada masa lampau. Para pelajar SMP sering diajak berkunjung ke sana agar tidak hanya menghafal nama jalan masa kini, melainkan memahami akar sejarah daerah tempat mereka tumbuh.',
    question: 'Mengapa guru mengajak pelajar SMP mengunjungi ruang arsip kebudayaan tersebut?',
    options: [
      'Agar siswa dapat mengubah nama seluruh jalan di Penajam.',
      'Agar siswa mengenal dan memahami perjalanan sejarah daerah asalnya sendiri.',
      'Agar siswa belajar cara menebang kayu pelabuhan tua.',
      'Agar siswa tidak perlu membaca buku pelajaran di sekolah.',
    ],
    correctIndex: 1,
    explanation: 'Kunjungan bertujuan agar pelajar memahami akar sejarah dan identitas daerah tempat mereka tumbuh.',
  },

  // === TELUK SYAIR PENAJAM (4 soal) ===
  {
    id: 'syr-1',
    regionId: 'syair',
    aspect: 'Pesan & Makna',
    title: 'Pantun Pelajar Benuo Taka',
    passage:
      'Berlayar kelotok ke Tanjung Jumlai / Membawa bekal kue cucur hangat / Rajinlah membaca sedari belia / Agar masa depan bersinar hebat.',
    question: 'Amanat yang terkandung dalam pantun tersebut adalah...',
    options: [
      'Belilah kue cucur setiap kali naik perahu kelotok.',
      'Biasakan rajin membaca sejak usia muda demi meraih masa depan gemilang.',
      'Jangan berlayar ke Tanjung Jumlai pada malam hari.',
      'Perahu kelotok hanya boleh dinaiki oleh pelajar SMP.',
    ],
    correctIndex: 1,
    explanation: 'Bagian isi pantun pada baris 3 dan 4 mengajak pelajar rajin membaca sejak muda agar masa depan cerah.',
  },
  {
    id: 'syr-2',
    regionId: 'syair',
    aspect: 'Kosakata',
    title: 'Ombak Teluk Balikpapan',
    passage:
      'Riak air teluk menari di lambung feri / Mengantar langkah pelajar menjemput mimpi / Bakau berbaris tegap menjaga tepi / Menjadi saksi tekad anak negeri.',
    question: 'Majas yang digunakan pada larik "Bakau berbaris tegap menjaga tepi" adalah...',
    options: [
      'Personifikasi (mengumpamakan tumbuhan bersikap seperti manusia)',
      'Ironi (sindiran berlawanan makna)',
      'Hiperbola (melebih-lebihkan ukuran)',
      'Litotes (merendahkan diri)',
    ],
    correctIndex: 0,
    explanation: 'Pohon bakau digambarkan "berbaris tegap menjaga tepi" seolah prajurit manusia, yang merupakan ciri majas personifikasi.',
  },
  {
    id: 'syr-3',
    regionId: 'syair',
    aspect: 'Inferensi',
    title: 'Embun Pagi di Sawah Babulu',
    passage:
      'Kabut tipis masih memeluk pematang Babulu / Saat seragam putih biru mulai melaju / Tas penuh buku tersandang di bahu / Menuju gerbang ilmu di balik bukit hijau.',
    question: 'Siapakah tokoh yang digambarkan dalam penggalan puisi tersebut?',
    options: [
      'Seorang nelayan yang bersiap menjala ikan di teluk',
      'Seorang pelajar SMP yang berangkat ke sekolah di pagi hari',
      'Seorang petani yang memanen padi pada tengah malam',
      'Seorang nahkoda kapal barang di pelabuhan',
    ],
    correctIndex: 1,
    explanation: 'Seragam putih biru, tas penuh buku, kabut pagi, dan menuju gerbang ilmu merujuk pada pelajar SMP yang berangkat sekolah.',
  },
  {
    id: 'syr-4',
    regionId: 'syair',
    aspect: 'Ide Pokok',
    title: 'Surat dari Sepaku ke Penajam',
    passage:
      'Dari rimbun hutan Sepaku hingga debur ombak Penajam / Kita membaca alam sebagai lembaran kitab paling dalam / Setiap kata adalah jembatan saling memahami / Merawat Benuo Taka dengan ilmu dan budi.',
    question: 'Makna keseluruhan dari bait puisi di atas adalah...',
    options: [
      'Jarak antara Sepaku dan Penajam tidak dapat ditempuh kendaraan.',
      'Mengajak warga Penajam Paser Utara mencintai ilmu, memahami sesama, dan merawat kampung halaman bersama.',
      'Membaca buku hanya boleh dilakukan di dalam hutan Sepaku.',
      'Semua jembatan di Penajam terbuat dari lembaran kertas.',
    ],
    correctIndex: 1,
    explanation: 'Puisi menyatukan wilayah Sepaku hingga Penajam untuk merawat Benuo Taka melalui ilmu pengetahuan, saling pengertian, dan budi pekerti.',
  },
];

export function getQuestionsByRegion(regionId: RegionInfo['id']): ReadingQuestion[] {
  return QUESTIONS.filter((q) => q.regionId === regionId);
}

export function getShuffledQuestions(count: number): ReadingQuestion[] {
  const pool = [...QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
