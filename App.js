import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  Switch,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LOGO_URL = 'https://i.ibb.co/1Y9xKCpr/IMG-5444.png';
const DEVELOPER_PHONE = '01229431500';
const DEFAULT_TARGET_WA = '01009669403';
const COMPANY_GMAIL = 'sanita.logistics.egypt@gmail.com';

const INITIAL_LOCATIONS = [
  {
    id: '1',
    name: 'مخزن الشايع (ستارباكس ومذركير) - العاشر من رمضان',
    company: 'الشايع',
    phone: '01000000001',
    notes: 'المخزن الرئيسي لتوزيع منتجات ومستلزمات ستارباكس ومذركير - المنطقة الصناعية.',
    mapsUrl: 'https://maps.google.com/?q=Alshaya+Warehouse+10th+of+Ramadan'
  },
  {
    id: '2',
    name: 'مخازن سوفيكو (Sofico) - مسطرد',
    company: 'سوفيكو',
    phone: '0223500000',
    notes: 'مخازن التوزيع الكبرى بمسطرد - دخول سيارات النقل والتوزيع.',
    mapsUrl: 'https://maps.google.com/?q=Sofico+Mostorod'
  },
  {
    id: '3',
    name: 'طلبات ديليفري (Talabat Hub) - مدينة نصر',
    company: 'طلبات',
    phone: '19912',
    notes: 'مركز تجمع وتوزيع طلبات الأوردرات والكباتن.',
    mapsUrl: 'https://maps.google.com/?q=Talabat+Hub+Nasr+City'
  },
  {
    id: '4',
    name: 'طلبات ديليفري - فرع الجيزة (الدقي)',
    company: 'طلبات',
    phone: '19912',
    notes: 'محطة استعلام وتمركز دليفري الجيزة.',
    mapsUrl: 'https://maps.google.com/?q=Talabat+Dokki'
  },
  {
    id: '5',
    name: 'ابن سينا فارما - مخزن القطامية الرئيسي',
    company: 'ابن سينا فارما',
    phone: '19048',
    notes: 'استلام الأدوية والمستلزمات الطبية - التجمع / القطامية.',
    mapsUrl: 'https://maps.google.com/?q=ابن+سينا+فارما+القطامية'
  },
  {
    id: '6',
    name: 'ابن سينا فارما - فرع 6 أكتوبر',
    company: 'ابن سينا فارما',
    phone: '19048',
    notes: 'المنطقة الصناعية - استلام وتوزيع الجيزة.',
    mapsUrl: 'https://maps.google.com/?q=ابن+سينا+فارما+6+أكتوبر'
  },
  {
    id: '7',
    name: 'أمازون مصر - المركز اللوجستي الرئيسي (الشروق)',
    company: 'أمازون',
    phone: '08000003886',
    notes: 'دخول الشاحنات والنقل الثقيل من البوابة 2 الخلفية.',
    mapsUrl: 'https://maps.google.com/?q=Amazon+FC+El+Shorouk'
  },
  {
    id: '8',
    name: 'أمازون مصر - مخزن العاشر من رمضان',
    company: 'أمازون',
    phone: '08000003886',
    notes: 'المنطقة الصناعية A1 - تسليم البضائع الكبيرة.',
    mapsUrl: 'https://maps.google.com/?q=Amazon+Warehouse+10th+of+Ramadan'
  },
  {
    id: '9',
    name: 'أمازون مصر - مخزن أبو رواش (الجيزة)',
    company: 'أمازون',
    phone: '08000003886',
    notes: 'تغطية توصيل غرب القاهرة والجيزة.',
    mapsUrl: 'https://maps.google.com/?q=Amazon+Abu+Rawash'
  },
  {
    id: '10',
    name: 'جوميا مصر - مخزن 6 أكتوبر الرئيسي',
    company: 'جوميا',
    phone: '15204',
    notes: 'مواعيد استلام الموردين والسواقين من 8 ص حتى 4 ع.',
    mapsUrl: 'https://maps.google.com/?q=Jumia+Warehouse+6th+October'
  },
  {
    id: '11',
    name: 'جوميا مصر - مركز تجمع المقطم',
    company: 'جوميا',
    phone: '15204',
    notes: 'توزيع فرعي لمناطق وسط وجنوب القاهرة.',
    mapsUrl: 'https://maps.google.com/?q=Jumia+Mokattam'
  },
  {
    id: '12',
    name: 'نون (noon) - مركز التجميع والتوزيع (أبو رواش)',
    company: 'نون',
    phone: '16086',
    notes: 'المنطقة الصناعية أبو رواش - استلام شحنات Express.',
    mapsUrl: 'https://maps.google.com/?q=noon+Hub+Abu+Rawash'
  },
  {
    id: '13',
    name: 'نون (noon) - مستودع العبور',
    company: 'نون',
    phone: '16086',
    notes: 'مدينة العبور - الحي الصناعي الأول.',
    mapsUrl: 'https://maps.google.com/?q=noon+Obour+Warehouse'
  },
  {
    id: '14',
    name: 'بي تك (B.TECH) - المركز اللوجستي (العاشر من رمضان)',
    company: 'B.TECH',
    phone: '19966',
    notes: 'مخزن الأجهزة الكهربائية والألكترونيات.',
    mapsUrl: 'https://maps.google.com/?q=B.TECH+Logistics+Center'
  },
  {
    id: '15',
    name: 'بوسطة (Bosta) - Hub المقطم الرئيسي',
    company: 'بوسطة',
    phone: '19036',
    notes: 'فرز وتسليم شحنات التجار لسائقي التوصيل.',
    mapsUrl: 'https://maps.google.com/?q=Bosta+Mokattam+Hub'
  },
  {
    id: '16',
    name: 'بوسطة (Bosta) - فرع الإسكندرية',
    company: 'بوسطة',
    phone: '19036',
    notes: 'منطقة سموحة - مركز الفرز والتوزيع الساحلي.',
    mapsUrl: 'https://maps.google.com/?q=Bosta+Alexandria'
  },
  {
    id: '17',
    name: 'أرامكس (Aramex) - مركز فرز العاشر من رمضان',
    company: 'أرامكس',
    phone: '16991',
    notes: 'شحن دولي ومحلي - بوابة الموردين والنقل الجماعي.',
    mapsUrl: 'https://maps.google.com/?q=Aramex+10th+of+Ramadan'
  },
  {
    id: '18',
    name: 'أرامكس (Aramex) - محطة المطار (القاهرة)',
    company: 'أرامكس',
    phone: '16991',
    notes: 'شحن جوي وطرود دولية سريعة.',
    mapsUrl: 'https://maps.google.com/?q=Aramex+Cairo+Airport'
  },
  {
    id: '19',
    name: 'مرسول مصر - فرع الدقي والتوزيع',
    company: 'مرسول',
    phone: '01000000000',
    notes: 'مكتب استلام واستبدال أدوات وكباتن مرسول.',
    mapsUrl: 'https://maps.google.com/?q=Mrsool+Egypt+Dokki'
  },
  {
    id: '20',
    name: 'تريدلاين (Tradeline) - المركز الرئيسي ومخزن القطامية',
    company: 'تريدلاين',
    phone: '19858',
    notes: 'موزع منتجات أبل المعتمد - استلام بضائع الأجهزة.',
    mapsUrl: 'https://maps.google.com/?q=Tradeline+Katameya'
  },
  {
    id: '21',
    name: 'راية شوب (Raya Shop) - مخزن أبو رواش',
    company: 'راية',
    phone: '19900',
    notes: 'مخازن التجارة الإلكترونية والأجهزة.',
    mapsUrl: 'https://maps.google.com/?q=Raya+Distribution+Abu+Rawash'
  },
  {
    id: '22',
    name: 'إل جي مصر (LG) - المخزن المركزي (العبور)',
    company: 'إل جي',
    phone: '19990',
    notes: 'استلام الأجهزة المنزلية والشاشات.',
    mapsUrl: 'https://maps.google.com/?q=LG+Warehouse+Obour'
  },
  {
    id: '23',
    name: 'مترو ماركت وكنوز (Metro & Kheir Zaman) - مخزن أبو رواش',
    company: 'مترو وخير زمان',
    phone: '19259',
    notes: 'مخازن الأغذية والسلع الاستهلاكية.',
    mapsUrl: 'https://maps.google.com/?q=Metro+Market+Warehouse+Abu+Rawash'
  },
  {
    id: '24',
    name: 'سبينس مصر (Spinneys) - مركز التوزيع الرئيسي (العبور)',
    company: 'سبينس',
    phone: '16005',
    notes: 'تخزين وتوزيع الأغذية والمستلزمات.',
    mapsUrl: 'https://maps.google.com/?q=Spinneys+Obour+Warehouse'
  },
  {
    id: '25',
    name: 'هومز مارت (Homzmart) - مخزن العاشر من رمضان',
    company: 'هومز مارت',
    phone: '0235380000',
    notes: 'منصة أونلاين الأثاث والديكور - استلام الشاحنات.',
    mapsUrl: 'https://maps.google.com/?q=Homzmart+Warehouse+10th+of+Ramadan'
  },
  {
    id: '26',
    name: 'البنك الأهلي المصري - مركز التحصيل والعمليات (القرية الذكية)',
    company: 'بنوك ومحطات',
    phone: '19623',
    notes: 'إيداع وتحصيل الشحنات المالية والعهد.',
    mapsUrl: 'https://maps.google.com/?q=National+Bank+of+Egypt+Smart+Village'
  },
  {
    id: '27',
    name: 'بنك مصر - مركز العمليات والخدمات (التجمع الخامس)',
    company: 'بنوك ومحطات',
    phone: '19888',
    notes: 'استلام وتوريد عهد السائقين والشحنات المالية.',
    mapsUrl: 'https://maps.google.com/?q=Banque+Misr+NewCairo'
  },
  {
    id: '28',
    name: 'محطة تحصيل فوري (Fawry Hub) - القرية الذكية',
    company: 'بنوك ومحطات',
    phone: '16421',
    notes: 'محطة تسوية المدفوعات والخدمات المالية.',
    mapsUrl: 'https://maps.google.com/?q=Fawry+Smart+Village'
  }
];

