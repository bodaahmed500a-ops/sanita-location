import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  TextInput,
  Alert,
  Modal,
  Share,
  Dimensions,
  Linking
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // حالة شاشة الترحيب
  const [showWelcome, setShowWelcome] = useState(true);

  const [activeTab, setActiveTab] = useState('finance'); 
  
  // 1. الخزنة والحسابات
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [financeSearch, setFinanceSearch] = useState('');

  // 2. العملاء
  const [customers, setCustomers] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientDue, setClientDue] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // 3. المخازن
  const [products, setProducts] = useState([]);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodEmoji, setProdEmoji] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // 4. الموظفين
  const [employees, setEmployees] = useState([]);
  const [empName, setEmpName] = useState('');
  const [empSalary, setEmpSalary] = useState('');
  const [empPhone, setEmpPhone] = useState('');

  // حالات نافذة التعديل
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editField1, setEditField1] = useState('');
  const [editField2, setEditField2] = useState('');
  const [editField3, setEditField3] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  // تحميل البيانات المحفوظة
  useEffect(() => {
    loadStoredData();
  }, []);

  // حفظ البيانات تلقائياً
  useEffect(() => {
    saveDataToDevice();
  }, [totalIncome, totalExpense, transactions, customers, products, employees]);

  const loadStoredData = async () => {
    try {
      const storedIncome = await AsyncStorage.getItem('@total_income');
      const storedExpense = await AsyncStorage.getItem('@total_expense');
      const storedTransactions = await AsyncStorage.getItem('@transactions_list');
      const storedCustomers = await AsyncStorage.getItem('@customers_list');
      const storedProducts = await AsyncStorage.getItem('@products_list');
      const storedEmployees = await AsyncStorage.getItem('@employees_list');

      if (storedIncome !== null) setTotalIncome(parseFloat(storedIncome));
      if (storedExpense !== null) setTotalExpense(parseFloat(storedExpense));
      if (storedTransactions !== null) setTransactions(JSON.parse(storedTransactions));
      if (storedCustomers !== null) setCustomers(JSON.parse(storedCustomers));
      if (storedProducts !== null) setProducts(JSON.parse(storedProducts));
      if (storedEmployees !== null) setEmployees(JSON.parse(storedEmployees));
    } catch (error) {
      console.log('خطأ في استرجاع البيانات:', error);
    }
  };

  const saveDataToDevice = async () => {
    try {
      await AsyncStorage.setItem('@total_income', totalIncome.toString());
      await AsyncStorage.setItem('@total_expense', totalExpense.toString());
      await AsyncStorage.setItem('@transactions_list', JSON.stringify(transactions));
      await AsyncStorage.setItem('@customers_list', JSON.stringify(customers));
      await AsyncStorage.setItem('@products_list', JSON.stringify(products));
      await AsyncStorage.setItem('@employees_list', JSON.stringify(employees));
    } catch (error) {
      console.log('خطأ في حفظ البيانات:', error);
    }
  };

  // فتح الواتساب بدون إظهار الرقم صراحة
  const handleOpenWhatsApp = () => {
    const phoneNumber = '+201229431500';
    const message = 'السلام عليكم يا مهندس سيد، كنت أستفسر بخصوص تطبيق مدير الأعمال الشامل... 🚀';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('تنبيه', 'تطبيق الواتساب غير مثبت على هذا الجهاز');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // تصفير كل البيانات
  const handleResetAllData = () => {
    Alert.alert(
      '⚠️ تحذير خطير',
      'هل أنت متأكد من رغبتك في حذف وتصفير جميع بيانات التطبيق؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'نعم، امسح الكل', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setTotalIncome(0);
              setTotalExpense(0);
              setTransactions([]);
              setCustomers([]);
              setProducts([]);
              setEmployees([]);
              Alert.alert('تم بنجاح', 'تم تصفير التطبيق والبدء من جديد 🔄');
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ أثناء مسح البيانات');
            }
          } 
        }
      ]
    );
  };

  const openEditModal = (type, item) => {
    setEditingType(type);
    setEditingId(item.id);
    if (type === 'customer') {
      setEditField1(item.name);
      setEditField2(item.phone);
      setEditField3(item.totalDue);
    } else if (type === 'product') {
      setEditField1(item.name);
      setEditField2(item.price);
      setEditField3(item.qty);
      setEditEmoji(item.emoji || '📦');
    } else if (type === 'employee') {
      setEditField1(item.name);
      setEditField2(item.salary);
      setEditField3(item.phone);
    }
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editField1) {
      Alert.alert('تنبيه', 'هذا الحقل أساسي ولا يمكن تركه فارغاً');
      return;
    }

    if (editingType === 'customer') {
      setCustomers(customers.map(c => c.id === editingId ? { ...c, name: editField1, phone: editField2, totalDue: editField3 || '0' } : c));
    } else if (editingType === 'product') {
      setProducts(products.map(p => p.id === editingId ? { ...p, name: editField1, price: editField2, qty: editField3, emoji: editEmoji || '📦' } : p));
    } else if (editingType === 'employee') {
      setEmployees(employees.map(e => e.id === editingId ? { ...e, name: editField1, salary: editField2, phone: editField3 || 'غير محدد' } : e));
    }

    setEditModalVisible(false);
    Alert.alert('تم التعديل', 'تم تحديث البيانات بنجاح ✅');
  };

  const handleShareReport = async () => {
    try {
      const lowStockCount = products.filter(p => parseInt(p.qty || 0) <= 5).length;
      const reportText = `📊 تقرير مدير الأعمال الشامل:\n` +
        `------------------------------------\n` +
        `💰 صافي الخزنة: ${netBalance} ج.م\n` +
        `👥 إجمالي ديون العملاء: ${totalCustomerDue} ج.م\n` +
        `📦 إجمالي بضاعة المخزن: ${products.length} منتج (منها ${lowStockCount} منخفض)\n` +
        `👨‍💼 إجمالي الرواتب: ${totalSalaries} ج.م\n` +
        `------------------------------------\n` +
        `تم الاستخراج عبر تطبيق مدير الأعمال 🚀`;

      await Share.share({ message: reportText });
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة التقرير');
    }
  };

  const netBalance = totalIncome - totalExpense;
  const totalCustomerDue = customers.reduce((sum, item) => sum + parseFloat(item.totalDue || 0), 0);
  const totalInventoryVal = products.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.qty || 0)), 0);
  const totalSalaries = employees.reduce((sum, item) => sum + parseFloat(item.salary || 0), 0);

  const filteredTransactions = transactions.filter(t => t.note.toLowerCase().includes(financeSearch.toLowerCase()));
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const isLowStock = parseInt(p.qty || 0) <= 5;
    if (lowStockFilter) {
      return matchesSearch && isLowStock;
    }
    return matchesSearch;
  });

  const theme = {
    bg: isDarkMode ? '#07090E' : '#F1F5F9',
    cardBg: isDarkMode ? '#121824' : '#FFFFFF',
    textMain: isDarkMode ? '#F1F5F9' : '#0F172A',
    textSub: isDarkMode ? '#8E9BAE' : '#64748B',
    border: isDarkMode ? '#1E293B' : '#E2E8F0',
    inputBg: isDarkMode ? '#0A0E14' : '#F8FAFC',
    accentBlue: '#00B4D8',
    accentPurple: '#7B2CBF',
    accentOrange: '#F77F00',
    accentPink: '#F72585',
    accentGreen: '#2A9D8F',
  };

  const handleAddTransaction = (type) => {
    const val = parseFloat(amountInput);
    if (!val || isNaN(val)) {
      Alert.alert('تنبيه', 'برجاء إدخال مبلغ صحيح');
      return;
    }
    const newTx = {
      id: Date.now().toString(),
      type: type,
      amount: val,
      note: noteInput || (type === 'income' ? 'إيراد عام' : 'مصروف عام'),
      date: new Date().toLocaleDateString('ar-EG')
    };

    setTransactions([newTx, ...transactions]);
    if (type === 'income') setTotalIncome(prev => prev + val);
    else setTotalExpense(prev => prev + val);
    setAmountInput('');
    setNoteInput('');
  };

  const handleDeleteTransaction = (id, type, amount) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذه الحركة؟', [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'حذف', 
        style: 'destructive', 
        onPress: () => {
          setTransactions(transactions.filter(t => t.id !== id));
          if (type === 'income') setTotalIncome(prev => Math.max(0, prev - amount));
          else setTotalExpense(prev => Math.max(0, prev - amount));
        } 
      }
    ]);
  };

  const handleAddCustomer = () => {
    if (!clientName || !clientPhone) {
      Alert.alert('تنبيه', 'برجاء إدخال اسم العميل ورقم التليفون');
      return;
    }
    const newCust = {
      id: Date.now().toString(),
      name: clientName,
      phone: clientPhone,
      totalDue: clientDue || '0'
    };
    setCustomers([newCust, ...customers]);
    setClientName('');
    setClientPhone('');
    setClientDue('');
  };

  const handleDeleteCustomer = (id) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا العميل؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setCustomers(customers.filter(c => c.id !== id)) }
    ]);
  };

  const handleAddProduct = () => {
    if (!prodName || !prodPrice || !prodQty) {
      Alert.alert('تنبيه', 'برجاء إدخال اسم المنتج، السعر، والكمية');
      return;
    }
    const newProd = {
      id: Date.now().toString(),
      name: prodName,
      price: prodPrice,
      qty: prodQty,
      emoji: prodEmoji || '📦'
    };
    setProducts([newProd, ...products]);
    setProdName('');
    setProdPrice('');
    setProdQty('');
    setProdEmoji('');
  };

  const handleDeleteProduct = (id) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا المنتج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setProducts(products.filter(p => p.id !== id)) }
    ]);
  };

  const handleAddEmployee = () => {
    if (!empName || !empSalary) {
      Alert.alert('تنبيه', 'برجاء إدخال اسم الموظف والراتب');
      return;
    }
    const newEmp = {
      id: Date.now().toString(),
      name: empName,
      salary: empSalary,
      phone: empPhone || 'غير محدد'
    };
    setEmployees([newEmp, ...employees]);
    setEmpName('');
    setEmpSalary('');
    setEmpPhone('');
  };

  const handleDeleteEmployee = (id) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا الموظف؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setEmployees(employees.filter(e => e.id !== id)) }
    ]);
  };

  // ==========================================
  // شاشة الترحيب الافتتاحية الفخمة
  // ==========================================
  if (showWelcome) {
    return (
      <View style={[styles.welcomeContainer, { backgroundColor: isDarkMode ? '#07090E' : '#0096C7' }]}>
        <StatusBar barStyle="light-content" backgroundColor={isDarkMode ? '#07090E' : '#0096C7'} />
        
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeIconCircle}>
            <MaterialCommunityIcons name="shield-crown-outline" size={56} color="#00B4D8" />
          </View>
          
          <Text style={styles.welcomeTitle}>مدير الأعمال الشامل</Text>
          
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>
              🌟 نظام ذكي فائق الاحترافية لإدارة الشركات، المشاريع، والمتاجر الكبرى. يمنحك سيطرة كاملة على الخزنة، حسابات العملاء، المخزون، وشؤون الموظفين بتصميم عصري وأمان تام.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.startAppBtn} 
            onPress={() => setShowWelcome(false)}
          >
            <Text style={styles.startAppBtnText}>دخول لوحة التحكم ⚡</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.whatsappBtn} 
            onPress={handleOpenWhatsApp}
          >
            <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" style={{ marginRight: 8 }} />
            <Text style={styles.whatsappBtnText}>تواصل مع مطور التطبيق 💬</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', width: '100%', paddingBottom: 10 }}>
          <Text style={styles.welcomeFooter}>Developed by Eng. Sayed Ahmed Sayed 💻</Text>
        </View>
      </View>
    );
  }

  // الواجهة الأساسية للتطبيق
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* الهيدر العلوي */}
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.headerLogoBox, { backgroundColor: isDarkMode ? '#1E293B' : '#E0F2FE' }]}>
            <MaterialCommunityIcons name="finance" size={20} color="#00B4D8" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.appName, { color: theme.textMain }]}>مدير الأعمال 👑</Text>
            <Text style={styles.appSubtitle}>الإصدار الاحترافي المرن</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => setShowWelcome(true)}
            style={[styles.resetIconBtn, { borderColor: theme.border, backgroundColor: theme.inputBg, marginRight: 6 }]}
          >
            <MaterialCommunityIcons name="information-outline" size={17} color="#00B4D8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleResetAllData}
            style={[styles.resetIconBtn, { borderColor: theme.border, backgroundColor: theme.inputBg }]}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={17} color="#EF4444" />
          </TouchableOpacity>

          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#CBD5E1', true: '#1E293B' }}
            thumbColor={isDarkMode ? '#00B4D8' : '#FFFFFF'}
            style={{ marginLeft: 6 }}
          />
        </View>
      </View>

      {/* شريط التنقل الاحترافي */}
      <View style={[styles.tabBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'finance' && { backgroundColor: theme.accentBlue, shadowColor: theme.accentBlue, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }]} onPress={() => setActiveTab('finance')}>
          <MaterialCommunityIcons name="wallet-outline" size={16} color={activeTab === 'finance' ? '#FFF' : theme.textSub} style={{ marginBottom: 2 }} />
          <Text style={[styles.tabText, { color: activeTab === 'finance' ? '#FFF' : theme.textSub }]}>الخزنة</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'crm' && { backgroundColor: theme.accentPurple, shadowColor: theme.accentPurple, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }]} onPress={() => setActiveTab('crm')}>
          <MaterialCommunityIcons name="account-group-outline" size={16} color={activeTab === 'crm' ? '#FFF' : theme.textSub} style={{ marginBottom: 2 }} />
          <Text style={[styles.tabText, { color: activeTab === 'crm' ? '#FFF' : theme.textSub }]}>العملاء</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabBtn, activeTab === 'inventory' && { backgroundColor: theme.accentOrange, shadowColor: theme.accentOrange, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }]} onPress={() => setActiveTab('inventory')}>
          <MaterialCommunityIcons name="package-variant-closed" size={16} color={activeTab === 'inventory' ? '#FFF' : theme.textSub} style={{ marginBottom: 2 }} />
          <Text style={[styles.tabText, { color: activeTab === 'inventory' ? '#FFF' : theme.textSub }]}>المخزن</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabBtn, activeTab === 'hr' && { backgroundColor: theme.accentPink, shadowColor: theme.accentPink, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }]} onPress={() => setActiveTab('hr')}>
          <MaterialCommunityIcons name="badge-account-outline" size={16} color={activeTab === 'hr' ? '#FFF' : theme.textSub} style={{ marginBottom: 2 }} />
          <Text style={[styles.tabText, { color: activeTab === 'hr' ? '#FFF' : theme.textSub }]}>الموظفين</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabBtn, activeTab === 'reports' && { backgroundColor: theme.accentGreen, shadowColor: theme.accentGreen, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }]} onPress={() => setActiveTab('reports')}>
          <MaterialCommunityIcons name="chart-box-outline" size={16} color={activeTab === 'reports' ? '#FFF' : theme.textSub} style={{ marginBottom: 2 }} />
          <Text style={[styles.tabText, { color: activeTab === 'reports' ? '#FFF' : theme.textSub }]}>التقارير</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. الحسابات والخزنة --- */}
        {activeTab === 'finance' && (
          <>
            <View style={[styles.balanceCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.balanceHeaderRow}>
                <Text style={[styles.balanceTitle, { color: theme.textSub }]}>صافي الرصيد الحالي بالخزنة</Text>
                <MaterialCommunityIcons name="shield-check" size={20} color={theme.accentBlue} />
              </View>
              <Text style={[styles.balanceAmount, { color: netBalance >= 0 ? '#2A9D8F' : '#EF4444' }]}>{netBalance} <Text style={{ fontSize: 16 }}>ج.م</Text></Text>
              
              <View style={[styles.rowStats, { borderTopColor: theme.border }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: theme.textSub }]}>إجمالي الداخل</Text>
                  <Text style={[styles.statValue, { color: '#2A9D8F' }]}>+{totalIncome} ج</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: theme.textSub }]}>إجمالي الخارج</Text>
                  <Text style={[styles.statValue, { color: '#EF4444' }]}>-{totalExpense} ج</Text>
                </View>
              </View>
            </View>

            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, marginBottom: 15 }]}>
              <Text style={[styles.formTitle, { color: theme.textMain }]}>✍️ تسجيل حركة مالية جديدة</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="ادخل المبلغ (مثال: 1500)..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={amountInput} onChangeText={setAmountInput} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="وصف الحركة (مثال: مبيعات، إيجار)..." placeholderTextColor={theme.textSub} value={noteInput} onChangeText={setNoteInput} />
              
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2A9D8F', flex: 1, marginLeft: 6 }]} onPress={() => handleAddTransaction('income')}>
                  <MaterialCommunityIcons name="arrow-down-left" size={16} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.btnText}>إضافة إيراد</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444', flex: 1, marginRight: 6 }]} onPress={() => handleAddTransaction('expense')}>
                  <MaterialCommunityIcons name="arrow-up-right" size={16} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={[styles.btnText, { color: '#FFF' }]}>إضافة مصروف</Text>
                </TouchableOpacity>
              </View>
            </View>

            {transactions.length > 0 && (
              <TextInput style={[styles.input, { backgroundColor: theme.cardBg, color: theme.textMain, borderColor: theme.border, marginBottom: 12 }]} placeholder="🔍 ابحث في بيان الحركات..." placeholderTextColor={theme.textSub} value={financeSearch} onChangeText={setFinanceSearch} />
            )}

            <Text style={[styles.sectionTitleHeader, { color: theme.textMain }]}>سجل الحركات ({filteredTransactions.length})</Text>
            {filteredTransactions.map(tx => (
              <View key={tx.id} style={[styles.customerCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={[styles.cardIconBox, { backgroundColor: tx.type === 'income' ? 'rgba(42, 157, 143, 0.12)' : 'rgba(239, 68, 68, 0.12)' }]}>
                  <MaterialCommunityIcons name={tx.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'} size={18} color={tx.type === 'income' ? '#2A9D8F' : '#EF4444'} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.custName, { color: theme.textMain }]}>{tx.note}</Text>
                  <Text style={[styles.custPhone, { color: theme.textSub }]}>📅 {tx.date}</Text>
                </View>
                <Text style={[styles.custDue, { color: tx.type === 'income' ? '#2A9D8F' : '#EF4444' }]}>
                  {tx.type === 'income' ? `+${tx.amount}` : `-${tx.amount}`} ج.م
                </Text>
                <TouchableOpacity onPress={() => handleDeleteTransaction(tx.id, tx.type, tx.amount)} style={styles.deleteIconBtn}>
                  <MaterialCommunityIcons name="delete-outline" size={17} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* --- 2. العملاء --- */}
        {activeTab === 'crm' && (
          <>
            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, marginBottom: 20 }]}>
              <Text style={[styles.formTitle, { color: theme.textMain }]}>👥 إضافة عميل جديد ومتابعة الديون</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="اسم العميل الرباعي أو التجاري..." placeholderTextColor={theme.textSub} value={clientName} onChangeText={setClientName} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="رقم الهاتف..." placeholderTextColor={theme.textSub} keyboardType="phone-pad" value={clientPhone} onChangeText={setClientPhone} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="المبلغ المتبقي عليه ديون (اختياري)..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={clientDue} onChangeText={setClientDue} />
              
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accentPurple, width: '100%' }]} onPress={handleAddCustomer}>
                <MaterialCommunityIcons name="account-plus-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>حفظ بيانات العميل</Text>
              </TouchableOpacity>
            </View>

            {customers.length > 0 && (
              <TextInput style={[styles.input, { backgroundColor: theme.cardBg, color: theme.textMain, borderColor: theme.border, marginBottom: 12 }]} placeholder="🔍 ابحث عن اسم العميل..." placeholderTextColor={theme.textSub} value={customerSearch} onChangeText={setCustomerSearch} />
            )}

            <Text style={[styles.sectionTitleHeader, { color: theme.textMain }]}>قائمة العملاء المسجلين ({filteredCustomers.length})</Text>
            {filteredCustomers.map(cust => (
              <View key={cust.id} style={[styles.customerCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={[styles.cardIconBox, { backgroundColor: 'rgba(123, 44, 191, 0.12)' }]}>
                  <MaterialCommunityIcons name="account-outline" size={18} color={theme.accentPurple} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.custName, { color: theme.textMain }]}>{cust.name}</Text>
                  <Text style={[styles.custPhone, { color: theme.textSub }]}>📞 {cust.phone}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                  <Text style={{ fontSize: 9, color: theme.textSub }}>المتبقي عليه:</Text>
                  <Text style={[styles.custDue, { color: '#EF4444' }]}>{cust.totalDue} ج.م</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                  <TouchableOpacity onPress={() => openEditModal('customer', cust)} style={[styles.smallIconAction, { backgroundColor: theme.inputBg, borderColor: theme.border, marginRight: 4 }]}>
                    <MaterialCommunityIcons name="pencil-outline" size={15} color="#00B4D8" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCustomer(cust.id)} style={[styles.smallIconAction, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <MaterialCommunityIcons name="delete-outline" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* --- 3. المخازن --- */}
        {activeTab === 'inventory' && (
          <>
            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, marginBottom: 20 }]}>
              <Text style={[styles.formTitle, { color: theme.textMain }]}>📦 إضافة منتج جديد للمخزن</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="اسم المنتج..." placeholderTextColor={theme.textSub} value={prodName} onChangeText={setProdName} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="سعر القطعة..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={prodPrice} onChangeText={setProdPrice} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="الكمية المتاحة..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={prodQty} onChangeText={setProdQty} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="رمز تعبيري (مثل: 📱, 💻, 👟)..." placeholderTextColor={theme.textSub} value={prodEmoji} onChangeText={setProdEmoji} maxLength={2} />

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accentOrange, width: '100%', marginTop: 5 }]} onPress={handleAddProduct}>
                <MaterialCommunityIcons name="plus-box-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>إضافة المنتج للمخزن</Text>
              </TouchableOpacity>
            </View>

            {products.length > 0 && (
              <>
                <TextInput style={[styles.input, { backgroundColor: theme.cardBg, color: theme.textMain, borderColor: theme.border, marginBottom: 8 }]} placeholder="🔍 ابحث عن اسم منتج..." placeholderTextColor={theme.textSub} value={productSearch} onChangeText={setProductSearch} />
                
                <TouchableOpacity style={[styles.filterBadgeBtn, { backgroundColor: lowStockFilter ? '#EF4444' : theme.cardBg, borderColor: theme.border, marginBottom: 12 }]} onPress={() => setLowStockFilter(!lowStockFilter)}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={16} color={lowStockFilter ? '#FFF' : '#EF4444'} style={{ marginRight: 6 }} />
                  <Text style={{ color: lowStockFilter ? '#FFF' : theme.textMain, fontSize: 11, fontWeight: 'bold' }}>
                    {lowStockFilter ? 'عرض جميع المنتجات' : 'تنبيهات المنتجات الوشيكة النفاذ (≤ 5 قطع) ⚠️'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={[styles.sectionTitleHeader, { color: theme.textMain }]}>محتويات المخزن ({filteredProducts.length})</Text>
            
            {filteredProducts.map(prod => {
              const isLow = parseInt(prod.qty || 0) <= 5;
              return (
                <View key={prod.id} style={[styles.customerCard, { backgroundColor: theme.cardBg, borderColor: isLow ? '#EF4444' : theme.border, borderWidth: isLow ? 1.5 : 1 }]}>
                  <View style={[styles.emojiBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <Text style={{ fontSize: 20 }}>{prod.emoji || '📦'}</Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.custName, { color: theme.textMain }]}>{prod.name}</Text>
                      {isLow && (
                        <View style={styles.lowStockTag}>
                          <Text style={{ color: '#FFF', fontSize: 8, fontWeight: 'bold' }}>وشك النفاذ</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.custPhone, { color: theme.textSub }]}>سعر القطعة: {prod.price} ج.م</Text>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                    <Text style={{ fontSize: 9, color: theme.textSub }}>الكمية:</Text>
                    <Text style={[styles.custDue, { color: isLow ? '#EF4444' : theme.accentOrange }]}>{prod.qty} ق</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
                    <TouchableOpacity onPress={() => openEditModal('product', prod)} style={[styles.smallIconAction, { backgroundColor: theme.inputBg, borderColor: theme.border, marginRight: 4 }]}>
                      <MaterialCommunityIcons name="pencil-outline" size={15} color="#00B4D8" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteProduct(prod.id)} style={[styles.smallIconAction, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                      <MaterialCommunityIcons name="delete-outline" size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* --- 4. الموظفين --- */}
        {activeTab === 'hr' && (
          <>
            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, marginBottom: 20 }]}>
              <Text style={[styles.formTitle, { color: theme.textMain }]}>👨‍💼 تسجيل موظف جديد ورواتب</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="اسم الموظف..." placeholderTextColor={theme.textSub} value={empName} onChangeText={setEmpName} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="الراتب الشهري..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={empSalary} onChangeText={setEmpSalary} />
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="رقم هاتف التواصل..." placeholderTextColor={theme.textSub} keyboardType="phone-pad" value={empPhone} onChangeText={setEmpPhone} />
              
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accentPink, width: '100%' }]} onPress={handleAddEmployee}>
                <MaterialCommunityIcons name="account-check-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>حفظ بيانات الموظف</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitleHeader, { color: theme.textMain }]}>قائمة الموظفين المسجلين ({employees.length})</Text>
            {employees.map(emp => (
              <View key={emp.id} style={[styles.customerCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={[styles.cardIconBox, { backgroundColor: 'rgba(247, 37, 133, 0.12)' }]}>
                  <MaterialCommunityIcons name="badge-account-horizontal-outline" size={18} color={theme.accentPink} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.custName, { color: theme.textMain }]}>{emp.name}</Text>
                  <Text style={[styles.custPhone, { color: theme.textSub }]}>📞 {emp.phone}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                  <Text style={{ fontSize: 9, color: theme.textSub }}>الراتب:</Text>
                  <Text style={[styles.custDue, { color: theme.accentPink }]}>{emp.salary} ج.م</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                  <TouchableOpacity onPress={() => openEditModal('employee', emp)} style={[styles.smallIconAction, { backgroundColor: theme.inputBg, borderColor: theme.border, marginRight: 4 }]}>
                    <MaterialCommunityIcons name="pencil-outline" size={15} color="#00B4D8" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteEmployee(emp.id)} style={[styles.smallIconAction, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <MaterialCommunityIcons name="delete-outline" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* --- 5. التقارير --- */}
        {activeTab === 'reports' && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={[styles.sectionTitleHeader, { color: theme.textMain, marginBottom: 0 }]}>📈 لوحة مؤشرات الأداء والتقارير</Text>
              <TouchableOpacity style={[styles.shareReportBtn, { backgroundColor: theme.accentGreen }]} onPress={handleShareReport}>
                <MaterialCommunityIcons name="share-variant-outline" size={15} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>مشاركة التقرير</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.reportCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={[styles.reportIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                <MaterialCommunityIcons name="account-cash-outline" size={22} color="#EF4444" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.reportTitle, { color: theme.textSub }]}>إجمالي مديونيات العملاء</Text>
                <Text style={[styles.reportValue, { color: '#EF4444' }]}>{totalCustomerDue} ج.م</Text>
              </View>
            </View>

            <View style={[styles.reportCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={[styles.reportIconCircle, { backgroundColor: 'rgba(247, 127, 0, 0.12)' }]}>
                <MaterialCommunityIcons name="package-variant-closed" size={22} color={theme.accentOrange} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.reportTitle, { color: theme.textSub }]}>إجمالي القيمة السوقية لبضاعة المخزن</Text>
                <Text style={[styles.reportValue, { color: theme.accentOrange }]}>{totalInventoryVal} ج.م</Text>
              </View>
            </View>

            <View style={[styles.reportCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={[styles.reportIconCircle, { backgroundColor: 'rgba(247, 37, 133, 0.12)' }]}>
                <MaterialCommunityIcons name="cash-multiple" size={22} color={theme.accentPink} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.reportTitle, { color: theme.textSub }]}>إجمالي الرواتب الشهرية للموظفين</Text>
                <Text style={[styles.reportValue, { color: theme.accentPink }]}>{totalSalaries} ج.م</Text>
              </View>
            </View>
          </>
        )}

      </ScrollView>

      {/* نافذة التعديل */}
      <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={[styles.formTitle, { color: theme.textMain, marginBottom: 15 }]}>✏️ نافذة تحديث البيانات</Text>

            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="الاسم أو البيان..." placeholderTextColor={theme.textSub} value={editField1} onChangeText={setEditField1} />
            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="القيمة المالية أو السعر..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={editField2} onChangeText={setEditField2} />
            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="الكمية أو الهاتف..." placeholderTextColor={theme.textSub} keyboardType="numeric" value={editField3} onChangeText={setEditField3} />

            {editingType === 'product' && (
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="الإيموجي التعبيري..." placeholderTextColor={theme.textSub} value={editEmoji} onChangeText={setEditEmoji} maxLength={2} />
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00B4D8', flex: 1, marginLeft: 6 }]} onPress={handleSaveEdit}>
                <Text style={styles.btnText}>حفظ التعديلات</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#64748B', flex: 1, marginRight: 6 }]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.btnText}>إلغاء الأمر</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // شاشة الترحيب ستايلات
  welcomeContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 25 },
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  welcomeIconCircle: { width: 95, height: 95, borderRadius: 48, backgroundColor: 'rgba(0, 180, 216, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#00B4D8' },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15, textAlign: 'center' },
  
  aboutBox: { backgroundColor: 'rgba(255, 255, 255, 0.07)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 25, width: '100%' },
  aboutText: { fontSize: 12, color: '#E2E8F0', textAlign: 'center', lineHeight: 21 },

  startAppBtn: { backgroundColor: '#00B4D8', width: '100%', height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#00B4D8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 6 },
  startAppBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },

  whatsappBtn: { backgroundColor: 'rgba(37, 211, 102, 0.12)', width: '100%', height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#25D366', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  whatsappBtnText: { color: '#25D366', fontSize: 14, fontWeight: 'bold' },

  welcomeFooter: { fontSize: 11, color: '#8E9BAE', fontWeight: '600', letterSpacing: 0.5 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1 },
  headerLogoBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: 14, fontWeight: 'bold' },
  appSubtitle: { fontSize: 9, color: '#8E9BAE', marginTop: 1 },
  resetIconBtn: { width: 33, height: 33, borderRadius: 9, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  
  tabBar: { flexDirection: 'row', padding: 4, margin: 12, marginBottom: 6, borderRadius: 14, borderWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 9, fontWeight: 'bold' },

  scrollContent: { padding: 14, paddingTop: 4 },
  
  balanceCard: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  balanceHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceTitle: { fontSize: 12 },
  balanceAmount: { fontSize: 28, fontWeight: 'bold', marginBottom: 14 },
  rowStats: { flexDirection: 'row', width: '100%', borderTopWidth: 1, paddingTop: 12, justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 10, marginBottom: 3 },
  statValue: { fontSize: 14, fontWeight: 'bold' },
  statDivider: { width: 1, height: '100%' },

  formCard: { borderRadius: 18, borderWidth: 1, padding: 16 },
  formTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, height: 44, marginBottom: 10, fontSize: 12 },
  btnRow: { flexDirection: 'row', marginTop: 4 },
  actionBtn: { height: 44, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  sectionTitleHeader: { fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  shareReportBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 },
  filterBadgeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  lowStockTag: { backgroundColor: '#EF4444', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, marginRight: 6 },
  
  emojiBox: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  cardIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  customerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 11, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  custName: { fontSize: 12, fontWeight: 'bold' },
  custPhone: { fontSize: 10, marginTop: 2 },
  custDue: { fontSize: 13, fontWeight: 'bold' },
  deleteIconBtn: { padding: 6, marginLeft: 4 },
  smallIconAction: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

  reportCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  reportIconCircle: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  reportTitle: { fontSize: 11, marginBottom: 3 },
  reportValue: { fontSize: 18, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'center', padding: 22 },
  modalContent: { borderRadius: 18, borderWidth: 1, padding: 20 }
});
