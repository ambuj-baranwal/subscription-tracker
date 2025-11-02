import { Form, redirect, useNavigation} from 'react-router-dom'
import {Button, Center, Paper, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {useState} from "react";
import {notifications} from "@mantine/notifications";
import {setAuthToken} from "../utils/auth.js";

// for now it is  exported and used in main.jsx refactor later
export const loginAction = async ({ request }) => {
    try {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        // --- Sample Mock API Call ---
        // for token = await api.login(email, password);
        if (email === 'test@test.com' && password === 'password') {
            const mockToken = 'dummy-token-12345';
            setAuthToken(mockToken); // Manually set token *before* redirecting

            notifications.show({
                title: 'Login Successful',
                message: 'Welcome back!',
                color: 'green',
            });
            // Redirecting to the dashboard
            return redirect('/');
        } else {
            throw new Error('Invalid email or password');
        }
        // --- End Mock ---

    } catch (error) {
        notifications.show({
            title: 'Login Failed',
            message: error.message,
            color: 'red',
        });
        // On error, return null (or error data) to stay on the page
        return null;
    }
};

const LoginPage = () => {

     // refactor later to use action state
    const navigate = useNavigation()
    const isSubmitting = navigate.state === 'submitting'
    return (
        <Center h="100vh">
            <Paper withBorder shadow="md" p={30} mt={30} radius="md" w={400}>
                <Title order={2} ta="center">Login</Title>

                {/* Using React Router's <Form> component */}
                <Form method="post">
                    <Stack>
                        <TextInput
                            label="Email"
                            placeholder="test@test.com"
                            name="email"
                            required
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="password"
                            name="password"
                            required
                        />
                        <Button type="submit" loading={isSubmitting} fullWidth>
                            Login
                        </Button>
                    </Stack>
                </Form>
            </Paper>
        </Center>
    )
}

export default LoginPage;