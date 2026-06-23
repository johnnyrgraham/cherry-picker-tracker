import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SettingsData } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme';

type SettingsProps = {
  settings: SettingsData;
  onSettingsChange: (settings: SettingsData) => void;
  onBack: () => void;
};

const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function DayPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (day: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.pickerRow}>
        {weekDays.map((day) => (
          <Pressable
            key={day}
            onPress={() => onChange(day)}
            style={[styles.pickerOption, value === day && styles.pickerOptionActive]}
          >
            <Text
              style={[styles.pickerOptionText, value === day && styles.pickerOptionTextActive]}
            >
              {day.slice(0, 3)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function Settings({ settings, onSettingsChange, onBack }: SettingsProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.gray[600]} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <DayPicker
        label="Week Start Day"
        value={settings.weekStart}
        onChange={(weekStart) => onSettingsChange({ ...settings, weekStart })}
      />

      <DayPicker
        label="Week End Day"
        value={settings.weekEnd}
        onChange={(weekEnd) => onSettingsChange({ ...settings, weekEnd })}
      />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Pay Frequency</Text>
        <View style={styles.frequencyRow}>
          <Pressable
            onPress={() => onSettingsChange({ ...settings, payFrequency: 'weekly' })}
            style={[
              styles.frequencyButton,
              settings.payFrequency === 'weekly' && styles.frequencyButtonActive,
            ]}
          >
            <Text
              style={[
                styles.frequencyText,
                settings.payFrequency === 'weekly' && styles.frequencyTextActive,
              ]}
            >
              Weekly
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onSettingsChange({ ...settings, payFrequency: 'fortnightly' })}
            style={[
              styles.frequencyButton,
              settings.payFrequency === 'fortnightly' && styles.frequencyButtonActive,
            ]}
          >
            <Text
              style={[
                styles.frequencyText,
                settings.payFrequency === 'fortnightly' && styles.frequencyTextActive,
              ]}
            >
              Fortnightly
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Default Bucket Rate ($)</Text>
        <TextInput
          value={String(settings.defaultBucketRate)}
          onChangeText={(text) =>
            onSettingsChange({
              ...settings,
              defaultBucketRate: parseFloat(text) || 0,
            })
          }
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="50"
        />
      </View>

      <Pressable onPress={onBack} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </Pressable>
    </ScrollView>
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: radii['2xl'],
    padding: 20,
    marginBottom: spacing.sectionMargin,
    ...shadows.sm,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.xl,
    backgroundColor: colors.gray[100],
  },
  pickerOptionActive: {
    backgroundColor: colors.orange[500],
  },
  pickerOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  pickerOptionTextActive: {
    color: colors.white,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.xl,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: colors.blue[400],
  },
  frequencyText: {
    fontWeight: '500',
    color: colors.gray[600],
  },
  frequencyTextActive: {
    color: colors.white,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    fontSize: 16,
  },
  saveButton: {
    marginTop: spacing.sectionMargin,
    backgroundColor: colors.green[400],
    borderRadius: radii['2xl'],
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.lg,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
