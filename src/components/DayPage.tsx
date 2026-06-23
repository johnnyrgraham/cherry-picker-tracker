import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { DayData } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme';
import { StatCard } from './StatCard';

type DayPageProps = {
  date: string;
  existingData?: DayData;
  defaultBucketRate: number;
  onComplete: (date: string, data: DayData) => void;
  onBack: () => void;
};

type BucketLog = {
  timestamp: number;
  lapTime: number;
};

export function DayPage({
  date,
  defaultBucketRate,
  onComplete,
  onBack,
}: DayPageProps) {
  const [lapTime, setLapTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [dayStartTime, setDayStartTime] = useState(0);
  const [bucketLogs, setBucketLogs] = useState<BucketLog[]>([]);
  const [bucketRate, setBucketRate] = useState(defaultBucketRate);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState(defaultBucketRate.toString());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [finalBucketCount, setFinalBucketCount] = useState('');
  const [, setTick] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setLapTime(Date.now() - startTimeRef.current);
        setTick((t) => t + 1);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleCircleClick = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsRunning(true);
      const now = Date.now();
      setDayStartTime(now);
      startTimeRef.current = now;
    } else {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 300);
      setBucketLogs((prev) => [...prev, { timestamp: Date.now(), lapTime }]);
      startTimeRef.current = Date.now();
      setLapTime(0);
    }
  };

  const getBucketsInLastHour = () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return bucketLogs.filter((log) => log.timestamp >= oneHourAgo).length;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalElapsedTime = () => {
    if (!hasStarted) return 0;
    return Date.now() - dayStartTime;
  };

  const getFastestBucket = () => {
    if (bucketLogs.length === 0) return 0;
    const fastest = Math.min(...bucketLogs.map((log) => log.lapTime));
    return Math.floor(fastest / 1000);
  };

  const getFastestHour = () => {
    if (bucketLogs.length === 0) return 0;
    let maxBuckets = 0;
    bucketLogs.forEach((log) => {
      const oneHourLater = log.timestamp + 60 * 60 * 1000;
      const bucketsInHour = bucketLogs.filter(
        (l) => l.timestamp >= log.timestamp && l.timestamp < oneHourLater,
      ).length;
      maxBuckets = Math.max(maxBuckets, bucketsInHour);
    });
    return maxBuckets;
  };

  const handleDayComplete = () => {
    setShowCompletionModal(true);
    setIsRunning(false);
    setFinalBucketCount(bucketLogs.length.toString());
    const now = new Date();
    if (!finishTime) {
      setFinishTime(now.toTimeString().slice(0, 5));
    }
  };

  const handleSubmitCompletion = () => {
    Keyboard.dismiss();
    const buckets = parseInt(finalBucketCount, 10) || bucketLogs.length;
    const gross = buckets * bucketRate;
    const net = gross * 0.85;

    const data: DayData = {
      date,
      completed: true,
      earnings: {
        gross: parseFloat(gross.toFixed(2)),
        net: parseFloat(net.toFixed(2)),
      },
      bucketCount: buckets,
      fastestBucket: getFastestBucket(),
      fastestHour: getFastestHour(),
    };
    onComplete(date, data);
  };

  const handleSaveBucketRate = () => {
    const rate = parseFloat(rateInput);
    if (rate > 0) setBucketRate(rate);
    setIsEditingRate(false);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const currentGross = bucketLogs.length * bucketRate;

  const formatTimeInput = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }
    return digits;
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>{formattedDate}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Last Hour" value={`${getBucketsInLastHour()}`} />
          <StatCard label="Total Buckets" value={`${bucketLogs.length}`} />
          <StatCard label="Earnings" value={`$${currentGross.toFixed(0)}`} />
        </View>

        <View style={styles.timerSection}>
          <Pressable
            onPress={handleCircleClick}
            style={[styles.timerCircle, isPulsing && styles.timerPulsing]}
          >
            {!hasStarted ? (
              <>
                <Text style={styles.startTitle}>Start Day</Text>
                <Text style={styles.startSubtitle}>Tap to begin</Text>
              </>
            ) : (
              <>
                <Text style={styles.lapTime}>{formatTime(lapTime)}</Text>
                <Text style={styles.totalTime}>
                  Total: {formatTime(getTotalElapsedTime())}
                </Text>
                <Text style={styles.tapHint}>Tap to complete bucket</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.rateSection}>
            {isEditingRate ? (
              <View style={styles.rateEditCard}>
                <Text style={styles.rateLabel}>Bucket Rate</Text>
                <TextInput
                  value={rateInput}
                  onChangeText={setRateInput}
                  keyboardType="decimal-pad"
                  style={styles.rateInput}
                  autoFocus
                />
                <View style={styles.rateActions}>
                  <Pressable onPress={handleSaveBucketRate} style={styles.rateSave}>
                    <Text style={styles.rateSaveText}>Save</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setIsEditingRate(false);
                      setRateInput(bucketRate.toString());
                    }}
                    style={styles.rateCancel}
                  >
                    <Text style={styles.rateCancelText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable onPress={() => setIsEditingRate(true)} style={styles.rateButton}>
                <Text style={styles.rateLabel}>Bucket Rate</Text>
                <Text style={styles.rateValue}>${bucketRate}</Text>
              </Pressable>
            )}
          </View>

          <Pressable onPress={handleDayComplete} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete Day</Text>
          </Pressable>
        </View>

        <Modal visible={showCompletionModal} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Complete Your Day</Text>

                <Text style={styles.modalFieldLabel}>Start Time</Text>
                <TextInput
                  value={startTime}
                  onChangeText={(text) => setStartTime(formatTimeInput(text))}
                  placeholder="08:00"
                  placeholderTextColor={colors.white50}
                  keyboardType="number-pad"
                  maxLength={5}
                  style={styles.modalInput}
                />

                <Text style={styles.modalFieldLabel}>Finish Time</Text>
                <TextInput
                  value={finishTime}
                  onChangeText={(text) => setFinishTime(formatTimeInput(text))}
                  placeholder="17:00"
                  placeholderTextColor={colors.white50}
                  keyboardType="number-pad"
                  maxLength={5}
                  style={styles.modalInput}
                />

                <Text style={styles.modalFieldLabel}>Final Bucket Count</Text>
                <TextInput
                  value={finalBucketCount}
                  onChangeText={(text) =>
                    setFinalBucketCount(text.replace(/[^0-9]/g, '').slice(0, 3))
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                  placeholder="0"
                  placeholderTextColor={colors.white50}
                  style={styles.modalInput}
                />
                <Text style={styles.modalHint}>
                  Est. gross: $
                  {((parseInt(finalBucketCount, 10) || 0) * bucketRate).toFixed(2)}
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowCompletionModal(false);
                      setIsRunning(true);
                    }}
                    style={styles.modalCancel}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmitCompletion}
                    disabled={!finalBucketCount}
                    style={[styles.modalSubmit, !finalBucketCount && styles.modalSubmitDisabled]}
                  >
                    <Text
                      style={[
                        styles.modalSubmitText,
                        !finalBucketCount && styles.modalSubmitTextDisabled,
                      ]}
                    >
                      Complete
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.screenPadding,
    paddingBottom: spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: radii.full,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginBottom: 16,
  },
  timerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(253, 186, 116, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xl,
  },
  timerPulsing: {
    transform: [{ scale: 1.1 }],
  },
  startTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  startSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  lapTime: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 8,
  },
  totalTime: {
    fontSize: 12,
    color: colors.white60,
    marginBottom: 12,
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomControls: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  rateSection: {
    flex: 1,
  },
  rateButton: {
    borderRadius: radii.xl,
    padding: 12,
  },
  rateLabel: {
    fontSize: 10,
    color: colors.white60,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white70,
  },
  rateEditCard: {
    backgroundColor: colors.white10,
    borderRadius: radii.xl,
    padding: 12,
  },
  rateInput: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white30,
    backgroundColor: colors.white10,
    color: colors.white,
    fontSize: 14,
  },
  rateActions: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  rateSave: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.orange[700],
    borderRadius: 8,
  },
  rateSaveText: {
    fontSize: 12,
    color: colors.white,
  },
  rateCancel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.white20,
    borderRadius: 8,
  },
  rateCancelText: {
    fontSize: 12,
    color: colors.white,
  },
  completeButton: {
    flex: 1,
    backgroundColor: colors.orange[800],
    borderRadius: radii.xl,
    paddingVertical: 12,
    alignItems: 'center',
    ...shadows.lg,
  },
  completeButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.black50,
    justifyContent: 'center',
    padding: spacing.screenPadding,
  },
  modal: {
    backgroundColor: colors.orange[400],
    borderRadius: radii['3xl'],
    padding: spacing.screenPadding,
    ...shadows.xl,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sectionMargin,
  },
  modalFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    marginTop: 8,
  },
  modalInput: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.white20,
    backgroundColor: colors.white10,
    color: colors.white,
    fontSize: 16,
  },
  modalHint: {
    fontSize: 12,
    color: colors.white70,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.sectionMargin,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: colors.gray[200],
    borderRadius: radii.xl,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.gray[700],
    fontWeight: '500',
  },
  modalSubmit: {
    flex: 1,
    backgroundColor: colors.green[400],
    borderRadius: radii.xl,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitDisabled: {
    backgroundColor: colors.gray[200],
  },
  modalSubmitText: {
    color: colors.white,
    fontWeight: '700',
  },
  modalSubmitTextDisabled: {
    color: colors.gray[400],
  },
});