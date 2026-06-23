export type DayData = {
  date: string;
  completed: boolean;
  earnings: { gross: number; net: number };
  bucketCount: number;
  location?: string;
  fastestBucket?: number;
  fastestHour?: number;
};

export type SettingsData = {
  weekStart: string;
  weekEnd: string;
  payFrequency: 'weekly' | 'fortnightly';
  defaultBucketRate: number;
};

export type ViewName = 'dashboard' | 'settings' | 'day' | 'totals';
