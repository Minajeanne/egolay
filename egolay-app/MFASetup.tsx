import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { EgolayAPI } from "../utils/supabase/client";
import { Loader2, Shield, Smartphone, Copy, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";

interface MFASetupProps {
  isOpen: boolean;
  onClose: () => void;
  onMFAStatusChange?: () => void;
}

interface MFAFactor {
  id: string;
  friendly_name: string;
  factor_type: string;
  status: string;
  created_at: string;
}

export function MFASetup({ isOpen, onClose, onMFAStatusChange }: MFASetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'list' | 'setup' | 'verify'>('list');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMFAFactors();
    }
  }, [isOpen]);

  const loadMFAFactors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await EgolayAPI.getMFAFactors();
      setFactors(data.totp || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load MFA factors');
    } finally {
      setIsLoading(false);
    }
  };

  const startMFASetup = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await EgolayAPI.enrollMFA();
      setQrCode(data.totp?.qr_code || '');
      setSecret(data.totp?.secret || '');
      setFactorId(data.id);
      setStep('setup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start MFA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFASetup = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await EgolayAPI.verifyMFAEnrollment(factorId, verificationCode);
      setSuccess('MFA has been successfully enabled for your account!');
      setStep('list');
      setVerificationCode('');
      await loadMFAFactors();
      onMFAStatusChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const removeMFAFactor = async (factorId: string) => {
    if (!confirm('Are you sure you want to remove this MFA factor? This will make your account less secure.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await EgolayAPI.unenrollMFA(factorId);
      setSuccess('MFA factor removed successfully');
      await loadMFAFactors();
      onMFAStatusChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove MFA factor');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch (err) {
      console.error('Failed to copy secret:', err);
    }
  };

  const handleClose = () => {
    setStep('list');
    setVerificationCode('');
    setQrCode('');
    setSecret('');
    setFactorId('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  const renderFactorsList = () => (
    <div className="space-y-4">
      {factors.length > 0 ? (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            Active MFA Factors
          </h3>
          {factors.map((factor) => (
            <Card key={factor.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{factor.friendly_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {factor.factor_type.toUpperCase()} • {factor.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(factor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMFAFactor(factor.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>MFA is not enabled for your account. Set up two-factor authentication to enhance your account security.</p>
              <div className="text-xs space-y-1">
                <p><strong>Benefits:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Protects your reading history and recommendations</li>
                  <li>Prevents unauthorized access to your account</li>
                  <li>Works with apps like Google Authenticator, Authy, or 1Password</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={startMFASetup} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            {factors.length > 0 ? 'Add Another Factor' : 'Enable MFA'}
          </>
        )}
      </Button>
    </div>
  );

  const renderSetup = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3>Set Up Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Scan the QR code or enter the secret key in your authenticator app
        </p>
      </div>

      {qrCode && (
        <div className="text-center">
          <img src={qrCode} alt="QR Code for MFA setup" className="mx-auto mb-4 border rounded" />
        </div>
      )}

      {secret && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Manual Entry</CardTitle>
            <CardDescription>
              If you can't scan the QR code, enter this secret key manually:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                {secret}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copySecret}
                className="shrink-0"
              >
                {copiedSecret ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <Input
          id="verification-code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code from your app"
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code from your authenticator app to complete setup
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep('list')} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={verifyMFASetup}
          disabled={isLoading || !verificationCode.trim()}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Secure your Egolay account with two-factor authentication
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {step === 'list' && renderFactorsList()}
        {step === 'setup' && renderSetup()}
      </DialogContent>
    </Dialog>
  );
}