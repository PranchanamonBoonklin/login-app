// 📂 src/pages/ProductFormScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import ProductForm from "../components/ProductForm";

const ProductFormScreen = ({ navigation, route }) => {
  const { product } = route.params || {};

  const handleSave = (savedProduct) => {
    if (savedProduct) {
      navigation.navigate("Products", {
        refresh: true,
        newProduct: savedProduct,
      });
    } else {
      navigation.navigate("Products", { refresh: true });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProductForm
        product={product}
        onSave={handleSave}
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
});

export default ProductFormScreen;
