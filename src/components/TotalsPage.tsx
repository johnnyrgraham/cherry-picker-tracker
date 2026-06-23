import { ArrowLeft, DollarSign, Package, TrendingUp } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DayData } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme';

type TotalsPageProps = {
  daysData: Record<string, DayData>;
  onBack: () => void;
};

export function TotalsPage({ daysData, onBack }: TotalsPageProps) {
  const completedDays = Object.values(daysData).filter((day) => day.completed);

  const totals = completedDays.reduce(
    (acc, day) => {
      acc.gross += day.earnings.gross;
      acc.net += day.earnings.net;
      acc.buckets += day.bucketCount;
      return acc;
    },
    { gross: 0, net: 0, buckets: 0 },
  );

  const avgPerDay = {
    gross: completedDays.length ? totals.gross / completedDays.length : 0,
    net: completedDays.length ? totals.net / completedDays.length : 0,
    buckets: completedDays.length ? totals.buckets / completedDays.length : 0,
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.gray[600]} />
        </Pressable>
        <Text style={styles.title}>All Time Totals</Text>
      </View>

      <View style={styles.totalsSection}>
        <TotalCard
          icon={<DollarSign size={24} color={colors.white} />}
          label="Total Gross Earnings"
          value={`$${totals.gross.toFixed(2)}`}
          gradient={colors.green[500]}
        />
        <TotalCard
          icon={<TrendingUp size={24} color={colors.white} />}
          label="Total Net Earnings"
          value={`$${totals.net.toFixed(2)}`}
          gradient={colors.blue[500]}
        />
        <TotalCard
          icon={<Package size={24} color={colors.white} />}
          label="Total Buckets"
          value={`${totals.buckets}`}
          gradient={colors.purple[500]}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Averages</Text>
        <View style={styles.avgRow}>
          <View style={styles.avgItem}>
            <Text style={styles.avgLabel}>Gross</Text>
            <Text style={[styles.avgValue, { color: colors.green[600] }]}>
              ${avgPerDay.gross.toFixed(0)}
            </Text>
          </View>
          <View style={styles.avgItem}>
            <Text style={styles.avgLabel}>Net</Text>
            <Text style={[styles.avgValue, { color: colors.blue[600] }]}>
              ${avgPerDay.net.toFixed(0)}
            </Text>
          </View>
          <View style={styles.avgItem}>
            <Text style={styles.avgLabel}>Buckets</Text>
            <Text style={[styles.avgValue, { color: colors.purple[600] }]}>
              {avgPerDay.buckets.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overview</Text>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Days Completed</Text>
          <Text style={styles.overviewValue}>{completedDays.length}</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Average per Bucket</Text>
          <Text style={styles.overviewValue}>
            ${totals.buckets ? (totals.net / totals.buckets).toFixed(2) : '0.00'}
          </Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Expense Rate</Text>
          <Text style={styles.overviewValue}>
            {totals.gross
              ? (((totals.gross - totals.net) / totals.gross) * 100).toFixed(1)
              : '0'}
            %
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function TotalCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <View style={[styles.totalCard, { backgroundColor: gradient }]}>
      <View style={styles.totalCardHeader}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text style={styles.totalCardLabel}>{label}</Text>
      </View>
      <Text style={styles.totalCardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fef3e8',
  },
  container: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.headerMargin,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: radii.full,
  },
  title: {
    ...typography.title,
    color: colors.gray[800],
    marginLeft: 8,
  },
  totalsSection: {
    gap: 16,
    marginBottom: spacing.headerMargin,
  },
  totalCard: {
    borderRadius: radii['2xl'],
    padding: spacing.screenPadding,
    ...shadows.lg,
  },
  totalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconWrap: {
    padding: 8,
    backgroundColor: colors.white20,
    borderRadius: 8,
  },
  totalCardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  totalCardValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: radii['2xl'],
    padding: spacing.screenPadding,
    marginBottom: 16,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 16,
  },
  avgRow: {
    flexDirection: 'row',
    gap: 16,
  },
  avgItem: {
    flex: 1,
  },
  avgLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
  avgValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewLabel: {
    color: colors.gray[600],
  },
  overviewValue: {
    fontWeight: '700',
    color: colors.gray[800],
  },
});
