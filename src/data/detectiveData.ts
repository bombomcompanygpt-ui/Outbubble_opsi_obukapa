import { FeedItem, EvidenceItem, QuestionOption, ActionCardItem } from '../types/detective';

// ==========================================
// CASE 01: RAKA (WHO CREATED THIS FEED?)
// ==========================================
export const CASE_1_PROFILE = {
  name: "Raka",
  age: 16,
  role: "Siswa SMA Kelas 11",
  interests: ["Basketball", "Musik Indie", "Gaming"],
  avatarSeed: "Raka_Hoops",
  device: "Smartphone X-Pro"
};

export const CASE_1_FEED: FeedItem[] = [
  {
    id: "c1-f1",
    category: "sports",
    icon: "🏀",
    title: "10 Aksi Slam Dunk Paling Spektakuler Musim Ini!",
    author: "@HoopsDaily",
    tag: "#BasketballID",
    likes: 14200,
    comments: 890
  },
  {
    id: "c1-f2",
    category: "sports",
    icon: "🏀",
    title: "Analisis Taktik: Mengapa Tim Juara Menggunakan Pick & Roll Cepat",
    author: "@CoachBudi",
    tag: "#TacticsZone",
    likes: 8500,
    comments: 312
  },
  {
    id: "c1-f3",
    category: "sports",
    icon: "🏀",
    title: "Review Sepatu Basket Terlaris: Grip Terbaik untuk Lapangan Outdoor",
    author: "@SneakerHeadID",
    tag: "#BasketballGear",
    likes: 19400,
    comments: 1045
  },
  {
    id: "c1-f4",
    category: "sports",
    icon: "🏀",
    title: "Latihan Dribble 15 Menit di Rumah untuk Meningkatkan Kecepatan Tangan",
    author: "@DunkAcademy",
    tag: "#TrainingTips",
    likes: 12100,
    comments: 420
  }
];

export const CASE_1_EVIDENCE: EvidenceItem[] = [
  {
    id: "e1-like",
    iconType: "like",
    title: "Aktivitas 'Like'",
    subtitle: "Raka sering memberi Love ❤️ pada konten basket",
    detail: "Data telemetri menunjukkan Raka menekan tombol 'Like' pada 9 dari 10 video basket dalam 7 hari terakhir.",
    discovered: false
  },
  {
    id: "e1-watch",
    iconType: "watch",
    title: "Watch History & Durasi",
    subtitle: "Raka menonton video basket hingga detik terakhir",
    detail: "Retention rate Raka mencapai 98% saat menonton klip pertandingan basket, memberi sinyal kepuasan tinggi pada algoritma.",
    discovered: false
  },
  {
    id: "e1-follow",
    iconType: "follow",
    title: "Daftar Akun yang Diikuti",
    subtitle: "Raka mengikuti banyak akun & komunitas basket",
    detail: "Dari total 60 akun yang di-follow, 48 di antaranya adalah atlet basket, komentator NBA/IBL, dan toko perlengkapan olahraga.",
    discovered: false
  },
  {
    id: "e1-skip",
    iconType: "skip",
    title: "Konten yang Dilewati (Skipped)",
    subtitle: "Raka langsung swipe/skip konten non-basket",
    detail: "Konten berita umum, musik, dan sains langsung dilewati dalam < 1.5 detik. Algoritma mencatat topik tersebut 'kurang diminati'.",
    discovered: false
  }
];

