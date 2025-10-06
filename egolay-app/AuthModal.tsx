import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { EgolayAPI } from "../utils/supabase/client";
import { Loader2, Book, Shield, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMFAChallenge, setShowMFAChallenge] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState('');
  const [mfaChallengeId, setMfaChallengeId] = useState('');
  
  // Sign In form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await EgolayAPI.signIn(signInData.email, signInData.password);
      
      // Check if MFA is required
      if (result.user?.app_metadata?.providers?.includes('totp')) {
        // Get MFA factors
        const factors = await EgolayAPI.getMFAFactors();
        if (factors.totp && factors.totp.length > 0) {
          const factor = factors.totp[0];
          const challenge = await EgolayAPI.challengeMFA(factor.id);
          setMfaFactorId(factor.id);
          setMfaChallengeId(challenge.id);
          setShowMFAChallenge(true);
        }
      } else {
        onAuthSuccess();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await EgolayAPI.verifyMFAChallenge(mfaFactorId, mfaChallengeId, mfaToken);
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await EgolayAPI.signUp(
        signUpData.email, 
        signUpData.password, 
        signUpData.name, 
        parseInt(signUpData.age) || 0
      );
      
      // Auto sign in after successful signup
      await EgolayAPI.signIn(signUpData.email, signUpData.password);
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setSignInData({ email: '', password: '' });
    setSignUpData({ name: '', email: '', password: '', age: '' });
    setError(null);
    setShowMFAChallenge(false);
    setMfaToken('');
    setMfaFactorId('');
    setMfaChallengeId('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleBackFromMFA = () => {
    setShowMFAChallenge(false);
    setMfaToken('');
    setError(null);
  };

  if (showMFAChallenge) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter the verification code from your authenticator app
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleMFAVerification} className="space-y-4">
            <div>
              <Label htmlFor="mfa-token">Verification Code</Label>
              <Input
                id="mfa-token"
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBackFromMFA}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading || !mfaToken.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Having trouble? Contact support for assistance</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Book className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle>Welcome to Egolay</DialogTitle>
          <DialogDescription>
            Sign in to get personalized book recommendations and sync your reading progress
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-age">Age</Label>
                <Input
                  id="signup-age"
                  type="number"
                  value={signUpData.age}
                  onChange={(e) => setSignUpData({ ...signUpData, age: e.target.value })}
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  placeholder="Create a password"
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}