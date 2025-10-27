import { digimonIcons } from '@/constants/digimonIcons';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import { Theme } from '../constants/theme';

type DigimonStatus = 'caught' | 'living' | 'uncaught';

interface DigimonCardProps {
  digimonNumber: number;
  timeStrangerNumber: number;
  name: string;
  status: DigimonStatus;
  onPress: (digimonNumber: number) => void;
  onLongPress?: () => void;
}

const getStatusColor = (status: DigimonStatus | undefined) => {
  switch (status) {
    case 'caught':
      return Theme.colors.status.caught.background;
    case 'living':
      return Theme.colors.status.living.background;
    case 'uncaught':
    default:
      return Theme.colors.status.uncaught.background;
  }
};

const getStatusBorder = (status: DigimonStatus | undefined) => {
  switch (status) {
    case 'caught':
      return Theme.colors.status.caught.border;
    case 'living':
      return Theme.colors.status.living.border;
    case 'uncaught':
    default:
      return Theme.colors.status.uncaught.border;
  }
};

const getStatusTextColor = (status: DigimonStatus | undefined) => {
  switch (status) {
    case 'caught':
    case 'living':
      return '#1A1F3A';
    case 'uncaught':
    default:
      return Theme.colors.text.primary;
  }
};

export function DigimonCard({
  digimonNumber,
  timeStrangerNumber,
  name,
  status,
  onPress,
  onLongPress,
}: DigimonCardProps) {
  return (
    <Pressable
      style={{
        backgroundColor: Theme.colors.status[status].background,
        borderRadius: Theme.borderRadius.card,
        width:
          (Dimensions.get('window').width - Theme.spacing.md) / 4 -
          Theme.spacing.xs,
        height:
          (Dimensions.get('window').width - Theme.spacing.md) / 4 -
          Theme.spacing.xs,
        margin: Theme.spacing.xs / 2,
        ...Theme.shadow.card,
        overflow: 'hidden',
        ...Theme.border.card,
        borderColor: getStatusBorder(status),
      }}
      onPress={() => onPress(digimonNumber)}
      onLongPress={onLongPress}
    >
      {/* Status Indicator Bar */}
      <View
        style={{
          height: 4,
          backgroundColor: getStatusColor(status),
          width: '100%',
        }}
      />

      {/* Badge for timeStrangerNumber */}
      <View
        style={{
          position: 'absolute',
          top: Theme.spacing.xs,
          left: Theme.spacing.xs,
          backgroundColor: Theme.colors.badge.default,
          borderRadius: Theme.borderRadius.badge,
          paddingHorizontal: Theme.spacing.xs,
          paddingVertical: 2,
          zIndex: 1,
        }}
      >
        <Text
          style={{
            ...Theme.typography.cardNumber,
            color: Theme.colors.badge.text,
          }}
        >
          #{timeStrangerNumber}
        </Text>
      </View>

      {/* Image placeholder area */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: Theme.spacing.sm,
          paddingHorizontal: Theme.spacing.xs,
        }}
      >
        {/* Placeholder for future image */}
        <View
          style={{
            width: '100%',
            height: '70%',
            backgroundColor: getStatusColor(status),
            borderRadius: 8,
            opacity: 0.3,
          }}
        >
          <Image
            source={digimonIcons[timeStrangerNumber]}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      {/* Digimon Name */}
      <View
        style={{
          paddingBottom: Theme.spacing.xs,
          paddingHorizontal: Theme.spacing.xs,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            ...Theme.typography.cardTitle,
            color: getStatusTextColor(status),
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {name}
        </Text>
      </View>
    </Pressable>
  );
}
