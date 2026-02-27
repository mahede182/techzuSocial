import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SectionTitleProps } from '@/@types/post';


export default function SectionTitle({ title, icon }: SectionTitleProps) {
    return (
        <View style={styles.sectionTitle}>
            <Ionicons name={icon} size={16} color={Colors.text} />
            <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    sectionTitleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
});
