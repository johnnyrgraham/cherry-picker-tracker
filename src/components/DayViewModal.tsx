import { X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { DayData } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme';

type DayViewModalProps = {
  dayData: DayData;
  onClose: () => void;
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function DayViewModal({ dayData, onClose }: DayViewModalProps) {
  const formattedDate = new Date(dayData.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{formattedDate}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            <ModalStat label="Total Buckets" value={`${dayData.bucketCount}`} />
            <ModalStat label="Gross Earnings" value={`$${dayData.earnings.gross}`} />
            <ModalStat
              label="Fastest Hour"
              value={`${dayData.fastestHour || 0}`}
              sublabel="buckets"
            />
            <ModalStat
              label="Fastest Bucket"
              value={dayData.fastestBucket ? formatTime(dayData.fastestBucket) : '--'}
              sublabel="min:sec"
              small
            />
          </View>

          <Pressable onPress={onClose} style={styles.closeCta}>
            <Text style={styles.closeCtaText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ModalStat({
  label,
  value,
  sublabel,
  small,
}: {
  label: string;
  value: string;
  sublabel?: string;
  small?: boolean;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statCard}>
        <Text style={[styles.statValue, small && styles.statValueSmall]}>{value}</Text>
      </View>
      {sublabel && <Text style={styles.statSublabel}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.black40,
    justifyContent: 'center',
    padding: spacing.screenPadding,
  },
  modal: {
    backgroundColor: colors.orange[400],
    borderRadius: radii['3xl'],
    padding: spacing.screenPadding,
    ...shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sectionMargin,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: radii.full,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: '47%',
  },
  statLabel: {
    fontSize: 12,
    color: colors.white70,
    textAlign: 'center',
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: colors.white10,
    borderRadius: radii['2xl'],
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
  },
  statValueSmall: {
    fontSize: 36,
  },
  statSublabel: {
    fontSize: 10,
    color: colors.white60,
    textAlign: 'center',
    marginTop: 4,
  },
  closeCta: {
    marginTop: spacing.sectionMargin,
    backgroundColor: colors.white20,
    borderRadius: radii['2xl'],
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeCtaText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
