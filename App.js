import React from "react";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import store from "./store";

import LoginScreen from "./screens/login";
import PasswordScreen from "./screens/password";
import BiometricScreen from "./screens/biometric";
import CardReaderScreen from "./screens/cardReader";
import CardDetailScreen from "./screens/cardDetail";
import AuthLoadingScreen from "./screens/authLoading";
import SubscriptionScreen from "./screens/subscription";

const Stack = createNativeStackNavigator();

const AppContainer = () => {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTintColor: "#ffffff",
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: "#2e6efb" },
            contentStyle: { backgroundColor: "#ffffff" },
            gestureEnabled: false,
          }}
        >
          <Stack.Screen
            name="AuthLoading"
            options={{ headerShown: false }}
            component={AuthLoadingScreen}
          />
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="CardReader"
            options={{ headerShown: false }}
            component={CardReaderScreen}
          />
          <Stack.Screen name="Biometric" component={BiometricScreen} />
          <Stack.Screen
            name="CardDetail"
            options={{ title: "Card Detail" }}
            component={CardDetailScreen}
          />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Verify" component={PasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <AppContainer />
      </MenuProvider>
    </Provider>
  );
};

export default App;
