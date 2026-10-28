import label from "daisyui/components/label";
import { min } from "three/tsl";



export const internetDetails = {
    PHONE: {
        companies: [
            "",
            "تسديد ارضي فقط",
            "تسديد انترنت بريد فقط",
            "تسديد ارضي + انترنت بريد",
        ],
        speeds: null,
        title: "تسديد فاتورة الارضي",
        description: 'اختر نوع الدفع',
        label: 'رقم الارضي',
        multiplier: 1.05,
        min: 1
    },

    ELEC: {
        companies: [
            "",
            "حماة-كهرباء",
            "حمص-كهرباء",
            "دمشق-كهرباء",
            "ريف دمشق-كهرباء",
            "السويداء-كهرباء",
            "درعا-كهرباء",
            "القنيطرة-كهرباء",
            "اللاذقية-كهرباء",
            "طرطوس-كهرباء",
            "دير الزور-كهرباء",
            "حلب-كهرباء",
        ],
        speeds: "counter",
        title: "تسديد فاتورة كهرباء",
        description: 'اختر المحافظة',
        label: 'رقم الباركود',
        multiplier: 1.05,
        min: 1
    },

    WATER: {
        companies: [
            "",
            "حماة-مياه",
            "حمص-مياه",
            "دمشق-مياه",
            "ريف دمشق-مياه",
            "السويداء-مياه",
            "درعا-مياه",
            "القنيطرة-مياه",
            "اللاذقية-مياه",
            "طرطوس-مياه",
            "دير الزور-مياه",
            "حلب-مياه",
        ],
        speeds: "counter",
        title: "تسديد فاتورة المياه",
        description: 'اختر المحافظة',
        label: 'رقم الباركود',
        multiplier: 1.05,
        min: 1
    },
    SYR: {
        companies: [
            '',
            'تحويل وحدات سريتل',
            'تحويل فاتورة سريتل',
            'تحويل كاش سريتل',
        ],
        speeds: null,
        title: "تحويل وحدات سريتل",
        description: 'اختر نوع الدفع',
        label: 'رقم الهاتف',
        multiplier: 1.075,
        min: 1
    },
    MTN: {
        companies: [
            '',
            'تحويل وحدات MTN',
            'تحويل فاتورة MTN',
            'تحويل كاش MTN'
        ],
        speeds: null,
        title: "تحويل وحدات MTN",
        description: 'اختر نوع الدفع',
        label: 'رقم الهاتف',
        multiplier: 1.075,
        min: 1
    },

    ADSL: {
        companies: [
            "",
            "ناس",
            "برونت",
            "اينت",
            "رنت",
            "الكم",
            "ليما",
            "سوا",
            "اية",
            "يارا",
            "بطاقات",
            "هايبر",
            "ويف",
            "امنية",
            "فيو",
            "ليزر",
            "متس",
            "سما",
            "زاد",
            "دنيا",
            "هاي فاي",
            "تكامل",
            "لاين",
            "الجمعية",
        ],
        speeds: [
            "512 Mbps   السعر 140",
            "1 Mbps     السعر 185",
            "2 Mbps     السعر 240",
            "4 Mbps     السعر 380",
            "8 Mbps     السعر 640",
            "16 Mbps   السعر  830",
        ],
        title: "تسديد فاتورة ADSL",
        description: 'اختر الشركة',
        label: 'رقم الارضي',
        multiplier: 1.05,
        min: 1
    },

    IPTV: {
        companies: [
            "",
            "ناس",
            "برونت",
            "اينت",
            "رنت",
            "الكم",
            "ليما",
            "سوا",
            "اية",
            "يارا",
            "بطاقات",
            "هايبر",
            "ويف",
            "امنية",
            "فيو",
            "ليزر",
            "متس",
            "سما",
            "زاد",
            "دنيا",
            "هاي فاي",
            "تكامل",
            "لاين",
            "الجمعية",
        ],
        speeds: [
            "البرونزية      السعر 175",
            "العائلية       السعر 220",
            "الذهبية        السعر 290",
        ],
        title: "تسديد فاتورة IPTV",
        description: 'اختر الباقة',
        label: 'رقم الارضي',
        multiplier: 1.05,
        min: 1
    },

    RECHARGE: {
        companies: [
            "",
            "ناس",
            "برونت",
            "اينت",
            "رنت",
            "الكم",
            "ليما",
            "سوا",
            "اية",
            "يارا",
            "بطاقات",
            "هايبر",
            "ويف",
            "امنية",
            "فيو",
            "ليزر",
            "متس",
            "سما",
            "زاد",
            "دنيا",
            "هاي فاي",
            "تكامل",
            "لاين",
            "الجمعية",
        ],
        speeds: [
            "5 GB        السعر 18",
            "10 GB       السعر 33",
            "20 GB       السعر 57",
            "30 GB       السعر 76",
            "50 GB       السعر 115",
            "75 GB       السعر 135",
            "100 GB      السعر 190",
            "200 GB      السعر 350",
        ],
        title: "شحن باقة انترنت",
        description: 'اختر الباقة',
        label: 'رقم الارضي',
        multiplier: 1.05,
        min: 1
    },
    pubg: {
        companies: [
            '',
            '60UC ( السعر 105 ل.س ) pubg',
            '325UC ( السعر 526 ل.س ) pubg',
            '660UC ( السعر 1053 ل.س ) pubg',
            '1800UC ( السعر 2553 ل.س ) pubg',
            '3850UC ( السعر 5176 ل.س ) pubg',
            '8100UC ( السعر 10386 ل.س ) pubg',
            'حزمة الشراء الأول ( السعر 161 ل.س )  pubg',
            'حزمة ترقية الأسلحة ( السعر 396 ل.س )  pubg',
            'حزمة الشعار الخرافي ( السعر 668 ل.س ) pubg',
            'برايم بلس لمدة شهر ( السعر 1151 ل.س )  pubg',
        ],
        speeds: null,

        title: "شحن pubg mobile",
        description: 'اختر حجم الشدات',
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        min: 1
    },
    pubgtr: {
        companies: [
            '',
            'PUBG TR 60 ( السعر 122 ل.س ) pubg mobile TR',
            'PUBG TR 325 ( السعر 543 ل.س ) pubg mobile TR',
            'PUBG TR 660 ( السعر 1000 ل.س ) pubg mobile TR',
            'PUBG TR 1800 ( السعر 2516 ل.س ) pubg mobile TR',
            'PUBG TR 3850 ( السعر 5003 ل.س ) pubg mobile TR',
            'PUBG TR 8100 ( السعر 9994 ل.س ) pubg mobile TR',
        ],
        speeds: null,

        title: "شحن pubg mobile TR",
        description: 'اختر حجم الشدات',

        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        min: 1
    },
    freefire: {
        companies: [
            '',
            'Free Fire 110 + 10 Diamond ( السعر 110 ل.س )',
            'Free Fire 210 + 21 Diamond ( السعر 219 ل.س )',
            'Free Fire 530 + 53 Diamond ( السعر 547 ل.س )',
            'Free Fire 1080 + 108 Diamond ( السعر 1088 ل.س )',
            'Free Fire 2200 + 220 Diamond ( السعر 2180 ل.س )',
            'Free Fire عضوية أسبوعية ( السعر 278 ل.س )',
            'Free Fire عضوية شهرية ( السعر 1307 ل.س )',
            'Free Fire تصريح بوياه ( السعر 389 ل.س )',
            'Free Fire ترقية المستوى 6 ( السعر 50 ل.س )',
            'Free Fire ترقية المستوى 10 ( السعر 87 ل.س )',
            'Free Fire ترقية المستوى 15 ( السعر 87 ل.س )',
            'Free Fire ترقية المستوى 20 ( السعر 87 ل.س )',
            'Free Fire ترقية المستوى 25 ( السعر 87 ل.س )',
            'Free Fire ترقية المستوى 30 ( السعر 134 ل.س )',
        ],
        speeds: null,

        title: "شحن free fire",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر حجم الشدات',
        min: 1
    },
    ballpool8: {
        companies: [
            '',
            'Ball Pool 20000 العملات الذهبية ( السعر 40 ل.س )',
            'Ball Pool 52000 العملات الذهبية ( السعر 90 ل.س )',
            'Ball Pool 112000 العملات الذهبية ( السعر 178 ل.س )',
            'Ball Pool 256000 العملات الذهبية ( السعر 355 ل.س )',
            'Ball Pool 800000 العملات الذهبية( السعر 895 ل.س )',
            'Ball Pool 2000000 العملات الذهبية( السعر 1800 ل.س )',
            'Ball Pool 20 العملات الورقية( السعر 40 ل.س )',
            'Ball Pool 50 العملات الورقية( السعر 90 ل.س )',
            'Ball Pool 110 العملات الورقية( السعر 178 ل.س )',
            'Ball Pool 250 العملات الورقية( السعر 355 ل.س )',
            'Ball Pool 800 العملات الورقية( السعر 895 ل.س )',
            'Ball Pool 2000 العملات الورقية( السعر 1800 ل.س )',
        ],
        speeds: null,

        title: "شحن ball pool 8",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر حجم العملات',
        min: 1
    },
    clashclans: {
        companies: [
            '',
            '80 DIAMOND ( السعر 161 ل.س ) clash of clans',
            '250 DIAMOND ( السعر 645 ل.س ) clash of clans',
            '1200 DIAMOND ( السعر 1326 ل.س ) clash of clans',
            'التذكرة الذهبية ( السعر 917 ل.س ) clash of clans',
            'تذكرة الحدث المصغرة ( السعر 657 ل.س ) clash of clans',
            'سكنات الملوك ( السعر 1326 ل.س ) clash of clans',
            'سكنات القرية ( السعر 929 ل.س ) clash of clans',
        ],
        speeds: null,

        title: "شحن clash of clans",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر حجم العملات',
        min: 1
    },
    clashroyal: {
        companies: [
            '',
            '80 DIAMOND ( السعر 122 ل.س ) clash royal',
            '500 DIAMOND ( السعر 607 ل.س ) clash royal',
            '1200 DIAMOND ( السعر 1214 ل.س ) clash royal',
            'ROYAL PASS ( السعر 1499 ل.س ) clash royal',
        ],
        speeds: null,

        title: "شحن clash royal",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر حجم العملات',
        min: 1
    },
    jawakerman: {
        companies: [
            '',
            'قم بتدخيل المبلغ بشكل يدوي jawaker'
        ],
        speeds: null,

        title: "شحن يدوي jawaker",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 0.0127,
        description: 'اختر الكمية',
        min: 10000,
    },
    jawaker: {
        companies: [
            '',
            'JAWAKER 400.000 (السعر 5175 ل.س)',
            'JAWAKER 525.000 (السعر 6700 ل.س)',
            'JAWAKER 805.000 (السعر 10300 ل.س)',
            'المسرع الاحمر  (السعر 196 ل.س) JAWAKER',
            'المسرع الازرق  (السعر 910 ل.س) JAWAKER',
            'المسرع الاسود  (السعر 1692 ل.س) JAWAKER',
            'المسرع الذهبي  (السعر 3258 ل.س) JAWAKER',
        ],
        speeds: null,

        title: "شحن  jawaker",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1
    },
    knivesout: {
        companies: [
            '',
            '60 GOLD (السعر 127 ل.س) knives out',
            '180 GOLD (السعر 386 ل.س) knives out',
            '300 GOLD (السعر 647 ل.س) knives out',
            '680 GOLD (السعر 1287 ل.س) knives out',
            '1280 GOLD (السعر 2575 ل.س) knives out',
            '1980 GOLD (السعر 3863 ل.س) knives out',
        ],
        speeds: null,

        title: "شحن knives out",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1
    },
    ludoking: {
        companies: [
            '',
            '830 ألماسة (السعر 252) ludo ',
            '5150 ألماسة (السعر 1146) ludo king',
            '13580 ألماسة (السعر 2911) ludo king',
            '55800 ألماسة (السعر 11825) ludo king',
        ],
        speeds: null,

        title: "شحن ludo king",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1
    },
    mobilelegend: {
        companies: [
            '',
            'Diamonds 257 (السعر 470) mobile legends',
            'Diamonds 344 (السعر 583) mobile legends',
            'Diamonds 514 (السعر 838) mobile legends',
            'Diamonds 1050 (السعر 1733) mobile legends',
            'Diamonds 2195 (السعر 3476) mobile legends',
            'Diamonds 5533 (السعر 8757) mobile legends',
        ],
        speeds: 'mobilelegend',
        title: "شحن mobile legends",
        label: 'يرجى ادخال User ID',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1


    },
    projectentropy: {
        companies: [
            '',
            'PE 500 STAR CHIPS (السعر 123 ل.س) project entropy',
        ],
        speeds: null,

        title: "شحن project entropy",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1
    },
    whithoutsurvivial: {
        companies: [
            '',
            'DIAMOND 499 (السعر 635) whithout survivial',
            'DIAMOND 999 (السعر 1306) whithout survivial',
            'DIAMOND 1999 (السعر 2646) whithout survivial',
            'DIAMOND 4999 (السعر 6524) whithout survivial',
        ],
        speeds: null,

        title: "شحن whithout survivial",
        label: 'يرجى ادخال معرف المستخدم',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1
    },
    USDTBEB20: {
        companies: [
            '',
            'قم بتدخيل كمية USDT-BEB20 المراد شحنها'
        ],
        speeds: null,

        title: "شحن  USDT-BEB20",
        label: 'يرجى وضع رابط المحفظة',
        multiplier: 123,
        description: 'اختر الكمية',
        min: 50,
    },
    USDTTRC20: {
        companies: [
            '',
            'قم بتدخيل كمية USDT-TRC20 المراد شحنها'
        ],
        speeds: null,

        title: "شحن  USDT-TRC20",
        label: 'يرجى وضع رابط المحفظة',
        multiplier: 123,
        description: 'اختر الكمية',
        min: 50,
    },

    BANKTR: {
        companies: [
            '',
            'قم بتدخيل كمية BANK-TR المراد شحنها'
        ],
        speeds: 'BANKTR',

        title: "شحن  BANK-TR",
        label: 'يرجى  ادخال اسم المستقبل',
        multiplier: 2.90,
        description: 'اختر الكمية',
        min: 100,
    },
    PAYCELL: {
        companies: [
            '',
            'قم بتدخيل كمية PAYCELL المراد شحنها'
        ],
        speeds: null,

        title: "شحن PAYCELL",
        label: 'يرجى  ادخال معرف المستخدم',
        multiplier: 2.90,
        description: 'اختر الكمية',
        min: 25,
    },
    chatjpt: {
        companies: [
            '',
            'ChatGPT plus حساب جديد جاهز لمدة شهر (السعر 750)',
            'ChatGPT plus شهري تجديد حسابك (السعر 1500)',

        ],
        speeds: 'chatjpt',
        title: "شراء اشتراك chatjpt ",
        label: 'باسورد حساب الشات',
        multiplier: 1,
        description: 'اختر الكمية',
        min: 1


    },




};