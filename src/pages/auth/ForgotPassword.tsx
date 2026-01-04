import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Hotel, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setIsSubmitted(true);
                toast({
                    title: 'Request Sent',
                    description: result.message,
                });
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
                        <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
                        <CardDescription>
                            {!isSubmitted
                                ? "Enter your email address and we'll send you a link to reset your password."
                                : "Check your email for the reset link."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-9"
                                        />
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-lg text-sm text-center">
                                    We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                                </div>
                                <div className="text-center text-sm text-muted-foreground">
                                    Did not receive the email? <button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline">Try again</button>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
