import { Navigate, Route, Routes, Link } from 'react-router-dom';
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

function HomeRedirect() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
				<div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300 shadow-glow backdrop-blur">
					Loading your account...
				</div>
			</div>
		);
	}

	return <Navigate to={user ? '/lost' : '/login'} replace />;
}

function TopBar() {
	const { user } = useAuth();

	return (
		<header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<Link to="/" className="font-display text-lg font-semibold tracking-tight text-amber-300">
					College Lost & Found
				</Link>
				<nav className="flex items-center gap-4 text-sm text-slate-300">
					<Link to="/found" className="transition hover:text-white">
						Found Items
					</Link>
					<Link to="/found/new" className="transition hover:text-white">
						Report Found
					</Link>
					<Link to="/lost" className="transition hover:text-white">
						Lost Items
					</Link>
					<Link to="/lost/new" className="transition hover:text-white">
						Report Lost
					</Link>
					<Link to="/login" className="transition hover:text-white">
						Login
					</Link>
					<Link to="/register" className="transition hover:text-white">
						Register
					</Link>
					<Link
						to="/profile"
						className={`rounded-full border px-4 py-2 transition ${user ? 'border-amber-300/40 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-white/5 text-slate-400'}`}
					>
						Profile
					</Link>
				</nav>
			</div>
		</header>
	);
}

function AppLayout() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
				<div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
			</div>
			<TopBar />
			<main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
