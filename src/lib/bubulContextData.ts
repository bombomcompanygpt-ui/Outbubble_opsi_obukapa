export interface BubulPageContext {
  pageId: string;
  pageName: string;
  bubbleGreeting: string;
  guideDescription: string;
  keyConcept: string;
  defaultTopic: string;
  reflectionQuestions: {
    id: string;
    topic: string;
    question: string;
    hint: string;
    cognitiveLevel: 'C4-Analisis' | 'C5-Evaluasi';
  }[];
  quickPrompts: {
    label: string;
    query: string;
  }[];
}

export const BUBUL_PAGE_CONTEXTS: Record<string, BubulPageContext> = {
  '/': {
    pageId: 'home',
    pageName: 'Beranda OutBubble',
    bubbleGreeting: 'Hai! Aku Bubul 👋 Siap menemanimu menembus gelembung informasi digital hari ini?',
    guideDescription: 'Di Beranda ini, kamu bisa melihat ringkasan misi belajarmu, progress harian, dan petualangan literasi digital yang siap kamu taklukkan.',
    keyConcept: 'Literasi Digital Kritis & Menembus Filter Bubble',
    defaultTopic: 'Kesadaran Digital & Algoritma',
    reflectionQuestions: [
      {
        id: 'home-q1',
        topic: 'Kesadaran Ruang Digital',
        question: 'Ketika kamu membuka media sosial hari ini, seberapa sering kamu menyadari bahwa apa yang kamu lihat sudah diatur oleh algoritma, bukan pilihan acak?',
        hint: 'Coba analisis apakah berandamu terasa seperti cermin dari apa yang kamu sukai saja.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'home-q2',
        topic: 'Evaluasi Konsumsi Informasi',
        question: 'Menurutmu, apa risiko terbesar bagi seseorang jika ia menganggap seluruh informasi di FYP atau linimasanya mewakili kenyataan dunia yang sebenarnya?',
        hint: 'Evaluasi bagaimana pandangan seseorang bisa terbentuk hanya dari satu sudut pandang yang terus diulang.',
        cognitiveLevel: 'C5-Evaluasi'
      },
      {
        id: 'home-q3',
        topic: 'Pilihan & Agensi Diri',
        question: 'Langkah nyata apa yang bisa kamu ambil agar kamu yang mengendalikan media sosial, bukan algoritma yang mengendalikan waktu dan perhatianmu?',
        hint: 'Pikirkan tentang batasan screen time, variasi akun yang diikuti, atau trik jeda berpikir.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '🫧 Apa tujuan OutBubble?', query: 'Bubul, jelaskan apa misi utama OutBubble untuk membantuku memahami fenomena algoritma dan filter bubble!' },
      { label: '📱 Gimana cara algoritma kerja?', query: 'Bagaimana cara sederhana kerja algoritma media sosial dalam menentukan konten yang kulihat?' },
      { label: '💡 Trik linimasa sehat', query: 'Kasih 3 tips praktis agar linimasa media sosialku tidak menjadi echo chamber yang sempit!' }
    ]
  },
  '/materi': {
    pageId: 'materi',
    pageName: 'Modul Materi Pembelajaran',
    bubbleGreeting: 'Lagi mendalami materi ya? Yuk kita bedah cara kerja algoritma & fenomena sosial dari dua sisi! 📖',
    guideDescription: 'Di halaman ini, kamu bisa mempelajari 10 modul mendalam tentang Attention Economy, Filter Bubble, Echo Chamber, Bias Konfirmasi, hingga Etika Digital.',
    keyConcept: 'Analisis Mekanisme Algoritma & Bias Kognitif',
    defaultTopic: 'Filter Bubble & Echo Chamber',
    reflectionQuestions: [
      {
        id: 'materi-q1',
        topic: 'Filter Bubble',
        question: 'Kalau media sosial terus menampilkan konten yang sesuai dengan minatmu, informasi dan perspektif penting seperti apa yang mungkin tidak pernah kamu lihat?',
        hint: 'Analisis informasi apa yang hilang dari layarmu dan mengapa hal itu bisa membatasi pemahamanmu.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'materi-q2',
        topic: 'Echo Chamber & Polarisasi',
        question: 'Menurutmu, apa yang mungkin terjadi dalam masyarakat jika kelompok-kelompok yang berbeda pandangan hanya berinteraksi di ruang gema (echo chamber) masing-masing?',
        hint: 'Evaluasi dampak jangka panjang terhadap empati sosial dan kemampuan berdialog secara damai.',
        cognitiveLevel: 'C5-Evaluasi'
      },
      {
        id: 'materi-q3',
        topic: 'Attention Economy',
        question: 'Mengapa platform digital lebih mengutamakan konten yang memicu emosi (seperti kemarahan atau sensasi) dibanding konten yang menenangkan atau edukatif?',
        hint: 'Hubungkan dengan konsep ekonomi perhatian dan bagaimana waktu tonton dikonversi menjadi keuntungan iklan.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'materi-q4',
        topic: 'Confirmation Bias',
        question: 'Saat membaca berita yang sangat sesuai dengan opinimu, mengapa otak kita cenderung langsung mempercayainya tanpa mengecek kebenarannya terlebih dahulu?',
        hint: 'Analisis kecenderungan psikologis manusia dalam mencari rasa nyaman dan pembenaran diri.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'materi-q5',
        topic: 'Keterbukaan Perspektif',
        question: 'Jika kamu menemukan pandangan yang bertentangan dengan keyakinanmu, langkah berpikir apa yang akan kamu lakukan sebelum menyimpulkan bahwa pandangan itu salah?',
        hint: 'Evaluasi alasan di balik sudut pandang mereka dan bukti-bukti pendukungnya secara objektif.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '🧐 Beda Filter Bubble & Echo Chamber', query: 'Bubul, apa perbedaan mendasar antara Filter Bubble (algoritma) dan Echo Chamber (sosial)?' },
      { label: '🧠 Kenapa manusia kena Bias Konfirmasi?', query: 'Kenapa otak kita secara alami suka mencari pembenaran atas apa yang sudah kita percayai?' },
      { label: '🛡️ Cara uji validitas sumber', query: 'Berikan langkah praktis untuk memverifikasi sebuah klaim viral yang kelihatannya meyakinkan.' }
    ]
  },
  '/explore': {
    pageId: 'explore',
    pageName: 'Eksplorasi Studi Kasus & Labirin',
    bubbleGreeting: 'Sedang menganalisis studi kasus digital? Cermati setiap bukti dan perspektif dengan teliti ya! 🔍',
    guideDescription: 'Di halaman Eksplorasi ini, kamu bisa membedah studi kasus nyata di media sosial, menguji insting detektor biasmu, dan melihat bagaimana algoritma bereaksi terhadap interaksi pengguna.',
    keyConcept: 'Investigasi Bukti & Evaluasi Narasi Media',
    defaultTopic: 'Eksplorasi & Studi Kasus',
    reflectionQuestions: [
      {
        id: 'explore-q1',
        topic: 'Analisis Bukti Digital',
        question: 'Ketika melihat sebuah video viral atau tangkapan layar percakapan, apa saja yang perlu kamu periksa sebelum menyimpulkan kejadian tersebut 100% benar?',
        hint: 'Analisis konteks waktu, kemungkinan potongan video, atau manipulasi konteks di balik layar.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'explore-q2',
        topic: 'Evaluasi Dampak Narasi',
        question: 'Bagaimana sebuah narasi setengah-benar (misleading) bisa lebih berbahaya dan lebih mudah dipercaya masyarakat dibandingkan kabar bohong total?',
        hint: 'Evaluasi bagaimana unsur fakta nyata yang dibelokkan bisa mengecoh nalar kritis pembaca.',
        cognitiveLevel: 'C5-Evaluasi'
      },
      {
        id: 'explore-q3',
        topic: 'Cross-Check Lintas Sumber',
        question: 'Mengapa membandingkan informasi dari minimal 3 media dengan orientasi berbeda sangat efektif untuk memecah gelembung informasi?',
        hint: 'Pikirkan bagaimana sudut pandang yang berbeda menyajikan fakta yang sama.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '🕵️ Tips deteksi konten misleading', query: 'Apa saja ciri-ciri postingan yang menggunakan teknik cherry-picking atau framing manipulatif?' },
      { label: '🔍 Cara cek fakta foto/video', query: 'Bagaimana langkah praktis melakukan reverse image search dan verifikasi metadata video viral?' }
    ]
  },
  '/forum': {
    pageId: 'forum',
    pageName: 'Perspective Garden (Forum)',
    bubbleGreeting: 'Selamat datang di ruang dialog! Di sini kita saling mendengar dan memahami ragam perspektif 💬',
    guideDescription: 'Di Forum Diskusi ini, kamu bisa membaca pendapat netizen dari berbagai kacamata (Fakta, Opini, Harapan, Kritis) dan menuliskan tanggapan dengan etika diskusi yang sehat.',
    keyConcept: 'Dialektika Sehat & Empati Kognitif',
    defaultTopic: 'Keterbukaan Perspektif di Forum',
    reflectionQuestions: [
      {
        id: 'forum-q1',
        topic: 'Etika Berdiskusi Digital',
        question: 'Ketika kamu membaca komentar yang sangat menyebalkan di internet, bagaimana kamu membedakan antara menyerang argumen dan menyerang pribadi orangnya (ad hominem)?',
        hint: 'Analisis mengapa diskusi yang menyerang orang tidak menghasilkan solusi atau pemahaman baru.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'forum-q2',
        topic: 'Memahami Sudut Pandang Lawan',
        question: 'Pernahkah kamu mencoba memikirkan: "Mengapa orang itu bisa berpendapat seperti itu dari latar belakang pengalamannya?" Apa yang kamu rasakan setelah mencobanya?',
        hint: 'Evaluasi bagaimana empati kognitif dapat meredakan tensi polarisasi di ruang digital.',
        cognitiveLevel: 'C5-Evaluasi'
      },
      {
        id: 'forum-q3',
        topic: 'Keterbukaan Merubah Pikiran',
        question: 'Apakah menurutmu mengakui bahwa pendapat kita sebelumnya kurang tepat adalah tanda kelemahan atau tanda kedewasaan berpikir? Berikan alasanmu!',
        hint: 'Pertimbangkan nilai integritas intelektual dalam masyarakat digital yang beradab.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '🤝 Cara debat tanpa saling benci', query: 'Bubul, bagaimana cara menyampaikan perbedaan pendapat di internet tanpa memicu permusuhan?' },
      { label: '🛡️ Menghadapi komentar provokatif', query: 'Apa respon paling bijak ketika menemukan komentar yang sengaja memancing emosi (rage-bait)?' }
    ]
  },
  '/insight': {
    pageId: 'insight',
    pageName: 'Insight Sosial & Tren Polarisasi',
    bubbleGreeting: 'Lihat data grafik dan persebaran opini netizen! Pola apa yang berhasil kamu temukan? 📊',
    guideDescription: 'Di halaman Insight Sosial, kamu bisa memantau peta sentimen publik, dinamika isu yang sedang viral, dan seberapa kuat polarisasi opini yang terjadi di ruang siber.',
    keyConcept: 'Literasi Data & Analisis Polarisasi Publik',
    defaultTopic: 'Peta Polarisasi Opini',
    reflectionQuestions: [
      {
        id: 'insight-q1',
        topic: 'Pola Polarisasi Media Sosial',
        question: 'Berdasarkan grafik dan isu yang ada, mengapa topik-topik sensitif lebih cepat membelah opini masyarakat menjadi dua kubu ekstrem yang saling berhadapan?',
        hint: 'Analisis peran algoritma rekomendasi dan dorongan psikologis membela kelompok (in-group loyalty).',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'insight-q2',
        topic: 'Jembatan Penengah',
        question: 'Jika kamu diminta menjadi jembatan penengah antara dua kubu yang sedang berkonflik di media sosial, narasi atau data seperti apa yang akan kamu hadirkan?',
        hint: 'Evaluasi bagaimana menyajikan titik temu yang adil dan berbasis data terverifikasi.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '📊 Mengapa terjadi polarisasi ekstrem?', query: 'Jelaskan mengapa algoritma media sosial cenderung memperbesar jurang pemisah antara dua kelompok!' },
      { label: '🕊️ Solusi meredakan tensi opini', query: 'Bagaimana cara kita sebagai individu membantu mendinginkan suhu panas perdebatan di media sosial?' }
    ]
  },
  '/refleksi': {
    pageId: 'refleksi',
    pageName: 'Ruang Refleksi & Jurnal Digital',
    bubbleGreeting: 'Waktu yang tepat untuk jeda sejenak dan menyelami proses berpikirmu sendiri 🧘',
    guideDescription: 'Di halaman Refleksi ini, kamu bisa menuliskan pemikiran mendalam harian dan mengukur ketenangan emosimu saat berinteraksi di ruang digital.',
    keyConcept: 'Metakognisi & Kesadaran Diri Digital',
    defaultTopic: 'Jurnal Refleksi Mandiri',
    reflectionQuestions: [
      {
        id: 'refleksi-q1',
        topic: 'Refleksi Diri Digital',
        question: 'Kapan terakhir kali kamu merasa emosimu terpancing oleh sebuah konten online? Setelah dipikirkan kembali, apakah reaksi itu sepadan dengan energimu?',
        hint: 'Analisis pemicu emosi dan bagaimana kamu bisa lebih tenang menghadapi konten serupa.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'refleksi-q2',
        topic: 'Evaluasi Kebiasaan Internet',
        question: 'Jika kamu mengevaluasi kebiasaan berselancar di internet selama 1 minggu terakhir, perubahan kecil apa yang ingin kamu lakukan agar pikiranmu lebih jernih?',
        hint: 'Pikirkan tentang jenis konten yang kamu konsumsi dan durasi waktu yang kamu habiskan.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '🧘 Kenapa refleksi itu penting?', query: 'Mengapa kemampuan refleksi diri (metakognisi) sangat krusial dalam menghadapi tsunami informasi digital?' },
      { label: '✨ Tips menjaga kesehatan mental digital', query: 'Bagaimana cara menjaga kesehatan mental di tengah gempuran tren media sosial yang tiada henti?' }
    ]
  },
  '/profile': {
    pageId: 'profile',
    pageName: 'Profil Pengguna & Buku Refleksi',
    bubbleGreeting: 'Ini halaman prestasimu! Jangan lupa buka "The Progress Journal" untuk melihat catatan refleksimu 📖',
    guideDescription: 'Di halaman Profil, kamu bisa melihat level kepekaan kritismu, ringkasan capaian kuis, papan skor game, dan seluruh catatan refleksi yang pernah kamu simpan bersama Bubul.',
    keyConcept: 'Portofolio Pembelajaran & Jejak Berpikir',
    defaultTopic: 'Buku Refleksi Pembelajaran',
    reflectionQuestions: [
      {
        id: 'profile-q1',
        topic: 'Perkembangan Nalar Kritis',
        question: 'Dari semua materi dan tantangan yang sudah kamu lewati di OutBubble, konsep apa yang paling mengubah caramu melihat media sosial saat ini?',
        hint: 'Evaluasi perubahan cara pandangmu sebelum dan sesudah belajar di OutBubble.',
        cognitiveLevel: 'C5-Evaluasi'
      },
      {
        id: 'profile-q2',
        topic: 'Komitmen Masa Depan',
        question: 'Bagaimana kamu akan menerapkan keterampilan literasi digital kritis ini ketika menghadapi berita viral atau ajakan provokatif di grup WhatsApp keluarga/teman?',
        hint: 'Tuliskan komitmen tindakan nyatamu sebagai warganet yang kritis dan bijak.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ],
    quickPrompts: [
      { label: '📖 Cara baca Buku Refleksi', query: 'Bubul, bagaimana cara membaca dan mengevaluasi kembali catatan refleksi yang sudah kusimpan di Jurnal?' },
      { label: '🎯 Target literasi berikutnya', query: 'Bantu aku menyusun target belajar literasi digital berikutnya agar semakin mahir berpikir kritis!' }
    ]
  },
  '/game': {
    pageId: 'game',
    pageName: 'Game Arena Bubul',
    bubbleGreeting: 'Ayo asah kecepatan refleks dan ketajaman analisismu di Arena Game Bubul! 🎮',
    guideDescription: 'Di halaman Game, kamu bisa melatih insting membedakan fakta, opini, hoaks, dan jebakan algoritma dalam format permainan yang seru dan menantang.',
    keyConcept: 'Gamifikasi Literasi Digital',
    defaultTopic: 'Refleksi Game Literasi',
    reflectionQuestions: [
      {
        id: 'game-q1',
        topic: 'Refleksi Kecepatan Berpikir',
        question: 'Dalam game, ketika dituntut menjawab cepat, apakah kamu lebih sering mengandalkan intuisi cepat (System 1) atau berpikir analitis (System 2)? Mengapa?',
        hint: 'Hubungkan dengan bahaya langsung membagikan informasi di dunia nyata saat terburu-buru.',
        cognitiveLevel: 'C4-Analisis'
      }
    ],
    quickPrompts: [
      { label: '🎮 Tips memenangkan game', query: 'Bubul, bagaimana strategi terbaik untuk membedakan jebakan umpan klik (clickbait) secara cepat?' }
    ]
  }
};

// Modul-specific reflection questions jika pengguna sedang membuka modul tertentu di Materi
export const BUBUL_MODULE_CONTEXTS: Record<string, {
  title: string;
  topic: string;
  guide: string;
  questions: {
    id: string;
    question: string;
    hint: string;
    cognitiveLevel: 'C4-Analisis' | 'C5-Evaluasi';
  }[];
}> = {
  'M01': {
    title: 'Algoritma & Attention Economy',
    topic: 'Attention Economy',
    guide: 'Modul ini membongkar bagaimana perhatianmu diubah jadi komoditas oleh perusahaan teknologi melalui desain aplikasi yang adiktif.',
    questions: [
      {
        id: 'm01-q1',
        question: 'Menurutmu, apakah pertukaran antara "mendapatkan hiburan gratis di sosmed" dan "menyerahkan perhatian & data pribadimu" adalah kesepakatan yang adil? Jelaskan alasanmu!',
        hint: 'Pertimbangkan keuntungan yang kamu dapat vs waktu dan privasi yang kamu korbankan.',
        cognitiveLevel: 'C5-Evaluasi'
      },
      {
        id: 'm01-q2',
        question: 'Fitur apa di aplikasi favoritmu (seperti infinite scroll, notifikasi merah, autoplay) yang paling sering membuatmu lupa waktu? Bagaimana cara mengatasinya?',
        hint: 'Analisis rancangan antarmuka aplikasi yang mengeksploitasi dopamin otak.',
        cognitiveLevel: 'C4-Analisis'
      }
    ]
  },
  'M02': {
    title: 'Filter Bubble',
    topic: 'Filter Bubble',
    guide: 'Modul ini menjelaskan bagaimana algoritma mengurungmu dalam gelembung informasi yang hanya menampilkan hal-hal yang kamu sukai.',
    questions: [
      {
        id: 'm02-q1',
        question: 'Jika dua orang dengan minat berbeda mencari kata kunci yang sama di media sosial, hasilnya bisa sangat berbeda. Apa bahayanya jika kedua orang tersebut tidak menyadari hal ini?',
        hint: 'Analisis bagaimana persepsi realitas seseorang bisa terpecah akibat filter bubble.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'm02-q2',
        question: 'Langkah taktis apa yang bisa kamu lakukan secara berkala untuk "memecahkan" gelembung filter di akun media sosial pribadimu?',
        hint: 'Pikirkan cara mereset histori tontonan, mencari akun kontra-opini, atau menggunakan mode samaran.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M03': {
    title: 'Echo Chamber',
    topic: 'Echo Chamber',
    guide: 'Modul ini mengulas ruang gema sosial di mana pendapat serupa terus memantul dan membuat pandangan alternatif dianggap sebagai ancaman.',
    questions: [
      {
        id: 'm03-q1',
        question: 'Mengapa berada di dalam ruang gema (echo chamber) bersama orang-orang yang selalu setuju dengan kita terasa begitu nyaman dan menenangkan?',
        hint: 'Analisis kebutuhan psikologis manusia akan validasi sosial dan rasa aman.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'm03-q2',
        question: 'Bagaimana cara kamu tetap bersikap kritis ketika teman-teman satu kelompokmu secara serentak mempercayai sebuah narasi yang belum tentu benar?',
        hint: 'Evaluasi keberanian moral dan teknik mempertanyakan asumsi tanpa merusak pertemanan.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M04': {
    title: 'Bias Konfirmasi',
    topic: 'Bias Konfirmasi',
    guide: 'Modul ini membedah kecenderungan alami otak manusia untuk hanya mencari dan mempercayai bukti yang mendukung keyakinan awal kita.',
    questions: [
      {
        id: 'm04-q1',
        question: 'Pernahkah kamu sengaja mengabaikan data atau fakta yang valid hanya karena fakta tersebut bertentangan dengan figur atau hal yang kamu idolakan? Mengapa hal itu terjadi?',
        hint: 'Jujur pada diri sendiri dalam menganalisis bias konfirmasi emosional.',
        cognitiveLevel: 'C4-Analisis'
      },
      {
        id: 'm04-q2',
        question: 'Kebiasaan berpikir apa yang perlu dilatih agar kita tidak langsung menelan informasi yang terasa "sangat pas" dengan selera kita?',
        hint: 'Evaluasi konsep "Devil\'s Advocate" (sengaja mencari argumen tandingan).',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M05': {
    title: 'Polarisasi Media Sosial',
    topic: 'Polarisasi Sosial',
    guide: 'Modul ini menganalisis bagaimana algoritma dan konten provokatif membelah masyarakat menjadi kubu-kubu ekstrem.',
    questions: [
      {
        id: 'm05-q1',
        question: 'Mengapa algoritma media sosial cenderung mempromosikan konten yang bernada marah dan memecah belah lebih masif daripada konten yang mendamaikan?',
        hint: 'Analisis metrik keterlibatan (komentar perdebatan, share emosional) yang dicari algoritma.',
        cognitiveLevel: 'C4-Analisis'
      }
    ]
  },
  'M06': {
    title: 'Misleading Content & Cek Fakta',
    topic: 'Fact Checking',
    guide: 'Modul ini mengajarkan metode investigasi digital dan verifikasi silang (cross-check) informasi.',
    questions: [
      {
        id: 'm06-q1',
        question: 'Jika sebuah berita viral terlihat sangat meyakinkan tetapi disebarkan oleh akun tanpa reputasi jelas, apa 3 langkah pertama yang akan kamu lakukan sebelum mempercayainya?',
        hint: 'Tuliskan metode verifikasi sumber, pencarian pembanding, dan cek kredibilitas penulis.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M07': {
    title: 'Deepfake & AI Generatif',
    topic: 'Deepfake & AI Bias',
    guide: 'Modul ini menelusuri tantangan era kecerdasan buatan sintetis dan manipulasi audio-visual.',
    questions: [
      {
        id: 'm07-q1',
        question: 'Di era di mana video dan rekaman suara bisa dimanipulasi dengan AI (deepfake) secara sempurna, bagaimana cara kita menjaga kepercayaan publik terhadap kebenaran informasi?',
        hint: 'Evaluasi pentingnya integritas sumber primer dan literasi forensik digital.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M08': {
    title: 'Sistem Rekomendasi',
    topic: 'Algoritma Rekomendasi',
    guide: 'Modul ini membedah machine learning di balik tombol FYP, related videos, dan sponsored posts.',
    questions: [
      {
        id: 'm08-q1',
        question: 'Menurutmu, apakah sistem rekomendasi seharusnya diatur oleh undang-undang atau dibiarkan bebas ditentukan oleh perusahaan teknologi? Mengapa?',
        hint: 'Pertimbangkan keseimbangan antara inovasi teknologi dan perlindungan kepentingan publik.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M09': {
    title: 'Keterbukaan Perspektif & Empati',
    topic: 'Empati Digital',
    guide: 'Modul ini menekankan pentingnya memahami latar belakang dan motivasi di balik pandangan orang lain.',
    questions: [
      {
        id: 'm09-q1',
        question: 'Bagaimana kemampuan melihat masalah dari sudut pandang lawan bicara dapat membantumu menjadi netizen yang lebih bijak dan disegani di media sosial?',
        hint: 'Analisis nilai empati kognitif dalam menyelesaikan ketegangan komunikasi.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  },
  'M10': {
    title: 'Warga Digital Kritis',
    topic: 'Warga Digital Kritis',
    guide: 'Modul pamungkas yang menyatukan seluruh keterampilan literasi digital untuk aksi nyata.',
    questions: [
      {
        id: 'm10-q1',
        question: 'Sebagai seorang warganet yang telah mempelajari OutBubble, apa janji pribadimu dalam berinteraksi dan menyebarkan informasi di media sosial ke depannya?',
        hint: 'Tuliskan komitmen etika digital dan kontribusi positifmu bagi ruang siber.',
        cognitiveLevel: 'C5-Evaluasi'
      }
    ]
  }
};

export const BUBUL_REFLECTION_RESPONSES = [
  "Luar biasa! Pemikiranmu sangat tajam dan mendalam. Jawaban ini sudah kusimpan rapi ke Buku Refleksi di Profilmu 📖🫧",
  "Keren banget analisismu! Mempertimbangkan sudut pandang seperti ini membuktikan kamu warganet yang berpikiran terbuka. Catatan ini sudah tersimpan di Jurnalmu ✨",
  "Refleksi yang sangat bermakna! Kemampuanmu mengevaluasi situasi digital dengan kepala dingin adalah modal berharga. Sudah masuk ke Buku Refleksi Profilmu 🫧",
  "Mantap! Terus asah nalar kritismu seperti ini ya. Jawabanmu telah tercatat aman di The Progress Journal 🚀",
  "Jawaban yang sangat reflektif! Memahami batasan informasi membuat kita selangkah lebih maju daripada warganet yang pasif. Catatanmu sudah kusimpan di Jurnal 💡"
];
