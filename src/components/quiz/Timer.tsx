import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../constants/colors';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  autoStart?: boolean;
  format?: 'mm:ss' | 'ss';
  style?: ViewStyle;
  textStyle?: TextStyle;
  warningThreshold?: number; // seconds remaining to show warning
  showProgressBar?: boolean;
  progressBarColor?: string;
  progressBarTrackColor?: string;
  progressBarThickness?: number;
}

const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  autoStart = true,
  format = 'mm:ss',
  style,
  textStyle,
  warningThreshold = 10,
  showProgressBar = true,
  progressBarColor = colors.primary,
  progressBarTrackColor = '#f0f0f0',
  progressBarThickness = 4,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const progressAnim = useRef(new Animated.Value(100)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as mm:ss or ss
  const formatTime = (seconds: number) => {
    if (format === 'ss') {
      return seconds.toString().padStart(2, '0');
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start or pause the timer
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    progressAnim.setValue(100);
  };

  // Start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Pause the timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Animate the progress bar
  const animateProgress = (toValue: number, duration: number) => {
    Animated.timing(progressAnim, {
      toValue,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && onTimeUp) {
      onTimeUp();
      setIsRunning(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  // Animate progress when time changes
  useEffect(() => {
    const progress = (timeLeft / initialTime) * 100;
    const timeElapsed = initialTime - timeLeft;
    const duration = timeElapsed > 0 ? 1000 : 0; // Animate over 1 second for each tick
    
    animateProgress(progress, duration);
  }, [timeLeft, initialTime]);

  // Determine text color based on time left
  const getTextColor = () => {
    if (timeLeft <= warningThreshold) {
      return colors.error;
    }
    return colors.text;
  };

  const progress = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <Text 
        style={[
          styles.timerText, 
          { color: getTextColor() },
          textStyle
        ]}
      >
        {formatTime(timeLeft)}
      </Text>
      
      {showProgressBar && (
        <View style={[
          styles.progressBarTrack,
          { 
            backgroundColor: progressBarTrackColor,
            height: progressBarThickness,
            borderRadius: progressBarThickness / 2,
          }
        ]}>
          <Animated.View 
            style={[
              styles.progressBar,
              { 
                width: progress,
                backgroundColor: progressBarColor,
                height: progressBarThickness,
                borderRadius: progressBarThickness / 2,
              }
            ]} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'], // Monospaced numbers for smoother updates
  },
  progressBarTrack: {
    width: '100%',
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
  },
});

export default Timer;
