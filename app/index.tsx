import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { expo } from '../app.json';
import { DigimonCard } from '../components/DigimonCard';
import { DigimonDetailSheet } from '../components/DigimonDetailSheet';
import { StatButton } from '../components/StatButton';
import { Theme } from '../constants/theme';
import { DIGIMON_LIST } from '../data/DIGIMON_MASTER';

type DigimonStatus = 'caught' | 'living' | 'uncaught';
type FilterType = 'all' | 'caught' | 'living' | 'uncaught';

export default function Index() {
  // State
  const [digimonStatuses, setDigimonStatuses] = useState<
    Record<number, DigimonStatus>
  >({});
  const [searchText, setSearchText] = useState<string | undefined>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDigimon, setSelectedDigimon] = useState<any>(null);

  // Constants
  const { version } = expo;

  // Refs
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Functions
  const loadStatuses = async () => {
    try {
      const savedData = await AsyncStorage.getItem('digimonStatuses');
      if (savedData) {
        setDigimonStatuses(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading statuses:', error);
    }
  };

  const saveStatuses = async (statuses: Record<number, DigimonStatus>) => {
    try {
      await AsyncStorage.setItem('digimonStatuses', JSON.stringify(statuses));
    } catch (error) {
      console.error('Error saving statuses:', error);
    }
  };

  const handleLongPress = (digimon: any) => {
    setSelectedDigimon(digimon);

    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 250);
  };

  const handleCardPress = (digimonNumber: number) => {
    const currentStatus = digimonStatuses[digimonNumber] || 'uncaught';
    let nextStatus: DigimonStatus;

    // Cycle through states: uncaught -> caught -> living -> uncaught
    switch (currentStatus) {
      case 'uncaught':
        nextStatus = 'caught';
        break;
      case 'caught':
        nextStatus = 'living';
        break;
      case 'living':
        nextStatus = 'uncaught';
        break;
      default:
        nextStatus = 'uncaught';
    }

    const updatedStatuses = {
      ...digimonStatuses,
      [digimonNumber]: nextStatus,
    };

    setDigimonStatuses(updatedStatuses);
    saveStatuses(updatedStatuses);
  };

  const handleCloseDetailSheet = () => {
    bottomSheetRef?.current?.close();
  };

  // Memos
  const filteredDigimon = React.useMemo(
    () =>
      DIGIMON_LIST.filter((digimon) => {
        const status = digimonStatuses[digimon.digimonNumber] || 'uncaught';

        if (searchText && /^\d+$/.test(searchText)) {
          if (digimon.digimonNumber !== Number(searchText)) return false;
        } else if (searchText) {
          if (!digimon.name.includes(searchText)) return false;
        }

        if (filter === 'all') return true;
        if (filter === 'caught') {
          return status === 'caught' || status === 'living';
        }
        if (filter === 'living') {
          return status === 'living';
        }
        if (filter === 'uncaught') {
          return status === 'uncaught';
        }
        return true;
      }),
    [digimonStatuses, filter, searchText]
  );

  // Effects
  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: Theme.spacing.xs,
        }}
      >
        <Text
          style={{
            ...Theme.typography.h1,
            marginVertical: Theme.spacing.md,
            textAlign: 'center',
            fontFamily: 'PixelDigivolve',
            paddingBottom: 0,
            marginBottom: 0,
          }}
        >
          Field Guide
        </Text>
        <Text
          style={{
            ...Theme.typography.h2,
            textAlign: 'center',
            fontFamily: 'PixelDigivolve',
            paddingTop: 0,
            marginTop: 0,
          }}
        >
          Digimon Story: Time Stranger
        </Text>
        <Text
          style={{
            fontSize: Theme.typography.cardTitle.fontSize,
            color: Theme.typography.h2.color,
            textAlign: 'center',
            fontFamily: 'PixelDigivolve',
            paddingTop: 0,
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          {`Version ${version}`}
        </Text>
        {/* Stats Section */}
        <LinearGradient
          colors={[Theme.colors.background, `${Theme.colors.background}01`]}
          style={{
            gap: Theme.spacing.xs,
            position: 'absolute',
            paddingHorizontal: 20,
            marginTop: '22.5%',
            zIndex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: Theme.colors.backgroundSecondary,
              width: '80%',
              height: 44,
              borderRadius: Theme.borderRadius.card,
              paddingHorizontal: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialIcons
              name="search"
              size={24}
              color={Theme.colors.background}
            />
            <TextInput
              value={searchText}
              onChangeText={(val) => setSearchText(val)}
              style={{
                ...Theme.typography.cardTitle,
                fontSize: 12,
                color: Theme.colors.text.secondary,
                flex: 1,
                paddingHorizontal: 4,
              }}
              placeholder="Search for digimon..."
              placeholderTextColor={Theme.colors.text.tertiary}
              autoCapitalize={'words'}
              autoCorrect={false}
              spellCheck={false}
            />
            <Pressable
              onPress={() => {
                setSearchText(undefined);
              }}
            >
              <MaterialIcons
                name="clear"
                size={24}
                color={Theme.colors.background}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingTop: 8,
            }}
          >
            <StatButton
              label="Caught"
              count={
                Object.values(digimonStatuses).filter(
                  (s) => s === 'caught' || s === 'living'
                ).length
              }
              total={DIGIMON_LIST.length}
              percentage={Math.round(
                (Object.values(digimonStatuses).filter(
                  (s) => s === 'caught' || s === 'living'
                ).length /
                  DIGIMON_LIST.length) *
                  100 || 0
              )}
              color={Theme.colors.status.caught.accent}
              isActive={filter === 'caught'}
              filterType={filter}
              onPress={() => setFilter(filter === 'caught' ? 'all' : 'caught')}
            />

            <StatButton
              label="Living"
              count={
                Object.values(digimonStatuses).filter((s) => s === 'living')
                  .length
              }
              total={DIGIMON_LIST.length}
              percentage={Math.round(
                (Object.values(digimonStatuses).filter((s) => s === 'living')
                  .length /
                  DIGIMON_LIST.length) *
                  100 || 0
              )}
              color={Theme.colors.status.living.accent}
              isActive={filter === 'living'}
              filterType={filter}
              onPress={() => setFilter(filter === 'living' ? 'all' : 'living')}
            />

            <StatButton
              label="Uncaught"
              count={(() => {
                const caughtOrLiving = Object.values(digimonStatuses).filter(
                  (s) => s === 'caught' || s === 'living'
                ).length;
                return DIGIMON_LIST.length - caughtOrLiving;
              })()}
              total={DIGIMON_LIST.length}
              percentage={(() => {
                const caughtOrLiving = Object.values(digimonStatuses).filter(
                  (s) => s === 'caught' || s === 'living'
                ).length;
                const uncaughtCount = DIGIMON_LIST.length - caughtOrLiving;
                return Math.round(
                  (uncaughtCount / DIGIMON_LIST.length) * 100 || 0
                );
              })()}
              color={Theme.colors.text.secondary}
              isActive={filter === 'uncaught'}
              filterType={filter}
              onPress={() =>
                setFilter(filter === 'uncaught' ? 'all' : 'uncaught')
              }
            />
          </View>
        </LinearGradient>
        <FlatList
          data={filteredDigimon}
          numColumns={4}
          keyExtractor={(item) => item.digimonNumber.toString()}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            paddingHorizontal: Theme.spacing.xs,
          }}
          contentContainerStyle={{
            paddingTop: '33.3%',
          }}
          renderItem={({ item }) => {
            const status = digimonStatuses[item.digimonNumber] || 'uncaught';
            return (
              <DigimonCard
                digimonNumber={item.digimonNumber}
                timeStrangerNumber={item.timeStrangerNumber}
                name={item.name}
                status={status}
                onPress={handleCardPress}
                onLongPress={() => handleLongPress(item)}
              />
            );
          }}
        />
        <LinearGradient
          colors={[`${Theme.colors.background}01`, Theme.colors.background]}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: Theme.spacing.xs,
            position: 'absolute',
            height: 67,
            bottom: 0,
            zIndex: 2,
            width: '100%',
          }}
          pointerEvents="none"
        />
        {/* Detail Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={['72.5%']}
          enablePanDownToClose
          enableDynamicSizing={false}
          index={-1}
          backgroundStyle={{
            backgroundColor: Theme.colors.backgroundSecondary,
          }}
        >
          <BottomSheetView>
            <DigimonDetailSheet
              digimon={selectedDigimon}
              status={
                selectedDigimon
                  ? digimonStatuses[selectedDigimon.digimonNumber] || 'uncaught'
                  : 'uncaught'
              }
              onClose={handleCloseDetailSheet}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
