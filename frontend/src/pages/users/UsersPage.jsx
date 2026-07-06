// frontend/src/pages/users/UsersPage.jsx
// The control panel referenced throughout the Admin Guide: this is where you
// (Super Admin) or a parish's Katibu/Padre (admin role) add new users,
// promote/demote them, deactivate accounts, and trigger a forced password
// reset that emails a fresh temporary password to the user's REGISTERED
// address on file — never to an address typed in on the spot.

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  UserPlus, Shield, ShieldCheck, KeyRound, Trash2, Loader2,
  CheckCircle2, XCircle, Info,
} from 'lucide-react';

import { userService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const ROLE_LABELS = {
  super_admin: { label: 'Msimamizi Mkuu', sub: 'Super Admin', variant: 'danger' },
  admin:       { label: 'Katibu / Padre', sub: 'Admin',        variant: 'primary' },
  secretary:   { label: 'Mfanyakazi',     sub: 'Secretary',    variant: 'info' },
  viewer:      { label: 'Mtazamaji',      sub: 'Viewer',       variant: 'default' },
};

export default function UsersPage() {
  const { user: me } = useAuth();
  const isSuperAdmin = me?.role === 'super_admin';

  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // user object
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.list();
      setUsers(res.data.users);
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kupakia watumiaji.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleForceReset(u) {
    setBusyId(u.id);
    try {
      await userService.forceReset(u.id);
      toast.success(`Nywila mpya ya muda imetumwa kwa ${u.email}.`);
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kutuma nywila mpya.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(u) {
    setBusyId(u.id);
    try {
      const res = await userService.update(u.id, { isActive: !u.is_active });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? res.data.user : x)));
      toast.success(u.is_active ? 'Akaunti imezimwa.' : 'Akaunti imewashwa.');
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kubadilisha hali ya akaunti.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      await userService.remove(confirmDelete.id);
      setUsers((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      toast.success('Mtumiaji amefutwa.');
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kufuta mtumiaji.');
    } finally {
      setBusyId(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
            Watumiaji wa Mfumo
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            User Management — ongeza, simamia, au ondoa watumiaji. {isSuperAdmin ? 'Wewe ni Msimamizi Mkuu wa mfumo mzima.' : 'Unasimamia watumiaji wa parokia yako.'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          <UserPlus size={16} /> Ongeza Mtumiaji
        </button>
      </header>

      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-info-pale)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)' }}>
        <Info size={16} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          Nywila mpya au za muda hutumwa TU kwenye barua pepe iliyosajiliwa ya mtumiaji husika — kamwe hazionyeshwi hapa kwenye skrini.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
          <Loader2 className="spin" size={28} />
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={UserPlus} title="Hakuna watumiaji bado" description="Bofya 'Ongeza Mtumiaji' kuanza." />
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Jina</th>
                <th>Barua Pepe</th>
                <th>Cheo</th>
                <th>Hali</th>
                <th>Ingia Mara ya Mwisho</th>
                <th style={{ textAlign: 'right' }}>Vitendo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const roleInfo = ROLE_LABELS[u.role] || ROLE_LABELS.viewer;
                const isBusy = busyId === u.id;
                const isMe = u.id === me?.id;
                return (
                  <tr key={u.id}>
                    <td>{u.full_name}{isMe && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}> (wewe)</span>}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge variant={roleInfo.variant}>{roleInfo.label} · {roleInfo.sub}</Badge>
                    </td>
                    <td>
                      {u.is_active ? (
                        <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}><CheckCircle2 size={14} /> Hai</span>
                      ) : (
                        <span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}><XCircle size={14} /> Imezimwa</span>
                      )}
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.last_login_at || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-ghost" title="Tuma nywila mpya ya muda" disabled={isBusy} onClick={() => handleForceReset(u)}>
                          <KeyRound size={15} />
                        </button>
                        {!isMe && u.role !== 'super_admin' && (
                          <button className="btn btn-icon btn-ghost" title={u.is_active ? 'Zima akaunti' : 'Washa akaunti'} disabled={isBusy} onClick={() => handleToggleActive(u)}>
                            {u.is_active ? <Shield size={15} /> : <ShieldCheck size={15} />}
                          </button>
                        )}
                        {!isMe && u.role !== 'super_admin' && (
                          <button className="btn btn-icon btn-ghost" title="Futa mtumiaji" disabled={isBusy} onClick={() => setConfirmDelete(u)}>
                            <Trash2 size={15} style={{ color: 'var(--color-danger)' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        isSuperAdmin={isSuperAdmin}
        onCreated={(u) => { setUsers((prev) => [u, ...prev]); setCreateOpen(false); }}
      />

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Futa Mtumiaji"
        message={`Una uhakika unataka kumfuta ${confirmDelete?.full_name}? Hatua hii haiwezi kutenduliwa.`}
        confirmLabel="Futa"
        danger
        loading={busyId === confirmDelete?.id}
      />
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreated, isSuperAdmin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [role, setRole]         = useState('secretary');
  const [title, setTitle]       = useState('');
  const [saving, setSaving]     = useState(false);

  const availableRoles = isSuperAdmin
    ? ['admin', 'secretary', 'viewer']
    : ['secretary', 'viewer']; // Katibu/Padre can only create staff below them

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.create({ fullName, email, role, title: title || undefined });
      toast.success('Mtumiaji ameongezwa. Taarifa za kuingia zimetumwa kwa barua pepe yake.');
      onCreated(res.data.user);
      setFullName(''); setEmail(''); setRole('secretary'); setTitle('');
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kuongeza mtumiaji.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Ongeza Mtumiaji Mpya" maxWidth={480}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div className="form-group">
          <label className="form-label">Jina Kamili</label>
          <input className="form-control" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Barua Pepe (itakayotumika kuingia na kupokea taarifa)</label>
          <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Cheo</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            {availableRoles.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r].label} ({ROLE_LABELS[r].sub})</option>
            ))}
          </select>
        </div>
        {role === 'admin' && (
          <div className="form-group">
            <label className="form-label">Jina la Cheo (mf. Katibu, Padre)</label>
            <input className="form-control" placeholder="Katibu" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        )}
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Nywila ya muda itatengenezwa kiotomatiki na kutumwa kwa barua pepe hii. Mtumiaji ataombwa kuweka nywila yake mwenyewe anapoingia mara ya kwanza.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Ghairi</button>
          <button type="submit" className={`btn btn-primary ${saving ? 'btn-loading' : ''}`} disabled={saving}>Ongeza Mtumiaji</button>
        </div>
      </form>
    </Modal>
  );
}
