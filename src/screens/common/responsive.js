import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const wp = (percentage) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

export const hp = (percentage) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};