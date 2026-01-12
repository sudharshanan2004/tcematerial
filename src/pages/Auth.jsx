import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
  const { signIn, signUp, user } = useAuth();

  if (user) { navigate('/dashboard'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) { await signIn(email, password); toast({ title: 'Welcome back!' }); }
      else { await signUp(email, password, displayName); toast({ title: 'Account created!' }); }
      navigate('/dashboard');
    } catch (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <SEOHead title={isLogin ? 'Sign In' : 'Sign Up'} description="Access your study materials" />
      <div className="w-full max-w-md space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#FA76FF]"><ArrowLeft className="w-4 h-4" />Back to Home</Link>
        <div className="flex items-center gap-3"><div className="bg-black text-white h-12 w-12 flex items-center justify-center"><BookOpen className="w-6 h-6" /></div><span className="text-2xl font-medium">StudyShare</span></div>
        <div><h2 className="text-4xl font-normal">{isLogin ? 'Sign In' : 'Sign Up'}</h2></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && <div><label className="block text-sm font-medium uppercase mb-2">Display Name</label><Input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="border-[#1A1A1A] h-12" /></div>}
          <div><label className="block text-sm font-medium uppercase mb-2">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-[#1A1A1A] h-12" /></div>
          <div><label className="block text-sm font-medium uppercase mb-2">Password</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="border-[#1A1A1A] h-12" /></div>
          <Button type="submit" disabled={loading} className="w-full bg-[#1A1A1A] text-white h-12 uppercase font-medium">{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</Button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm hover:opacity-70">{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button>
      </div>
    </div>
  );
};

export default Auth;
