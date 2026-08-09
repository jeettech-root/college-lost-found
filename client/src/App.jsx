import { useState } from 'react';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LostItems from './pages/LostItems';
import LostItemCreate from './pages/LostItemCreate';
import LostItemDetails from './pages/LostItemDetails';
import LostItemEdit from './pages/LostItemEdit';
import FoundItems from './pages/FoundItems';
import FoundItemCreate from './pages/FoundItemCreate';
import FoundItemDetails from './pages/FoundItemDetails';
import FoundItemEdit from './pages/FoundItemEdit';
import ClaimTest from './pages/ClaimTest';
import ReceivedClaims from './pages/ReceivedClaims';
import { ShieldCheckIcon, MenuIcon, XIcon, PlusIcon, UserIcon, LogOutIcon, InboxIcon } from './components/Icons';

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F17] text-slate-100">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111726]/80 px-6 py-4 text-sm text-slate-300 shadow-glow backdrop-blur-md">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <span>Loading campus portal...</span>
        </div>
      </div>
    );
  }

  return <Navigate to={user ? '/lost' : '/login'} replace />;
}

function TopBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `flex items-center gap-2 text-sm font-medium transition-colors py-2 px-3 rounded-xl ${isActive(path)
      ? 'bg-white/10 text-white font-semibold shadow-sm'
      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0B0F17]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-amber-400 p-0.5 shadow-lg transition duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B0F17]">
              <ShieldCheckIcon className="h-5 w-5 text-sky-400" />
            </div>
          </div>
          <div>
            <span className="block font-display text-lg font-bold tracking-tight text-white">
              CAMPUS<span className="text-sky-400">FIND</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Lost & Found Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/found" className={navLinkClass('/found')}>
            <span className="h-2 w-2 rounded-full bg-sky-400"></span>
            Found Items
          </Link>
          <Link to="/lost" className={navLinkClass('/lost')}>
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            Lost Items
          </Link>

          {user ? (
            <Link to="/claims/received" className={navLinkClass('/claims/received')}>
              <InboxIcon className="h-4 w-4 text-slate-400" />
              Claims Review
            </Link>
          ) : null}
        </nav>

        {/* Action CTAs & Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Link
                  to="/found/new"
                  className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Report Found
                </Link>
                <Link
                  to="/lost/new"
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Report Lost
                </Link>
              </div>

              <div className="h-5 w-px bg-white/10" />

              <Link
                to="/profile"
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition ${isActive('/profile')
                    ? 'border-sky-400/40 bg-sky-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                  }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 text-xs font-bold text-slate-950">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate text-xs font-medium">{user.name || 'Account'}</span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-cyan-subtle transition hover:brightness-110"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0B0F17]/95 px-4 py-4 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              to="/found"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400"></span>
                Found Items
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500">Browse</span>
            </Link>
            <Link
              to="/lost"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                Lost Items
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500">Browse</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/claims/received"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <InboxIcon className="h-4 w-4 text-sky-400" />
                    Claims Review
                  </div>
                </Link>
                <div className="my-2 h-px bg-white/10" />
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/found/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5 text-xs font-semibold text-sky-300"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Report Found
                  </Link>
                  <Link
                    to="/lost/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs font-semibold text-amber-300"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Report Lost
                  </Link>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400 text-xs font-bold text-slate-950">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span>{user.name || 'Account'}</span>
                  </div>
                  <UserIcon className="h-4 w-4 text-slate-400" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-sky-400 py-2.5 text-xs font-semibold text-slate-950"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function AppLayout() {
  return (
    <div className="relative min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-sky-500/30">
      {/* Subtle ambient lighting glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute right-0 top-32 h-[30rem] w-[30rem] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
      </div>

      <TopBar />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/found" element={<FoundItems />} />
          <Route
            path="/found/new"
            element={
              <ProtectedRoute>
                <FoundItemCreate />
              </ProtectedRoute>
            }
          />
          <Route path="/found/:id" element={<FoundItemDetails />} />
          <Route
            path="/found/:id/edit"
            element={
              <ProtectedRoute>
                <FoundItemEdit />
              </ProtectedRoute>
            }
          />
          <Route path="/lost" element={<LostItems />} />
          <Route
            path="/lost/new"
            element={
              <ProtectedRoute>
                <LostItemCreate />
              </ProtectedRoute>
            }
          />
          <Route path="/lost/:id" element={<LostItemDetails />} />
          <Route
            path="/lost/:id/edit"
            element={
              <ProtectedRoute>
                <LostItemEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim-test"
            element={
              <ProtectedRoute>
                <ClaimTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims/received"
            element={
              <ProtectedRoute>
                <ReceivedClaims />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
