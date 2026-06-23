import { ChevronLeft, ChevronRight, Settings as SettingsIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DayData, SettingsData } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme';
import { DayBox } from './DayBox';
import { DayViewModal } from './DayViewModal';
import { StatCard } from './StatCard';

type DashboardProps = {
  daysData: Record<string, DayData>;
  settings: SettingsData;
  onDayClick: (date: string) => void;
  onSettingsClick: () => void;
  onTotalsClick: () => void;
};

const weekStartMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function getCurrentWeekDays(settings: SettingsData, offset: number = 0) {
  const today = new Date();
  const currentDay = today.getDay();
  const weekStart = weekStartMap[settings.weekStart] ?? 1;

  let daysToWeekStart = currentDay - weekStart;
  if (daysToWeekStart < 0) daysToWeekStart += 7;

  const weekStartDate = new Date(today);
  weekStartDate.setDate(today.getDate() - daysToWeekStart + offset * 7);
  weekStartDate.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + i);
    days.push(date);
  }

  return days;
}

function formatDate(date: Date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  return { weekday };
}

export function Dashboard({
  daysData,
  settings,
  onDayClick,
  onSettingsClick,
  onTotalsClick,
}: DashboardProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewingDay, setViewingDay] = useState<string | null>(null);

  const weekDays = getCurrentWeekDays(settings, weekOffset);

  const thisWeekTotals = weekDays.reduce(
    (acc, date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = daysData[dateStr];
      if (dayData?.completed) {
        acc.gross += dayData.earnings.gross;
        acc.net += dayData.earnings.net;
        acc.buckets += dayData.bucketCount;
      }
      return acc;
    },
    { gross: 0, net: 0, buckets: 0 },
  );

  const isCurrentWeek = weekOffset === 0;

  const weekLabel = isCurrentWeek
    ? 'This Week'
    : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ${weekOffset < 0 ? 'ago' : 'ahead'}`;

  const completedDays = weekDays
    .map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      return daysData[dateStr];
    })
    .filter((d): d is DayData => !!d?.completed)
    .reverse();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Week</Text>
        <Pressable onPress={onSettingsClick} style={styles.iconButton}>
          <SettingsIcon size={24} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Gross" value={`$${thisWeekTotals.gross}`} />
        <StatCard label="Net" value={`$${thisWeekTotals.net}`} />
        <StatCard label="Buckets" value={`${thisWeekTotals.buckets}`} />
      </View>

      <View style={styles.carousel}>
        <View style={styles.carouselHeader}>
          <Pressable
            onPress={() => setWeekOffset(weekOffset - 1)}
            style={styles.iconButton}
          >
            <ChevronLeft size={20} color={colors.white} />
          </Pressable>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          <Pressable
            onPress={() => setWeekOffset(weekOffset + 1)}
            style={styles.iconButton}
            disabled={weekOffset >= 0}
          >
            <ChevronRight
              size={20}
              color={weekOffset >= 0 ? colors.white30 : colors.white}
            />
          </Pressable>
        </View>

        <View style={styles.daysGrid}>
          {weekDays.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayData = daysData[dateStr];
            const { weekday } = formatDate(date);

            return (
              <DayBox
                key={dateStr}
                day={date.getDate()}
                weekday={weekday}
                dayData={dayData}
                onEdit={() => onDayClick(dateStr)}
                onView={() => setViewingDay(dateStr)}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.logSection}>
        {completedDays.length === 0 ? (
          <Text style={styles.logEmpty}>No completed days this week yet.</Text>
        ) : (
          completedDays.map((d) => {
            const label = new Date(d.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            return (
              <View key={d.date} style={styles.logRow}>
                <Text style={styles.logDay}>{label}</Text>
                <Text style={styles.logStat}>${Math.round(d.earnings.gross)}</Text>
                <Text style={styles.logStat}>{d.bucketCount}b</Text>
              </View>
            );
          })
        )}
      </View>

      <Pressable
        onPress={onTotalsClick}
        style={({ pressed }) => [styles.totalsButton, pressed && styles.totalsButtonPressed]}
      >
        <Text style={styles.totalsButtonText}>View All Totals</Text>
      </Pressable>

      {viewingDay && daysData[viewingDay] && (
        <DayViewModal
          dayData={daysData[viewingDay]}
          onClose={() => setViewingDay(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.screenPadding,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.headerMargin,
  },
  title: {
    ...typography.title,
    color: colors.white,
  },
  iconButton: {
    padding: 8,
    borderRadius: radii.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginBottom: spacing.sectionMargin,
  },
  carousel: {
    marginBottom: spacing.sectionMargin,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekLabel: {
    ...typography.subtitle,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  daysGrid: {
    flexDirection: 'row',
    gap: spacing.dayGap,
    alignItems: 'stretch',
  },
  totalsButton: {
    backgroundColor: colors.orange[700],
    borderRadius: radii['2xl'],
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.lg,
  },
  totalsButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  totalsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  logSection: {
    flex: 1,
    marginBottom: 16,
  },
  logEmpty: {
    color: colors.white50,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.white20,
  },
  logDay: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  logStat: {
    color: colors.white70,
    fontSize: 14,
    marginLeft: 12,
  },
});
