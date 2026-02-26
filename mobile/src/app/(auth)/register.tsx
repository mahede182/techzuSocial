import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Colors } from '@/constants/colors';

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) return;
        
        setLoading(true);
        // Simulate registration process
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Form 
                title="Create account" 
                subtitle="Sign up to get started"
            >
                <Input
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    autoCapitalize="words"
                />
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
                <Button
                    title="Sign up"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={!username || !email || !password}
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