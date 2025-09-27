// 📂 src/pages/ProductDetailScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Alert } from "react-native";
import {
  Card,
  Text,
  Button,
  Chip,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../AuthContext";

const ProductDetailScreen = ({ navigation, route }) => {
  const { product: initialProduct } = route.params;
  const { user } = useAuth();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const isOwner = user?.id === product?.created_by;

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleEdit = () => {
    navigation.navigate("ProductForm", { product });
  };

  const handleDelete = () => {
    Alert.alert("ยืนยันการลบ", `คุณต้องการลบ "${product.name}" หรือไม่?`, [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            // TODO: ลบข้อมูลจริงจาก Supabase
            Alert.alert("สำเร็จ", "ลบสินค้าเรียบร้อยแล้ว", [
              { text: "ตกลง", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบสินค้าได้");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleCall = () => {
    Alert.alert("แจ้งเตือน", "ฟีเจอร์โทรจะมาเร็ว ๆ นี้ 🍰");
  };

  const handleMessage = () => {
    Alert.alert("แจ้งเตือน", "ฟีเจอร์แชทจะมาเร็ว ๆ นี้ 🍭");
  };

  const handleShare = () => {
    Alert.alert("แจ้งเตือน", "ฟีเจอร์แชร์จะมาเร็ว ๆ นี้ 🎀");
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* รูปสินค้า */}
        {product.image_url && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image_url }} style={styles.image} />
            {product.category && (
              <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
                {product.category.name}
              </Chip>
            )}
          </View>
        )}

        <View style={styles.content}>
          {/* ชื่อสินค้า */}
          <Text variant="headlineSmall" style={styles.title}>
            {product.name}
          </Text>

          {/* ราคา */}
          <Text variant="headlineMedium" style={styles.price}>
            {formatPrice(product.price)}
          </Text>

          {/* คำอธิบาย */}
          {product.description && (
            <Card style={styles.descriptionCard}>
              <Card.Content>
                <Text style={styles.sectionTitle}>รายละเอียดสินค้า</Text>
                <Text style={styles.description}>{product.description}</Text>
              </Card.Content>
            </Card>
          )}

          {/* ข้อมูลเพิ่มเติม */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>ข้อมูลเพิ่มเติม</Text>
              <Text style={styles.infoText}>
                🗓️ สร้างเมื่อ: {formatDate(product.created_at)}
              </Text>
              {product.updated_at !== product.created_at && (
                <Text style={styles.infoText}>
                  🔄 แก้ไขล่าสุด: {formatDate(product.updated_at)}
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* ปุ่มติดต่อ (ไม่ใช่เจ้าของ) */}
          {!isOwner && (
            <View style={styles.contactButtons}>
              <Button
                mode="contained"
                onPress={handleCall}
                style={styles.contactButton}
                buttonColor="#FF69B4"
                textColor="#fff"
                icon="phone"
              >
                โทร
              </Button>
              <Button
                mode="outlined"
                onPress={handleMessage}
                style={styles.contactButton}
                textColor="#FF69B4"
                icon="message"
              >
                ส่งข้อความ
              </Button>
              <IconButton
                icon="share-variant"
                size={24}
                iconColor="#E75480"
                onPress={handleShare}
              />
            </View>
          )}

          {/* ปุ่มแก้ไข/ลบ (เฉพาะเจ้าของ) */}
          {isOwner && (
            <View style={styles.ownerButtons}>
              <Button
                mode="contained"
                onPress={handleEdit}
                style={styles.ownerButton}
                buttonColor="#FF69B4"
                textColor="#fff"
                icon="pencil"
              >
                แก้ไขสินค้า
              </Button>
              <Button
                mode="outlined"
                onPress={handleDelete}
                style={styles.ownerButton}
                textColor="#FF69B4"
                icon="delete"
                disabled={loading}
              >
                {loading ? "กำลังลบ..." : "ลบสินค้า"}
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 16, color: "#666" },
  imageContainer: { position: "relative" },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  categoryChip: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF69B4",
  },
  categoryText: { color: "#fff", fontSize: 14 },
  content: { padding: 16 },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  price: {
    fontWeight: "bold",
    color: "#E75480",
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    color: "#FF69B4",
  },
  descriptionCard: { marginBottom: 16, backgroundColor: "#fff" },
  description: { lineHeight: 22, color: "#555" },
  infoCard: { marginBottom: 16, backgroundColor: "#fff" },
  infoText: { marginBottom: 6, color: "#333" },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },
  contactButton: { flex: 1, marginHorizontal: 4 },
  ownerButtons: { marginTop: 20 },
  ownerButton: { marginBottom: 12 },
});

export default ProductDetailScreen;
