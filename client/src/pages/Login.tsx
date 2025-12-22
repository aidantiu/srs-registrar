import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { login, type UserRole } from '../common/auth';

interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
}

export default function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'admin',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password, formData.role);

      if (data.success) {
        // Redirect to home/dashboard
        await navigate({ to: '/' });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error_) {
      setError('An error occurred during login');
      console.error('Login error:', error_);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          SRS Registrar Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              id="email"
              type="email"
              value={formData.email}
              onChange={(event) => {
                setFormData({ ...formData, email: event.target.value });
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              id="password"
              type="password"
              value={formData.password}
              onChange={(event) => {
                setFormData({ ...formData, password: event.target.value });
              }}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="role"
            >
              Role
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              id="role"
              value={formData.role}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  role: event.target.value as UserRole,
                });
              }}
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
