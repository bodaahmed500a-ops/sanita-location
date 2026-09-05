import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, FlatList, 
  TouchableOpacity, Linking, SafeAreaView, StatusBar, Image, ScrollView, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGO_URL = 'https://i.ibb.co/1Yx9KCpr/IMG-5444.png';
const DEVELOPER_PHONE = '01229431500';
const DEFAULT_TARGET_WA = '01009669403';

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
    notes: 'محطة استلام وتمركز دليفري الجيزة.',
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
  }
];

const COMPANIES_LIST = [
  'الكل', 'الشايع', 'سوفيكو', 'طلبات', 'ابن سينا فارما', 
  'أمازون', 'جوميا', 'نون', 'B.TECH', 'بوسطة', 'أرامكس', 
  'مرسول', 'تريدلاين', 'راية', 'إل جي', 'مترو وخير زمان', 'سبينس', 'هومز مارت'
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

  useEffect(() => {
    loadStoredShipments();
  }, []);

  const loadStoredShipments = async () => {
    try {
      const stored = await AsyncStorage.getItem('@sanita_shipments_v7');
      if (stored !== null) {
        setSavedShipments(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Error loading shipments', e);
    }
  };

  const saveToStorage = async (newList) => {
    try {
      await AsyncStorage.setItem('@sanita_shipments_v7', JSON.stringify(newList));
    } catch (e) {
      console.log('Error saving shipments', e);
    }
  };

  const filteredLocations = INITIAL_LOCATIONS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.company.toLowerCase().includes(search.toLowerCase()) ||
                          item.notes.toLowerCase().includes(search.toLowerCase());
    const matchesCompany = selectedCompany === 'الكل' || item.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const handleAddShipment = () => {
    if (!driverName || !shipmentNo || !destination) {
      Alert.alert('تنبيه', 'برجاء ملء اسم السائق ورقم الشحنة والوجهة على الأقل');
      return;
    }
    const newShipment = {
      id: Date.now().toString(),
      driverName,
      shipmentNo,
      meterNo,
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

  const handleOpenGpsCurrentLocation = () => {
    Linking.openURL('https://maps.google.com/?q=current+location');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <View style={styles.header}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Sanita Location 🚚</Text>
          <Text style={styles.subtitle}>دليل مخازن وشركات الأونلاين والشحن بمصر</Text>
        </View>
        <TouchableOpacity style={styles.gpsBtnHeader} onPress={handleOpenGpsCurrentLocation}>
          <Text style={{ fontSize: 18 }}>📍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'locations' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('locations')}
        >
          <Text style={[styles.tabText, activeTab === 'locations' && styles.activeTabText]}>📍 المخازن والشركات</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'driver' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('driver')}
        >
          <Text style={[styles.tabText, activeTab === 'driver' && styles.activeTabText]}>📝 الشحنات والتقارير</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'about' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>ℹ️ عن التطبيق</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'locations' ? (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 ابحث بالشركة، أو اسم المخزن (أمازون، نون، بوسطة...)..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />

          <View style={{ height: 45, marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {COMPANIES_LIST.map((comp, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.chip, selectedCompany === comp && styles.activeChip]}
                  onPress={() => setSelectedCompany(comp)}
                >
                  <Text style={[styles.chipText, selectedCompany === comp && styles.activeChipText]}>{comp}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredLocations}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.badge}>{item.company}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.notes}>📝 {item.notes}</Text>

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
      ) : activeTab === 'driver' ? (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.formSectionTitle}>تسجيل شحنة جديدة للسائق</Text>
            
            <TextInput
              style={styles.input}
              placeholder="اسم السائق ثلاثي..."
              placeholderTextColor="#94A3B8"
              value={driverName}
              onChangeText={setDriverName}
            />

            <TextInput
              style={styles.input}
              placeholder="رقم الشحنة أو البوليصة..."
              placeholderTextColor="#94A3B8"
              value={shipmentNo}
              onChangeText={setShipmentNo}
            />

            <TextInput
              style={styles.input}
              placeholder="رقم العداد (اختياري)..."
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={meterNo}
              onChangeText={setMeterNo}
            />

            <TextInput
              style={styles.input}
              placeholder="الوجهة / عنوان التوصيل..."
              placeholderTextColor="#94A3B8"
              value={destination}
              onChangeText={setDestination}
            />

            <TextInput
              style={styles.input}
              placeholder="رقم هاتف الإدارة / العميل (لإرسال التقارير)..."
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
            <Text style={styles.formSectionTitle}>الشحنات النشطة ({savedShipments.length})</Text>
            {savedShipments.length === 0 ? (
              <Text style={styles.noDataText}>لا توجد شحنات مسجلة حتى الآن.</Text>
            ) : (
              savedShipments.map(s => (
                <View key={s.id} style={styles.savedCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.savedDate}>{s.date}</Text>
                    <Text style={styles.savedDriver}>الكابتن: {s.driverName}</Text>
                  </View>
                  <Text style={styles.savedDetails}>📦 رقم الشحنة: {s.shipmentNo}</Text>
                  {s.meterNo ? <Text style={styles.savedDetails}>⚡ رقم العداد: {s.meterNo}</Text> : null}
                  <Text style={styles.savedDetails}>📍 الوجهة: {s.destination}</Text>
                  <Text style={styles.savedPhone}>📞 رقم الإرسال: {s.clientPhone}</Text>

                  <View style={styles.statusButtonsRow}>
                    <TouchableOpacity style={styles.arriveActionBtn} onPress={() => handleSendStatus(s, 'arrival')}>
                      <Text style={styles.statusBtnText}>🟢 تسجيل وصول + لوكيشن</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.leaveActionBtn} onPress={() => handleSendStatus(s, 'leave')}>
                      <Text style={styles.statusBtnText}>🔴 تسجيل خروج + لوكيشن</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.savedCardActions}>
                    <TouchableOpacity style={styles.deleteBtnCard} onPress={() => handleDeleteShipment(s.id)}>
                      <Text style={styles.actionBtnText}>🗑️ حذف الشحنة</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.aboutHeaderBox}>
            <Image source={{ uri: LOGO_URL }} style={styles.aboutLogo} resizeMode="contain" />
            <Text style={styles.aboutBrand}>Sanita</Text>
            <Text style={styles.aboutBrandSub}>SHIPPING SOLUTIONS</Text>
          </View>

          <View style={styles.aboutCard}>
            <Text style={styles.aboutCardTitle}>حقوق الملكية</Text>
            <Text style={styles.aboutCardText}>
              جميع الحقوق محفوظة لدى شركة سانيتا للمنتجات الاستهلاكية. لا يجوز نسخ أو استخدام أي جزء من هذا التطبيق أو محتواه دون إذن كتابي مسبق.
            </Text>
          </View>

          <View style={styles.aboutCard}>
            <Text style={styles.aboutCardTitle}>عن التطبيق</Text>
            <Text style={styles.aboutCardText}>
              تطبيق سانيتا يجمع جميع مخازن وشركات الأونلاين والتجارة الإلكترونية والشحن في مصر، مع إمكانية تسجيل وقت الوصول وانصراف السائق مع إرسال اللوكيشن والتفاصيل للإدارة عبر الواتساب بضغطة زر.
            </Text>
          </View>

          <View style={styles.aboutCard}>
            <View style={styles.devHeaderRow}>
              <View>
                <Text style={styles.devLabel}>Developed by</Text>
                <Text style={styles.devName}>Eng. Abdo Ahmed</Text>
              </View>
              <Text style={{ fontSize: 24 }}>👨‍💻</Text>
            </View>

            <View style={styles.devContactButtons}>
              <TouchableOpacity 
                style={[styles.devBtn, styles.devWaBtn]} 
                onPress={() => Linking.openURL(`https://wa.me/2${DEVELOPER_PHONE}`)}
              >
                <Text style={styles.devBtnText}>💬 واتساب المطور</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.devBtn, styles.devCallBtn]} 
                onPress={() => Linking.openURL(`tel:${DEVELOPER_PHONE}`)}
              >
                <Text style={styles.devBtnText}>📞 اتصال بالمطور</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.versionText}>الإصدار 3.0.0 (Pro Max)</Text>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerDeveloper}>Developed by Eng. Abdo Ahmed 👨‍💻</Text>
        <Text style={styles.footerText}>Sanita Consumer Products © 2026</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingHorizontal: 15, paddingTop: 10 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 10, backgroundColor: '#1E293B', padding: 12, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: '#334155' },
  headerTextContainer: { flex: 1 },
  logo: { width: 45, height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#38BDF8' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'right' },
  subtitle: { fontSize: 10, color: '#38BDF8', marginTop: 2, textAlign: 'right', fontWeight: '600' },
  gpsBtnHeader: { backgroundColor: '#334155', padding: 8, borderRadius: 10 },
  
  tabContainer: { flexDirection: 'row-reverse', marginBottom: 12, backgroundColor: '#1E293B', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#334155' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabBtn: { backgroundColor: '#0284C7' },
  tabText: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  activeTabText: { color: '#FFFFFF' },

  searchInput: { backgroundColor: '#1E293B', padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 10, borderWidth: 1, borderColor: '#334155', color: '#F8FAFC', textAlign: 'right' },
  
  chipsRow: { flexDirection: 'row-reverse', gap: 6, alignItems: 'center' },
  chip: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#334155', height: 36, justifyContent: 'center' },
  activeChip: { backgroundColor: '#0284C7', borderColor: '#38BDF8' },
  chipText: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' },
  activeChipText: { color: '#FFFFFF' },

  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 14, borderRightWidth: 5, borderRightColor: '#38BDF8', borderWidth: 1, borderColor: '#334155', marginTop: 6 },
  cardHeader: { alignItems: 'flex-end', marginBottom: 6 },
  badge: { backgroundColor: '#0284C7', color: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 11, fontWeight: 'bold', overflow: 'hidden' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'right', marginTop: 2 },
  notes: { fontSize: 12, color: '#94A3B8', marginVertical: 8, textAlign: 'right', lineHeight: 18 },
  btnGroup: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 8, gap: 6 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  mapBtn: { backgroundColor: '#16A34A' },
  callBtn: { backgroundColor: '#2563EB' },
  waBtn: { backgroundColor: '#059669' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },

  formContainer: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 10 },
  formSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#38BDF8', textAlign: 'right', marginBottom: 12 },
  input: { backgroundColor: '#0F172A', padding: 12, borderRadius: 10, color: '#F8FAFC', textAlign: 'right', marginBottom: 10, borderWidth: 1, borderColor: '#334155', fontSize: 13 },
  submitBtn: { backgroundColor: '#16A34A', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  submitBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  
  noDataText: { color: '#64748B', textAlign: 'center', marginTop: 10, fontSize: 12 },
  savedCard: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155', borderLeftWidth: 4, borderLeftColor: '#16A34A' },
  rowBetween: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6 },
  savedDriver: { color: '#F1F5F9', fontWeight: 'bold', fontSize: 13 },
  savedDate: { color: '#94A3B8', fontSize: 11 },
  savedDetails: { color: '#94A3B8', fontSize: 12, textAlign: 'right', marginTop: 2 },
  savedPhone: { color: '#38BDF8', fontSize: 12, textAlign: 'right', marginTop: 4, fontWeight: 'bold' },
  
  statusButtonsRow: { flexDirection: 'row-reverse', gap: 8, marginTop: 12 },
  arriveActionBtn: { flex: 1, backgroundColor: '#059669', padding: 10, borderRadius: 8, alignItems: 'center' },
  leaveActionBtn: { flex: 1, backgroundColor: '#B91C1C', padding: 10, borderRadius: 8, alignItems: 'center' },
  statusBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', textAlign: 'center' },

  savedCardActions: { marginTop: 8, alignItems: 'flex-start' },
  deleteBtnCard: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  actionBtnText: { color: '#F8FAFC', fontSize: 10, fontWeight: 'bold' },

  aboutHeaderBox: { alignItems: 'center', backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  aboutLogo: { width: 70, height: 70, borderRadius: 14, marginBottom: 8 },
  aboutBrand: { fontSize: 22, fontWeight: 'bold', color: '#38BDF8', letterSpacing: 1 },
  aboutBrandSub: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold', letterSpacing: 2, marginTop: 2 },
  
  aboutCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  aboutCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'right', marginBottom: 8 },
  aboutCardText: { fontSize: 12, color: '#94A3B8', textAlign: 'right', lineHeight: 20 },

  devHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  devLabel: { fontSize: 11, color: '#94A3B8', textAlign: 'right' },
  devName: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', textAlign: 'right', marginTop: 2 },

  devContactButtons: { flexDirection: 'row-reverse', gap: 8, marginTop: 4 },
  devBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  devWaBtn: { backgroundColor: '#059669' },
  devCallBtn: { backgroundColor: '#2563EB' },
  devBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 11 },

  versionText: { fontSize: 11, color: '#64748B', textAlign: 'center', marginBottom: 20 },

  footer: { paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E293B', marginTop: 5 },
  footerDeveloper: { fontSize: 11, color: '#38BDF8', fontWeight: 'bold', marginBottom: 2 },
  footerText: { fontSize: 10, color: '#64748B', fontWeight: '600' }
});