const COMPANIES_LIST = [
  'الكل',
  'الشايع',
  'سوفيكو',
  'طلبات',
  'ابن سينا فارما',
  'أمازون',
  'جوميا',
  'نون',
  'B.TECH',
  'بوسطة',
  'أرامكس',
  'مرسول',
  'تريدلاين',
  'راية',
  'إل جي',
  'مترو وخير زمان',
  'سبينس',
  'هومز مارت',
  'بنوك ومحطات'
];

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const [activeTab, setActiveTab] = useState('locations');
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('الكل');

  const [driverName, setDriverName] = useState('');
  const [shipmentNo, setShipmentNo] = useState('');
  const [meterNo, setMeterNo] = useState('');
  const [destination, setDestination] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [shipmentNotes, setShipmentNotes] = useState('');
  const [shipmentStatus, setShipmentStatus] = useState('في الطريق');

  const [savedShipments, setSavedShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const [isAuthorized, setIsAuthorized] = useState(true);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  const [customPinEnabled, setCustomPinEnabled] = useState(false);
  const [customPin, setCustomPin] = useState('1234');
  const [pinSetupModal, setPinSetupModal] = useState(false);
  const [tempNewPin, setTempNewPin] = useState('');

  const [menuVisible, setMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [showUnderEditNotice, setShowUnderEditNotice] = useState(false);

  useEffect(() => {
    loadStoredData();
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false);
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const loadStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem('@sanita_shipments_v15');
      if (stored !== null) {
        setSavedShipments(JSON.parse(stored));
      }
      const themeStored = await AsyncStorage.getItem('@sanita_theme');
      if (themeStored !== null) {
        setIsDarkMode(JSON.parse(themeStored));
      }
      const pinEnabledStored = await AsyncStorage.getItem('@sanita_pin_enabled');
      if (pinEnabledStored !== null) {
        const enabled = JSON.parse(pinEnabledStored);
        setCustomPinEnabled(enabled);
        if (enabled) {
          setIsAuthorized(false);
        }
      }
      const pinStored = await AsyncStorage.getItem('@sanita_custom_pin');
      if (pinStored !== null) {
        setCustomPin(pinStored);
      }
    } catch (e) {
      console.log('Error loading data', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStoredData();
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const saveToStorage = async (newList) => {
    try {
      await AsyncStorage.setItem('@sanita_shipments_v15', JSON.stringify(newList));
    } catch (e) {}
  };

  const toggleTheme = async (value) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem('@sanita_theme', JSON.stringify(value));
    } catch (e) {}
  };

  const handleTabPress = (tabName) => {
    if (tabName === 'driver' && customPinEnabled && !isAuthorized) {
      setPinModalVisible(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const verifyPin = () => {
    if (enteredPin === customPin) {
      setIsAuthorized(true);
      setPinModalVisible(false);
      setEnteredPin('');
      setActiveTab('driver');
    } else {
      Alert.alert('خطأ', 'الرمز السري غير صحيح!');
      setEnteredPin('');
    }
  };

  const handleTogglePinFeature = async (val) => {
    setCustomPinEnabled(val);
    try {
      await AsyncStorage.setItem('@sanita_pin_enabled', JSON.stringify(val));
      if (val) {
        setMenuVisible(false);
        setPinSetupModal(true);
      } else {
        setIsAuthorized(true);
      }
    } catch (e) {}
  };

  const saveNewCustomPin = async () => {
    if (!tempNewPin || tempNewPin.length < 3) {
      Alert.alert('تنبيه', 'برجاء إدخال رمز سري مكون من 3 أرقام على الأقل');
      return;
    }
    setCustomPin(tempNewPin);
    try {
      await AsyncStorage.setItem('@sanita_custom_pin', tempNewPin);
      setPinSetupModal(false);
      setTempNewPin('');
      Alert.alert('نجاح', 'تم حفظ وتحديث الرمز السري بنجاح 🔒');
    } catch (e) {}
  };

  const filteredLocations = INITIAL_LOCATIONS.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.notes.toLowerCase().includes(search.toLowerCase());

    const matchesCompany = selectedCompany === 'الكل' || item.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const handleAddShipment = () => {
    if (!driverName || !destination) {
      Alert.alert('تنبيه', 'برجاء ملء اسم السائق والوجهة على الأقل لحفظ الشحنة');
      return;
    }

    const etaDate = new Date(Date.now() + 60 * 60 * 1000).toLocaleString('ar-EG', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    const newShipment = {
      id: Date.now().toString(),
      driverName,
      shipmentNo: shipmentNo ? shipmentNo.trim() : 'غير محدد',
      meterNo: meterNo ? meterNo.trim() : '',
      destination,
      clientPhone: clientPhone || DEFAULT_TARGET_WA,
      status: shipmentStatus,
      driverNotes: shipmentNotes ? shipmentNotes.trim() : '',
      deliveryProof: false,
      deliveryProofDate: '',
      date: new Date().toLocaleString('ar-EG', { hour12: true }),
      smartETA: `اليوم، ${etaDate}`
    };

    const updatedList = [newShipment, ...savedShipments];
    setSavedShipments(updatedList);
    saveToStorage(updatedList);

    setDriverName('');
    setShipmentNo('');
    setMeterNo('');
    setDestination('');
    setClientPhone('');
    setShipmentNotes('');
    setShipmentStatus('في الطريق');

    Alert.alert('نجاح', 'تم حفظ الشحنة وتثبيتها بنجاح 🚀');
  };

  const handleDeleteShipment = (id) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذه الشحنة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => {
          const updatedList = savedShipments.filter(s => s.id !== id);
          setSavedShipments(updatedList);
          saveToStorage(updatedList);
        }
      }
    ]);
  };

  const openStatusModal = (shipment) => {
    setSelectedShipment(shipment);
    setStatusModalVisible(true);
  };

  const changeShipmentStatus = (newStatus) => {
    if (!selectedShipment) return;
    const updatedList = savedShipments.map(s =>
      s.id === selectedShipment.id ? { ...s, status: newStatus } : s
    );
    setSavedShipments(updatedList);
    saveToStorage(updatedList);
    setStatusModalVisible(false);
    setSelectedShipment(null);
    Alert.alert('تم التحديث', `تم تغيير حالة الشحنة إلى: ${newStatus}`);
  };

  const handleSendStatus = (s, statusType) => {
    const currentDateTime = new Date().toLocaleString('ar-EG', { hour12: true });
    const locationMapUrl = 'https://maps.google.com/?q=current+location';
    let targetNumber = s.clientPhone ? s.clientPhone.trim() : DEFAULT_TARGET_WA;
    let cleanPhone = targetNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '2' + cleanPhone;
    }

    let message = '';
    if (statusType === 'arrival') {
      message =
        `🟢 [إشعار وصول شحنة]\n` +
        `👨‍✈️ السائق: ${s.driverName}\n` +
        `📦 رقم الشحنة: ${s.shipmentNo}\n` +
        `📍 الوجهة: ${s.destination}\n` +
        `📦 الحالة: ${s.status || 'في الطريق'}\n` +
        `⏰ وقت الوصول: ${currentDateTime}\n` +
        (s.smartETA ? `⏱️ وقت الوصول المتوقع (ETA): ${s.smartETA}\n` : '') +
        `🗺️ موقع اللوكيشن الحالي:\n${locationMapUrl}`;
    } else {
      message =
        `🔴 [إشعار إنهاء وتسليم شحنة]\n` +
        `👨‍✈️ السائق: ${s.driverName}\n` +
        `📦 رقم الشحنة: ${s.shipmentNo}\n` +
        `📍 الوجهة: ${s.destination}\n` +
        `📦 الحالة: ${s.status || 'تم التسليم'}\n` +
        `🏁 وقت الخروج والانتهاء: ${currentDateTime}\n` +
        `🗺️ موقع اللوكيشن الحالي:\n${locationMapUrl}`;
    }

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('خطأ', 'تعذر فتح تطبيق واتساب');
    });
  };

  const handleExportAllReport = () => {
    if (savedShipments.length === 0) {
      Alert.alert('تنبيه', 'لا توجد شحنات مسجلة لتصديرها.');
      return;
    }

    let reportText =
      `📋 [تقرير الشحنات النشطة - شركة سانيتا]\n` +
      `📅 تاريخ التقرير: ${new Date().toLocaleString('ar-EG', { hour12: true })}\n` +
      `-------------------\n`;

    savedShipments.forEach((s, index) => {
      reportText +=
        `\n${index + 1}. السائق: ${s.driverName}\n` +
        `📦 الشحنة: ${s.shipmentNo}\n` +
        `📍 الوجهة: ${s.destination}\n` +
        `📦 الحالة: ${s.status || 'في الطريق'}\n` +
        (s.smartETA ? `⏱️ الـ ETA: ${s.smartETA}\n` : '') +
        `${s.meterNo ? '⚡ العداد: ' + s.meterNo + '\n' : ''}` +
        `${s.driverNotes ? '📝 ملاحظات السائق: ' + s.driverNotes + '\n' : ''}` +
        `-------------------`;
    });

    let targetNumber = DEFAULT_TARGET_WA;
    let cleanPhone = targetNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '2' + cleanPhone;
    }

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(reportText)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('خطأ', 'تعذر فتح تطبيق واتساب');
    });
  };

  const contactDeveloper = () => {
    let cleanPhone = DEVELOPER_PHONE.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '2' + cleanPhone;
    }
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent('السلام عليكم يا مهندس، بخصوص تطبيق Sanita Logistics...')}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('خطأ', 'تعذر فتح تطبيق واتساب للتواصل مع المطور');
    });
  };

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    inputBg: isDarkMode ? '#0F172A' : '#F1F5F9'
  };

  if (isSplashVisible) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim, backgroundColor: '#0F172A' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <Image source={{ uri: LOGO_URL }} style={styles.splashLogo} resizeMode="contain" />
        <Text style={styles.splashWelcome}>أهلاً بكم</Text>
        <Text style={styles.splashTitle}>Sanita</Text>
        <Text style={styles.splashSubtitle}>Sanita Logistics Guide</Text>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ تنبيه: لا يوجد اتصال بالإنترنت حالياً</Text>
        </View>
      )}

      {/* الهيدر */}
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <TouchableOpacity style={[styles.menuBtn, { backgroundColor: theme.inputBg }]} onPress={() => setMenuVisible(true)}>
          <Text style={{ fontSize: 20, color: theme.textMain }}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.textMain }]}>Sanita Location 🚚</Text>
          <Text style={styles.subtitle}>دليل مخازن وشركات الأونلاين والبنوك بمصر</Text>
        </View>

        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
      </View>

      {/* شريط التنقل بين التبويبات */}
      <View style={[styles.tabBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'locations' && styles.activeTabItem]}
          onPress={() => handleTabPress('locations')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'locations' ? '#0284C7' : theme.textSub }]}>
            📍 المخازن
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'driver' && styles.activeTabItem]}
          onPress={() => handleTabPress('driver')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'driver' ? '#0284C7' : theme.textSub }]}>
            📦 إدارة الشحنات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'about' && styles.activeTabItem]}
          onPress={() => handleTabPress('about')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'about' ? '#0284C7' : theme.textSub }]}>
            ℹ️ عن التطبيق
          </Text>
        </TouchableOpacity>
      </View>

      {/* المحتوى حسب التبويب النشط */}
      {activeTab === 'locations' && (
        <View style={styles.contentContainer}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.cardBg, color: theme.textMain, borderColor: theme.border }]}
            placeholder="ابحث باسم المخزن، الشركة، أو المدينة..."
            placeholderTextColor={theme.textSub}
            value={search}
            onChangeText={setSearch}
          />

          <View style={styles.companiesScrollWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companiesScrollContainer}>
              {COMPANIES_LIST.map((comp) => (
                <TouchableOpacity
                  key={comp}
                  style={[
                    styles.companyChip,
                    {
                      backgroundColor: selectedCompany === comp ? '#0284C7' : theme.cardBg,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => setSelectedCompany(comp)}
                >
                  <Text style={{ color: selectedCompany === comp ? '#FFF' : theme.textMain, fontWeight: 'bold' }}>
                    {comp}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <View style={[styles.locationCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.locationName, { color: theme.textMain }]} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.companyBadge}>{item.company}</Text>
                </View>
                <Text style={[styles.locationNotes, { color: theme.textSub }]} numberOfLines={3}>{item.notes}</Text>
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#16A34A', opacity: 0.5 }]}
                    onPress={() => Alert.alert('تنبيه', 'خاصية الاتصال تحت التعديل حالياً ⚠️')}
                  >
                    <Text style={styles.actionBtnText}>📞 اتصال</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#25D366', opacity: 0.5 }]}
                    onPress={() => Alert.alert('تنبيه', 'خاصية واتساب تحت التعديل حالياً ⚠️')}
                  >
                    <Text style={styles.actionBtnText}>💬 واتساب</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#0284C7' }]}
                    onPress={() => Linking.openURL(item.mapsUrl)}
                  >
                    <Text style={styles.actionBtnText}>🗺️ الخرائط</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {activeTab === 'driver' && (
        <ScrollView style={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.formTitle, { color: theme.textMain }]}>📝 تسجيل شحنة جديدة</Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="اسم السائق..."
              placeholderTextColor={theme.textSub}
              value={driverName}
              onChangeText={setDriverName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="رقم الشحنة / البوليصة..."
              placeholderTextColor={theme.textSub}
              value={shipmentNo}
              onChangeText={setShipmentNo}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="الوجهة / المخزن..."
              placeholderTextColor={theme.textSub}
              value={destination}
              onChangeText={setDestination}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="رقم هاتف العميل / المشرف (اختياري)..."
              placeholderTextColor={theme.textSub}
              keyboardType="phone-pad"
              value={clientPhone}
              onChangeText={setClientPhone}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="ملاحظات السائق أو الشحنة..."
              placeholderTextColor={theme.textSub}
              value={shipmentNotes}
              onChangeText={setShipmentNotes}
            />

            <Text style={{ color: theme.textSub, fontSize: 12, marginBottom: 5 }}>حالة الشحنة الابتدائية:</Text>
            <View style={styles.statusSelectRow}>
              {['في الطريق', 'تم الاستلام', 'تم التسليم'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.statusChipSelect,
                    { backgroundColor: shipmentStatus === st ? '#0284C7' : theme.inputBg, borderColor: theme.border }
                  ]}
                  onPress={() => setShipmentStatus(st)}
                >
                  <Text style={{ color: shipmentStatus === st ? '#FFF' : theme.textMain, fontSize: 12, fontWeight: 'bold' }}>
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddShipment}>
              <Text style={styles.submitBtnText}>حفظ وإضافة الشحنة 🚀</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.savedHeaderRow}>
            <Text style={[styles.savedTitle, { color: theme.textMain }]}>الشحنات المسجلة ({savedShipments.length})</Text>
            {savedShipments.length > 0 && (
              <TouchableOpacity style={styles.exportAllBtn} onPress={handleExportAllReport}>
                <Text style={styles.exportAllText}>📤 إرسال تقرير الكل</Text>
              </TouchableOpacity>
            )}
          </View>

          {savedShipments.map((item) => (
            <View key={item.id} style={[styles.shipmentCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.shipmentDriver, { color: theme.textMain }]}>👨‍✈️ {item.driverName}</Text>
                <TouchableOpacity onPress={() => openStatusModal(item)}>
                  <Text style={[styles.statusBadge, { backgroundColor: item.status === 'تم التسليم' ? '#16A34A' : item.status === 'تم الاستلام' ? '#0284C7' : '#D97706' }]}>
                    {item.status || 'في الطريق'} 🔄
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.shipmentDetail, { color: theme.textSub }]}>📦 رقم الشحنة: {item.shipmentNo}</Text>
              <Text style={[styles.shipmentDetail, { color: theme.textSub }]}>📍 الوجهة: {item.destination}</Text>
              {item.driverNotes ? <Text style={[styles.shipmentDetail, { color: theme.textSub }]}>📝 ملاحظات: {item.driverNotes}</Text> : null}
              <Text style={[styles.shipmentDate, { color: theme.textSub }]}>⏰ {item.date}</Text>

              <View style={styles.etaBox}>
                <MaterialCommunityIcons name="clock-fast" size={18} color="#00E676" />
                <View style={styles.etaTextContainer}>
                  <Text style={styles.etaLabel}>وقت الوصول المتوقع (Smart ETA):</Text>
                  <Text style={styles.etaValue}>{item.smartETA || 'قريباً...'}</Text>
                </View>
              </View>

              <View style={styles.shipmentActionsRow}>
                <TouchableOpacity style={[styles.shipmentActionBtn, { backgroundColor: '#25D366' }]} onPress={() => handleSendStatus(item, 'arrival')}>
                  <Text style={styles.actionBtnText}>🟢 وصول</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.shipmentActionBtn, { backgroundColor: '#DC2626' }]} onPress={() => handleSendStatus(item, 'finish')}>
                  <Text style={styles.actionBtnText}>🔴 تسليم</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.shipmentActionBtn, { backgroundColor: '#475569' }]} onPress={() => handleDeleteShipment(item.id)}>
                  <Text style={styles.actionBtnText}>🗑️ حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {activeTab === 'about' && (
        <ScrollView style={styles.contentContainer}>
          <View style={[styles.aboutCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Image source={{ uri: LOGO_URL }} style={styles.aboutLogo} resizeMode="contain" />
            <Text style={[styles.aboutTitle, { color: theme.textMain }]}>Sanita Logistics Guide</Text>
            
            <Text style={styles.devNameText}>Developed by Engineer Sayed Ahmed</Text>

            <Text style={[styles.aboutDesc, { color: theme.textSub }]}>
              تطبيق Sanita Logistics هو رفيقك الاحترافي الأول في مصر، صُمم خصيصاً لتسهيل وتطوير العمليات اللوجستية وإدارة الشحنات بذكاء والكفاءة عالية. نهدف من خلال هذا التطبيق إلى تزويد السناد والمندوبين بأحدث أدوات التتبع، وسرعة الوصول للمخازن والشركات الكبرى، وإرسال التقارير الفورية لضمان أعلى معايير الجودة والاحترافية في العمل.
            </Text>

            <Text style={styles.copyrightText}>جميع الحقوق محفوظة لدى شركة سانيتا للمنتجات الاستهلاكية © 2026</Text>

            <View style={{ width: '100%', marginBottom: 15, marginTop: 10 }}>
              <TouchableOpacity 
                style={styles.customerServiceBtn} 
                onPress={() => setShowUnderEditNotice(!showUnderEditNotice)}
              >
                <Text style={styles.customerServiceBtnText}>🎧 خدمة العملاء</Text>
              </TouchableOpacity>
              {showUnderEditNotice && (
                <Text style={styles.underEditNoticeText}>⚠️ تحت التعديل حالياً، سيتم توفير الخدمة قريباً</Text>
              )}
            </View>

            {/* زر التواصل مع المطور */}
            <TouchableOpacity style={styles.devContactBtn} onPress={contactDeveloper}>
              <Text style={styles.devContactBtnText}>👨‍💻 تواصل مع المطور</Text>
            </TouchableOpacity>

            <View style={styles.aboutQuickActions}>
              <View style={{ flex: 1, marginHorizontal: 3 }}>
                <TouchableOpacity 
                  style={[styles.aboutActionBtn, { backgroundColor: '#25D366', opacity: 0.5 }]} 
                  onPress={() => Alert.alert('تنبيه', 'خاصية تواصل واتساب تحت التعديل حالياً ⚠️')}
                >
                  <Text style={styles.actionBtnText}>💬 واتساب</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, marginHorizontal: 3 }}>
                <TouchableOpacity 
                  style={[styles.aboutActionBtn, { backgroundColor: '#16A34A', opacity: 0.5 }]} 
                  onPress={() => Alert.alert('تنبيه', 'خاصية تواصل فون تحت التعديل حالياً ⚠️')}
                >
                  <Text style={styles.actionBtnText}>📞 اتصال</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* مودال تغيير حالة الشحنة السريع */}
      <Modal visible={statusModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.menuContainer, { backgroundColor: theme.cardBg, minHeight: 220 }]}>
            <Text style={[styles.menuHeaderTitle, { color: theme.textMain }]}>🔄 تغيير حالة الشحنة</Text>
            
            {['في الطريق', 'تم الاستلام', 'تم التسليم', 'مؤجل / مشكلة'].map((st) => (
              <TouchableOpacity
                key={st}
                style={[styles.modalStatusOptionBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
                onPress={() => changeShipmentStatus(st)}
              >
                <Text style={{ color: theme.textMain, fontWeight: 'bold' }}>{st}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeMenuBtn} onPress={() => setStatusModalVisible(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* مودال إدخال الرمز السري عند الدخول لقسم الشحنات */}
      <Modal visible={pinModalVisible} transparent={true} animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.menuContainer, { backgroundColor: theme.cardBg, minHeight: 220 }]}>
            <Text style={[styles.menuHeaderTitle, { color: theme.textMain }]}>🔒 أدخل الرمز السري للمتابعة</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border, marginBottom: 15 }]}
              placeholder="الرمز السري..."
              placeholderTextColor={theme.textSub}
              secureTextEntry
              keyboardType="numeric"
              value={enteredPin}
              onChangeText={setEnteredPin}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={verifyPin}>
              <Text style={styles.submitBtnText}>تحقق ودخول</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeMenuBtn, { marginTop: 10 }]} onPress={() => setPinModalVisible(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* مودال تعيين/تغيير الرمز السري الجديد (معدل لمنع تعليق الكيبورد) */}
      <Modal visible={pinSetupModal} transparent={true} animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={[styles.menuContainer, { backgroundColor: theme.cardBg, minHeight: 220 }]}>
            <Text style={[styles.menuHeaderTitle, { color: theme.textMain }]}>🔑 تعيين الرمز السري الجديد</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border, marginBottom: 15 }]}
              placeholder="أدخل الرمز السري (3 أرقام فأكثر)..."
              placeholderTextColor={theme.textSub}
              secureTextEntry
              keyboardType="numeric"
              value={tempNewPin}
              onChangeText={setTempNewPin}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={saveNewCustomPin}>
              <Text style={styles.submitBtnText}>حفظ الرمز السري</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeMenuBtn, { marginTop: 10 }]} onPress={() => setPinSetupModal(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* قائمة الإعدادات الجانبية */}
      <Modal visible={menuVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.menuContainer, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.menuHeaderTitle, { color: theme.textMain }]}>⚙️ إعدادات التطبيق</Text>

            <View style={styles.menuItemRow}>
              <Text style={{ color: theme.textMain, fontSize: 16 }}>الوضع الليلي 🌙</Text>
              <Switch value={isDarkMode} onValueChange={toggleTheme} />
            </View>

            <View style={styles.menuItemRow}>
              <Text style={{ color: theme.textMain, fontSize: 16 }}>قفل إدارة الشحنات بكلمة مرور 🔒</Text>
              <Switch value={customPinEnabled} onValueChange={handleTogglePinFeature} />
            </View>

            {/* زر تغيير كلمة السر */}
            <TouchableOpacity
              style={styles.changePinMenuBtn}
              onPress={() => {
                setMenuVisible(false);
                setPinSetupModal(true);
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>🔑 تغيير كلمة السر السريعة</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeMenuBtn} onPress={() => setMenuVisible(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>إغلاق القائمة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
  },
  splashWelcome: {
    fontSize: 22,
    color: '#94A3B8',
    marginBottom: 5,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#0284C7',
    fontWeight: '600',
  },

  offlineBanner: { backgroundColor: '#EF4444', padding: 6, alignItems: 'center' },
  offlineText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  menuBtn: { padding: 8, borderRadius: 8 },
  headerTextContainer: { flex: 1, marginHorizontal: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  logo: { width: 40, height: 40, borderRadius: 8 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 6 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  activeTabItem: { borderBottomWidth: 2, borderBottomColor: '#0284C7' },
  tabText: { fontWeight: 'bold', fontSize: 14 },
  contentContainer: { flex: 1, padding: 12 },
  searchInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 45, marginBottom: 10 },
  
  companiesScrollWrapper: { height: 50, marginBottom: 10 },
  companiesScrollContainer: { alignItems: 'center', paddingVertical: 5 },
  companyChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginHorizontal: 4 },
  
  locationCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  locationName: { fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 8 },
  companyBadge: { backgroundColor: '#0284C7', color: '#FFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 11, overflow: 'hidden' },
  locationNotes: { fontSize: 13, marginBottom: 10 },
  cardActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  actionBtn: { flex: 1, marginHorizontal: 3, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  formCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 15 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, height: 42, marginBottom: 10 },
  
  statusSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statusChipSelect: { flex: 1, marginHorizontal: 3, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },

  submitBtn: { backgroundColor: '#0284C7', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 5 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  savedHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  savedTitle: { fontSize: 16, fontWeight: 'bold' },
  exportAllBtn: { backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  exportAllText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  shipmentCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  shipmentDriver: { fontSize: 15, fontWeight: 'bold' },
  statusBadge: { color: '#FFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 11, overflow: 'hidden' },
  shipmentDetail: { fontSize: 13, marginBottom: 4 },
  shipmentDate: { fontSize: 11, marginTop: 4, marginBottom: 8 },
  etaBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: 8, borderRadius: 8, marginBottom: 10 },
  etaTextContainer: { marginLeft: 8 },
  etaLabel: { fontSize: 11, color: '#94A3B8' },
  etaValue: { fontSize: 13, fontWeight: 'bold', color: '#00E676' },
  shipmentActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  shipmentActionBtn: { flex: 1, marginHorizontal: 2, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  aboutCard: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  aboutLogo: { width: 70, height: 70, borderRadius: 12, marginBottom: 10 },
  aboutTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  devNameText: { color: '#0284C7', fontWeight: 'bold', fontSize: 13, marginBottom: 6 },
  copyrightText: { color: '#94A3B8', fontSize: 11, textAlign: 'center', fontWeight: '600', marginBottom: 10 },
  aboutDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 10 },
  customerServiceBtn: { backgroundColor: '#0284C7', width: '100%', padding: 10, borderRadius: 8, alignItems: 'center' },
  customerServiceBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  underEditNoticeText: { color: '#D97706', fontSize: 12, textAlign: 'center', marginTop: 6 },
  devContactBtn: { backgroundColor: '#10B981', width: '100%', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  devContactBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  aboutQuickActions: { flexDirection: 'row', width: '100%', marginTop: 5 },
  aboutActionBtn: { paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 250 },
  menuHeaderTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  menuItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#334155' },
  changePinMenuBtn: { backgroundColor: '#0284C7', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  modalStatusOptionBtn: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8, alignItems: 'center' },
  closeMenuBtn: { backgroundColor: '#DC2626', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 }
});
