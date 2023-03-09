import React from "react";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { Alert, StyleSheet, TextInput, View } from "react-native";

import { setAuthenticationStatus } from "../store/reducers/common";

const PasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = React.useState("");

  const handleVerify = async () => {
    const storedPassword = await SecureStore.getItemAsync("appPassword");

    if (storedPassword === password) {
      dispatch(setAuthenticationStatus(true));
      navigation.replace("AuthLoading");
    } else {
      Alert.alert("Wrong password");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textbox}
        placeholder="Please enter your 6 digit pin"
        placeholderTextColor="#999999"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        returnKeyType="done"
        onSubmitEditing={handleVerify}
        onChangeText={(text) => setPassword(text)}
        value={password}
        autoFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textbox: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 6,
    borderColor: "#f5f5f5",
    backgroundColor: "#f6f6f6",
    marginVertical: 24,
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export default PasswordScreen;
