import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DayData } from '../types';
import { colors, radii, shadows, typography } from '../theme';

type DayBoxProps = {
  day: number;
  weekday: string;
  dayData?: DayData;
  onEdit: () => void;
  onView: () => void;
};

export function DayBox({ weekday, dayData, onEdit, onView }: DayBoxProps) {
  const isCompleted = dayData?.completed;

  if (!isCompleted) {
    return (
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [styles.emptyBox, pressed && styles.pressed]}
      >
        <Plus size={16} color={colors.white50} strokeWidth={2} />
        <Text style={styles.weekdaySmall}>{weekday}</Text>
      </Pressable>
    );
  }

  const grossStr = `$${Math.round(dayData.earnings.gross)}`;

  return (
    <Pressable
      onPress={onView}
      style={({ pressed }) => [styles.filledBox, pressed && styles.filledPressed]}
    >
      <Text style={styles.weekdayBold}>{weekday}</Text>
      <Text style={styles.earnings} numberOfLines={1} adjustsFontSizeToFit>
        {grossStr}
      </Text>
      <Text style={styles.bucketCount}>{dayData.bucketCount}b</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emptyBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.white20,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.white30,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  weekdaySmall: {
    fontSize: 9,
    color: colors.white60,
    marginTop: 2,
  },
  filledBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.orange900_40,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    ...shadows.md,
  },
  filledPressed: {
    backgroundColor: colors.orange900_50,
    transform: [{ scale: 0.95 }],
  },
  weekdayBold: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  earnings: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    textAlign: 'center',
  },
  bucketCount: {
    fontSize: 9,
    color: colors.white70,
  },
});