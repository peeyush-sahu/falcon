import React from "react";
import { useSelector } from "react-redux";
import { WebView } from "react-native-webview";
import { StyleSheet, Text, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

const SubscriptionScreen = ({ navigation }) => {
  const { details } = useSelector((state) => state.company);

  const handleOpenCardReader = () => {
    navigation.navigate("CardReader");
  };

  const handleSetAppSecurity = () => {
    navigation.navigate("Biometric");
  };

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: details?.displayName });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.planRow}>
            <Text style={styles.sectionTitle}>Subscription Plans</Text>
            <Menu>
              <MenuTrigger
                children={<Icon name="cog" size={28} color="#2e6efb" />}
              />
              <MenuOptions>
                <MenuOption
                  onSelect={handleOpenCardReader}
                  text="Card Reader"
                  style={{ padding: 12 }}
                />
                <MenuOption
                  onSelect={handleSetAppSecurity}
                  text="App Security"
                  style={{ padding: 12 }}
                />
              </MenuOptions>
            </Menu>
          </View>

          {details?.subscriptionPlans.map((plan, index) => (
            <Text key={index} style={styles.planTitle}>
              {plan}
            </Text>
          ))}
        </View>
        <WebView
          style={styles.webview}
          source={{ uri: "http://adminprepaid.uat.kitecash.in/" }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  webview: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 32,
  },

  planRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  planTitle: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 24,
    color: "#2e6efb",
  },
});

export default SubscriptionScreen;
