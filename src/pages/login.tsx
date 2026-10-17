import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginWithPassword } from '../api/auth';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // TanStack Query Mutation
    const { mutate, isPending, error } = useMutation({
        mutationFn: loginWithPassword,
    });

    const handleLogin = (e: React.SubmitEvent) => {
        e.preventDefault();
        mutate({ email, password });
    };

    // Toggle handling for showing/hiding password
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 4,
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                            Sign in to manage your account
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error.message}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isPending}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                                },
                            }}
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isPending}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isPending}
                            sx={{
                                mt: 1,
                                py: 1.5,
                                borderRadius: 2.5,
                                backgroundColor: '#4f46e5',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                                '&:hover': {
                                    backgroundColor: '#4338ca',
                                },
                            }}
                        >
                            {isPending ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
