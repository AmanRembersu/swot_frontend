import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiService, type User } from '@/lib/api';

interface AuthFormProps {
    onAuthSuccess: (user: User, token: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await apiService.login(formData.email, formData.password);
            } else {
                const age = parseInt(formData.age);
                if (isNaN(age) || age < 13 || age > 120) {
                    throw new Error('Please enter a valid age between 13 and 120');
                }
                response = await apiService.register(formData.name, formData.email, formData.password, age);
            }

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            onAuthSuccess(response.user, response.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '', age: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        SWOT Analysis
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={!isLogin}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                        Age
                                    </label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        required={!isLogin}
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="Enter your age"
                                        min="13"
                                        max="120"
                                        className="mt-1"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                minLength={6}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};