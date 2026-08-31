import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/ui/Logo.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { isValidEmail, isRequired } from '../../utils/validators.js';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!isRequired(form.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await login(form.email, form.password);

      if (response.success) {
        navigate('/feed');
      } else {
        setApiError(response.message || 'Login failed');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed');
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
            Welcome Back
          </h1>
          <p className="text-text-secondary mt-2">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <div className="p-3 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 text-red-500 text-sm">
              {apiError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Login
          </Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;