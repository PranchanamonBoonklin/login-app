// 📂 src/components/ProductCard.js
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Text, Button, Chip } from "react-native-paper";

const ProductCard = ({ product, onPress }) => {
  if (!product) return null;

  return (
    <TouchableOpacity
      onPress={() => onPress(product)}
      style={styles.cardWrapper}
      activeOpacity={0.85}
    >
      <Card style={styles.card}>
        {/* รูปสินค้า */}
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>ไม่มีรูป</Text>
          </View>
        )}

        {/* เนื้อหา */}
        <Card.Content style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.price}>
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(product.price)}
          </Text>

          {product.category && (
            <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
              {product.category.name}
            </Chip>
          )}
        </Card.Content>

        {/* ปุ่มดูรายละเอียด */}
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => onPress(product)}
            buttonColor="#FF69B4"
            textColor="#fff"
            style={styles.button}
          >
            ดูรายละเอียด
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: 220,
    marginHorizontal: 8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#FF69B4",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: "cover",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe4ec",
  },
  noImageText: {
    color: "#999",
    fontSize: 14,
  },
  content: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E75480",
    marginBottom: 6,
  },
  categoryChip: {
    alignSelf: "flex-start",
    backgroundColor: "#FFC0CB",
    marginTop: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actions: {
    justifyContent: "flex-end",
    paddingRight: 8,
    paddingBottom: 6,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 12,
  },
});

export default ProductCard;
