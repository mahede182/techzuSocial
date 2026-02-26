import { Colors } from "@/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    statItem: { alignItems: 'center' },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
})