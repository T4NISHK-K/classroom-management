import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Layers, Sparkles, Lock, User, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuthStore();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (auth.authenticated) {
      navigate('/');
    }
  }, [auth.authenticated, navigate]);

  const [username_email, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'faculty'>('admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.auth.login(username_email, password, role);
      if (response.success && response.data) {
        auth.setAuth(response.data);
        toast.success(`Welcome, ${response.data.username}!`);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } else {
        toast.error(response.error || 'Invalid credentials');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Enhanced gradient mesh with animated elements - matching dashboard */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/[0.03] via-transparent to-transparent animate-gradient-animate" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/[0.03] via-transparent to-transparent animate-gradient-animate" style={{ animationDelay: '1s' }} />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet/5 rounded-full blur-3xl animate-breathe" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      </div>

      {/* Glassmorphism Login Card */}
      <div className="w-full max-w-md animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div className="relative">
          {/* Glassmorphism Card Container */}
          <div className="relative backdrop-blur-xl bg-card/70 border border-border/50 rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
            
            {/* Card Content */}
            <div className="relative z-10">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6 space-y-4">
                {/* Logo/Icon */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl blur-xl opacity-30 animate-pulse-glow" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 animate-float">
                      <Layers className="w-8 h-8 text-primary-foreground relative z-10" strokeWidth={1.5} />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold tracking-tight relative inline-block">
                    <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                      SmartClass
                    </span>
                    <Sparkles className="absolute -top-1 -right-8 w-5 h-5 text-primary animate-sparkle opacity-70" />
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Sign in to your account
                  </p>
                </div>
              </div>
              
              {/* Form Section */}
              <div className="px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username/Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username_email" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Username or Email
                    </Label>
                    <div className="relative group">
                      {/* Glassmorphism Input Container */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                      <Input
                        id="username_email"
                        type="text"
                        value={username_email}
                        onChange={(e) => setUsernameEmail(e.target.value)}
                        placeholder="Enter username or email"
                        required
                        autoFocus
                        className="relative h-12 bg-background/40 backdrop-blur-sm border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
                      />
                      {/* Focus glow */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      Password
                    </Label>
                    <div className="relative group">
                      {/* Glassmorphism Input Container */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="relative h-12 bg-background/40 backdrop-blur-sm border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
                      />
                      {/* Focus glow */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      Role
                    </Label>
                    <RadioGroup 
                      value={role} 
                      onValueChange={(v) => setRole(v as 'admin' | 'faculty')}
                      className="grid grid-cols-2 gap-3"
                    >
                      {/* Admin Role Card */}
                      <div className="relative">
                        <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                        <Label
                          htmlFor="admin"
                          className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                            role === 'admin'
                              ? 'border-primary/80 bg-primary/15 shadow-lg shadow-primary/25'
                              : 'border-border/50 bg-background/30 hover:border-primary/60 hover:bg-primary/8'
                          }`}
                        >
                          {/* Glassmorphism effect */}
                          <div className={`absolute inset-0 rounded-xl backdrop-blur-sm ${
                            role === 'admin' ? 'bg-primary/5' : 'bg-background/20'
                          }`} />
                          <div className={`relative mb-2 w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-sm ${
                            role === 'admin' ? 'bg-primary/25 shadow-md shadow-primary/20' : 'bg-primary/10'
                          }`}>
                            <Shield className={`w-5 h-5 ${role === 'admin' ? 'text-primary' : 'text-primary/60'}`} />
                          </div>
                          <span className="relative text-sm font-medium">Admin</span>
                        </Label>
                      </div>
                      
                      {/* Faculty Role Card */}
                      <div className="relative">
                        <RadioGroupItem value="faculty" id="faculty" className="peer sr-only" />
                        <Label
                          htmlFor="faculty"
                          className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                            role === 'faculty'
                              ? 'border-accent/80 bg-accent/15 shadow-lg shadow-accent/25'
                              : 'border-border/50 bg-background/30 hover:border-accent/60 hover:bg-accent/8'
                          }`}
                        >
                          {/* Glassmorphism effect */}
                          <div className={`absolute inset-0 rounded-xl backdrop-blur-sm ${
                            role === 'faculty' ? 'bg-accent/5' : 'bg-background/20'
                          }`} />
                          <div className={`relative mb-2 w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-sm ${
                            role === 'faculty' ? 'bg-accent/25 shadow-md shadow-accent/20' : 'bg-accent/10'
                          }`}>
                            <User className={`w-5 h-5 ${role === 'faculty' ? 'text-accent' : 'text-accent/60'}`} />
                          </div>
                          <span className="relative text-sm font-medium">Faculty</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group mt-6"
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Sign In
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
