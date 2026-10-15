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
  Filter,
  Eye,
  EyeOff,
  Radio,
  FileText
} from 'lucide-react';
import { AuthUser, UserRole, Language } from '../types';
import { storageService } from '../services/storageService';
import { LadderSymbolIcon } from './PartySymbol';
import { referenceDataService, type DistrictOption, type LookupOption } from '../services/referenceDataService';

interface Props {
  lang: Language;
  currentUser: AuthUser;
  onUserUpdated: () => void;
  onNavigateToStructure?: () => void;
  onNavigateLogin?: () => void;
}

export const RoleManagementView: React.FC<Props> = ({ 
  lang, 
  currentUser, 
  onUserUpdated,
  onNavigateToStructure,
  onNavigateLogin
}) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<LookupOption[]>([]);
  const [lookupError, setLookupError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  
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
  const [resetError, setResetError] = useState<string | null>(null);

  const isSuperAdmin = currentUser.role === 'superadmin';
  const canManageRoles = isSuperAdmin;

  useEffect(() => {
    loadUsers();
    let cancelled = false;
    void Promise.all([referenceDataService.districts(), referenceDataService.roles()])
      .then(([districtRows, roleRows]) => {
        if (cancelled) return;
        setDistrictOptions(districtRows);
        setRoleOptions(roleRows);
        setLookupError('');
      })
      .catch((error: unknown) => {
        if (!cancelled) setLookupError(error instanceof Error ? error.message : 'Could not load role/district lookups.');
      });
    return () => { cancelled = true; };
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
      setCreateSuccess(lang === 'hi' ? 'नया खाता सफलतापूर्वक बनाया गया!' : 'New account created successfully!');
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
    setResetError(null);
    if (!passwordModalUser || !newResetPassword) return;

    const res = storageService.changeUserPasswordWithPermission(
      currentUser,
      passwordModalUser.id,
      newResetPassword
    );

    if (res.success) {
      setResetSuccess(true);
      loadUsers();
      onUserUpdated();
      setTimeout(() => {
        setPasswordModalUser(null);
        setResetSuccess(false);
        setNewResetPassword('');
      }, 1200);
    } else {
      setResetError(res.error || 'Permission denied.');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own active account.");
      return;
    }
    if (confirm(lang === 'hi' ? 'क्या आप इस खाते को निरस्त व हटाना चाहते हैं?' : 'Are you sure you want to revoke and delete this account?')) {
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

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-rose-100 text-rose-800 border border-rose-300">Super Admin</span>;
      case 'state_president':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-purple-100 text-purple-900 border border-purple-300">State President</span>;
      case 'press_release':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-amber-100 text-amber-900 border border-amber-300">Press / Media In-Charge</span>;
      case 'content_manager':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-cyan-100 text-cyan-900 border border-cyan-300">Content Manager</span>;
      case 'state_admin':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">State Admin</span>;
      case 'district_incharge':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-900 border border-blue-300">District In-Charge</span>;
      case 'cadre_volunteer':
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-stone-100 text-stone-700 border border-stone-300">Cadre Volunteer</span>;
      default:
        return <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-stone-100 text-stone-500">Public</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <LadderSymbolIcon size={18} />
            <span>{lang === 'hi' ? 'सुरक्षित भूमिका एवं विशेषाधिकार प्रबंधन' : 'Post-Login Role & Access Control Desk'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-rose-800">
              {isSuperAdmin ? 'Super Admin Mode Active' : 'Restricted Role Mode'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {lang === 'hi' ? 'भूमिका एवं कैडर अधिकार प्रबंधन' : 'Role Management & Security Permissions'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            {lang === 'hi'
              ? 'सुपर एडमिन (Super Admin) सभी पासवर्ड देख सकते हैं और किसी भी खाते का पासवर्ड बदल सकते हैं। अन्य उपयोगकर्ता केवल अपना पासवर्ड बदल सकते हैं।'
              : 'Super Admin has master privileges to see all passwords, change any password, and assign roles. Non-admin users can update their own password only.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {onNavigateToStructure && (isSuperAdmin || currentUser.role === 'state_president') && (
            <button
              type="button"
              onClick={onNavigateToStructure}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all border border-stone-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'hi' ? 'विंग्स व ज़िले CRUD' : 'Wings & Districts CRUD'}</span>
            </button>
          )}

          {canManageRoles && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ नया पदाधिकारी खाता' : '+ Create Account'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Operator Session Strip */}
      <div className="p-5 bg-white border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-blue-900 text-white font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <span>{currentUser.name}</span>
              {getRoleBadge(currentUser.role)}
            </div>
            <div className="text-stone-500 text-xs mt-0.5">
              {currentUser.designation} {currentUser.district && `(${currentUser.district} District)`} · <span className="font-mono">{currentUser.email || currentUser.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'public' && onNavigateLogin ? (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'पासवर्ड से लॉगिन करें' : 'Log In with Password'}</span>
            </button>
          ) : isSuperAdmin ? (
            <div className="text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>Super Admin Authority: Master Password & Role Access</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPasswordModalUser(currentUser);
                setNewResetPassword('');
              }}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? 'मेरा पासवर्ड बदलें' : 'Change My Password'}</span>
            </button>
          )}
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
                <th className="p-3">Capability / Feature</th>
                <th className="p-3 text-rose-800">Super Admin</th>
                <th className="p-3 text-purple-900">State President</th>
                <th className="p-3 text-amber-900">Press Release</th>
                <th className="p-3 text-cyan-900">Content Manager</th>
                <th className="p-3 text-blue-900">District In-Charge</th>
                <th className="p-3 text-stone-700">Cadre Volunteer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[11px] text-stone-700">
              <tr>
                <td className="p-3 font-semibold text-stone-900">View All Passwords</td>
                <td className="p-3 text-rose-700 font-bold">✓ Full visibility</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Change Any User's Password</td>
                <td className="p-3 text-rose-700 font-bold">✓ Master override</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
                <td className="p-3 text-stone-400">✕ Own only</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Posts, Wings & Districts CRUD</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Full access</td>
                <td className="p-3 text-purple-800 font-bold">✓ Full access</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Press Release & Event Publishing</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Full access</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-amber-800 font-bold">✓ Add/Edit/Delete</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">RSVP only</td>
                <td className="p-3 text-stone-400">RSVP only</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">FAQ & Leader Content Editing</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Full access</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-cyan-800 font-bold">✓ Bilingual Editor</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-900">Cadre Approvals & Official ID</td>
                <td className="p-3 text-emerald-700 font-bold">✓ Statewide</td>
                <td className="p-3 text-purple-800 font-bold">✓ Statewide</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-stone-400">✕ Restricted</td>
                <td className="p-3 text-blue-800 font-bold">✓ District Only</td>
                <td className="p-3 text-emerald-700 font-bold">Verified Card</td>
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
              {lang === 'hi' ? 'सक्रिय पदाधिकारी एवं कैडर खाते' : 'Registered Accounts & Password Master Directory'}
            </h3>
            <span className="text-xs text-stone-500">
              {filteredUsers.length} {lang === 'hi' ? 'खाते सूचीबद्ध' : 'accounts listed'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setShowAllPasswords(!showAllPasswords)}
                className="px-2.5 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {showAllPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAllPasswords ? 'Mask Passwords' : 'Show All Passwords'}</span>
              </button>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search name, phone, email..."
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
              {roleOptions.map((item) => <option key={item.id} value={item.code}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)
            </select>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredUsers.map((u) => {
            const isSelf = u.id === currentUser.id;
            const canChangeThisPassword = isSuperAdmin || isSelf;

            return (
              <div key={u.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-stone-50/60 p-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0 mt-0.5">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-2 flex-wrap">
                      <span className="text-sm">{u.name}</span>
                      {isSelf && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          LOGGED IN
                        </span>
                      )}
                      {getRoleBadge(u.role)}
                    </div>

                    <div className="text-stone-500 text-[11px] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span>{u.designation}</span>
                      {u.district && <span>· District: <strong>{u.district}</strong></span>}
                      <span>· Phone: <span className="font-mono">{u.phone || 'N/A'}</span></span>
                      {u.email && <span>· Email: <span className="font-mono text-stone-600">{u.email}</span></span>}
                    </div>

                    {/* Password display: Super Admin sees all passwords */}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-stone-500 font-semibold">Password:</span>
                      {isSuperAdmin || isSelf ? (
                        <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {isSuperAdmin && !showAllPasswords && !isSelf ? '••••••••' : u.password || 'not set'}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-stone-400">•••••••• (Hidden)</span>
                      )}
                      <span className="text-[10px] text-stone-400">· Last Active: {u.lastLogin || 'Recent'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {canChangeThisPassword ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordModalUser(u);
                        setNewResetPassword('');
                        setResetError(null);
                      }}
                      className="px-3 py-1.5 text-xs text-stone-800 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                      title={isSuperAdmin && !isSelf ? "Change this user's password (Super Admin)" : "Change your password"}
                    >
                      <Key className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isSelf ? 'Change Password' : 'Reset Password'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-400 italic flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Protected</span>
                    </span>
                  )}

                  {canManageRoles && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setEditRole(u.role);
                          setEditDistrict(u.district || 'Moradabad');
                          setEditDesignation(u.designation);
                        }}
                        className="px-2.5 py-1.5 text-xs text-blue-900 hover:bg-blue-50 rounded-lg border border-blue-300 transition-colors flex items-center gap-1 cursor-pointer font-bold"
                        title="Edit Role & District"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Role</span>
                      </button>

                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
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
                  className="w-full p-2 border border-stone-300 rounded-lg focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98370 XXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="name@mylup.org"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Initial Password *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg focus:border-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white font-medium"
                  >
                    {roleOptions.map((item) => <option key={item.id} value={item.code}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District</label>
                  <select value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} disabled={districtOptions.length === 0} className="w-full p-2 border border-stone-300 rounded-lg bg-white disabled:bg-stone-100">
                    <option value="">{lang === 'hi' ? 'ज़िला चुनें' : 'Select district'}</option>
                    {districtOptions.map((item) => <option key={item.id} value={item.name_en}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Designation Title</label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="e.g. Media Coordinator, Sambhal District"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lookupError && <p role="alert" className="mx-4 text-xs text-rose-700">{lookupError}</p>}

      {/* EDIT ROLE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">
                Edit Role & Designation: {editingUser.name}
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
                <label className="block font-semibold text-stone-700 mb-1">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white font-semibold"
                >
                  {roleOptions.map((item) => <option key={item.id} value={item.code}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Assigned District</label>
                <select value={editDistrict} onChange={(e) => setEditDistrict(e.target.value)} disabled={districtOptions.length === 0} className="w-full p-2 border border-stone-300 rounded-lg bg-white disabled:bg-stone-100">
                  <option value="">{lang === 'hi' ? 'ज़िला चुनें' : 'Select district'}</option>
                  {districtOptions.map((item) => <option key={item.id} value={item.name_en}>{lang === 'hi' && item.name_hi ? item.name_hi : item.name_en}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Official Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-xs cursor-pointer"
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
                <span>
                  {passwordModalUser.id === currentUser.id 
                    ? 'Change My Password' 
                    : `Super Admin Reset: ${passwordModalUser.name}`}
                </span>
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

            {resetError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-lg text-[11px] text-stone-600 border border-stone-200">
                User: <strong>{passwordModalUser.name}</strong> ({passwordModalUser.role})
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Enter New Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter new password"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
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
