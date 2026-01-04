import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Hotel, Eye, EyeOff, Lock } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            toast({
                title: 'Invalid Link',
                description: 'This password reset link is invalid or incomplete.',
                variant: 'destructive',
            });
        }
    }, [token, email, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !email) {
            toast({ title: 'Error', description: 'Missing token or email.', variant: 'destructive' });
            return;
        }

        if (password !== confirmPassword) {
            toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
            return;
        }

        if (password.length < 6) {
            toast({ title: 'Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPassword(password, token, email);
            if (result.success) {
                toast({
                    title: 'Success',
                    description: 'Your password has been successfully reset. You can now log in.',
                });
                navigate('/auth');
            } else {
                toast({
                    title: 'Error',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <Card className="border-border/50 shadow-xl">
                        <CardContent className="pt-6">
                            <p className="mb-4 text-destructive">Invalid or missing reset token.</p>
                            <Link to="/auth/forgot-password">
                                <Button variant="outline">Request New Link</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex flex-col items-center mb-8">
                    <Hotel className="w-12 h-12 text-primary mb-2" />
                    <span className="font-serif text-3xl font-bold tracking-wide text-foreground">MONIPEE</span>
                    <span className="text-xs tracking-[0.3em] uppercase text-primary">HOTEL</span>
                </Link>

                <Card className="border-border/50 shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-serif">Set New Password</CardTitle>
                        <CardDescription>Enter your new password below to update your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-9"
                                    />
                                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-9"
                                    />
                                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                                {isLoading ? 'Updating Password...' : 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
