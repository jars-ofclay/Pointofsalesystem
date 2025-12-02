import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import groceryImage from 'figma:asset/9862d012458576518fbe9d4dc78e607024345e07.png';

interface SignUpPageProps {
  onSignUp: (username: string, email: string, password: string, role: 'admin' | 'cashier') => Promise<void>;
  onBackToLogin: () => void;
}

type UserRole = 'admin' | 'cashier';

export function SignUpPage({ onSignUp, onBackToLogin }: SignUpPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Call the sign-up handler
      await onSignUp(username, email, password, selectedRole);
      setSuccess(true);
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-[#d1edc5] from-[49%] to-white">
      <div className="flex w-full h-screen max-w-7xl mx-auto">
        {/* Left side - Grocery Image */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <img 
            src={groceryImage} 
            alt="Grocery bag with fresh produce" 
            className="max-w-lg w-full h-auto object-contain"
          />
        </div>

        {/* Right side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-5xl text-[#449c56] mb-2">POS Sign up</h1>
            <p className="text-gray-800 mb-8">
              Already have an account? <button onClick={onBackToLogin} className="text-gray-800 hover:text-gray-600 transition-colors">Log in</button>
            </p>

            {/* Role Toggle Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-3 px-6 rounded-full transition-all border border-[#3f9651] ${
                  selectedRole === 'admin'
                    ? 'bg-[#3f9651] text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('cashier')}
                className={`flex-1 py-3 px-6 rounded-full transition-all border border-[#3f9651] ${
                  selectedRole === 'cashier'
                    ? 'bg-[#3f9651] text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                Cashier
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="size-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Account created successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full py-6 px-5 rounded-2xl border-2 border-[#3f9651] bg-white text-gray-700 placeholder:text-gray-400 placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-6 px-5 rounded-2xl border-2 border-[#3f9651] bg-white text-gray-700 placeholder:text-gray-400 placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-6 px-5 rounded-2xl border-2 border-[#3f9651] bg-white text-gray-700 placeholder:text-gray-400 placeholder:opacity-30"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#3f9651] hover:bg-[#2d7a3d] text-white py-6 rounded-full text-lg disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
