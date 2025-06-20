import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabsParamList, RootStackParamList } from '../navigation/AppNavigator';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabsNavigationProp = NativeStackNavigationProp<MainTabsParamList>;
