import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../constants/theme';
import { getPopularCategories } from '../../constants/categories';
import { APP_ROUTES } from '../../constants/routes';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  const categories = getPopularCategories(12);

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    // @ts-ignore
    navigation.navigate(APP_ROUTES.CATEGORY_QUIZZES, { 
      categoryId, 
      title: categoryName 
    });
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.backgroundColor }]}
      onPress={() => handleCategoryPress(item.id, item.name)}
    >
      <Icon name={item.icon} size={32} color="white" />
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.quizCount}>{item.quizCount} Quizzes</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    margin: CARD_MARGIN / 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  quizCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CategoriesScreen;
