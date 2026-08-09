import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, MailIcon, LockIcon, SparklesIcon, AlertCircleIcon } from '../components/Icons';

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
    <section className="grid min-h-[calc(100vh-10rem)] items-center gap-12 lg:grid-cols-12 py-6">
      {/* Left Column: Hero & Campus Highlights */}
      <div className="space-y-6 lg:col-span-7">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
          <SparklesIcon className="h-4 w-4" />
          Campus Identity & Verification
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">CampusFind</span>.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-slate-300">
          Sign in to report missing items, claim found belongings, and track claim verifications across all campus departments.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid gap-4 sm:grid-cols-2 pt-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/60 p-4 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">Verified Ownership</h3>
            <p className="mt-1 text-xs text-slate-400">Owner-only verification and claims management system.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/60 p-4 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">Instant Claims</h3>
            <p className="mt-1 text-xs text-slate-400">Real-time status updates and resolution notifications.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Polished Sign In Card */}
      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-8 shadow-glow backdrop-blur-md">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-white">Sign In</h2>
            <p className="mt-1 text-xs text-slate-400">Enter your registered campus account credentials.</p>
          </div>

          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
              <AlertCircleIcon className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-300">Email Address</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <MailIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="student@college.edu"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-300">Password</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <LockIcon className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="••••••••"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 py-3.5 text-sm font-bold text-slate-950 shadow-cyan-subtle transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Account</span>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/[0.08] pt-4 text-center">
            <p className="text-xs text-slate-400">
              New to CampusFind?{' '}
              <Link to="/register" className="font-semibold text-sky-400 transition hover:text-sky-300">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}