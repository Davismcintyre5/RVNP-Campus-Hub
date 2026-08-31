import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/ui/Logo.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import authApi from '../../api/authApi.js';
import { isValidEmail } from '../../utils/validators.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showText={false} />
          <h1 className="text-2xl font-heading font-bold text-text-primary mt-4">
            Forgot Password
          </h1>
          <p className="text-text-secondary mt-2">
            Enter your email to reset your password
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="p-4 rounded-lg bg-green-500 bg-opacity-10 border border-green-500 text-green-500 mb-4">
              Password reset link sent to your email!
            </div>
            <Link to="/login" className="text-text-primary font-medium hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 text-red-500 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="text-center text-text-secondary text-sm mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;