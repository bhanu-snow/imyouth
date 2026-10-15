import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Key, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Lock, 
  Building2, 
  Sparkles,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { AuthUser, UserRole, Language } from '../types';
import { storageService } from '../services/storageService';
import { LadderSymbolIcon } from './PartySymbol';

interface Props {
  lang: Language;
  currentUser: AuthUser;
  onUserUpdated: () => void;
}

export const RoleManagementView: React.FC<Props> = ({ 
  lang, 
  currentUser, 
  onUserUpdated 
}) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<AuthUser | null>(null);
  
  // Create user form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('myl2026');
  const [newRole, setNewRole] = useState<UserRole>('district_incharge');
  const [newDistrict, setNewDistrict] = useState('Lucknow');
  const [newDesignation, setNewDesignation] = useState('District In-Charge');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Edit role form
  const [editRole, setEditRole] = useState<UserRole>('district_incharge');
  const [editDistrict, setEditDistrict] = useState('Moradabad');
  const [editDesignation, setEditDesignation] = useState('');

  // Password reset form
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const isStateAdmin = currentUser.role === 'state_admin';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(storageService.getAllUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!newName || !newPhone) {
      setCreateError('Name and phone are required.');
      return;
    }

    const res = storageService.createUserAccount({
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@mylup.org`,
      phone: newPhone,
      password: newPassword,
      role: newRole,
      district: newRole === 'district_incharge' || newRole === 'cadre_volunteer' ? newDistrict : undefined,
      designation: newDesignation,
    });

    if (res.success && res.user) {
      setCreateSuccess(lang === 'hi' ? 'नया पदाधिकारी खाता सफलतापूर्वक बनाया गया!' : 'New cadre account created successfully!');
      loadUsers();
      onUserUpdated();
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess(null);
        setNewName('');
        setNewEmail('');
        setNewPhone('');
      }, 1200);
    } else {
      setCreateError(res.error || 'Failed to create user.');
    }
  };

  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    storageService.updateUserRole(editingUser.id, editRole, editDistrict, editDesignation);
    loadUsers();
    onUserUpdated();
    setEditingUser(null);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !newResetPassword) return;
    storageService.changeUserPassword(passwordModalUser.id, newResetPassword);
    setResetSuccess(true);
    loadUsers();
    onUserUpdated();
    setTimeout(() => {
      setPasswordModalUser(null);
      setResetSuccess(false);
      setNewResetPassword('');
    }, 1200);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own active account.");
      return;
    }
    if (confirm("Are you sure you want to revoke and delete this account?")) {
      storageService.deleteUserAccount(userId);
      loadUsers();
      onUserUpdated();
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.district && u.district.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <LadderSymbolIcon size={18} />
            <span>{lang === 'hi' ? 'सुरक्षित भूमिका एवं विशेषाधिकार प्रबंधन' : 'Post-Login Role & Access Control Desk'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? 'उत्तर प्रदेश समिति' : 'UP Committee'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'भूमिका एवं कैडर अधिकार प्रबंधन' : 'Role Management & Cadre Permissions'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'लॉगिन पश्चात पदाधिकारियों, ज़िला संयोजकों और कार्यकर्ताओं के अधिकार स्तर, पासवर्ड रीसेट व नए खाते सृजन की केंद्रीय व्यवस्था।'
              : 'Post-authentication dashboard to manage office-bearer tiers, assign district jurisdictions, configure passwords, and manage administrative capabilities.'}
          </p>
        </div>

        {/* Action Button */}
        {isStateAdmin && (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'hi' ? '+ नया पदाधिकारी खाता जोड़ें' : '+ Create Office Bearer Login'}</span>
          </button>
        )}
      </div>

      {/* Current Operator Session Strip */}
      <div className="p-4 bg-white border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-900 font-extrabold flex items-center justify-center text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                currentUser.role === 'state_admin' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : currentUser.role === 'district_incharge' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-stone-200 text-stone-800'
              }`}>
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-stone-500 text-[11px]">
              {currentUser.designation} {currentUser.district && `(${currentUser.district} District)`} · {currentUser.email || currentUser.phone}
            </div>
          </div>
        </div>

        <div className="text-stone-500 text-[11px] bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
          <strong>Authentication Level:</strong> {currentUser.role === 'state_admin' ? 'Super Admin (All UP)' : 'District Executive'}
        </div>
      </div>

      {/* Permissions Matrix Breakdown */}
      <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'hi' ? 'भूमिका विशेषाधिकार मैट्रिक्स (Permissions Matrix)' : 'System Permissions Matrix by Role'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-bold uppercase text-stone-400 bg-stone-50">
                <th className="p-3">Platform Capability</th>
                <th className="p-3 text-emerald-800">State Admin (Super Admin)</th>
                <th className="p-3 text-blue-900">District In-Charge</th>
                <th className="p-3 text-stone-700">Cadre Volunteer</th>
                <th className="p-3 text-stone-400">Public / Guest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[11px] text-stone-700">
              <tr>
                <td className="p-3 font-semibold text-stone-900">Approve Cadre Applications</td>
                <td className="p-3 text-emerald-700 font-bold">✓ All 75 UP Districts</td>
                <td className="p-3 text-blue-800 font-bold">✓ Assigned District Only</td>
                <td className="p-3 text-rose-500">✕ Restricted</td>
                <td className="p-3 text-rose-500">✕ Restricted</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Add / Edit / Delete Rallies & Events</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Statewide full control</td>
                <td className="p-3 text-blue-800 font-bold">✓ District level events</td>
                <td className="p-3 text-stone-500">RSVP only</td>
                <td className="p-3 text-stone-500">View only</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Record Leadership Tenures & Appointments</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Statewide</td>
                <td className="p-3 text-blue-800 font-bold">✓ District & Tehsil units</td>
                <td className="p-3 text-rose-500">✕ Restricted</td>
                <td className="p-3 text-rose-500">✕ Restricted</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">User Role & Password Management</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Full management</td>
                <td className="p-3 text-stone-500">Self password only</td>
                <td className="p-3 text-stone-500">Self password only</td>
                <td className="p-3 text-rose-500">✕ Restricted</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Social Studio 1-Shot Broadcast</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Verified Broadcast</td>
                <td className="p-3 text-blue-800 font-bold">✓ Verified Broadcast</td>
                <td className="p-3 text-emerald-700 font-bold">✓ WhatsApp / Social Share</td>
                <td className="p-3 text-stone-500">Public share</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* User Accounts Directory Table */}
      <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              {lang === 'hi' ? 'सक्रिय पदाधिकारी एवं कैडर खाते' : 'Office Bearer & Cadre User Accounts'}
            </h3>
            <span className="text-xs text-stone-500">
              {filteredUsers.length} {lang === 'hi' ? 'पंजीकृत खाते' : 'accounts active'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white font-medium"
            >
              <option value="all">All Roles (सभी)</option>
              <option value="state_admin">State Admin</option>
              <option value="district_incharge">District In-Charge</option>
              <option value="cadre_volunteer">Cadre Volunteer</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredUsers.map((u) => {
            const isSelf = u.id === currentUser.id;
            return (
              <div key={u.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0 mt-0.5">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-2">
                      <span>{u.name}</span>
                      {isSelf && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          YOU
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        u.role === 'state_admin' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : u.role === 'district_incharge' 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-stone-500 text-[11px] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span>{u.designation}</span>
                      {u.district && <span>· District: <strong>{u.district}</strong></span>}
                      <span>· Phone: <span className="font-mono">{u.phone || 'N/A'}</span></span>
                      {u.email && <span>· Email: <span className="font-mono">{u.email}</span></span>}
                    </div>

                    <div className="text-[10px] text-stone-400 mt-0.5">
                      Password: <span className="font-mono text-stone-600 font-bold">{u.password || '******'}</span> · Last Login: {u.lastLogin || 'Recent'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordModalUser(u);
                      setNewResetPassword('');
                    }}
                    className="px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-100 rounded border border-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Change Password"
                  >
                    <Key className="w-3 h-3 text-stone-500" />
                    <span>Password</span>
                  </button>

                  {isStateAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setEditRole(u.role);
                          setEditDistrict(u.district || 'Moradabad');
                          setEditDesignation(u.designation);
                        }}
                        className="px-2.5 py-1 text-xs text-blue-900 hover:bg-blue-50 rounded border border-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit Role & District"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Role</span>
                      </button>

                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                          title="Revoke Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE NEW USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? 'नया पदाधिकारी लॉगिन खाता बनाएं' : 'Create Cadre Login Account'}</span>
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{createSuccess}</span>
              </div>
            )}

            {createError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adv. Tariq Masood"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98370 54321"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="tariq@mylup.org"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Password *</label>
                <input
                  type="text"
                  required
                  placeholder="Create password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:border-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="district_incharge">District In-Charge</option>
                    <option value="state_admin">State Admin</option>
                    <option value="cadre_volunteer">Cadre Volunteer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Designation Title</label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">
                Edit Role: {editingUser.name}
              </h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full p-2 border border-stone-300 rounded bg-white"
                >
                  <option value="state_admin">State Admin (Super Admin)</option>
                  <option value="district_incharge">District In-Charge</option>
                  <option value="cadre_volunteer">Cadre Volunteer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded text-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-700" />
                <span>Password Reset: {passwordModalUser.name}</span>
              </h3>
              <button 
                onClick={() => setPasswordModalUser(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter new password"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-mono focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
