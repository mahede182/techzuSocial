import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProfileInfoProps } from '@/@types/post';

export default function ProfileInfo({ name, email, onEditProfile }: ProfileInfoProps) {
    return (
        <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            
            <TouchableOpacity 
                style={styles.editBtn} 
                activeOpacity={0.8}
                onPress={onEditProfile}
            >
                <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
    },
    email: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    editBtn: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
});
