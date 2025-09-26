// screens/DetailsScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const DetailsScreen = ({ route, navigation }) => {
  const { itemId, title } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>หน้ารายละเอียด (Details Screen)</Text>
      <Text>ID ที่ได้รับ: {itemId}</Text>
      <Text>หัวข้อที่ได้รับ: {title}</Text>
      <Button title=" กลับไปหน้าหลัก " onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});
export default DetailsScreen;
