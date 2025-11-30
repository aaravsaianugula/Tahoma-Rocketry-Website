import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'rgba(5, 24, 55, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <Image src="/assets/Logo.png" alt="Logo" width={32} height={32} />
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Member Portal</h4>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="#" style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, color: 'var(--patch-gold)' }}>
                        Dashboard
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        My Profile
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Resources
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Settings
                    </Link>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333' }}></div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Test User</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Member</p>
                        </div>
                    </div>
                    <Link href="/" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', opacity: 0.5 }}>
                        ← Back to Home
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '3rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', background: 'transparent', border: 'none', padding: 0 }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mission Control</h1>
                        <p style={{ opacity: 0.6 }}>Welcome back, Cadet.</p>
                    </div>
                    <button className="btn btn-primary">New Project +</button>
                </header>

                {/* Stats Grid */}
                <div className="grid-4" style={{ marginBottom: '3rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>upcoming Launch</p>
                        <h3>5 Days</h3>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '1rem' }}>
                            <div style={{ width: '70%', height: '100%', background: 'var(--patch-gold)', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Projects</p>
                        <h3>2</h3>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Cert Level</p>
                        <h3>L1</h3>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Flight Hours</p>
                        <h3>12.5</h3>
                    </div>
                </div>

                {/* Recent Activity */}
                <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(244, 193, 92, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--patch-gold)' }}>🚀</div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Flight Log #204 Submitted</h4>
                            <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>Yesterday at 4:20 PM</p>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(31, 118, 200, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mountain-blue)' }}>📂</div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>New Resource Added: "Avionics 101"</h4>
                            <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>2 days ago</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
