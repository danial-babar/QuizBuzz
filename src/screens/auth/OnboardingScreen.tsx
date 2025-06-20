import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext/ThemeContext';
import AppButton from '../../components/common/AppButton';
import { AUTH_ROUTES } from '../../constants/routes';

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: '1',
    title: 'Welcome to QuizBuzz',
    description: 'Test your knowledge and learn new things with our fun and engaging quizzes!',
    image: require('../../../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Challenge Yourself',
    description: 'Take quizzes on various topics and challenge yourself to beat your high score!',
    image: require('../../../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Compete with Friends',
    description: 'Share your scores and compete with friends to see who knows more!',
    image: require('../../../assets/images/onboarding3.png'),
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      // @ts-ignore
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to login screen when done
      // @ts-ignore
      navigation.navigate(AUTH_ROUTES.LOGIN);
    }
  };

  const skipOnboarding = () => {
    // @ts-ignore
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingSlides.map((_, index) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.skipButtonContainer}>
        <TouchableOpacity onPress={skipOnboarding}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
      
      <Animated.FlatList
        ref={slidesRef}
        data={onboardingSlides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        showsHorizontalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        {renderDots()}
        <AppButton
          title={currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          onPress={scrollTo}
          style={styles.button}
          variant="primary"
          icon={
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color="white" 
              style={styles.buttonIcon} 
            />
          }
        />
        
        {currentIndex === onboardingSlides.length - 1 && (
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>
              Already have an account? 
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN as never)}
            >
              <Text style={[styles.loginLink, { color: theme.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    marginBottom: 16,
    width: '100%',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
