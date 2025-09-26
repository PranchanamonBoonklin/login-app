import React from "react";
import { View, StyleSheet } from "react-native";
import ProductForm from "../components/ProductForm";
const ProductFormScreen = ({ navigation, route }) => {
    const { product } = route.params || {};
    // const { selectedLocation, fromMapPicker } = route.params || {}; // N/>N/O.O>//?/>//O>
    const handleSave = (savedProduct) => {
        console.log(" ProductFormScreen handleSave:", savedProduct);
        if (savedProduct) {
            // ถ้าสร้างใหม่หรือแก้ไขสำเร็จ -ส่งข้อมูลกลับไปยัง ProductsScreen
            navigation.navigate("Products", {
                refresh: true,
                newProduct: savedProduct
            });
        } else {
            // ถ้าลบสินค้า
            navigation.navigate("Products", {
                refresh: true
            });
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
            // selectedLocation={selectedLocation} // เอาไว้สำหรับคราวหน้า
            // fromMapPicker={fromMapPicker} // เอาไว้สำหรับคราวหน้า
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default ProductFormScreen;