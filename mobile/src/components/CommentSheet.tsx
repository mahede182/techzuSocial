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
import CommentItem from './CommentItem';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';
import type { Comment } from '@/@types/post';

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

    const renderItem = useCallback(
        ({ item }: { item: Comment }) => <CommentItem item={item} />,
        [],
    );

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
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
                    }
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
