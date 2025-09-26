import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { useAuth } from "../AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import HomeScreen from "../pages/HomeScreen";
import DetailsScreen from "../pages/DetailsScreen";
import LoginPage from "../pages/LoginPage";
import DataScreen from "../pages/DataScreen";
import RegisterScreen from "../pages/RegisterScreen";
import ForgetPasswordScreen from "../pages/ForgetPasswordScreen";
import ProductsScreen from "../pages/ProductsScreen";
import ProductFormScreen from "../pages/ProductFormScreen";
import ProductDetailScreen from "../pages/ProductDetailScreen";
// import MapPickerScreen from "../pages/MapPickerScreen";
const Stack = createNativeStackNavigator();
// Auth Stack สำหรับหน้าที่ยังไม่ได้ login
const AuthStack = () => {
return (
<Stack.Navigator
initialRouteName="Login"
screenOptions={{
 headerShown: true,
 headerStyle: {
 backgroundColor: '#FF6B35',
 },
 headerTintColor: '#fff',
 headerTitleStyle: {
 fontWeight: 'bold',
 },
 }}
>
<Stack.Screen
name="Login"
component={LoginPage}
options={{
 title: "NO>.?N/>",
 headerShown: false
 }}
/>
<Stack.Screen
name="Register"
component={RegisterScreen}
options={{
 title: "./?/./>> ",
 headerBackTitle: "/?"
 }}
/>
<Stack.Screen
name="ForgetPassword"
component={ForgetPasswordScreen}
options={{
 title: "/?///?.N>",
 headerBackTitle: "/?"
 }}
/>
</Stack.Navigator>
 );
};
// Main Stack .O>//?/O>//?> login O/O/
const MainStack = () => {
return (
<Stack.Navigator
initialRouteName="Home"
screenOptions={{
 headerStyle: {
 backgroundColor: '#FF6B35',
 },
 headerTintColor: '#fff',
 headerTitleStyle: {
 fontWeight: 'bold',
 },
 }}
>
<Stack.Screen
name="Home"
component={HomeScreen}
options={{
 title: "/O>//?",
 headerShown: false
 }}
/>
<Stack.Screen
name="Details"
component={DetailsScreen}
options={{
 title: "/>./>N/?.",
 headerBackTitle: "/?"
 }}
/>
<Stack.Screen
name="Data"
component={DataScreen}
options={{
 title: "O//?/",
 headerBackTitle: "/?"
 }}
/>
<Stack.Screen
name="DataDetail"
component={DataDetailScreen}
options={{
 title: "/>./>N/?./>N.",
 headerBackTitle: "/?"
 }}
/>
<Stack.Screen
name="Products"
component={ProductsScreen}
options={({ navigation }) => ({
 title: ".>O>?//  ",
 headerBackTitle: "/?",
 headerRight: () => (
<IconButton
icon="plus"
iconColor="#fff"
size={24}
onPress={() => navigation.navigate("ProductForm")}
/>
 ),
 })}
/>
<Stack.Screen
name="ProductForm"
component={ProductFormScreen}
options={({ route }) => ({
 title: route.params?.product ? "OON.>O>" : "N>/.>O>O//N  ",
 headerBackTitle: "/?"
 })}
/>
<Stack.Screen
name="ProductDetail"
component={ProductDetailScreen}
options={{
 title: "/>./>N/?..>O>",
 headerBackTitle: "/?"
 }}
/>
<Stack.Screen
name="MapPicker"
component={MapPickerScreen}
options={{
 title: "N/?/O>O/NO?",
 headerBackTitle: "/?"
 }}
/>
</Stack.Navigator>
 );
 };
const AppNavigator = () => {
const { user, loading } = useAuth();
if (loading) {
return <LoadingScreen />;
 }
return (
<NavigationContainer>
{user ? <MainStack /> : <AuthStack />}
</NavigationContainer>
 );
};
export default AppNavigator;