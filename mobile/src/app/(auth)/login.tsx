import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAppStore((state) => state.login);
    const authLoading = useAppStore((state) => state.authLoading);
    const authError = useAppStore((state) => state.authError);

    const handleLogin = async () => {
        if (!email || !password) return;

        await login({ email, password });

        const { token, authError: latestError } = useAppStore.getState();
        if (token && !latestError) {
            router.replace('/(tabs)');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Form 
                title="Welcome back" 
                subtitle="Sign in to continue"
            >
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                />
                {authError ? (
                    <Text style={styles.errorText}>{authError}</Text>
                ) : null}
                <Button
                    title="Log in"
                    onPress={handleLogin}
                    loading={authLoading}
                    disabled={!email || !password || authLoading}
                />
                <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text style={styles.linkText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </Form>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    errorText: {
        color: Colors.danger,
        marginTop: 8,
        textAlign: 'center',
    },
    linkButton: {
        marginTop: 20,
        padding: 10,
    },
    linkText: {
        color: Colors.primary,
        fontSize: 16,
        textAlign: 'center',
    },
});