import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '../theme';

type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.card}>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.white70,
    textAlign: 'center',
    marginBottom: spacing.labelMargin,
  },
  card: {
    backgroundColor: colors.white10,
    borderRadius: radii['2xl'],
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  value: {
    ...typography.statValue,
    color: colors.white,
    fontSize: 22,
  },
});