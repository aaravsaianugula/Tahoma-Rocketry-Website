import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: '#020a1a',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <Image src="/assets/Logo.png" alt="Logo" width={32} height={32} />
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--rocket-red)' }}>ADMIN PANEL</h4>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="#" style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600 }}>
                        Overview
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Events
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Members
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Content
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Media
                    </Link>
                    <Link href="#" style={{ padding: '0.8rem 1rem', borderRadius: '12px', opacity: 0.7 }}>
                        Settings
                    </Link>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <Link href="/" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', opacity: 0.5 }}>
                        ← Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '3rem', background: '#051837' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', background: 'transparent', border: 'none', padding: 0 }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Overview</h1>
                        <p style={{ opacity: 0.6 }}>System Status: Operational</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary">Export Data</button>
                        <button className="btn btn-primary">Create Event +</button>
                    </div>
                </header>

                {/* Analytics Grid */}
                <div className="grid-4" style={{ marginBottom: '3rem' }}>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Members</p>
                        <h3>54</h3>
                        <p style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '0.5rem' }}>+12% this month</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pending RSVPs</p>
                        <h3>8</h3>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Server Status</p>
                        <h3 style={{ color: '#4ade80' }}>Online</h3>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Next Launch</p>
                        <h3>2 Days</h3>
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Registrations</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', opacity: 0.6 }}>Name</th>
                                <th style={{ padding: '1rem', opacity: 0.6 }}>Email</th>
                                <th style={{ padding: '1rem', opacity: 0.6 }}>Date</th>
                                <th style={{ padding: '1rem', opacity: 0.6 }}>Status</th>
                                <th style={{ padding: '1rem', opacity: 0.6 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>John Doe</td>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>john@example.com</td>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>Nov 28, 2025</td>
                                <td style={{ padding: '1rem' }}><span style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>Active</span></td>
                                <td style={{ padding: '1rem' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer' }}>•••</button></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>Jane Smith</td>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>jane@example.com</td>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>Nov 27, 2025</td>
                                <td style={{ padding: '1rem' }}><span style={{ background: 'rgba(244, 193, 92, 0.2)', color: 'var(--patch-gold)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>Pending</span></td>
                                <td style={{ padding: '1rem' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer' }}>•••</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
