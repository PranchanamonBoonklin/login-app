// 📂 src/components/ProductList.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  Searchbar,
  Chip,
  IconButton,
  Button,
} from "react-native-paper";
import { supabase } from "../config/supabase";
import ProductCard from "./ProductCard";
import AddProduct from "./AddProduct"; 

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const cardMargin = 10;
const cardWidth = (screenWidth - cardMargin * (numColumns + 1)) / numColumns;

const ProductList = ({ onProductPress }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); 

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "โหลดหมวดหมู่ไม่สำเร็จ");
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("products")
        .select(`
          *,
          category:categories(name)
        `)
        .order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "โหลดสินค้าล้มเหลว");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // 🏷️ กรองสินค้าแต่ละหมวดหมู่
  const getProductsByCategory = (categoryName) =>
  products.filter((p) => p.category === categoryName);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#FF69B4"]}
          tintColor="#FF69B4"
        />
      }
    >
      {/* 🔎 Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="ค้นหา..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#FF69B4"
        />
        <IconButton
          icon="tune"
          size={24}
          iconColor="#FF69B4"
          onPress={() =>
            Alert.alert("แจ้งเตือน", "ฟีเจอร์กรองจะมาเร็ว ๆ นี้")
          }
        />
      </View>

      {/* 🏷️ Chips เลือกหมวดหมู่ */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            onPress={() => setSearchQuery(cat.name)}
            style={styles.categoryChip}
            selected={searchQuery === cat.name}
            selectedColor="#fff"
            textStyle={
              searchQuery === cat.name
                ? styles.selectedChipText
                : styles.chipText
            }
          >
            {cat.name}
          </Chip>
        ))}
      </View>

      {/* 🍰 Swimlane Sections */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF69B4" />
      ) : (
        <>
          <Text style={styles.laneTitle}>🍓 สินค้าใหม่</Text>
          <FlatList
            horizontal
            data={getProductsByCategory("New")}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={onProductPress} />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.laneList}
          />

          <Text style={styles.laneTitle}>⭐ เมนูขายดี</Text>
          <FlatList
            horizontal
            data={getProductsByCategory("Best Seller")}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={onProductPress} />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.laneList}
          />

          <Text style={styles.laneTitle}>🎀 แนะนำ</Text>
          <FlatList
            horizontal
            data={getProductsByCategory("Recommended")}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={onProductPress} />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.laneList}
          />
        </>
      )}

      <View style={{ padding: 12 }}>
        <Button
          mode="contained"
          buttonColor="#FF69B4"
          onPress={() => setModalVisible(true)}
        >
          ➕ เพิ่มสินค้าใหม่
        </Button>
      </View>

      {/* ✅ เรียก AddProduct Modal */}
      <AddProduct
        visible={modalVisible}
        onAdded={loadProducts} // รีเฟรชสินค้าเมื่อเพิ่มเสร็จ
        onClose={() => setModalVisible(false)}
        categories={categories}
      />

      {products.map((p, index) => (
        <TouchableOpacity key={index} onPress={() => onProductPress(p)}>
          <View style={styles.card}>
            <Image
              source={{ uri: p.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.description}>{p.description}</Text>
            <Text style={styles.category}>{p.category?.name}</Text>
          </View>
    
          
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  categoryChip: {
    margin: 4,
    backgroundColor: "#FFC0CB",
  },
  chipText: { color: "#333", fontSize: 12 },
  selectedChipText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  laneTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF69B4",
    marginLeft: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  laneList: { paddingHorizontal: 8 },
  container: {
    padding: cardMargin,
  },
  card: {
    backgroundColor: "#ffe6f0",
    borderRadius: 12,
    margin: cardMargin / 2,
    width: cardWidth,
    overflow: "hidden",
    elevation: 3, // shadow android
    shadowColor: "#000", // shadow ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
    textAlign: "center",
  },
  category: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default ProductList;
