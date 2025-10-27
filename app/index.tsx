import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DigimonCard } from '../components/DigimonCard';
import { DigimonDetailSheet } from '../components/DigimonDetailSheet';
import { StatButton } from '../components/StatButton';
import { Theme } from '../constants/theme';
import { DIGIMON_LIST } from '../data/DIGIMON_MASTER';

type DigimonStatus = 'caught' | 'living' | 'uncaught';
type FilterType = 'all' | 'caught' | 'living' | 'uncaught';

export default function Index() {
  // Constants
  const [digimonStatuses, setDigimonStatuses] = useState<
    Record<number, DigimonStatus>
  >({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDigimon, setSelectedDigimon] = useState<any>(null);

  // Refs
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Load saved statuses on mount
  useEffect(() => {
    loadStatuses();
  }, []);

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

  const handleLongPress = (digimon: any) => {
    bottomSheetRef.current?.snapToIndex(0);
    setSelectedDigimon(digimon);
  };

  const handleCloseDetailSheet = () => {
    bottomSheetRef?.current?.close();
  };

  // Filter digimon based on active filter
  const filteredDigimon = DIGIMON_LIST.filter((digimon) => {
    const status = digimonStatuses[digimon.digimonNumber] || 'uncaught';

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
  });

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
          }}
        >
          Digimon Field Guide
        </Text>
        {/* Stats Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: Theme.spacing.lg,
            marginHorizontal: Theme.spacing.md,
            gap: Theme.spacing.xs,
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
            paddingBottom: Theme.spacing.md,
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
        {/* Detail Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={['81%']}
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
