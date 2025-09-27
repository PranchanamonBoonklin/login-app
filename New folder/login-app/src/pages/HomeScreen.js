// screens/HomeScreen.js
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { useAuth } from "../AuthContext";
const HomeScreen = ({ navigation }) => {
 const { user, signOut } = useAuth();
 const handleLogout = async () => {
 Alert.alert(
 "ออกจากระบบ",
 "คุณต้องการออกจากระบบหรือไม่?",
 [
 {
 text: "ยกเลิก",
 style: "cancel"
 },
 {
 text: "ออกจากระบบ",
 style: "destructive",
 onPress: async () => {
 const { error } = await signOut();
 if (error) {
 Alert.alert("ข้อผิดพลาด", error.message);
 } else {
 Alert.alert("สำเร็จ", "ออกจากระบบเรียบร้อยแล้ว");
 }
 }
 }
 ]
 );
 };
 return (
 <View style={styles.container}>
 <Appbar.Header style={styles.header}>
 <Appbar.Content title="Welcome" />
 <Appbar.Action
 icon="logout"
 onPress={handleLogout}
 iconColor="#fff"
 />
 </Appbar.Header>

 <View style={styles.content}>
 <Text style={styles.text}>TopChef Thai </Text>
 {user && (
 <Text style={styles.userText}>อีเมล: {user.email}</Text>
 )}

 <View style={styles.buttonContainer}>
 <Button
 mode="contained"
 style={styles.button}
 onPress={() =>
 navigation.navigate("Products")
 }
 >
    ขายสินค้า
 </Button>


 
 </View>
 </View>
 </View>
 );
};
const styles = StyleSheet.create({
 container: {
 flex: 1,
 },
 header: {
 backgroundColor: '#e982c7ff',
 },
 content: {
 flex: 1,
 justifyContent: "center",
 alignItems: "center",
 padding: 20,
 },
 text: {
 fontSize: 24,
 marginBottom: 20,
 textAlign: "center",
 },
 userText: {
 fontSize: 16,
 marginBottom: 30,
 color: "#020202ff",
 textAlign: "center",
 },
 buttonContainer: {
 width: "100%",
 maxWidth: 300,
 },
 button: {
 marginBottom: 15,
 },
})
export default HomeScreen;