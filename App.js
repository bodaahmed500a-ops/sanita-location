import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, FlatList, 
  TouchableOpacity, Linking, SafeAreaView, StatusBar, Image 
} from 'react-native';

const LOGO_URL = 'https://i.ibb.co/1Yx9KCpr/IMG-5444.png';

const INITIAL_LOCATIONS = [
  {
    id: '1',
    name: 'ابن سينا فارما - مخزن القطامية الرئيسي',
    company: 'ابن سينا فارما',
    phone: '19048',
    notes: 'استلام الأدوية والمستلزمات الطبية - التجمع / القطامية.',
    mapsUrl: 'https://maps.google.com/?q=ابن+سينا+فارما+القطامية'
  },
  {
    id: '2',
    name: 'ابن سينا فارما - فرع 6 أكتوبر',
    company: 'ابن سينا فارما',
    phone: '19048',
    notes: 'المنطقة الصناعية - استلام وتوزيع الجيزة.',
    mapsUrl: 'https://maps.google.com/?q=ابن+سينا+فارما+6+أكتوبر'
  },
  {
    id: '3',
    name: 'ابن سينا فارما - فرع الإسكندرية',
    company: 'ابن سينا فارما',
    phone: '19048',
    notes: 'مخزن التوزيع الرئيسي للوجه البحري.',
    mapsUrl: 'https://maps.google.com/?q=ابن+سينا+فارما+الاسكندرية'
  },
  {
    id: '4',
    name: 'أمازون مصر - المركز اللوجستي الرئيسي (الشروق)',
    company: 'أمازون',
    phone: '08000003886',
    notes: 'دخول الشاحنات والنقل الثقيل من البوابة 2 الخلفية.',
    mapsUrl: 'https://maps.google.com/?q=Amazon+FC+El+Shorouk'
  },
  {
    id: '5',
    name: 'أمازون مصر - مخزن العاشر من رمضان',
    company: 'أمازون',
    phone: '08000003886',
    notes: 'المنطقة الصناعية A1 - تسليم البضائع الكبيرة.',
    mapsUrl: 'https://maps.google.com/?q=Amazon+Warehouse+10th+of+Ramadan'
  },
  {
    id: '6',
    name: 'جوميا مصر - مخزن 6 أكتوبر الرئيسي',
    company: 'جوميا',
    phone: '15204',
    notes: 'مواعيد استلام الموردين والسواقين من 8 ص حتى 4 ع.',
    mapsUrl: 'https://maps.google.com/?q=Jumia+Warehouse+6th+October'
  },
  {
    id: '7',
    name: 'نون (noon) - مركز التجميع والتوزيع (أبو رواش)',
    company: 'نون',
    phone: '16086',
    notes: 'المنطقة الصناعية أبو رواش - استلام شحنات Express.',
    mapsUrl: 'https://maps.google.com/?q=noon+Hub+Abu+Rawash'
  },
  {
    id: '8',
    name: 'بي تك (B.TECH) - المركز اللوجستي (العاشر من رمضان)',
    company: 'B.TECH',
    phone: '19966',
    notes: 'مخزن الأجهزة الكهربائية والألكترونيات.',
    mapsUrl: 'https://maps.google.com/?q=B.TECH+Logistics+Center'
  },
  {
    id: '9',
    name: 'بوسطة (Bosta) - Hub المقطم الرئيسي',
    company: 'بوسطة',
    phone: '19036',
    notes: 'تفرز وتسليم شحنات التجار لسائقي التوصيل.',
    mapsUrl: 'https://maps.google.com/?q=Bosta+Mokattam+Hub'
  },
  {
    id: '10',
    name: 'أرامكس (Aramex) - مركز فرز ألاميل (العاشر من رمضان)',
    company: 'أرامكس',
    phone: '16991',
    notes: 'شحن دولي ومحلي - بوابة الموردين والنقل الجماعي.',
    mapsUrl: 'https://maps.google.com/?q=Aramex+10th+of+Ramadan'
  },
  {
    id: '11',
    name: 'مرسول مصر - فرع الدقي والتوزيع',
    company: 'مرسول',
    phone: '01000000000',
    notes: 'مكتب استلام واستبدال أدوات وكباتن مرسول.',
    mapsUrl: 'https://maps.google.com/?q=Mrsool+Egypt+Dokki'
  },
  {
    id: '12',
    name: 'شركة طرد (Tard) - مخزن مصر الجديدة',
    company: 'طرد',
    phone: '01200000000',
    notes: 'تجميع الشحنات السريعة داخل القاهرة.',
    mapsUrl: 'https://maps.google.com/?q=Tard+Express+Cairo'
  }
];

export default function App() {
  const [search, setSearch] = useState('');

  const filteredLocations = INITIAL_LOCATIONS.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.company.toLowerCase().includes(search.toLowerCase()) ||
    item.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <View style={styles.header}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Sanita Location 🚚</Text>
          <Text style={styles.subtitle}>دليل مخازن الشحن والملاحة للسواقين</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 ابحث بالشركة، المخزن، أو المنطقة..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
      />

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

      <View style={styles.footer}>
        <Text style={styles.footerText}>جميع الحقوق محفوظة © 2026 | تطوير Sanita Location 🚀</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingHorizontal: 15, paddingTop: 10 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 12, backgroundColor: '#1E293B', padding: 14, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: '#334155' },
  headerTextContainer: { flex: 1 },
  logo: { width: 55, height: 55, borderRadius: 12, borderWidth: 1, borderColor: '#38BDF8' },
  title: { fontSize: 21, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'right' },
  subtitle: { fontSize: 12, color: '#38BDF8', marginTop: 2, textAlign: 'right', fontWeight: '600' },
  searchInput: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, fontSize: 14, marginBottom: 14, borderWidth: 1, borderColor: '#334155', color: '#F8FAFC', textAlign: 'right' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 14, borderRightWidth: 5, borderRightColor: '#38BDF8', borderWidth: 1, borderColor: '#334155' },
  cardHeader: { alignItems: 'flex-end', marginBottom: 6 },
  badge: { backgroundColor: '#0284C7', color: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 11, fontWeight: 'bold', overflow: 'hidden' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'right', marginTop: 2 },
  notes: { fontSize: 13, color: '#94A3B8', marginVertical: 8, textAlign: 'right', lineHeight: 18 },
  btnGroup: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 8, gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  mapBtn: { backgroundColor: '#16A34A' },
  callBtn: { backgroundColor: '#2563EB' },
  waBtn: { backgroundColor: '#059669' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  footer: { paddingVertical: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E293B', marginTop: 5 },
  footerText: { fontSize: 11, color: '#64748B', fontWeight: '600' }
});