export const CASE_1_QUESTION = {
  question: "Berdasarkan seluruh bukti di atas, faktor apa yang paling dominan memengaruhi algoritma dalam merekomendasikan feed Raka?",
  options: [
    {
      id: "c1-opt-a",
      text: "Warna tema aplikasi dan jenis sistem operasi ponsel yang dipakai Raka.",
      isCorrect: false,
      feedback: "🧐 Kurang tepat. Perhatikan kembali data bukti suka (likes), durasi tonton, dan akun yang di-follow Raka!"
    },
    {
      id: "c1-opt-b",
      text: "Aktivitas interaksi, durasi tonton, dan preferensi digital Raka sebelumnya.",
      isCorrect: true,
      feedback: "🔎 Analisis Hebat! Algoritma membaca pola riwayat interaksi pengguna untuk menyusun rekomendasi personalisasi."
    },
    {
      id: "c1-opt-c",
      text: "Jumlah total aplikasi yang terpasang di memori internal ponsel Raka.",
      isCorrect: false,
      feedback: "🧐 Kurang tepat. Algoritma media sosial memantau perilaku pengguna di dalam platform, bukan aplikasi lain di memori ponsel."
    },
    {
      id: "c1-opt-d",
      text: "Kombinasi nama pengguna (username) dan tanggal lahir akun Raka.",
      isCorrect: false,
      feedback: "🧐 Kurang tepat. Username tidak menentukan preferensi konten harian yang disukai pengguna."
    }
  ]
};

// ==========================================
// CASE 02: NAYA (FIND THE BUBBLE)
// ==========================================
export const CASE_2_PROFILE = {
  name: "Naya",
  age: 17,
  role: "Siswa SMA Kelas 12",
  interests: ["Isu Sosial", "Kesehatan", "Lingkungan"],
  avatarSeed: "Naya_Explorer",
  device: "Tablet Edu-Smart"
};

export const CASE_2_FEED: FeedItem[] = [
  {
    id: "c2-f1",
    category: "opinion",
    icon: "📰",
    title: "Klaim Isu X: Mengapa Kebijakan Baru Ini Hanya Merugikan Masyarakat!",
    author: "@WargaVokal",
    tag: "#OpiniKubuA",
    likes: 8300,
    comments: 1200
  },
  {
    id: "c2-f2",
    category: "opinion",
    icon: "📰",
    title: "Bukti Baru: Sudut Pandang A Adalah Satu-Satunya Solusi yang Masuk Akal",
    author: "@FokusSatuArah",
    tag: "#OpiniKubuA",
    likes: 12900,
    comments: 940
  },
  {
    id: "c2-f3",
    category: "opinion",
    icon: "📰",
    title: "Mengapa Orang yang Tidak Setuju dengan Opini A Dianggap Keliru?",
    author: "@KritikKeras",
    tag: "#OpiniKubuA",
    likes: 6700,
    comments: 810
  },
  {
    id: "c2-f4",
    category: "opinion",
    icon: "📰",
    title: "Rangkuman Argumen Pendukung Opini A yang Wajib Kamu Bagikan",
    author: "@SolidaritasA",
    tag: "#OpiniKubuA",
    likes: 15400,
    comments: 1350
  }
];

export const CASE_2_MISSING_FEED: FeedItem[] = [
  {
    id: "c2-m1",
    category: "news",
    icon: "📰",
    title: "Opini Kubu B: Mengapa Kebijakan Ini Memiliki Manfaat Jangka Panjang",
    author: "@PerspektifLain",
    tag: "#SudutPandangB",
    likes: 9100,
    comments: 630
  },
  {
    id: "c2-m2",
    category: "discussion",
    icon: "💬",
    title: "Analisis Netral: Membandingkan Kelebihan dan Kekurangan Isu X",
    author: "@PakarKebijakan",
    tag: "#DiskusiSehat",
    likes: 11200,
    comments: 480
  },
  {
    id: "c2-m3",
    category: "education",
    icon: "🏫",
    title: "Riset Data Statistik: Apa Kata Fakta Empiris Mengenai Isu Ini?",
    author: "@JurnalData",
    tag: "#DataKritis",
    likes: 14800,
    comments: 720
  }
];

