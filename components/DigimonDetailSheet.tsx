import { digimonIcons } from '@/constants/digimonIcons';
import { Image, Text, View } from 'react-native';
import { Theme } from '../constants/theme';

type DigimonStatus = 'caught' | 'living' | 'uncaught';

interface DigimonData {
  digimonNumber: number;
  timeStrangerNumber: number;
  name: string;
  generation: string;
  attribute: string;
  type: string;
  basePersonality: string;
}

interface DigimonDetailSheetProps {
  digimon: DigimonData | null;
  status: DigimonStatus;
  onClose: () => void;
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

export function DigimonDetailSheet({
  digimon,
  status,
}: DigimonDetailSheetProps) {
  if (!digimon) return null;

  return (
    <View
      style={{
        backgroundColor: Theme.colors.backgroundSecondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: Theme.spacing.md,
        paddingBottom: Theme.spacing.lg,
        flex: 1,
      }}
    >
      {/* Large Image Placeholder */}
      <View
        style={{
          height: 300,
          backgroundColor: getStatusColor(status),
          marginHorizontal: Theme.spacing.md,
          borderRadius: Theme.borderRadius.card,
          marginBottom: Theme.spacing.md,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 3,
          borderColor: getStatusBorder(status),
        }}
      >
        {/* <Text
          style={{
            color:
              status === 'caught' || status === 'living'
                ? Theme.colors.text.primary
                : Theme.colors.text.secondary,
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          {digimon.name}
        </Text>
        <Text
          style={{
            color:
              status === 'caught' || status === 'living'
                ? Theme.colors.text.tertiary
                : Theme.colors.text.tertiary,
            fontSize: 12,
            marginTop: Theme.spacing.xs,
          }}
        >
          Image Placeholder
        </Text> */}
        <Image
          source={digimonIcons[digimon?.timeStrangerNumber]}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      {/* Digimon Info */}
      <View style={{ paddingHorizontal: Theme.spacing.md }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Theme.spacing.md,
          }}
        >
          <Text
            style={{
              ...Theme.typography.h1,
              fontSize: 28,
            }}
          >
            {digimon.name}
          </Text>
          <View
            style={{
              backgroundColor: Theme.colors.badge.default,
              borderRadius: Theme.borderRadius.badge,
              paddingHorizontal: Theme.spacing.sm,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: Theme.colors.badge.text,
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              #{digimon.timeStrangerNumber}
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View>
          <InfoRow label="Digimon #" value={digimon.digimonNumber} />
          <InfoRow label="Generation" value={digimon.generation} />
          <InfoRow label="Attribute" value={digimon.attribute} />
          <InfoRow label="Type" value={digimon.type} />
          <InfoRow label="Base Personality" value={digimon.basePersonality} />
        </View>

        {/* Status Badge */}
        <View
          style={{
            marginTop: Theme.spacing.md,
            padding: Theme.spacing.md,
            backgroundColor: getStatusColor(status),
            borderRadius: Theme.borderRadius.card,
            borderWidth: 2,
            borderColor: getStatusBorder(status),
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color:
                getStatusColor(status) ===
                Theme.colors.status.uncaught.background
                  ? Theme.colors.text.primary
                  : '#1A1F3A',
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {status === 'uncaught' ? 'Not Caught' : status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.status.uncaught.background,
      }}
    >
      <Text
        style={{
          color: Theme.colors.text.secondary,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: Theme.colors.text.primary,
          fontSize: 14,
          fontWeight: '600',
        }}
      >
        {value}
      </Text>
    </View>
  );
}
