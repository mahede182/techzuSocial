import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormProps } from '@/@types/forms';
import { Colors } from '@/constants/colors';

export default function Form({ title, subtitle, children }: FormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.formContent}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  formContent: {
    alignItems: 'center',
    width: '100%',
  },
});
