import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../../components/ui/Logo.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import authApi from '../../api/authApi.js';
import { isValidPassword } from '../../utils/validators.js';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const validate = () => {
    const newErrors = {};

    if (!isValidPassword(form.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!token || !userId) {
      setApiError('Invalid reset link');
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authApi.resetPassword({
        token,
        userId,
        newPassword: form.newPassword,
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setApiError(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to reset password');
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
            Reset Password
          </h1>
          <p className="text-text-secondary mt-2">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <div className="p-3 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 text-red-500 text-sm">
              {apiError}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            error={errors.newPassword}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;