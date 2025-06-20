import React from 'react';
import { View, Text, StyleSheet, Animated, Easing, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../constants/colors';

interface ScoreBarProps {
  currentScore: number;
  maxScore: number;
  minScore?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  height?: number;
  width?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  barStyle?: ViewStyle;
  labelStyle?: TextStyle;
  showGradient?: boolean;
  gradientColors?: string[];
  animationDuration?: number;
  showStripes?: boolean;
  stripeWidth?: number;
  stripeColor?: string;
  showThresholds?: boolean;
  passingThreshold?: number;
  excellentThreshold?: number;
  thresholdLabelStyle?: TextStyle;
}

const ScoreBar: React.FC<ScoreBarProps> = ({
  currentScore,
  maxScore,
  minScore = 0,
  showLabels = true,
  showPercentage = true,
  height = 20,
  width = '100%',
  borderRadius = 4,
  style,
  barStyle,
  labelStyle,
  showGradient = true,
  gradientColors = [colors.success, colors.warning, colors.error],
  animationDuration = 1000,
  showStripes = false,
  stripeWidth = 10,
  stripeColor = 'rgba(255, 255, 255, 0.3)',
  showThresholds = false,
  passingThreshold = 60,
  excellentThreshold = 85,
  thresholdLabelStyle,
}) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = React.useState(0);
  
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, 
    ((currentScore - minScore) / (maxScore - minScore)) * 100
  ));
  
  // Animate the progress bar
  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentScore, maxScore, minScore]);

  // Get the width of the progress bar as an Animated value
  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  
  // Generate stripes pattern
  const renderStripes = () => {
    if (!showStripes) return null;
    
    const stripes = [];
    const stripeCount = Math.ceil(containerWidth / (stripeWidth * 2));
    
    for (let i = 0; i < stripeCount; i++) {
      stripes.push(
        <View
          key={i}
          style={[
            styles.stripe,
            {
              width: stripeWidth,
              backgroundColor: stripeColor,
              left: i * (stripeWidth * 2),
            },
          ]}
        />
      );
    }
    
    return (
      <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
        {stripes}
      </View>
    );
  };
  
  // Render threshold markers
  const renderThresholds = () => {
    if (!showThresholds) return null;
    
    return (
      <View style={styles.thresholdsContainer}>
        <View style={[styles.threshold, { left: `${passingThreshold}%` }]}>
          <View style={[styles.thresholdLine, { backgroundColor: colors.warning }]} />
          <Text style={[styles.thresholdLabel, thresholdLabelStyle]}>
            Pass: {passingThreshold}%
          </Text>
        </View>
        <View style={[styles.threshold, { left: `${excellentThreshold}%` }]}>
          <View style={[styles.thresholdLine, { backgroundColor: colors.success }]} />
          <Text style={[styles.thresholdLabel, thresholdLabelStyle]}>
            Excellent: {excellentThreshold}%
          </Text>
        </View>
      </View>
    );
  };

  // Get the color for the current score
  const getScoreColor = () => {
    if (percentage >= excellentThreshold) return colors.success;
    if (percentage >= passingThreshold) return colors.warning;
    return colors.error;
  };

  return (
    <View style={[styles.container, style]}>
      {showLabels && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            Score: {currentScore}/{maxScore}
            {showPercentage && ` (${Math.round(percentage)}%)`}
          </Text>
          <Text style={[styles.scoreLabel, { color: getScoreColor() }]}>
            {percentage >= excellentThreshold 
              ? 'Excellent!'
              : percentage >= passingThreshold 
                ? 'Good!'
                : 'Keep trying!'}
          </Text>
        </View>
      )}
      
      <View 
        style={[
          styles.barContainer, 
          { 
            height, 
            width, 
            borderRadius,
            backgroundColor: colors.background,
          },
          barStyle,
        ]}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: animatedWidth,
              height: '100%',
              borderRadius,
              backgroundColor: getScoreColor(),
            },
            showGradient && {
              backgroundColor: 'transparent',
            },
          ]}
        >
          {showGradient && (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[StyleSheet.absoluteFill, { borderRadius }]}
            />
          )}
          {renderStripes()}
        </Animated.View>
        
        {renderThresholds()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'relative',
  },
  stripe: {
    position: 'absolute',
    height: '100%',
    transform: [{ skewX: '-45deg' }],
  },
  thresholdsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  threshold: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
    width: 1,
  },
  thresholdLine: {
    width: 1,
    height: 20,
  },
  thresholdLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'center',
    minWidth: 80,
    marginLeft: -40,
  },
});

export default ScoreBar;