export const CASE_2_QUESTION_1 = {
  question: "Apa risiko atau permasalahan terbesar jika Naya terus-menerus hanya menerima informasi yang sesuai dengan preferensi awalnya (Opini A)?",
  options: [
    {
      id: "c2-q1-a",
      text: "Tampilan linimasa media sosialnya menjadi lebih berwarna dan interaktif.",
      isCorrect: false,
      feedback: "🧐 Kurang tepat. Masalah utama bukan pada aspek estetika, melainkan pada keragaman informasi yang diterima."
    },
    {
      id: "c2-q1-b",
      text: "Keterpaparan Naya terhadap sudut pandang alternatif menjadi sangat terbatas (Filter Bubble).",
      isCorrect: true,
      feedback: "🫧 Tepat Sekali! Personalisasi berlebih dapat mengurung pengguna dalam gelembung informasi yang homogen."
    },
    {
      id: "c2-q1-c",
      text: "Performa baterai dan kecepatan koneksi internet pada perangkat ponselnya menurun drastis.",
      isCorrect: false,
      feedback: "🧐 Kurang tepat. Filter bubble adalah fenomena penyempitan informasi, bukan masalah teknis hardware."
    },
    {
      id: "c2-q1-d",
      text: "Naya secara otomatis akan selalu mendapatkan informasi yang 100% akurat dan valid.",
      isCorrect: false,
      feedback: "🧐 Kurang tepat. Kesamaan opini tidak menjamin kebenaran atau kelengkapan suatu fakta."
    }
  ]
};

export const CASE_2_QUESTION_2 = {
  question: "Naya ingin memahami isu tersebut secara utuh dan berimbang. Tindakan mana yang paling konstruktif untuk ia lakukan?",
  options: [
    {
      id: "c2-q2-a",
      text: "Hanya mengikuti akun-akun yang memiliki pandangan identik agar merasa nyaman.",
      isCorrect: false,
      feedback: "🧐 Itu justru akan mempertebal dinding Filter Bubble & Echo Chamber Naya."
    },
    {
      id: "c2-q2-b",
      text: "Terus menonton konten sejenis secara berulang hingga meyakini tidak ada opini lain.",
      isCorrect: false,
      feedback: "🧐 Tindakan ini membuat algoritma semakin mengira Naya hanya ingin melihat satu sudut pandang."
    },
    {
      id: "c2-q2-c",
      text: "Secara sadar mencari informasi dari berbagai sumber, perspektif berbeda, dan data terverifikasi.",
      isCorrect: true,
      feedback: "🫧 Sangat Tepat! Memecah gelembung informasi bukan berarti harus setuju dengan semua orang, tetapi memberi ruang bagi nalar untuk membedah beragam sudut pandang."
    },
    {
      id: "c2-q2-d",
      text: "Berhenti membaca informasi sama sekali dan menutup diri dari dinamika sosial.",
      isCorrect: false,
      feedback: "🧐 Menghindar tidak melatih nalar kritis. Kuncinya adalah literasi dan verifikasi silang."
    }
  ]
};

// ==========================================
// CASE 03: DIMAS (CHANGE THE FEED)
// ==========================================
export const CASE_3_PROFILE = {
  name: "Dimas",
  age: 16,
  role: "Siswa SMA Kelas 10",
  interests: ["Teknologi", "Olahraga", "Sains"],
  avatarSeed: "Dimas_Tech",
  device: "Smartphone Pro-5G"
};

export const CASE_3_INITIAL_FEED: FeedItem[] = [
  {
    id: "c3-i1",
    category: "sports",
    icon: "🏀",
    title: "10 Aksi Slam Dunk Spektakuler Musim Ini",
    author: "@HoopsDaily",
    tag: "#BasketballID",
    likes: 12400,
    comments: 530
  },
  {
    id: "c3-i2",
    category: "sports",
    icon: "🏀",
    title: "Pemain Bintang Pindah Klub: Berita Transfer Terpanas",
    author: "@BallerNews",
    tag: "#BasketballID",
    likes: 9800,
    comments: 420
  },
  {
    id: "c3-i3",
    category: "sports",
    icon: "🏀",
    title: "Tips Memperbaiki Akurasi Lemparan Tiga Angka",
    author: "@CoachHandy",
    tag: "#BasketballID",
    likes: 15100,
    comments: 880
  },
  {
    id: "c3-i4",
    category: "sports",
    icon: "🏀",
    title: "Sepatu Edisi Terbatas Resmi Diluncurkan Pekan Ini",
    author: "@SneakersZone",
    tag: "#BasketballID",
    likes: 8200,
    comments: 310
  }
];

