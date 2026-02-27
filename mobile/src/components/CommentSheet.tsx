import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import BottomSheet, {
    BottomSheetFlatList,
    BottomSheetTextInput,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';
import { timeAgo } from '@/utils/date';

interface CommentSheetProps {
    postId: string | null;
    onClose: () => void;
}

export default function CommentSheet({ postId, onClose }: CommentSheetProps) {
    const { commentsByPostId, commentsLoadingByPostId, loadComments, addComment } =
        useAppStore((state) => state);

    const sheetRef = useRef<BottomSheet>(null);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const comments = postId ? (commentsByPostId[postId] ?? []) : [];
    const loading = postId ? (commentsLoadingByPostId[postId] ?? false) : false;

    useEffect(() => {
        if (postId) {
            sheetRef.current?.expand();
            loadComments(postId);
        } else {
            sheetRef.current?.close();
        }
    }, [postId]);

    const handleSubmit = async () => {
        if (!postId || !text.trim()) return;
        setSubmitting(true);
        await addComment(postId, text.trim());
        setText('');
        setSubmitting(false);
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                onPress={onClose}
            />
        ),
        [onClose],
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={['50%', '85%']}
            enablePanDownToClose
            onClose={onClose}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={styles.handle}
            backgroundStyle={styles.background}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <View style={styles.header}>
                <Text style={styles.title}>Comments</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                    <Ionicons name="close" size={22} color={Colors.text} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
                <BottomSheetTextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Write a comment..."
                    placeholderTextColor={Colors.textSecondary}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendBtn, (!text.trim() || submitting) && styles.sendDisabled]}
                    onPress={handleSubmit}
                    disabled={!text.trim() || submitting}
                    activeOpacity={0.7}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color={Colors.background} />
                    ) : (
                        <Ionicons name="arrow-up" size={18} color={Colors.background} />
                    )}
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator style={styles.loader} color={Colors.primary} />
            ) : (
                <BottomSheetFlatList
                    data={comments}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.commentRow}>
                            <Avatar name={item.userId?.name ?? 'Unknown'} size={32} />
                            <View style={styles.commentBody}>
                                <View style={styles.commentMeta}>
                                    <Text style={styles.commentAuthor}>
                                        {item.userId?.name ?? 'Unknown'}
                                    </Text>
                                    <Text style={styles.commentTime}>
                                        {timeAgo(item.createdAt)}
                                    </Text>
                                </View>
                                <Text style={styles.commentText}>{item.text}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    handle: {
        backgroundColor: Colors.border,
        width: 40,
    },
    background: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    loader: {
        marginTop: 40,
    },
    list: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexGrow: 1,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 14,
        marginTop: 24,
    },
    commentRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },
    commentBody: {
        flex: 1,
    },
    commentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    commentAuthor: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text,
    },
    commentTime: {
        fontSize: 11,
        color: Colors.textSecondary,
    },
    commentText: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: Colors.text,
        backgroundColor: Colors.background,
        maxHeight: 100,
    },
    sendBtn: {
        backgroundColor: Colors.primary,
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendDisabled: {
        backgroundColor: Colors.textSecondary,
    },
});
