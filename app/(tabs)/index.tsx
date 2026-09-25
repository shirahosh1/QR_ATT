import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/AppButton";
import Header from "@/components/Header";
import { COLORS } from "@/constants/colors";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header title="QR Attendance" />
        <Text style={styles.author}>by: Syrell Jane S. Dacuyan</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>School Event Attendance</Text>

        <Text style={styles.subtitle}>
          Scan QR Codes to record your attendance during school activities.
        </Text>
      </View>

      <View style={styles.buttons}>
        <AppButton
          theme="primary"
          title="Scan QR Code"
          icon="qr-code-outline"
          onPress={() => router.push("/scan")}
        />

        <AppButton
          title="Attendance History"
          icon="time-outline"
          onPress={() => router.push("/history")}
        />

        <AppButton
          title="Profile"
          icon="person-outline"
          onPress={() => router.push("/profile")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    alignItems: "center",
    padding: 24,
  },

  author: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 8,
  },

  buttons: {
    padding: 24,
    gap: 10,
  },
});
