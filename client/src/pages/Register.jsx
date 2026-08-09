import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, MailIcon, LockIcon, SparklesIcon, AlertCircleIcon, ShieldCheckIcon } from '../components/Icons';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/profile', { replace: true });
    } catch (authError) {
      setError(authError.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-10rem)] items-center gap-12 lg:grid-cols-12 py-6">
      {/* Left Column: Form Card */}
      <div className="lg:col-span-5 order-2 lg:order-1">
        <div className="rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-8 shadow-glow backdrop-blur-md">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-white">Create Account</h2>
            <p className="mt-1 text-xs text-slate-400">Join the campus lost & found network.</p>
          </div>

          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
              <AlertCircleIcon className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-300">Full Name</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="John Doe"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-300">Campus Email</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <MailIcon className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="student@college.edu"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-300">Password</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <LockIcon className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-300">Confirm Password</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <LockIcon className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 py-3.5 text-sm font-bold text-slate-950 shadow-cyan-subtle transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/[0.08] pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-sky-400 transition hover:text-sky-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Content */}
      <div className="space-y-6 lg:col-span-7 order-1 lg:order-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
          <SparklesIcon className="h-4 w-4" />
          Campus Community Portal
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Register once, protect your items forever.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-slate-300">
          Create your verified student or staff account to submit lost item reports, manage claims, and easily contact finders.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 pt-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/60 p-4 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">Campus Security</h3>
            <p className="mt-1 text-xs text-slate-400">Role-based access tied to your official campus credentials.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111726]/60 p-4 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">Unified Profile</h3>
            <p className="mt-1 text-xs text-slate-400">Easily update contact details or rotate passwords anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}