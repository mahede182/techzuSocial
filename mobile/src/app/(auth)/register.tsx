import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import { Colors } from '@/constants/colors';
import { useAppStore } from '@/store/store';
import { validateRegisterForm } from '@/utils/validation';

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const register = useAppStore((state) => state.register);
    const authLoading = useAppStore((state) => state.authLoading);
    const authError = useAppStore((state) => state.authError);

    const clearValidation = () => setValidationError(null);

    const handleRegister = async () => {
        const error = validateRegisterForm(username, email, password);
        if (error) { setValidationError(error); return; }
        setValidationError(null);
        await register({ email, password, name: username });
        const { token, authError: latestError } = useAppStore.getState();
        if (token && !latestError) {
            router.replace('/(tabs)');
        }
    };

    const displayError = validationError ?? authError;

    return (
        <SafeAreaView style={styles.container}>
            <Form
                title="Create account"
                subtitle="Sign up to get started"
            >
                <Input
                    label="Username"
                    value={username}
                    onChangeText={(t) => { clearValidation(); setUsername(t); }}
                    placeholder="Enter your username"
                    autoCapitalize="words"
                />
                <Input
                    label="Email"
                    value={email}
                    onChangeText={(t) => { clearValidation(); setEmail(t); }}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    label="Password"
                    value={password}
                    onChangeText={(t) => { clearValidation(); setPassword(t); }}
                    placeholder="Enter your password"
                    secureTextEntry
                />
                {displayError ? (
                    <ErrorMessage message={displayError} />
                ) : null}
                <Button
                    title="Sign up"
                    onPress={handleRegister}
                    loading={authLoading}
                    disabled={!username || !email || !password || authLoading}
                />
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.linkText}>Already have an account? Log in</Text>
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