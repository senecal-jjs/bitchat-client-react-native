import { BounceButton } from "@/components/ui/bounce-button";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function StartSettingsScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.logoAvatar}></View>
          <Text style={styles.headerText}>Yantagram</Text>
        </View>
        <BounceButton style={styles.button} onPress={() => {}}>
          <Text style={{ color: "white" }}>My Info</Text>
        </BounceButton>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 20,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#767676ff",
  },
  headerText: {
    color: "white",
    fontWeight: 600,
    fontSize: 14,
  },
  logoAvatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#5766b1ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#767676ff",
  },
});