export const CASE_3_ACTION_CARDS: ActionCardItem[] = [
  {
    id: "act-a",
    icon: "❤️",
    label: "TINDAKAN A",
    description: "Hanya menyukai dan membagikan jenis konten yang sama secara terus-menerus.",
    isCorrect: false
  },
  {
    id: "act-b",
    icon: "🔎",
    label: "TINDAKAN B",
    description: "Mencari informasi dan mengeksplorasi topik sains, edukasi, dan berita dari berbagai sumber baru.",
    isCorrect: true
  },
  {
    id: "act-c",
    icon: "👥",
    label: "TINDAKAN C",
    description: "Hanya mengikuti dan berteman dengan akun yang memiliki minat dan opini serupa.",
    isCorrect: false
  },
  {
    id: "act-d",
    icon: "📰",
    label: "TINDAKAN D",
    description: "Melakukan verifikasi silang dan membandingkan beragam sudut pandang sebelum menarik kesimpulan.",
    isCorrect: true
  }
];

export const CASE_3_TRANSFORMED_FEED: FeedItem[] = [
  {
    id: "c3-t1",
    category: "sports",
    icon: "🏀",
    title: "Update Liga Basket Nasional Pekan Ini",
    author: "@HoopsDaily",
    tag: "#Olahraga",
    likes: 11200,
    comments: 420
  },
  {
    id: "c3-t2",
    category: "news",
    icon: "📰",
    title: "Analisis Kebijakan Lingkungan: Solusi Pengurangan Sampah Plastik",
    author: "@WartaKritis",
    tag: "#BeritaLingkungan",
    likes: 14500,
    comments: 890
  },
  {
    id: "c3-t3",
    category: "gaming",
    icon: "🎮",
    title: "Eksplorasi Game Edukasi Logika & Coding untuk Siswa SMA",
    author: "@TechGamingID",
    tag: "#Teknologi",
    likes: 9200,
    comments: 310
  },
  {
    id: "c3-t4",
    category: "education",
    icon: "🏫",
    title: "Mengapa Berpikir Kritis Penting di Era Kecerdasan Buatan (AI)?",
    author: "@SainsMasaDepan",
    tag: "#LiterasiDigital",
    likes: 18400,
    comments: 1150
  },
  {
    id: "c3-t5",
    category: "discussion",
    icon: "💬",
    title: "Forum Terbuka: Etika Berdialog Sehat di Media Sosial",
    author: "@PerspectiveGarden",
    tag: "#Dialektika",
    likes: 13600,
    comments: 970
  }
];

export const CASE_3_FINAL_CHALLENGE = {
  situation: "Dimas menemukan sebuah artikel viral yang sangat mendukung opini pribadinya. Sebelum memutuskan untuk membagikannya ke media sosial atau grup chat, apa tindakan paling bijak yang harus ia lakukan?",
  options: [
    {
      id: "c3-f-a",
      text: "Langsung membagikannya sesegera mungkin karena isinya sangat cocok dengan apa yang ia yakini.",
      isCorrect: false,
      feedback: "🧐 Ini adalah jebakan Bias Konfirmasi (Confirmation Bias). Kita cenderung buru-buru share konten yang kita sukai tanpa cek fakta."
    },
    {
      id: "c3-f-b",
      text: "Melihat berapa banyak jumlah like dan share artikel tersebut sebagai tolok ukur kebenaran mutlak.",
      isCorrect: false,
      feedback: "🧐 Jumlah like atau viralitas tinggi tidak selalu berarti informasinya akurat (bisa jadi clickbait atau misinformasi)."
    },
    {
      id: "c3-f-c",
      text: "Melakukan verifikasi silang (cross-check) dan membandingkan isi artikel dengan sumber rujukan primer lain yang kredibel.",
      isCorrect: true,
      feedback: "🔎 Sempurna! Melakukan pembacaan lateral (lateral reading) adalah ciri utama warganet berdaya nalar kritis tingkat tinggi."
    },
    {
      id: "c3-f-d",
      text: "Hanya meminta pendapat teman satu kelompok yang sudah pasti memiliki pandangan sama.",
      isCorrect: false,
      feedback: "🧐 Meminta konfirmasi pada orang yang sepemikiran hanya akan memperkuat ruang gema (echo chamber)."
    }
  ]
};
