import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 6/7/8 as base (375x667)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

export const deviceWidth = SCREEN_WIDTH;
export const deviceHeight = SCREEN_HEIGHT;

// Responsive width
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive height
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font size
export const fs = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Check if device is tablet
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

// Check if device is small phone
export const isSmallPhone = (): boolean => {
  return SCREEN_WIDTH <= 350;
};

// Responsive padding/margin
export const spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(12),
};

// Responsive border radius
export const borderRadius = {
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(6),
};

// Responsive icon sizes
export const iconSizes = {
  xs: wp(4),
  sm: wp(6),
  md: wp(8),
  lg: wp(10),
  xl: wp(12),
};

export default {
  wp,
  hp,
  fs,
  isTablet,
  isSmallPhone,
  spacing,
  borderRadius,
  iconSizes,
  deviceWidth,
  deviceHeight,
};
