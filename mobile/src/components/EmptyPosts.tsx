import React from "react";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const EmptyPosts = () => {
    return (
        <View style={styles.center}>
            <Ionicons name="newspaper-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubText}>Be the first to share something!</Text>
        </View>
    )
}

export default EmptyPosts;

const styles = StyleSheet.create({
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        gap: 8,
    }
})