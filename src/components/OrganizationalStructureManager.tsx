import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  MapPin, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  Search,
  Filter,
  Sparkles,
  Phone,
  Landmark,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Language, AuthUser, PostDesignation, OrgWing, OrgDistrict } from '../types';
import { storageService } from '../services/storageService';
import { LadderSymbolIcon, PartyFlagIcon } from './PartySymbol';

interface Props {
  lang: Language;
  currentUser: AuthUser;
}

export const OrganizationalStructureManager: React.FC<Props> = ({ lang, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'wings' | 'districts'>('posts');
  
  // Data states
  const [posts, setPosts] = useState<PostDesignation[]>([]);
  const [wings, setWings] = useState<OrgWing[]>([]);
  const [districts, setDistricts] = useState<OrgDistrict[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDesignation | null>(null);

  const [showWingModal, setShowWingModal] = useState(false);
  const [editingWing, setEditingWing] = useState<OrgWing | null>(null);

  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<OrgDistrict | null>(null);

  // Form states: Posts
  const [postTitleEn, setPostTitleEn] = useState('');
  const [postTitleHi, setPostTitleHi] = useState('');
  const [postLevel, setPostLevel] = useState<PostDesignation['level']>('state');
  const [postWingId, setPostWingId] = useState('myl_cadre');
  const [postDescEn, setPostDescEn] = useState('');
  const [postDescHi, setPostDescHi] = useState('');
  const [postStatus, setPostStatus] = useState<PostDesignation['status']>('active');
  const [postTerm, setPostTerm] = useState(2);

  // Form states: Wings
  const [wingCode, setWingCode] = useState('');
  const [wingNameEn, setWingNameEn] = useState('');
  const [wingNameHi, setWingNameHi] = useState('');
  const [wingColor, setWingColor] = useState('emerald');
  const [wingFocusEn, setWingFocusEn] = useState('');
  const [wingFocusHi, setWingFocusHi] = useState('');
  const [wingDescEn, setWingDescEn] = useState('');
  const [wingDescHi, setWingDescHi] = useState('');
  const [wingHead, setWingHead] = useState('');
  const [wingBadge, setWingBadge] = useState('Affiliated Wing');

  // Form states: Districts
  const [distNameEn, setDistNameEn] = useState('');
  const [distNameHi, setDistNameHi] = useState('');
  const [distZone, setDistZone] = useState<OrgDistrict['zone']>('Rohilkhand');
  const [distSubDistricts, setDistSubDistricts] = useState('');
  const [distHeadquarters, setDistHeadquarters] = useState('');
  const [distInCharge, setDistInCharge] = useState('');
  const [distPhone, setDistPhone] = useState('+91 ');
  const [distCadreCount, setDistCadreCount] = useState(150);

  const isAuthorized = currentUser.role === 'superadmin' || currentUser.role === 'state_president';

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setPosts(storageService.getPosts());
    setWings(storageService.getWings());
    setDistricts(storageService.getOrgDistricts());
  };

  // POST CRUD Handlers
  const openNewPostModal = () => {
    setEditingPost(null);
    setPostTitleEn('');
    setPostTitleHi('');
    setPostLevel('state');
    setPostWingId('myl_cadre');
    setPostDescEn('');
    setPostDescHi('');
    setPostStatus('active');
    setPostTerm(2);
    setShowPostModal(true);
  };

  const openEditPostModal = (post: PostDesignation) => {
    setEditingPost(post);
    setPostTitleEn(post.titleEn);
    setPostTitleHi(post.titleHi);
    setPostLevel(post.level);
    setPostWingId(post.wingId || 'myl_cadre');
    setPostDescEn(post.descriptionEn);
    setPostDescHi(post.descriptionHi);
    setPostStatus(post.status);
    setPostTerm(post.termYears || 2);
    setShowPostModal(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitleEn || !postTitleHi) return;
    const postData: PostDesignation = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      titleEn: postTitleEn,
      titleHi: postTitleHi,
      level: postLevel,
      wingId: postWingId,
      descriptionEn: postDescEn,
      descriptionHi: postDescHi,
      status: postStatus,
      termYears: Number(postTerm) || 2,
    };
    storageService.savePost(postData);
    loadAllData();
    setShowPostModal(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm(lang === 'hi' ? 'क्या आप इस पद को हटाना चाहते हैं?' : 'Are you sure you want to delete this designation post?')) {
      storageService.deletePost(id);
      loadAllData();
    }
  };

  // WING CRUD Handlers
  const openNewWingModal = () => {
    setEditingWing(null);
    setWingCode(`wing_${Date.now().toString().slice(-4)}`);
    setWingNameEn('');
    setWingNameHi('');
    setWingColor('emerald');
    setWingFocusEn('');
    setWingFocusHi('');
    setWingDescEn('');
    setWingDescHi('');
    setWingHead('');
    setWingBadge('Affiliated Wing');
    setShowWingModal(true);
  };

  const openEditWingModal = (wing: OrgWing) => {
    setEditingWing(wing);
    setWingCode(wing.code);
    setWingNameEn(wing.nameEn);
    setWingNameHi(wing.nameHi);
    setWingColor(wing.color);
    setWingFocusEn(wing.focusEn);
    setWingFocusHi(wing.focusHi);
    setWingDescEn(wing.descriptionEn);
    setWingDescHi(wing.descriptionHi);
    setWingHead(wing.headLeaderName || '');
    setWingBadge(wing.badgeLabel || 'Affiliated Wing');
    setShowWingModal(true);
  };

  const handleSaveWing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wingNameEn || !wingNameHi) return;
    const wingData: OrgWing = {
      id: editingWing ? editingWing.id : `wing-${Date.now()}`,
      code: wingCode || `wing_${Date.now().toString().slice(-4)}`,
      nameEn: wingNameEn,
      nameHi: wingNameHi,
      color: wingColor,
      focusEn: wingFocusEn,
      focusHi: wingFocusHi,
      descriptionEn: wingDescEn,
      descriptionHi: wingDescHi,
      headLeaderName: wingHead,
      badgeLabel: wingBadge,
    };
    storageService.saveWing(wingData);
    loadAllData();
    setShowWingModal(false);
  };

  const handleDeleteWing = (id: string) => {
    if (confirm(lang === 'hi' ? 'क्या आप इस विंग/प्रकोष्ठ को हटाना चाहते हैं?' : 'Are you sure you want to delete this organizational wing?')) {
      storageService.deleteWing(id);
      loadAllData();
    }
  };

  // DISTRICT CRUD Handlers
  const openNewDistrictModal = () => {
    setEditingDistrict(null);
    setDistNameEn('');
    setDistNameHi('');
    setDistZone('Rohilkhand');
    setDistSubDistricts('');
    setDistHeadquarters('');
    setDistInCharge('');
    setDistPhone('+91 ');
    setDistCadreCount(120);
    setShowDistrictModal(true);
  };

  const openEditDistrictModal = (dist: OrgDistrict) => {
    setEditingDistrict(dist);
    setDistNameEn(dist.nameEn);
    setDistNameHi(dist.nameHi);
    setDistZone(dist.zone);
    setDistSubDistricts(dist.subDistricts.join(', '));
    setDistHeadquarters(dist.headquarters || '');
    setDistInCharge(dist.inChargeName);
    setDistPhone(dist.inChargePhone);
    setDistCadreCount(dist.activeCadreCount);
    setShowDistrictModal(true);
  };

  const handleSaveDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distNameEn || !distNameHi) return;
    const subDistArray = distSubDistricts
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const distData: OrgDistrict = {
      id: editingDistrict ? editingDistrict.id : `org-dist-${Date.now()}`,
      nameEn: distNameEn,
      nameHi: distNameHi,
      zone: distZone,
      subDistricts: subDistArray.length ? subDistArray : ['Sadar', 'City Unit'],
      headquarters: distHeadquarters,
      inChargeName: distInCharge,
      inChargePhone: distPhone,
      activeCadreCount: Number(distCadreCount) || 50,
      status: 'active',
    };
    storageService.saveOrgDistrict(distData);
    loadAllData();
    setShowDistrictModal(false);
  };

  const handleDeleteDistrict = (id: string) => {
    if (confirm(lang === 'hi' ? 'क्या आप इस ज़िला इकाई को हटाना चाहते हैं?' : 'Are you sure you want to delete this district record?')) {
      storageService.deleteOrgDistrict(id);
      loadAllData();
    }
  };

  // Access Guard
  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">
          {lang === 'hi' ? 'संगठनात्मक संरचना प्रबंधन (प्रतिबंधित पहुंच)' : 'Organizational Structure Desk (Restricted Access)'}
        </h2>
        <p className="text-stone-600 max-w-lg mx-auto text-sm leading-relaxed">
          {lang === 'hi'
            ? 'पार्टी के नए पद (Posts), विंग्स (Wings) और उत्तर प्रदेश के ज़िलों (Districts) का CRUD प्रबंधन केवल "Super Admin" या "State President" की भूमिका द्वारा किया जा सकता है।'
            : 'Access to create, edit, or delete party posts, wings, and UP districts CRUD is exclusively restricted to the "Super Admin" or "State President" roles.'}
        </p>
        <div className="inline-block p-3 bg-stone-100 rounded-xl text-xs font-mono text-stone-700">
          Current Role: <span className="font-bold text-rose-700 uppercase">{currentUser.role}</span>
        </div>
      </div>
    );
  }

  // Filtered Lists
  const filteredPosts = posts.filter((p) => {
    const matchesSearch = 
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || p.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const filteredWings = wings.filter((w) => {
    return (
      w.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.focusEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.focusHi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredDistricts = districts.filter((d) => {
    const matchesSearch = 
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.inChargeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subDistricts.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesZone = zoneFilter === 'all' || d.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded border border-emerald-700">
                {currentUser.role === 'superadmin' ? 'Super Admin Desk' : 'State President Desk'}
              </span>
              <span className="text-xs text-stone-300 font-mono">
                UP State Committee Command
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <LadderSymbolIcon size={28} />
              <span>{lang === 'hi' ? 'संगठनात्मक नेटवर्क व ढांचा प्रबंधन' : 'Organizational Network & Structure Management'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              {lang === 'hi'
                ? 'मुस्लिम यूथ लीग व सहयोगी प्रकोष्ठों के आधिकारिक पद (Posts/Designations), विभिन्न विंग्स (Wings) और उत्तर प्रदेश के 75 ज़िलों (Districts) का लाइव CRUD नियंत्रण।'
                : 'Centralized live administration of executive posts, specialized wings, and Uttar Pradesh district & zonal units.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 text-center">
              <div className="text-lg font-black text-emerald-400">{posts.length}</div>
              <div className="text-[10px] text-stone-300 uppercase font-semibold">{lang === 'hi' ? 'कुल पद' : 'Posts'}</div>
            </div>
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 text-center">
              <div className="text-lg font-black text-blue-400">{wings.length}</div>
              <div className="text-[10px] text-stone-300 uppercase font-semibold">{lang === 'hi' ? 'विंग्स' : 'Wings'}</div>
            </div>
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 text-center">
              <div className="text-lg font-black text-amber-400">{districts.length}</div>
              <div className="text-[10px] text-stone-300 uppercase font-semibold">{lang === 'hi' ? 'सक्रिय ज़िले' : 'Districts'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setActiveSubTab('posts'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'posts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{lang === 'hi' ? '1. पद एवं दायित्व (Posts)' : '1. Posts & Designations'}</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full font-mono">{posts.length}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveSubTab('wings'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'wings'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'hi' ? '2. संगठन के विंग्स (Wings)' : '2. Wings & Fronts'}</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full font-mono">{wings.length}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveSubTab('districts'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'districts'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{lang === 'hi' ? '3. यूपी ज़िले (Districts)' : '3. UP Districts'}</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full font-mono">{districts.length}</span>
          </button>
        </div>

        {/* Primary Action Button */}
        <div>
          {activeSubTab === 'posts' && (
            <button
              type="button"
              onClick={openNewPostModal}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया पद जोड़ें (Add Post)' : 'Create New Post'}</span>
            </button>
          )}

          {activeSubTab === 'wings' && (
            <button
              type="button"
              onClick={openNewWingModal}
              className="px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया विंग जोड़ें (Add Wing)' : 'Register New Wing'}</span>
            </button>
          )}

          {activeSubTab === 'districts' && (
            <button
              type="button"
              onClick={openNewDistrictModal}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया ज़िला जोड़ें (Add District)' : 'Add UP District Unit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'posts' 
                ? (lang === 'hi' ? 'पद का नाम या विवरण खोजें...' : 'Search posts by title or level...')
                : activeSubTab === 'wings'
                ? (lang === 'hi' ? 'विंग का नाम या फोकस खोजें...' : 'Search wings by name or focus...')
                : (lang === 'hi' ? 'ज़िला, तहसील या प्रभारी खोजें...' : 'Search district, tehsil or in-charge...')
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 bg-stone-50"
          />
        </div>

        {activeSubTab === 'posts' && (
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-stone-500 font-semibold shrink-0">{lang === 'hi' ? 'स्तर:' : 'Level:'}</span>
            {['all', 'state', 'district', 'block', 'ward'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold capitalize transition-colors ${
                  levelFilter === lvl
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        )}

        {activeSubTab === 'districts' && (
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-stone-500 font-semibold shrink-0">{lang === 'hi' ? 'ज़ोन:' : 'Zone:'}</span>
            {['all', 'Rohilkhand', 'Western UP', 'Awadh', 'Purvanchal'].map((zn) => (
              <button
                key={zn}
                type="button"
                onClick={() => setZoneFilter(zn)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors ${
                  zoneFilter === zn
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {zn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUBTAB 1: POSTS CRUD */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-emerald-600 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      post.level === 'state' ? 'bg-purple-100 text-purple-800' :
                      post.level === 'district' ? 'bg-emerald-100 text-emerald-800' :
                      post.level === 'block' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {post.level} Level
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Term: {post.termYears || 2} yrs
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                    {lang === 'hi' ? post.titleHi : post.titleEn}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium">
                    {lang === 'hi' ? post.titleEn : post.titleHi}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    {lang === 'hi' ? post.descriptionHi : post.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Status: {post.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditPostModal(post)}
                      className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300 text-stone-500 text-sm">
              {lang === 'hi' ? 'कोई पद नहीं मिला।' : 'No designation posts match the current filter.'}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: WINGS CRUD */}
      {activeSubTab === 'wings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWings.map((wing) => (
              <div
                key={wing.id}
                className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs hover:border-blue-800 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded font-mono">
                      {wing.code}
                    </span>
                    {wing.badgeLabel && (
                      <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {wing.badgeLabel}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-stone-900">
                      {lang === 'hi' ? wing.nameHi : wing.nameEn}
                    </h3>
                    <div className="text-xs text-stone-500 font-semibold">
                      {lang === 'hi' ? wing.nameEn : wing.nameHi}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-lg text-xs font-semibold text-stone-800">
                    <span className="text-emerald-800 font-bold block mb-0.5">{lang === 'hi' ? 'प्रमुख फोकस / कार्यक्षेत्र:' : 'Primary Focus:'}</span>
                    {lang === 'hi' ? wing.focusHi : wing.focusEn}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lang === 'hi' ? wing.descriptionHi : wing.descriptionEn}
                  </p>

                  {wing.headLeaderName && (
                    <div className="text-xs text-stone-700 flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>{lang === 'hi' ? 'राज्य प्रभारी / प्रमुख:' : 'State In-Charge:'}</span>
                      <strong className="text-stone-900">{wing.headLeaderName}</strong>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditWingModal(wing)}
                    className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'संपादित करें' : 'Edit Wing'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteWing(wing.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Wing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DISTRICTS CRUD */}
      {activeSubTab === 'districts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistricts.map((dist) => (
              <div
                key={dist.id}
                className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-emerald-700 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {dist.zone}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                      {dist.activeCadreCount} Cadres
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{lang === 'hi' ? dist.nameHi : dist.nameEn}</span>
                    </h3>
                    <div className="text-xs text-stone-500 font-semibold pl-6">
                      {lang === 'hi' ? dist.nameEn : dist.nameHi} District Unit
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 bg-stone-50 p-3 rounded-lg border border-stone-200/70">
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="font-semibold text-stone-500">{lang === 'hi' ? 'ज़िला प्रभारी:' : 'In-Charge:'}</span>
                      <strong className="text-stone-900">{dist.inChargeName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="font-semibold text-stone-500">{lang === 'hi' ? 'फोन नंबर:' : 'Phone:'}</span>
                      <span className="font-mono text-emerald-800 font-bold">{dist.inChargePhone}</span>
                    </div>
                    {dist.headquarters && (
                      <div className="flex items-center justify-between text-stone-700 text-[11px]">
                        <span className="font-semibold text-stone-500">{lang === 'hi' ? 'मुख्यालय:' : 'HQ:'}</span>
                        <span className="truncate max-w-[150px]">{dist.headquarters}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-stone-600 mb-1.5">
                      {lang === 'hi' ? 'तहसील / ब्लॉक इकाइयां:' : 'Sub-Districts & Tehsils:'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dist.subDistricts.map((sub, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditDistrictModal(dist)}
                    className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'संपादित करें' : 'Edit Unit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDistrict(dist.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete District"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT POST */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-stone-900">
                {editingPost 
                  ? (lang === 'hi' ? 'पद संपादित करें' : 'Edit Designation Post')
                  : (lang === 'hi' ? 'नया पद बनाएं' : 'Create New Designation Post')}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowPostModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Post Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={postTitleEn}
                    onChange={(e) => setPostTitleEn(e.target.value)}
                    placeholder="e.g. State Vice President"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">पद का शीर्षक (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={postTitleHi}
                    onChange={(e) => setPostTitleHi(e.target.value)}
                    placeholder="जैसे: प्रदेश उपाध्यक्ष"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Level *</label>
                  <select
                    value={postLevel}
                    onChange={(e) => setPostLevel(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="state">State (प्रदेश)</option>
                    <option value="zonal">Zonal (ज़ोनल)</option>
                    <option value="district">District (ज़िला)</option>
                    <option value="block">Block / Campus (ब्लॉक)</option>
                    <option value="ward">Ward / Mohalla (वार्ड)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Term (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={postTerm}
                    onChange={(e) => setPostTerm(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="reserved">Reserved</option>
                    <option value="vacant">Vacant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Role Description (English)</label>
                <textarea
                  rows={2}
                  value={postDescEn}
                  onChange={(e) => setPostDescEn(e.target.value)}
                  placeholder="Key responsibilities and organizational functions..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">दायित्व विवरण (हिंदी)</label>
                <textarea
                  rows={2}
                  value={postDescHi}
                  onChange={(e) => setPostDescHi(e.target.value)}
                  placeholder="मुख्य कार्य व संगठनात्मक भूमिका का संक्षिप्त विवरण..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-bold hover:bg-stone-100"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingPost ? (lang === 'hi' ? 'अपडेट करें' : 'Save Changes') : (lang === 'hi' ? 'पद बनाएं' : 'Create Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT WING */}
      {showWingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-stone-900">
                {editingWing 
                  ? (lang === 'hi' ? 'विंग संपादित करें' : 'Edit Organizational Wing')
                  : (lang === 'hi' ? 'नया विंग जोड़ें' : 'Register New Wing / Cell')}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowWingModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWing} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Wing Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={wingNameEn}
                    onChange={(e) => setWingNameEn(e.target.value)}
                    placeholder="e.g. Lawyers & Legal Forum"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">विंग का नाम (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={wingNameHi}
                    onChange={(e) => setWingNameHi(e.target.value)}
                    placeholder="जैसे: विधिक व मानवाधिकार प्रकोष्ठ"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Wing Unique Code *</label>
                  <input
                    type="text"
                    required
                    value={wingCode}
                    onChange={(e) => setWingCode(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="e.g. legal_forum"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State In-Charge / Leader</label>
                  <input
                    type="text"
                    value={wingHead}
                    onChange={(e) => setWingHead(e.target.value)}
                    placeholder="e.g. Adv. Sarfaraz Ahmed"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Primary Focus Area (English) *</label>
                <input
                  type="text"
                  required
                  value={wingFocusEn}
                  onChange={(e) => setWingFocusEn(e.target.value)}
                  placeholder="e.g. Free legal defense, RTI filing for youth..."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">मुख्य कार्यक्षेत्र (हिंदी) *</label>
                <input
                  type="text"
                  required
                  value={wingFocusHi}
                  onChange={(e) => setWingFocusHi(e.target.value)}
                  placeholder="जैसे: निःशुल्क कानूनी सहायता, आरटीआई क्लिनिक..."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Description (English)</label>
                <textarea
                  rows={2}
                  value={wingDescEn}
                  onChange={(e) => setWingDescEn(e.target.value)}
                  placeholder="Objectives, targeted youth demographic..."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">विस्तृत विवरण (हिंदी)</label>
                <textarea
                  rows={2}
                  value={wingDescHi}
                  onChange={(e) => setWingDescHi(e.target.value)}
                  placeholder="उद्देश्य, लक्षित युवा वर्ग व कार्यप्रणाली..."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowWingModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-bold hover:bg-stone-100"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingWing ? (lang === 'hi' ? 'अपडेट करें' : 'Save Changes') : (lang === 'hi' ? 'विंग बनाएं' : 'Save Wing')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT DISTRICT */}
      {showDistrictModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-stone-900">
                {editingDistrict 
                  ? (lang === 'hi' ? 'ज़िला इकाई संपादित करें' : 'Edit UP District Unit')
                  : (lang === 'hi' ? 'नया ज़िला इकाई जोड़ें' : 'Add New UP District Unit')}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowDistrictModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDistrict} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">District Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={distNameEn}
                    onChange={(e) => setDistNameEn(e.target.value)}
                    placeholder="e.g. Saharanpur"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ज़िले का नाम (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={distNameHi}
                    onChange={(e) => setDistNameHi(e.target.value)}
                    placeholder="जैसे: सहारनपुर"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Zone (क्षेत्र) *</label>
                  <select
                    value={distZone}
                    onChange={(e) => setDistZone(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Rohilkhand">Rohilkhand (रुहेलखंड)</option>
                    <option value="Western UP">Western UP (पश्चिमी यूपी)</option>
                    <option value="Awadh">Awadh (अवध)</option>
                    <option value="Purvanchal">Purvanchal (पूर्वांचल)</option>
                    <option value="Bundelkhand">Bundelkhand (बुंदेलखंड)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Active Cadre Count</label>
                  <input
                    type="number"
                    value={distCadreCount}
                    onChange={(e) => setDistCadreCount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">In-Charge Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={distInCharge}
                    onChange={(e) => setDistInCharge(e.target.value)}
                    placeholder="e.g. Adv. Zeeshan Farooqui"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={distPhone}
                    onChange={(e) => setDistPhone(e.target.value)}
                    placeholder="+91 98370 XXXXX"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">District Headquarters / Office Address</label>
                <input
                  type="text"
                  value={distHeadquarters}
                  onChange={(e) => setDistHeadquarters(e.target.value)}
                  placeholder="e.g. Station Road, Moradabad"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Sub-Districts & Tehsils (Comma separated) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={distSubDistricts}
                  onChange={(e) => setDistSubDistricts(e.target.value)}
                  placeholder="e.g. Moradabad Sadar, Bilari, Kanth, Thakurdwara, Sambhal Road"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowDistrictModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-bold hover:bg-stone-100"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingDistrict ? (lang === 'hi' ? 'अपडेट करें' : 'Save Changes') : (lang === 'hi' ? 'ज़िला जोड़ें' : 'Save District')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
