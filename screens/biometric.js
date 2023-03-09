import React from "react";
import Checkbox from "expo-checkbox";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { useSelector } from "react-redux";

const BiometricScreen = ({ navigation }) => {
  const { isBiometricEnabled } = useSelector((state) => state.common);
  const [isChecked, setChecked] = React.useState(isBiometricEnabled);
  const [appPassword, setAppPassword] = React.useState("");

  const setBiometricStatus = async (status) => {
    try {
      await AsyncStorage.setItem("isBiometricEnabled", `${status}`);
    } catch (e) {
      console.log(e);
    }
  };

  const checkPinExist = async () => {
    const pin = await SecureStore.getItemAsync("appPassword");

    if (pin === null) {
      return false;
    } else {
      return true;
    }
  };

  const handleCheckboxChange = async (value) => {
    if (await checkPinExist()) {
      setBiometricStatus(value);
      setChecked(value);
    } else {
      Alert.alert("Please set app password");
    }
  };

  const handleSetAppPassword = async () => {
    if (!appPassword.trim()) {
      Alert.alert("Password cannot be blank");
      return;
    }

    if (appPassword.length < 6) {
      Alert.alert("Password should contain 6 digits");
      return;
    }

    await SecureStore.setItemAsync("appPassword", appPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={handleCheckboxChange}
            color={isChecked ? "#2e6efb" : undefined}
          />
          <Text style={styles.checkboxLabel}>
            Turn on/off biometric security
          </Text>
        </View>
        <TextInput
          style={styles.textbox}
          placeholder="Please enter six digit code"
          placeholderTextColor="#999999"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          returnKeyType="done"
          onSubmitEditing={handleSetAppPassword}
          onChangeText={(text) => setAppPassword(text)}
          value={appPassword}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    marginRight: 10,
  },

  checkboxLabel: {
    fontSize: 14,
    fontWeight: 500,
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
  },
});

export default BiometricScreen;
