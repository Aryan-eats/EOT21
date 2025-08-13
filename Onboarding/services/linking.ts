import { Linking } from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import { encode as btoa } from 'base-64';

const SECRET_KEY = 'your-secret-key'; // In production, use secure storage

export interface RiderData {
  name: string;
  phone: string;
  vehicleType: string;
  aadhar: string;
}

export const encryptRiderData = (data: RiderData): string => {
  const jsonData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
};

export const decryptRiderData = (encrypted: string): RiderData => {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const redirectToDeliveryApp = async (riderData: RiderData): Promise<void> => {
  try {
    const encryptedData = encryptRiderData(riderData);
    const encodedData = btoa(encryptedData);
    const deliveryAppUrl = `deliveryapp://signin?data=${encodedData}`;
    
    // Try opening the app directly first
    const canOpen = await Linking.canOpenURL(deliveryAppUrl);
    if (canOpen) {
      await Linking.openURL(deliveryAppUrl);
      return;
    }

    // Fallback to Play Store
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourdeliveryapp';
    await Linking.openURL(playStoreUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    // Fallback to Play Store if any error occurs
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourdeliveryapp';
    await Linking.openURL(playStoreUrl);
  }
};