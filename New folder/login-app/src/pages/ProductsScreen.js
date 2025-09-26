import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
const ProductsScreen = ({ navigation, route }) => {
 // รับ refresh parameter จาก ProductFormScreen
 useEffect(() => {
 if (route.params?.refresh) {
 console.log("ProductsScreen received refresh signal");
 // ส่ง refresh signal จาก ProductList
 // ProductList จะ refresh ข้อมูลอัตโนมัติเมื่อ mount ใหม่
 }
 }, [route.params?.refresh]);
 const handleProductPress = (product) => {
 navigation.navigate("ProductDetail", { product });
 };
 const handleProductEdit = (product) => {
 navigation.navigate("ProductForm", { product });
 };
 const handleAddProduct = () => {
 navigation.navigate("ProductForm");
 };
 const handleProductDelete = (product) => {
 // ProductList จะจัดการลบเอง
 console.log("Product deleted:", product.name);
 };
 return (
 <View style={styles.container}>
 <ProductList
 key={route.params?.refresh ? Date.now() : 'default'}
 onProductPress={handleProductPress}
 onProductEdit={handleProductEdit}
 onProductDelete={handleProductDelete}
 onAddProduct={handleAddProduct}
 showAddButton={true}
 />
 </View>
 );
};
const styles = StyleSheet.create({
 container: {
 flex: 1,
 },
});
export default ProductsScreen;