import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import groceryImage from 'figma:asset/9862d012458576518fbe9d4dc78e607024345e07.png';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onGoToSignUp: () => void;
  registeredUsers: Array<{ id: string; username: string; password: string; role: 'admin' | 'cashier'; name: string; email: string }>;
}

type UserRole = 'admin' | 'cashier';

export function LoginPage({ onLogin, onGoToSignUp, registeredUsers }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = registeredUsers.find(
      u => u.username === username && u.password === password && u.role === selectedRole
    );

    if (user) {
      onLogin({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      });
    } else {
      setError('Invalid username or password for the selected role');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D1EDC5]">
      <div className="flex w-full h-screen max-w-7xl mx-auto">
        {/* Left side - Grocery Image */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <img 
            src={groceryImage} 
            alt="Grocery bag with fresh produce" 
            className="max-w-lg w-full h-auto object-contain"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-5xl text-[#4a9d5f] mb-2">POS Login</h1>
            <p className="text-gray-800 mb-8">
              Don't have an account? <button onClick={onGoToSignUp} className="text-gray-800 underline hover:text-gray-600">Sign up</button>
            </p>

            {/* Role Toggle Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-3 px-6 rounded-full transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#4a9d5f] text-white'
                    : 'bg-white text-gray-800 border-2 border-gray-300'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('cashier')}
                className={`flex-1 py-3 px-6 rounded-full transition-all ${
                  selectedRole === 'cashier'
                    ? 'bg-[#4a9d5f] text-white'
                    : 'bg-white text-gray-800 border-2 border-gray-300'
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

              <div className="space-y-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full py-6 px-5 rounded-2xl border-2 border-[#4a9d5f] bg-white text-gray-700 placeholder:text-gray-400"
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
                  className="w-full py-6 px-5 rounded-2xl border-2 border-[#4a9d5f] bg-white text-gray-700 placeholder:text-gray-400"
                />
              </div>

              <div className="text-left">
                <button type="button" className="text-gray-800 hover:text-gray-600 transition-colors">
                  Forgot your password?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#4a9d5f] hover:bg-[#3d8450] text-white py-6 rounded-2xl text-lg"
              >
                Login
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-white/50 rounded-xl border border-[#4a9d5f]/30">
              <p className="text-sm text-gray-700 mb-2">Demo Credentials:</p>
              <div className="text-xs space-y-1 text-gray-600">
                <p><span className="text-[#4a9d5f]">Admin:</span> admin / admin123</p>
                <p><span className="text-[#4a9d5f]">Cashier:</span> cashier / cashier123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
