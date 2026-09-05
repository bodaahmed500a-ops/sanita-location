import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const BLUE = "#0877C9";
const DARK = "#123047";
const LIGHT = "#F4F8FB";

const companies = [
  {
    id: "1",
    name: "Aramex",
    type: "شحن دولي ومحلي",
    city: "القاهرة",
    phone: "16060",
    latitude: 30.0444,
    longitude: 31.2357,
  },
  {
    id: "2",
    name: "DHL",
    type: "شحن دولي",
    city: "القاهرة",
    phone: "16345",
    latitude: 30.0626,
    longitude: 31.2497,
  },
  {
    id: "3",
    name: "Bosta",
    type: "شحن داخلي",
    city: "القاهرة",
    phone: "15429",
    latitude: 30.0131,
    longitude: 31.2089,
  },
  {
    id: "4",
    name: "Amazon Egypt",
    type: "تجارة وشحن",
    city: "مصر",
    phone: null,
    latitude: 30.0444,
    longitude: 31.2357,
  },
  {
    id: "5",
    name: "UPS",
    type: "شحن دولي",
    city: "القاهرة",
    phone: null,
    latitude: 30.08,
    longitude: 31.34,
  },
];

const initialRegion = {
  latitude: 30.0444,
  longitude: 31.2357,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const homeMapRef = useRef(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationLoading(false);

        Alert.alert(
          "إذن الموقع",
          "لم يتم السماح للتطبيق بالوصول إلى موقعك. يمكنك السماح بالموقع من إعدادات الهاتف."
        );

        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);

      setTimeout(() => {
        if (homeMapRef.current) {
          homeMapRef.current.animateToRegion(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            },
            1000
          );
        }
      }, 500);
    } catch (error) {
      Alert.alert(
        "خطأ في الموقع",
        "لم نتمكن من الحصول على موقعك الحالي."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return companies;

    return companies.filter((company) =>
      `${company.name} ${company.type} ${company.city}`
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  const callCompany = async (phone) => {
    if (!phone) {
      Alert.alert(
        "غير متاح",
        "لا يوجد رقم اتصال موثوق لهذه الشركة حاليًا."
      );
      return;
    }

    try {
      const url = `tel:${phone}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("خطأ", "لا يمكن فتح تطبيق الاتصال.");
      }
    } catch {
      Alert.alert(
        "خطأ",
        "حدثت مشكلة أثناء محاولة الاتصال."
      );
    }
  };

  const openMaps = async (company) => {
    const url =
      `https://www.google.com/maps/search/?api=1` +
      `&query=${company.latitude},${company.longitude}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("خطأ", "تعذر فتح الخرائط.");
    }
  };

  const openWhatsApp = async () => {
    Alert.alert(
      "واتساب",
      "سنضيف أرقام واتساب الرسمية للشركات بعد التأكد من بياناتها."
    );
  };

  const showCompany = (company) => {
    setSelectedCompany(company);
    setScreen("company");
  };

  const goToMyLocation = () => {
    if (!userLocation) {
      Alert.alert(
        "الموقع",
        "جاري الحصول على موقعك، حاول مرة أخرى بعد لحظات."
      );

      getUserLocation();
      return;
    }

    if (homeMapRef.current) {
      homeMapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        800
      );
    }
  };

  const Home = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>SANITA</Text>

          <Text style={styles.subtitle}>
            دليلك لخدمات الشحن
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setScreen("companies")}
        >
          <Text style={styles.headerButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ابحث عن شركة شحن..."
          placeholderTextColor="#8A9AA8"
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>
        شركات الشحن القريبة
      </Text>

      <View style={styles.mapCard}>
        <MapView
          ref={homeMapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
        >
          {filteredCompanies.map((company) => (
            <Marker
              key={company.id}
              coordinate={{
                latitude: company.latitude,
                longitude: company.longitude,
              }}
              title={company.name}
              description={company.type}
              onCalloutPress={() => showCompany(company)}
            />
          ))}

          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="موقعك الحالي"
              description="أنت هنا"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>
          )}
        </MapView>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={goToMyLocation}
        >
          <Text style={styles.locationButtonText}>⌖</Text>
        </TouchableOpacity>

        {locationLoading && (
          <View style={styles.locationLoading}>
            <Text style={styles.locationLoadingText}>
              جاري تحديد موقعك...
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        الشركات
      </Text>

      {filteredCompanies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onPress={() => showCompany(company)}
          onCall={() => callCompany(company.phone)}
          onWhatsApp={openWhatsApp}
        />
      ))}

      {filteredCompanies.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            لا توجد نتائج
          </Text>

          <Text style={styles.emptyText}>
            جرّب كتابة اسم شركة أو مدينة مختلفة.
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const Companies = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() => setScreen("home")}
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>
          شركات الشحن
        </Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ابحث عن شركة..."
          placeholderTextColor="#8A9AA8"
          style={styles.searchInput}
        />
      </View>

      {filteredCompanies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onPress={() => showCompany(company)}
          onCall={() => callCompany(company.phone)}
          onWhatsApp={openWhatsApp}
        />
      ))}
    </ScrollView>
  );

  const Company = () => {
    if (!selectedCompany) return null;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={() => setScreen("companies")}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.pageTitle}>
            تفاصيل الشركة
          </Text>

          <View style={{ width: 30 }} />
        </View>

        <View style={styles.companyHero}>
          <View style={styles.companyIcon}>
            <Text style={styles.companyIconText}>
              {selectedCompany.name.charAt(0)}
            </Text>
          </View>

          <Text style={styles.companyName}>
            {selectedCompany.name}
          </Text>

          <Text style={styles.companyType}>
            {selectedCompany.type}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <ActionButton
            title="اتصال"
            icon="☎"
            onPress={() =>
              callCompany(selectedCompany.phone)
            }
          />

          <ActionButton
            title="واتساب"
            icon="◉"
            onPress={openWhatsApp}
          />

          <ActionButton
            title="الاتجاهات"
            icon="⌖"
            onPress={() =>
              openMaps(selectedCompany)
            }
          />
        </View>

        <Text style={styles.sectionTitle}>
          الموقع
        </Text>

        <View style={styles.mapCard}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedCompany.latitude,
              longitude: selectedCompany.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedCompany.latitude,
                longitude: selectedCompany.longitude,
              }}
              title={selectedCompany.name}
            />

            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="موقعك الحالي"
                description="أنت هنا"
              >
                <View style={styles.userMarker}>
                  <View style={styles.userMarkerInner} />
                </View>
              </Marker>
            )}
          </MapView>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => openMaps(selectedCompany)}
        >
          <Text style={styles.primaryButtonText}>
            فتح الموقع في الخرائط
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {screen === "home" && <Home />}
      {screen === "companies" && <Companies />}
      {screen === "company" && <Company />}

      <View style={styles.bottomNav}>
        <NavButton
          title="الرئيسية"
          icon="⌂"
          active={screen === "home"}
          onPress={() => setScreen("home")}
        />

        <NavButton
          title="الشركات"
          icon="▣"
          active={screen === "companies"}
          onPress={() => setScreen("companies")}
        />

        <NavButton
          title="الشحنة"
          icon="□"
          active={false}
          onPress={() =>
            Alert.alert(
              "قريبًا",
              "سنضيف نظام تتبع الشحنات الحقيقي."
            )
          }
        />

        <NavButton
          title="حسابي"
          icon="♙"
          active={false}
          onPress={() =>
            Alert.alert(
              "قريبًا",
              "سنضيف الحساب والسائق."
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

function CompanyCard({
  company,
  onPress,
  onCall,
  onWhatsApp,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardTop}>
        <View style={styles.companyIconSmall}>
          <Text style={styles.companyIconSmallText}>
            {company.name.charAt(0)}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>
            {company.name}
          </Text>

          <Text style={styles.cardType}>
            {company.type}
          </Text>

          <Text style={styles.cardCity}>
            📍 {company.city}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={(event) => {
            event.stopPropagation();
            onCall();
          }}
        >
          <Text style={styles.smallButtonText}>
            ☎ اتصال
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={(event) => {
            event.stopPropagation();
            onWhatsApp();
          }}
        >
          <Text style={styles.smallButtonText}>
            واتساب
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={onPress}
        >
          <Text style={styles.smallButtonText}>
            التفاصيل
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ActionButton({ title, icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>{icon}</Text>

      <Text style={styles.actionText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function NavButton({
  title,
  icon,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.navButton}
      onPress={onPress}
    >
      <Text
        style={[
          styles.navIcon,
          active && styles.navActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navText,
          active && styles.navActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: LIGHT,
  },

  content: {
    padding: 18,
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  logo: {
    fontSize: 28,
    fontWeight: "900",
    color: BLUE,
    letterSpacing: 2,
  },

  subtitle: {
    color: "#6F8290",
    marginTop: 3,
    fontSize: 13,
  },

  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerButtonText: {
    fontSize: 24,
    color: DARK,
  },

  searchBox: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  searchIcon: {
    fontSize: 25,
    color: BLUE,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    textAlign: "right",
    fontSize: 15,
    color: DARK,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: DARK,
    textAlign: "right",
    marginBottom: 12,
    marginTop: 5,
  },

  mapCard: {
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 22,
    backgroundColor: "#DCEAF2",
  },

  map: {
    flex: 1,
  },

  locationButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  locationButtonText: {
    color: BLUE,
    fontSize: 27,
    fontWeight: "900",
  },

  locationLoading: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },

  locationLoadingText: {
    color: DARK,
    fontSize: 12,
    fontWeight: "700",
  },

  userMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(8, 119, 201, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  companyIconSmall: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#E8F4FC",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  companyIconSmallText: {
    color: BLUE,
    fontSize: 24,
    fontWeight: "900",
  },

  cardInfo: {
    flex: 1,
  },

  cardName: {
    textAlign: "right",
    color: DARK,
    fontSize: 17,
    fontWeight: "800",
  },

  cardType: {
    textAlign: "right",
    color: "#687B88",
    marginTop: 3,
  },

  cardCity: {
    textAlign: "right",
    color: "#80909B",
    marginTop: 4,
    fontSize: 12,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 7,
  },

  smallButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EDF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  smallButtonText: {
    color: BLUE,
    fontWeight: "700",
    fontSize: 12,
  },

  empty: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },

  emptyText: {
    color: "#71828D",
    marginTop: 7,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  back: {
    fontSize: 38,
    color: BLUE,
    lineHeight: 38,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: DARK,
  },

  companyHero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    alignItems: "center",
    padding: 25,
    marginBottom: 15,
  },

  companyIcon: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#E8F4FC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  companyIconText: {
    color: BLUE,
    fontSize: 34,
    fontWeight: "900",
  },

  companyName: {
    color: DARK,
    fontSize: 25,
    fontWeight: "900",
  },

  companyType: {
    color: "#71828D",
    marginTop: 5,
  },

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 22,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 22,
    color: BLUE,
    marginBottom: 5,
  },

  actionText: {
    color: DARK,
    fontWeight: "700",
    fontSize: 12,
  },

  primaryButton: {
    height: 52,
    backgroundColor: BLUE,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E7EEF2",
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 65,
  },

  navIcon: {
    fontSize: 22,
    color: "#82929D",
    marginBottom: 3,
  },

  navText: {
    fontSize: 11,
    color: "#82929D",
    fontWeight: "600",
  },

  navActive: {
    color: BLUE,
  },
});
