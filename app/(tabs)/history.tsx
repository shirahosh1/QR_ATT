import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from '@/lib/attendance';
import { getProfile, type Role } from '@/lib/profiles';

function shortId(id: string) {
  return id ? `…${id.slice(-8)}` : 'Unknown student';
}

function formatDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleString() : '';
}

export default function HistoryScreen() {
  const { user } = useAuth();

  const [role, setRole] = useState<Role | null>(null);
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);
  const [teacherEvents, setTeacherEvents] = useState<TeacherEventAttendance[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const profile = await getProfile(user.id);
    const currentRole = profile?.role ?? 'student';

    setRole(currentRole);

    if (currentRole === 'teacher') {
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

  // Reload every time the History tab comes into focus,
  // so a newly created event shows up right away.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (role === 'teacher') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Attendance History</Text>

        {loading ? (
          <Text style={styles.subtitle}>Loading records...</Text>
        ) : (
          <FlatList
            data={teacherEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={styles.list}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <Text style={styles.subtitle}>
                No events yet. Create one in the Teacher tab and it will appear
                here.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.iconBadge}>
                    <Ionicons name="people-outline" size={26} color={COLORS.primary} />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.eventTitle}>{item.title}</Text>

                    {!!item.startTime && (
                      <Text style={styles.eventMeta}>
                        {formatDate(item.startTime)}
                      </Text>
                    )}

                    <Text style={styles.eventMeta}>Code: {item.eventCode}</Text>

                    <Text style={styles.attendeeCount}>
                      Attendees: {item.attendeeCount}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.presentHeading}>Present Students</Text>

                {item.attendees.length === 0 ? (
                  <Text style={styles.emptyAttendees}>
                    No one has scanned in yet.
                  </Text>
                ) : (
                  item.attendees.map((att, idx) => (
                    <View key={`${att.studentId}-${idx}`} style={styles.studentRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={COLORS.primary}
                      />

                      <Text style={styles.studentName}>
                        {att.studentName || shortId(att.studentId)}
                      </Text>
                    </View>
                  ))
                )}
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
      ) : (
        <FlatList
          data={studentRecords}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text style={styles.subtitle}>
              No records yet. Scan a QR code to register your attendance.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconBadge}>
                  <Ionicons name="checkmark-done-outline" size={26} color={COLORS.primary} />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.eventTitle}>{item.eventTitle}</Text>

                  <Text style={styles.eventMeta}>
                    {formatDate(item.scannedAt)}
                  </Text>

                  <Text style={styles.eventMeta}>Code: {item.eventId}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginTop: 24,
  },

  list: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  cardTop: {
    flexDirection: 'row',
  },

  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  eventMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  attendeeCount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  presentHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 10,
  },

  emptyAttendees: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  studentName: {
    fontSize: 16,
    color: COLORS.primaryDark,
    marginLeft: 10,
    flexShrink: 1,
  },
});