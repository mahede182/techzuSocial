import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { MAX_CHARS } from '@/constants/data';

export default function CreatePostScreen() {
    const router = useRouter();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const remaining = MAX_CHARS - text.length;
    const canPost = text.trim().length > 0 && remaining >= 0;

    const handlePost = async () => {
        if (!canPost) return;
        setLoading(true);
        try {
            // await createPost(text.trim());
            setText('');
            Toast.show({
                type: 'success',
                text1: 'Post created!',
                text2: 'Your post is now visible on the feed.',
            });
            router.replace('/(tabs)');
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to create post. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn} activeOpacity={0.7}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>New Post</Text>
                    <TouchableOpacity
                        style={[styles.postBtn, !canPost && styles.postBtnDisabled]}
                        onPress={handlePost}
                        disabled={!canPost || loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.background} size="small" />
                        ) : (
                            <Text style={styles.postBtnText}>Post</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.body}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputCard}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="What's on your mind?"
                            placeholderTextColor={Colors.textSecondary}
                            value={text}
                            onChangeText={setText}
                            multiline
                            maxLength={MAX_CHARS}
                            autoFocus
                            textAlignVertical="top"
                        />
                        <Text style={[styles.charCounter, remaining < 50 && styles.charCounterWarn]}>
                            {remaining}
                        </Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.tipText}>Posts are public and visible to everyone.</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    cancelBtn: {
        padding: 4,
        minWidth: 60,
    },
    cancelText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    postBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 18,
        paddingVertical: 7,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    postBtnDisabled: {
        backgroundColor: Colors.border,
    },
    postBtnText: {
        color: Colors.background,
        fontWeight: '600',
        fontSize: 15,
    },
    body: {
        padding: 16,
        paddingBottom: 40,
    },
    inputCard: {
        backgroundColor: Colors.background,
        borderRadius: 14,
        padding: 16,
        minHeight: 180,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    textInput: {
        fontSize: 16,
        color: Colors.text,
        lineHeight: 24,
        minHeight: 130,
    },
    charCounter: {
        textAlign: 'right',
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    charCounterWarn: {
        color: Colors.danger,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 14,
        paddingHorizontal: 4,
    },
    tipText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});