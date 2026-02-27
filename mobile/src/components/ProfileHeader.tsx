import React from 'react';
import { View, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import ProfileStats from './ProfileStats';
import ProfileInfo from './ProfileInfo';
import SectionTitle from './SectionTitle';
import { Colors } from '@/constants/colors';
import { ProfileHeaderProps } from '@/@types/post';

export default function ProfileHeader({
    userName,
    userEmail,
    postsCount,
    likesCount,
    commentsCount,
    onEditProfile
}: ProfileHeaderProps) {
    return (
        <View style={styles.profileHeader}>
            <View style={styles.avatarRow}>
                <Avatar name={userName} size={72} />
                <ProfileStats 
                    postsCount={postsCount}
                    likesCount={likesCount}
                    commentsCount={commentsCount}
                />
            </View>

            <ProfileInfo 
                name={userName}
                email={userEmail}
                onEditProfile={onEditProfile}
            />

            <SectionTitle title="My Posts" icon="grid-outline" />
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginBottom: 12,
    },
});
