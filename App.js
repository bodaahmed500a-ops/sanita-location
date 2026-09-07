import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, FlatList, 
  TouchableOpacity, Linking, SafeAreaView, StatusBar, Image, ScrollView, Alert, RefreshControl, Modal, Switch 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGO_URL = 'https://i.ibb.co/1Yx9KCpr/IMG-5444.png';
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
  'الكل', 'الشايع', 'سوفيكو', 'طلبات', 'ابن سينا فارما', 
  'أمازون', 'جوميا', 'نون', 'B.TECH', 'بوسطة', 'أرامكس', 
  'مرسول', 'تريدلاين', 'راية', 'إل جي', 'مترو وخير زمان', 'سبينس', 'هومز مارت', 'بنوك ومحطات'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('locations');
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('الكل');
   
  const [driverName, setDriverName] = useState('');
  const [shipmentNo, setShipmentNo] = useState('');
  const [meterNo, setMeterNo] = useState('');
  const [destination, setDestination] = useState('');
  const [clientPhone, setClientPhone] = useState('');
   
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

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem('@sanita_shipments_v14');
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
      await AsyncStorage.setItem('@sanita_shipments_v14', JSON.stringify(newList));
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
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
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
    const newShipment = {
      id: Date.now().toString(),
      driverName,
      shipmentNo: shipmentNo ? shipmentNo.trim() : 'غير محدد',
      meterNo: meterNo ? meterNo.trim() : '',
      destination,
      clientPhone: clientPhone || DEFAULT_TARGET_WA,
      date: new Date().toLocaleString('ar-EG', { hour12: true })
    };
     
    const updatedList = [newShipment, ...savedShipments];
    setSavedShipments(updatedList);
    saveToStorage(updatedList);

    setDriverName('');
    setShipmentNo('');
    setMeterNo('');
    setDestination('');
    setClientPhone('');
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
      message = `🟢 [إشعار وصول شحنة]\n👨‍✈️ السائق: ${s.driverName}\n📦 رقم الشحنة: ${s.shipmentNo}\n📍 الوجهة: ${s.destination}\n⏰ وقت الوصول: ${currentDateTime}\n🗺️ موقع اللوكيشن الحالي:\n${locationMapUrl}`;
    } else {
      message = `🔴 [إشعار إنهاء وتسليم شحنة]\n👨‍✈️ السائق: ${s.driverName}\n📦 رقم الشحنة: ${s.shipmentNo}\n📍 الوجهة: ${s.destination}\n🏁 وقت الخروج والانتهاء: ${currentDateTime}\n🗺️ موقع اللوكيشن الحالي:\n${locationMapUrl}`;
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

    let reportText = `📋 [تقرير الشحنات النشطة - شركة سانيتا]\n📅 تاريخ التقرير: ${new Date().toLocaleString('ar-EG', { hour12: true })}\n-------------------\n`;
     
    savedShipments.forEach((s, index) => {
      reportText += `\n${index + 1}. السائق: ${s.driverName}\n📦 الشحنة: ${s.shipmentNo}\n📍 الوجهة: ${s.destination}\n${s.meterNo ? '⚡ العداد: ' + s.meterNo + '\n' : ''}-------------------`;
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

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    inputBg: isDarkMode ? '#0F172A' : '#F1F5F9',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
       
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ تنبيه: لا يوجد اتصال بالإنترنت حالياً</Text>
        </View>
      )}

      {/* الهيدر العلوي */}
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

      {/* نافذة الإعدادات الجانبية */}
      <Modal visible={menuVisible} transparent={true} animationType="slide">
        <View style={styles.drawerOverlay}>
          <View style={[styles.drawerContent, { backgroundColor: theme.cardBg }]}>
            <View style={styles.drawerHeaderRow}>
              <Text style={[styles.drawerTitle, { color: theme.textMain }]}>⚙️ إعدادات التطبيق</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={{ fontSize: 20, color: '#EF4444', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.settingItemRow, { borderBottomColor: theme.border }]}>
                <View>
                  <Text style={[styles.settingLabel, { color: theme.textMain }]}>الوضع المظلم (Dark Mode)</Text>
                  <Text style={[styles.settingSub, { color: theme.textSub }]}>تفعيل الثيم المظلم المريح للعين</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#334155', true: '#0284C7' }}
                  thumbColor={'#FFFFFF'}
                />
              </View>

              <View style={[styles.settingItemRow, { borderBottomColor: theme.border }]}>
                <View>
                  <Text style={[styles.settingLabel, { color: theme.textMain }]}>حماية قسم الشحنات برمز PIN</Text>
                  <Text style={[styles.settingSub, { color: theme.textSub }]}>تفعيل كلمة سر خاصة لفتح السجلات</Text>
                </View>
                <Switch
                  value={customPinEnabled}
                  onValueChange={handleTogglePinFeature}
                  trackColor={{ false: '#334155', true: '#16A34A' }}
                  thumbColor={'#FFFFFF'}
                />
              </View>

              {customPinEnabled && (
                <TouchableOpacity 
                  style={styles.changePinBtn} 
                  onPress={() => {
                    setMenuVisible(false);
                    setPinSetupModal(true);
                  }}
                >
                  <Text style={styles.changePinBtnText}>🔑 تغيير الرمز السري الخاص بي</Text>
                </TouchableOpacity>
              )}

              <View style={[styles.drawerSectionBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.drawerSectionTitle, { color: '#38BDF8' }]}>🏢 معلومات الشركة والدعم</Text>
                <Text style={[styles.drawerInfoText, { color: theme.textSub }]}>📧 بريد الشركة:</Text>
                <Text style={[styles.drawerInfoValue, { color: theme.textMain }]}>{COMPANY_GMAIL}</Text>
                 
                <View style={styles.drawerContactRow}>
                  <TouchableOpacity style={styles.drawerWaBtn} onPress={() => Linking.openURL(`https://wa.me/2${DEVELOPER_PHONE}`)}>
                    <Text style={styles.drawerBtnText}>💬 تواصل مع المطور (واتساب)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.closeDrawerBtn} onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeDrawerBtnText}>إغلاق القائمة</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* موديل تعيين أو تغيير الرمز السري */}
      <Modal visible={pinSetupModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={styles.modalTitle}>🔑 تعيين الرمز السري</Text>
            <Text style={[styles.modalSub, { color: theme.textSub }]}>اكتب الرمز السري الجديد الذي تريده لحماية الشحنات:</Text>
             
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="اكتب الرمز هنا..."
              placeholderTextColor="#94A3B8"
              secureTextEntry
              keyboardType="numeric"
              value={tempNewPin}
              onChangeText={setTempNewPin}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalCancelBtn, { backgroundColor: theme.border }]} 
                onPress={() => {
                  setPinSetupModal(false);
                  setTempNewPin('');
                }}
              >
                <Text style={[styles.modalBtnText, { color: theme.textMain }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={saveNewCustomPin}>
                <Text style={styles.modalBtnText}>حفظ الرمز</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ترويسة التبويبات */}
      <View style={[styles.tabContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'locations' && styles.activeTabBtn]} 
          onPress={() => handleTabPress('locations')}
        >
          <Text style={[styles.tabText, activeTab === 'locations' && styles.activeTabText]}>📍 المخازن والبنوك</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'driver' && styles.activeTabBtn]} 
          onPress={() => handleTabPress('driver')}
        >
          <Text style={[styles.tabText, activeTab === 'driver' && styles.activeTabText]}>🔐 الشحنات والتقارير</Text>
        </TouchableOpacity>
      </View>

      {/* موديل إدخال الرمز السري لفتح صفحة الشحنات */}
      <Modal visible={pinModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={styles.modalTitle}>🔐 إدخال الرمز السري</Text>
            <Text style={[styles.modalSub, { color: theme.textSub }]}>هذا القسم محمي، أدخل الرمز السري الخاص بك للمتابعة:</Text>
             
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="الرمز السري..."
              placeholderTextColor="#94A3B8"
              secureTextEntry
              keyboardType="numeric"
              value={enteredPin}
              onChangeText={setEnteredPin}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalCancelBtn, { backgroundColor: theme.border }]} onPress={() => setPinModalVisible(false)}>
                <Text style={[styles.modalBtnText, { color: theme.textMain }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={verifyPin}>
                <Text style={styles.modalBtnText}>دخول</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {activeTab === 'locations' ? (
        <View style={{ flex: 1 }}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.cardBg, color: theme.textMain, borderColor: theme.border }]}
            placeholder="🔍 ابحث بفرع معين (مثل: أكتوبر، القطامية، البنك الأهلي...)..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />

          <View style={{ height: 45, marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {COMPANIES_LIST.map((comp, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.chip, { backgroundColor: theme.cardBg, borderColor: theme.border }, selectedCompany === comp && styles.activeChip]}
                  onPress={() => setSelectedCompany(comp)}
                >
                  <Text style={[styles.chipText, { color: theme.textSub }, selectedCompany === comp && styles.activeChipText]}>{comp}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredLocations}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.badge}>{item.company}</Text>
                </View>
                <Text style={[styles.cardTitle, { color: theme.textMain }]}>{item.name}</Text>
                <Text style={[styles.notes, { color: theme.textSub }]}>📝 {item.notes}</Text>

                <View style={styles.btnGroup}>
                  <TouchableOpacity style={[styles.btn, styles.mapBtn]} onPress={() => Linking.openURL(item.mapsUrl)}>
                    <Text style={styles.btnText}>🗺️ الخريطة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn, styles.callBtn]} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                    <Text style={styles.btnText}>📞 اتصال</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn, styles.waBtn]} onPress={() => Linking.openURL(`https://wa.me/2${item.phone}`)}>
                    <Text style={styles.btnText}>💬 واتساب</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <ScrollView 
          style={{ flex: 1 }} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
        >
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Text style={styles.statNumber}>{savedShipments.length}</Text>
              <Text style={[styles.statLabel, { color: theme.textSub }]}>إجمالي الشحنات</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Text style={styles.statNumber}>Active</Text>
              <Text style={[styles.statLabel, { color: theme.textSub }]}>حالة النظام آمنة</Text>
            </View>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={styles.formSectionTitle}>تسجيل شحنة جديدة للسائق</Text>
             
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="اسم السائق ثلاثي..."
              placeholderTextColor="#94A3B8"
              value={driverName}
              onChangeText={setDriverName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="رقم الشحنة أو البوليصة (اختياري)..."
              placeholderTextColor="#94A3B8"
              value={shipmentNo}
              onChangeText={setShipmentNo}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="رقم العداد (اختياري)..."
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={meterNo}
              onChangeText={setMeterNo}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="الوجهة / فرع التوصيل..."
              placeholderTextColor="#94A3B8"
              value={destination}
              onChangeText={setDestination}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]}
              placeholder="رقم هاتف الإدارة / العميل (اختياري)..."
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={clientPhone}
              onChangeText={setClientPhone}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddShipment}>
              <Text style={styles.submitBtnText}>حفظ وتثبيت الشحنة 🚀</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10, paddingBottom: 20 }}>
            <View style={styles.rowBetweenContainer}>
              <Text style={styles.formSectionTitle}>الشحنات النشطة ({savedShipments.length})</Text>
              {savedShipments.length > 0 && (
                <TouchableOpacity style={styles.exportAllBtn} onPress={handleExportAllReport}>
                  <Text style={styles.exportAllBtnText}>📤 تصدير الكل للواتساب</Text>
                </TouchableOpacity>
              )}
            </View>

            {savedShipments.length === 0 ? (
              <Text style={[styles.noDataText, { color: theme.textSub }]}>لا توجد شحنات مسجلة حتى الآن.</Text>
            ) : (
              savedShipments.map(s => (
                <View key={s.id} style={[styles.savedCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.savedDate, { color: theme.textSub }]}>{s.date}</Text>
                    <Text style={[styles.savedDriver, { color: theme.textMain }]}>الكابتن: {s.driverName}</Text>
                  </View>
                  <Text style={[styles.savedDetails, { color: theme.textSub }]}>📦 رقم الشحنة: {s.shipmentNo}</Text>
                  {s.meterNo ? <Text style={[styles.savedDetails, { color: theme.textSub }]}>⚡ رقم العداد: {s.meterNo}</Text> : null}
                  <Text style={[styles.savedDetails, { color: theme.textSub }]}>📍 الوجهة: {s.destination}</Text>
                  <Text style={styles.savedPhone}>📞 رقم الإرسال: {s.clientPhone}</Text>

                  <View style={styles.statusButtonsRow}>
                    <TouchableOpacity style={styles.arrivalBtn} onPress={() => handleSendStatus(s, 'arrival')}>
                      <Text style={styles.statusBtnText}>🟢 إشعار وصول</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.finishBtn} onPress={() => handleSendStatus(s, 'finish')}>
                      <Text style={styles.statusBtnText}>🔴 إشعار انتهاء</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteShipment(s.id)}>
                      <Text style={styles.statusBtnText}>🗑️ حذف</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  offlineBanner: { backgroundColor: '#EF4444', padding: 6, alignItems: 'center' },
  offlineText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 },
  menuBtn: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTextContainer: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 10, color: '#94A3B8' },
  logo: { width: 40, height: 40, borderRadius: 20 },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabBtn: { backgroundColor: '#0284C7' },
  tabText: { fontSize: 13, fontWeight: 'bold', color: '#94A3B8' },
  activeTabText: { color: '#FFFFFF' },
  searchInput: { margin: 10, padding: 10, borderRadius: 8, borderWidth: 1, fontSize: 13 },
  chipsRow: { paddingHorizontal: 10, alignItems: 'center' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginRight: 8, height: 32 },
  activeChip: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  chipText: { fontSize: 12, fontWeight: 'bold' },
  activeChipText: { color: '#FFFFFF' },
  card: { marginHorizontal: 10, marginBottom: 10, padding: 12, borderRadius: 10, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', marginBottom: 4 },
  badge: { fontSize: 10, backgroundColor: '#0284C7', color: '#FFFFFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontWeight: 'bold' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', marginVertical: 4 },
  notes: { fontSize: 12, marginBottom: 10 },
  btnGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  btn: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginHorizontal: 2 },
  mapBtn: { backgroundColor: '#0284C7' },
  callBtn: { backgroundColor: '#059669' },
  waBtn: { backgroundColor: '#16A34A' },
  btnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', padding: 10, justifyContent: 'space-between' },
  statBox: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center', marginHorizontal: 5 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#38BDF8' },
  statLabel: { fontSize: 11, marginTop: 4 },
  formContainer: { margin: 10, padding: 12, borderRadius: 10, borderWidth: 1 },
  formSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#38BDF8', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 13, marginBottom: 10 },
  submitBtn: { backgroundColor: '#16A34A', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  submitBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  rowBetweenContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginBottom: 6 },
  exportAllBtn: { backgroundColor: '#2563EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  exportAllBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  noDataText: { textAlign: 'center', marginTop: 20, fontSize: 13 },
  savedCard: { marginHorizontal: 10, marginBottom: 10, padding: 12, borderRadius: 10, borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  savedDate: { fontSize: 10 },
  savedDriver: { fontSize: 13, fontWeight: 'bold' },
  savedDetails: { fontSize: 12, marginVertical: 2 },
  savedPhone: { fontSize: 12, color: '#38BDF8', marginVertical: 2, fontWeight: 'bold' },
  statusButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  arrivalBtn: { flex: 1, backgroundColor: '#16A34A', padding: 6, borderRadius: 6, alignItems: 'center', marginHorizontal: 2 },
  finishBtn: { flex: 1, backgroundColor: '#D97706', padding: 6, borderRadius: 6, alignItems: 'center', marginHorizontal: 2 },
  deleteBtn: { flex: 1, backgroundColor: '#DC2626', padding: 6, borderRadius: 6, alignItems: 'center', marginHorizontal: 2 },
  statusBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  drawerContent: { height: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  drawerHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  drawerTitle: { fontSize: 16, fontWeight: 'bold' },
  settingItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  settingLabel: { fontSize: 13, fontWeight: 'bold' },
  settingSub: { fontSize: 11, marginTop: 2 },
  changePinBtn: { backgroundColor: '#0284C7', padding: 10, borderRadius: 8, alignItems: 'center', marginVertical: 15 },
  changePinBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  drawerSectionBox: { padding: 12, borderRadius: 10, borderWidth: 1, marginVertical: 10 },
  drawerSectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  drawerInfoText: { fontSize: 11 },
  drawerInfoValue: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  drawerContactRow: { marginTop: 5 },
  drawerWaBtn: { backgroundColor: '#16A34A', padding: 8, borderRadius: 6, alignItems: 'center' },
  drawerBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  closeDrawerBtn: { backgroundColor: '#334155', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  closeDrawerBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 20, borderRadius: 12, borderWidth: 1 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#38BDF8', marginBottom: 8 },
  modalSub: { fontSize: 12, marginBottom: 15 },
  modalInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 15 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalCancelBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginRight: 5 },
  modalConfirmBtn: { flex: 1, backgroundColor: '#0284C7', padding: 10, borderRadius: 8, alignItems: 'center', marginLeft: 5 },
  modalBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
