import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { useAuth } from "@/lib/auth";
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from "@/lib/attendance";
import { getProfile, type Role } from "@/lib/profiles";

function shortId(id: string) {
  return id ? `…${id.slice(-8)}` : "unknown";
}

function formatTime(iso: string) {
  return iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "";
}

function formatDate(iso: string) {
  return iso ? new Date(iso).toLocaleString() : "";
}

export default function HistoryScreen() {
  const { user } = useAuth();

  const [role, setRole] = useState<Role | null>(null);
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);
  const [teacherEvents, setTeacherEvents] = useState<TeacherEventAttendance[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const profile = await getProfile(user.id);
    const currentRole = profile?.role ?? "student";

    setRole(currentRole);

    if (currentRole === "teacher") {
      const events = await getTeacherEventAttendance(user.id);

      setTeacherEvents(events);
      setStudentRecords([]);
    } else {
      const records = await getAttendanceHistory(user.id);

      setStudentRecords(records);
      setTeacherEvents([]);
    }

    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (role === "teacher") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Teacher Attendance Register</Text>

        {loading ? (
          <Text style={styles.subtitle}>Loading records...</Text>
        ) : teacherEvents.length === 0 ? (
          <Text style={styles.subtitle}>
            No events or attendance records found.
          </Text>
        ) : (
          <FlatList
            data={teacherEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                </View>

                <Text style={styles.eventMeta}>Code: {item.eventCode}</Text>

                <Text style={styles.attendeeHeading}>
                  Attendees ({item.attendeeCount})
                </Text>

                {item.attendees.map((att, idx) => (
                  <View key={idx} style={styles.attendeeRow}>
                    <Text style={styles.studentLabel}>Student</Text>

                    <Text style={styles.studentName}>
                      {att.studentName || shortId(att.studentId)}
                    </Text>

                    <Text style={styles.scannedText}>
                      Scanned: {formatTime(att.scannedAt)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>

      {loading ? (
        <Text style={styles.subtitle}>Loading records...</Text>
      ) : studentRecords.length === 0 ? (
        <Text style={styles.subtitle}>
          No records yet. Scan a QR code to register your attendance.
        </Text>
      ) : (
        <FlatList
          data={studentRecords}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.eventTitle}>{item.eventTitle}</Text>

              <Text style={styles.eventMeta}>{item.eventId}</Text>

              <Text style={styles.eventMeta}>{formatDate(item.scannedAt)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ─────────────────────────────────────────────
  // Screen
  // ─────────────────────────────────────────────

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.7,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 22,
  },

  // ─────────────────────────────────────────────
  // List
  // ─────────────────────────────────────────────

  list: {
    paddingTop: 4,
    paddingBottom: 32,
  },

  // ─────────────────────────────────────────────
  // Event Card
  // ─────────────────────────────────────────────

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },

  eventHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  eventTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginRight: 12,
  },

  eventMeta: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ─────────────────────────────────────────────
  // Event Status
  // ─────────────────────────────────────────────

  eventBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(34, 197, 94, 0.10)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },

  eventBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // ─────────────────────────────────────────────
  // Attendee Section
  // ─────────────────────────────────────────────

  attendeeHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,

    marginTop: 18,
    marginBottom: 10,
    paddingTop: 16,

    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  attendeeCount: {
    color: COLORS.primary,
    fontWeight: "800",
  },

  // ─────────────────────────────────────────────
  // Attendee Card
  // ─────────────────────────────────────────────

  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,

    paddingHorizontal: 12,
    paddingVertical: 11,

    marginBottom: 8,
  },

  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  attendeeAvatarText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  attendeeInfo: {
    flex: 1,
  },

  studentLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textSecondary,

    marginBottom: 2,

    textTransform: "uppercase",
    letterSpacing: 0.7,
  },

  studentName: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  scannedText: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  // ─────────────────────────────────────────────
  // Scan / Attendance Status
  // ─────────────────────────────────────────────

  scannedBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.10)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    marginLeft: 8,
  },

  scannedBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#5db0bb",
  },

  // ─────────────────────────────────────────────
  // Empty State
  // ─────────────────────────────────────────────

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: COLORS.card,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
