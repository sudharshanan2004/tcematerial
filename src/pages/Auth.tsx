import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';
import { BookOpen, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              display_name: displayName || email.split('@')[0]
            }
          },
        });

        if (error) throw error;

        toast({
          title: 'Account created!',
          description: 'You can now sign in with your credentials.',
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <SEOHead 
        title={isLogin ? 'Sign In' : 'Sign Up'}
        description={isLogin ? 'Sign in to access your study materials' : 'Create an account to share and access study materials'}
      />
      
      <div className="w-full max-w-md space-y-8">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#FA76FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-black text-white h-12 w-12 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-2xl font-medium">StudyShare</span>
        </div>

        <div>
          <h2 className="text-4xl font-normal text-[#1A1A1A] tracking-[-0.02em]">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="mt-2 text-sm text-[#1A1A1A] opacity-50">
            {isLogin ? 'Welcome back! Sign in to access your materials' : 'Create an account to share and discover study materials'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium uppercase mb-2">
                Display Name
              </label>
              <Input
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-[#1A1A1A] text-[#1A1A1A] h-12"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium uppercase mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#1A1A1A] text-[#1A1A1A] h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium uppercase mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-[#1A1A1A] text-[#1A1A1A] h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white hover:bg-opacity-90 h-12 uppercase font-medium"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-[#1A1A1A] hover:opacity-70 transition-opacity"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

export default Auth;