import { Pressable, Text } from 'react-native';
import { Theme } from '../constants/theme';

interface StatButtonProps {
  label: string;
  count: number;
  total: number;
  percentage: number;
  color: string;
  isActive: boolean;
  filterType: string;
  onPress: () => void;
}

export function StatButton({
  label,
  count,
  total,
  percentage,
  color,
  isActive,
  filterType,
  onPress,
}: StatButtonProps) {
  return (
    <Pressable
      style={{
        alignItems: 'center',
        backgroundColor: Theme.colors.backgroundSecondary,
        paddingVertical: Theme.spacing.sm,
        paddingHorizontal: Theme.spacing.md,
        borderRadius: Theme.borderRadius.card,
        ...Theme.shadow.card,
        flex: 1,
        marginHorizontal: Theme.spacing.xs,
        borderWidth: 3,
        borderColor: isActive ? color : 'transparent',
        opacity: isActive ? 1 : filterType === 'all' ? 1 : 0.6,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 12,
          color: Theme.colors.text.secondary,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: color,
        }}
      >
        {count}/{total}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: Theme.colors.text.secondary,
        }}
      >
        {percentage}%
      </Text>
    </Pressable>
  );
}
