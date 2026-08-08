import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      const destination = location.state?.from?.pathname || '/profile';
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(authError.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-8rem)] items-center lg:grid-cols-[1.2fr_0.8fr]">
      <div className="mb-8 space-y-6 lg:mb-0 lg:pr-8">
        <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
          Secure access
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Reconnect with your campus account.
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-300">
          Sign in to manage your profile, update your password, and keep your lost-and-found identity in one place.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:p-8">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-white">Login</h2>
          <p className="mt-1 text-sm text-slate-400">Use your registered email and password.</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
              placeholder="student@college.edu"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/60"
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-medium text-amber-200 transition hover:text-amber-100">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}