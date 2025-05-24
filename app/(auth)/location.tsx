import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/images';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';

const LocationPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDetectLocation = async () => {
    try {
      setIsLoading(true);
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // TODO: Store location data in your app's state management
      console.log('Location:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address,
      });

      // Navigate to home screen after successful location detection
      router.replace('/(root)/(tabs)/home');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to detect location. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-between items-center">
      <View className="flex-1 w-full items-center justify-center">
        <Image
          source={images.locationPage}
          className="w-72 h-72 mt-10 mb-10"
          resizeMode="contain"
        />
        <TouchableOpacity 
          className="w-72 h-12 bg-orange-500 rounded-lg justify-center items-center mb-4"
          onPress={handleDetectLocation}
          disabled={isLoading}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? 'Detecting...' : 'Detect Location'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-72 h-12 bg-orange-500 rounded-lg justify-center items-center">
          <Text className="text-white text-base font-semibold">Enter Location Manually</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-gray-400 text-center mb-6 px-6">
        DFOOD WILL ACCESS YOUR LOCATION{"\n"}ONLY WHILE USING THE APP
      </Text>
    </SafeAreaView>
  );
};

export default LocationPage;
