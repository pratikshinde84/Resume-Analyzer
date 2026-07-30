import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, Shield, Edit2, Check, X, 
  Trash2, AlertTriangle, RefreshCw, Sparkles, FileText, Search, Database, Lock
} from '../components/icons';
import apiClient from '../api/client';
import NavigationBar from '../components/NavigationBar';

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/users/me');
      setProfile(res.data);
      setEditName(res.data.display_name || '');
    } catch (err) {
      console.error('Failed to load profile:', err);
      setSaveStatus({ type: 'error', message: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim() || (profile && editName === profile.display_name)) {
      setIsEditing(false);
      return;
    }
    
    setSaving(true);
    try {
      const res = await apiClient.patch('/users/me', { 
        display_name: editName.trim() 
      });
      setProfile(res.data);
      setIsEditing(false);
      if (refreshUser) refreshUser();
      setSaveStatus({ type: 'success', message: 'Profile updated' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ 
        type: 'error', 
        message: err.response?.data?.detail || 'Update failed' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (!password || confirmText.trim() !== 'DELETE MY ACCOUNT') return;

    setDeleting(true);
    setDeleteError('');

    try {
      await apiClient.delete('/users/me', {
        data: {
          password: password,
          confirm_text: confirmText.trim()
        }
      });
      
      logout();
      navigate('/auth', { state: { message: 'Your account and all associated data have been permanently deleted.' } });
    } catch (err) {
      console.error('Failed to delete account:', err);
      const detail = err.response?.data?.detail;
      setDeleteError(typeof detail === 'string' ? detail : detail?.message || 'Failed to delete account. Please verify your password.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <NavigationBar />
        <main className="main-content page-container">
          <div className="page-header-title">
            <h2 className="page-title">User Profile</h2>
            <p className="page-subtitle">Manage workspace identity, view activity stats, and account settings.</p>
          </div>
          <div className="profile-layout-grid">
            <div className="glass-panel profile-hero-card skeleton" style={{ height: 320 }} />
            <div className="glass-panel profile-details-card skeleton" style={{ height: 320 }} />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="app-layout">
        <NavigationBar />
        <main className="main-content page-container">
          <div className="glass-panel error-card-box">
            <AlertTriangle className="icon-lg text-danger" />
            <h3>Failed to Load Profile</h3>
            <p>We encountered an issue connecting to your user profile session.</p>
            <button className="btn primary-btn mt-4" onClick={fetchProfile}>
              <RefreshCw className="icon-sm" />
              <span>Retry Connection</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <NavigationBar />

      <main className="main-content page-container">
        {/* Page Header */}
        <div className="page-header-title">
          <h1 className="page-title">Profile & Identity</h1>
          <p className="page-subtitle">
            Manage your display identity, view document usage metrics, and security settings.
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
          {/* Left Column: Avatar & Quick Metrics */}
          <div className="bg-white dark:bg-[#16181c] border border-[#dee1e6] dark:border-[#212327] rounded-[24px] p-8 flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-[#0052ff] flex items-center justify-center text-white text-3xl font-normal overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (profile.display_name || profile.email)?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#0052ff]/10 border border-[#0052ff]/20 text-[#0052ff]">
                {profile.role || 'Workspace Member'}
              </span>
            </div>

            {/* Name Edit */}
            {isEditing ? (
              <div className="flex flex-col gap-3 w-full">
                <input
                  type="text"
                  className="w-full h-11 px-4 bg-[#f7f7f7] dark:bg-[#212327] border border-[#dee1e6] dark:border-[#212327] rounded-xl text-sm text-[#0a0b0d] dark:text-white outline-none focus:border-[#0052ff] transition-all"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Display name"
                  maxLength={60}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 h-10 rounded-full border border-[#dee1e6] dark:border-[#212327] text-sm text-[#5b616e] hover:bg-[#f7f7f7] dark:hover:bg-[#212327] transition-colors"
                    onClick={() => { setIsEditing(false); setEditName(profile.display_name || ''); }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 h-10 rounded-full bg-[#0052ff] hover:bg-[#003ecc] text-white text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-normal text-[#0a0b0d] dark:text-white tracking-tight">
                  {profile.display_name || profile.username || 'Workspace User'}
                </h2>
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-[#f7f7f7] dark:hover:bg-[#212327] text-[#5b616e] transition-colors"
                  title="Edit Display Name"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-[#5b616e] dark:text-[#a8acb3]">
              <Mail className="w-3.5 h-3.5" />
              <span>{profile.email}</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full pt-4 border-t border-[#dee1e6] dark:border-[#212327]">
              {[
                { label: 'Queries', value: profile.total_queries ?? 0 },
                { label: 'Docs', value: profile.total_documents ?? 0 },
                { label: 'Storage', value: `${profile.storage_used_mb ?? 0}MB` }
              ].map(m => (
                <div key={m.label} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xl font-normal text-[#0a0b0d] dark:text-white tracking-tight">{m.value}</span>
                  <span className="text-xs font-mono text-[#7c828a] uppercase tracking-wider">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Account Meta & Danger Zone */}
          <div className="flex flex-col gap-4">
            {/* Account Details Card */}
            <div className="bg-white dark:bg-[#16181c] border border-[#dee1e6] dark:border-[#212327] rounded-[24px] p-8">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-[#0052ff]" />
                <h3 className="text-base font-medium text-[#0a0b0d] dark:text-white">Account Meta & Session</h3>
              </div>

              <div className="flex flex-col gap-0">
                {[
                  { label: 'Member Since', value: new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'Last Login', value: profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Active Session' },
                  { label: 'Current Plan', value: (
                    <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase ${profile.plan?.toLowerCase() === 'pro' ? 'bg-[#0052ff]/10 text-[#0052ff] border border-[#0052ff]/20' : 'bg-[#f7f7f7] dark:bg-[#212327] text-[#5b616e] dark:text-[#a8acb3] border border-[#dee1e6] dark:border-[#212327]'}`}>
                      {profile.plan || 'Free'}
                    </span>
                  )},
                  { label: 'User ID', value: <span className="font-mono text-xs text-[#5b616e] dark:text-[#a8acb3] break-all">{profile.id}</span> }
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-[#eef0f3] dark:border-[#212327] last:border-0">
                    <span className="text-sm text-[#5b616e] dark:text-[#a8acb3]">{row.label}</span>
                    <span className="text-sm text-[#0a0b0d] dark:text-white text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-white dark:bg-[#16181c] border border-[#cf202f]/20 rounded-[24px] p-8">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#cf202f]" />
                <h3 className="text-base font-medium text-[#cf202f]">Danger Zone</h3>
              </div>
              <p className="text-sm text-[#5b616e] dark:text-[#a8acb3] mb-5 leading-relaxed">
                Permanently remove your account, clear vector indexes, and purge all uploaded document files from Cv-Insight.
              </p>
              <button
                type="button"
                className="h-11 px-6 rounded-full bg-[#cf202f] hover:bg-[#a01524] text-white text-sm font-semibold transition-colors flex items-center gap-2"
                onClick={() => {
                  setShowDeleteModal(true);
                  setPassword('');
                  setConfirmText('');
                  setDeleteError('');
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account & Purge Data
              </button>
            </div>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {saveStatus && (
          <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-full border shadow-lg z-50 text-sm font-medium ${saveStatus.type === 'success' ? 'bg-[#05b169]/10 border-[#05b169]/30 text-[#05b169]' : 'bg-[#cf202f]/10 border-[#cf202f]/30 text-[#cf202f]'}`}>
            {saveStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{saveStatus.message}</span>
          </div>
        )}
      </main>

      {/* Delete Account High-Severity Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] p-6"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="bg-white dark:bg-[#16181c] border border-[#cf202f]/20 rounded-[24px] p-8 w-full max-w-lg flex flex-col gap-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#cf202f] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-[#cf202f]">Permanent Account Deletion</h3>
                  <p className="text-xs text-[#cf202f]/70 mt-0.5">This action is irreversible and permanent.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !deleting && setShowDeleteModal(false)}
                className="p-1.5 rounded-full hover:bg-[#f7f7f7] dark:hover:bg-[#212327] text-[#5b616e] transition-colors"
                disabled={deleting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#cf202f]/5 border border-[#cf202f]/15">
              <p className="text-xs font-semibold text-[#cf202f] mb-2">The following resources will be permanently purged:</p>
              <ul className="text-xs text-[#5b616e] dark:text-[#a8acb3] flex flex-col gap-1.5 pl-4 list-disc">
                <li>All uploaded PDF/DOCX files from object storage</li>
                <li>All vector embeddings & local search indices</li>
                <li>All chat sessions, message histories, and citations</li>
                <li>Your profile credentials, avatar, and preferences</li>
              </ul>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-[#cf202f]/10 border border-[#cf202f]/30 text-[#cf202f] text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDelete} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3] flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Enter Password to Confirm
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your account password"
                  required
                  disabled={deleting}
                  className="w-full h-11 px-4 bg-[#f7f7f7] dark:bg-[#212327] border border-[#dee1e6] dark:border-[#212327] rounded-xl text-sm text-[#0a0b0d] dark:text-white outline-none focus:border-[#0052ff] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3]">
                  Type <span className="text-[#cf202f]">DELETE MY ACCOUNT</span> below
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  required
                  disabled={deleting}
                  className="w-full h-11 px-4 bg-[#f7f7f7] dark:bg-[#212327] border border-[#dee1e6] dark:border-[#212327] rounded-xl text-sm text-[#0a0b0d] dark:text-white outline-none focus:border-[#cf202f] transition-all"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 h-11 rounded-full border border-[#dee1e6] dark:border-[#212327] text-sm text-[#5b616e] hover:bg-[#f7f7f7] dark:hover:bg-[#212327] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || !password || confirmText.trim() !== 'DELETE MY ACCOUNT'}
                  className="flex-[2] h-11 rounded-full bg-[#cf202f] hover:bg-[#a01524] disabled:bg-[#cf202f]/40 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Purging Account & Data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete Everything</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

