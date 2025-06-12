'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { createUserProfile, getUserProfile } from '@/lib/db';
import type { UserProfile } from '@/types/database';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const redirectBasedOnUserType = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        switch (profile.userType) {
          case 'team':
            router.push(`/teams/${userId}/dashboard`);
            break;
          case 'league':
            router.push('/leagues/dashboard');
            break;
          default:
            router.push('/profile');
            break;
        }
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error redirecting user:', error);
      router.push('/profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn(email, password);
      if (result?.user) {
        await redirectBasedOnUserType(result.user.uid);
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        const existingProfile = await getUserProfile(result.user.uid);
        if (existingProfile) {
          await redirectBasedOnUserType(result.user.uid);
        } else {
          // Create default athlete profile for new Google sign-ins
          const names = result.user.displayName?.split(' ') || ['', ''];
          const profile: Partial<UserProfile> = {
            id: result.user.uid,
            email: result.user.email || '',
            firstName: names[0],
            lastName: names.slice(1).join(' '),
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            bio: '',
            userType: 'athlete',
            teams: [],
            leagues: [],
            connections: [],
            pendingRequests: [],
            sentRequests: [],
            postViews: 0,
            sports: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await createUserProfile(result.user.uid, profile);
          router.push('/profile');
        }
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign In to ZTRIKE</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full">
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
    </Card>
  );
}