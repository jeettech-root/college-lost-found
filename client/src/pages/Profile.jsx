import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, MailIcon, LockIcon, LogOutIcon, ShieldCheckIcon, CheckCircleIcon, AlertCircleIcon } from '../components/Icons';

const emptyForm = {
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined
      });

      setMessage('Profile updated successfully');
      setFormData((current) => ({
        ...current,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (profileError) {
      setError(profileError.response?.data?.message || 'Unable to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <section className="grid gap-8 lg:grid-cols-12 pb-12">
      {/* Left Column: User Identity Card */}
      <aside className="space-y-6 lg:col-span-4">
        <div className="rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-500 font-display text-3xl font-extrabold text-slate-950 shadow-cyan-subtle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 className="mt-4 font-display text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Role: {user?.role || 'Member'}
          </div>

          <div className="mt-6 border-t border-white/[0.08] pt-6 space-y-3 text-left text-xs">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3">
              <span className="block font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Account ID</span>
              <span className="mt-0.5 block font-mono text-slate-300 text-[11px] truncate">{user?._id || 'N/A'}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F17] p-3">
              <span className="block font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Campus Identity</span>
              <span className="mt-0.5 block font-medium text-emerald-300">Verified Student / Faculty</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign Out of Account
          </button>
        </div>
      </aside>

      {/* Right Column: Update Settings Form */}
      <div className="lg:col-span-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[#111726]/90 p-6 shadow-glow backdrop-blur-md sm:p-8">
          <div className="mb-6 border-b border-white/[0.08] pb-4">
            <h1 className="font-display text-2xl font-bold text-white">Account Settings</h1>
            <p className="mt-1 text-xs text-slate-400">Update personal credentials and rotate access passwords.</p>
          </div>

          {message ? (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
          ) : null}

          {error ? (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
              <AlertCircleIcon className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-300">Display Name</span>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-300">Email Address</span>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <MailIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      required
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Password Rotation */}
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Security & Password Rotation</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-300">Current Password</span>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <LockIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="Required to change password"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-300">New Password</span>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <LockIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-300">Confirm New Password</span>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F17] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="Repeat new password"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}