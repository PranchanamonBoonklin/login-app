import { View, StyleSheet } from "react-native";
import LoginForm from "../components/LoginFrom";
 
const LoginPage = () => {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
 
export default LoginPage;