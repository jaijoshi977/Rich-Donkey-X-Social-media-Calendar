import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Plus, 
  Upload, 
  Share2, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  FolderPlus, 
  HardDrive, 
  Film, 
  Image as ImageIcon, 
  Sliders, 
  Layers, 
  Eye, 
  AlertCircle,
  X,
  Settings,
  FolderOpen,
  Loader2
} from 'lucide-react';

// Connect to your live Supabase database
const SUPABASE_URL = 'https://rsxbwvysdbdgdnxhdbug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzeGJ3dnlzZGJkZ2RueGhkYnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NzQzMTUsImV4cCI6MjEwNjQ1MDMxNX0.FA42dTqPaICmMy6Q-RaJO4wnQEQzNkC22HbOc8k4gWw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEFAULT_CLIENT = {
  id: 'sarvam-solar',
  name: 'Sarvam Surya Solar',
  category: 'Renewable Energy & Solar EPC',
  avatar: '☀️',
  color: '#0284c7',
  token: 'srvm_9021',
  drive_folder_url: 'https://drive.google.com/drive/folders/',
  drive_notes: 'Primary folder for monthly creatives and ad assets.'
};

export default function App() {
  const [clients, setClients] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClientMode, setIsClientMode] = useState(false);
  const [activeClientId, setActiveClientId] = useState('');

  // 1. Fetch live data from Supabase on load
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Clients
      let { data: clientData, error: clientErr } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: true });

      if (clientErr) throw clientErr;

      // If no clients exist yet, seed the initial one
      if (!clientData || clientData.length === 0) {
        const { data: seeded } = await supabase.from('clients').insert([DEFAULT_CLIENT]).select();
        clientData = seeded || [DEFAULT_CLIENT];
      }

      setClients(clientData);

      // Check URL parameters for magic client link
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client');
      const tokenParam = params.get('token');

      let currentId = clientData[0]?.id;
      if (clientParam) {
        const matched = clientData.find(c => c.id === clientParam);
        if (matched) {
          currentId = matched.id;
          if (tokenParam === matched.token) {
            setIsClientMode(true);
          }
        }
      }
      setActiveClientId(currentId);

      // Fetch Posts
      const { data: postData, error: postErr } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postErr) throw postErr;
      setPosts(postData || []);
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeClient = useMemo(() => {
    return clients.find(c => c.id === activeClientId) || clients[0] || DEFAULT_CLIENT;
  }, [clients, activeClientId]);

  // Calendar Date Navigation
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const handleResetToOct = () => setCurrentDate(new Date(2026, 9, 1));

  // Modals & UI States
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditDriveModalOpen, setIsEditDriveModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [newRemarkText, setNewRemarkText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client form states
  const [newClientName, setNewClientName] = useState('');
  const [newClientCategory, setNewClientCategory] = useState('');
  const [newClientAvatar, setNewClientAvatar] = useState('🎯');
  const [newClientDriveUrl, setNewClientDriveUrl] = useState('');

  // Edit Drive settings states
  const [editDriveUrl, setEditDriveUrl] = useState('');
  const [editDriveNotes, setEditDriveNotes] = useState('');

  const handleOpenEditDrive = () => {
    setEditDriveUrl(activeClient.drive_folder_url || '');
    setEditDriveNotes(activeClient.drive_notes || '');
    setIsEditDriveModalOpen(true);
  };

  const handleSaveDriveSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          drive_folder_url: editDriveUrl.trim(),
          drive_notes: editDriveNotes.trim()
        })
        .eq('id', activeClient.id);

      if (!error) {
        setClients(prev => prev.map(c => c.id === activeClient.id ? {
          ...c,
          drive_folder_url: editDriveUrl.trim(),
          drive_notes: editDriveNotes.trim()
        } : c));
        setIsEditDriveModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Client
  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    setIsSubmitting(true);

    const slug = newClientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `client-${Date.now()}`;
    const token = `${slug.slice(0, 4)}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newObj = {
      id: slug,
      name: newClientName.trim(),
      category: newClientCategory.trim() || 'General Marketing',
      avatar: newClientAvatar || '🎯',
      color: '#0284c7',
      token,
      drive_folder_url: newClientDriveUrl.trim(),
      drive_notes: 'Google Drive folder'
    };

    try {
      const { data, error } = await supabase.from('clients').insert([newObj]).select();
      if (!error && data) {
        setClients(prev => [...prev, data[0]]);
        setActiveClientId(data[0].id);
        setIsNewClientModalOpen(false);
        setNewClientName('');
        setNewClientCategory('');
        setNewClientDriveUrl('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Client
  const handleDeleteClient = async (clientIdToDelete, clientNameToDelete) => {
    if (clients.length <= 1) {
      alert("At least one client must exist in the database.");
      return;
    }
    if (window.confirm(`Delete "${clientNameToDelete}" and all their scheduled calendar posts permanently?`)) {
      await supabase.from('clients').delete().eq('id', clientIdToDelete);
      setClients(prev => prev.filter(c => c.id !== clientIdToDelete));
      setPosts(prev => prev.filter(p => p.client_id !== clientIdToDelete));
      if (activeClientId === clientIdToDelete) {
        const remaining = clients.filter(c => c.id !== clientIdToDelete);
        setActiveClientId(remaining[0]?.id);
      }
    }
  };

  // New Post Form States
  const [postDate, setPostDate] = useState('2026-10-02');
  const [postTime, setPostTime] = useState('11:00 AM');
  const [postPlatform, setPostPlatform] = useState('Instagram');
  const [postFormat, setPostFormat] = useState('Carousel');
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postDriveFileUrl, setPostDriveFileUrl] = useState('');
  const [uploadedMediaFiles, setUploadedMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedMediaFiles(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Schedule Post into Supabase
  const handleSchedulePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    setIsSubmitting(true);

    const mediaList = uploadedMediaFiles.length > 0 
      ? uploadedMediaFiles 
      : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'];

    const tagsArray = postTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const newPost = {
      id: `post_${Date.now()}`,
      client_id: activeClient.id,
      date: postDate,
      time: postTime,
      platform: postPlatform,
      format: postFormat,
      title: postTitle.trim(),
      caption: postCaption.trim(),
      tags: tagsArray,
      status: 'Pending',
      media_urls: mediaList,
      drive_file_url: postDriveFileUrl.trim(),
      remarks: []
    };

    try {
      const { data, error } = await supabase.from('posts').insert([newPost]).select();
      if (!error && data) {
        setPosts(prev => [data[0], ...prev]);
        setIsNewPostModalOpen(false);
        setPostTitle('');
        setPostCaption('');
        setPostTags('');
        setPostDriveFileUrl('');
        setUploadedMediaFiles([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId) => {
    await supabase.from('posts').delete().eq('id', postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    setSelectedPost(null);
    setDeleteConfirmPostId(null);
  };

  // Update Status in Supabase (Approve / Reject)
  const handleUpdateStatus = async (postId, newStatus) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: newStatus } : p));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, status: newStatus }));
    }
    await supabase.from('posts').update({ status: newStatus }).eq('id', postId);
  };

  // Add Remark in Supabase
  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!newRemarkText.trim() || !selectedPost) return;

    const newRemark = {
      id: `rem_${Date.now()}`,
      author: isClientMode ? activeClient.name : 'Agency Lead',
      role: isClientMode ? 'client' : 'agency',
      text: newRemarkText.trim(),
      timestamp: 'Just now'
    };

    const updatedRemarks = [...(selectedPost.remarks || []), newRemark];

    setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, remarks: updatedRemarks } : p));
    setSelectedPost(prev => ({ ...prev, remarks: updatedRemarks }));
    setNewRemarkText('');

    await supabase.from('posts').update({ remarks: updatedRemarks }).eq('id', selectedPost.id);
  };

  // Magic Link Copy
  const copyClientMagicLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const magicUrl = `${baseUrl}?client=${activeClient.id}&token=${activeClient.token}`;
    navigator.clipboard.writeText(magicUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const clientPosts = useMemo(() => {
    return posts.filter(p => p.client_id === activeClient.id);
  }, [posts, activeClient.id]);

  const stats = useMemo(() => {
    const total = clientPosts.length;
    const approved = clientPosts.filter(p => p.status === 'Approved').length;
    const pending = clientPosts.filter(p => p.status === 'Pending').length;
    const changes = clientPosts.filter(p => p.status === 'Changes Requested').length;
    return { total, approved, pending, changes };
  }, [clientPosts]);

  // Calendar Day Generation
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ dayNumber: null });
    }

    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
      const matched = clientPosts.filter(p => p.date === dateKey);

      cells.push({
        dayNumber: d,
        dateKey,
        posts: matched,
        isSpecialDate: currentMonth === 9 && d === 2
      });
    }
    return cells;
  }, [currentYear, currentMonth, clientPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Connecting to cloud database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-sans antialiased flex flex-col">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isClientMode ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center text-xl">
                  {activeClient.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-slate-900 text-base leading-tight tracking-tight">
                      {activeClient.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Client Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{activeClient.category}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsRosterOpen(true)}
                className="group flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-lg">
                  {activeClient.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 text-sm tracking-tight">{activeClient.name}</span>
                    <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Switch Client Roster</p>
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {activeClient.drive_folder_url ? (
              <a
                href={activeClient.drive_folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/80 active:scale-95 transition-all shadow-xs"
              >
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Drive</span>
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </a>
            ) : (
              !isClientMode && (
                <button
                  onClick={handleOpenEditDrive}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium border border-slate-200 active:scale-95 transition-all"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                  <span>Connect G-Drive</span>
                </button>
              )
            )}

            {!isClientMode && (
              <>
                <button
                  onClick={copyClientMagicLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs active:scale-95 transition-all"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Client Magic Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Post</span>
                </button>
              </>
            )}

            {isClientMode && (
              <a href={window.location.pathname} className="text-xs text-slate-500 hover:text-slate-800 underline font-medium">
                Agency Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 2. Subheader Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
              <button onClick={handlePrevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-700 hover:shadow-xs active:scale-90 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 text-center min-w-[140px]">
                <span className="font-semibold text-sm text-slate-900 tracking-tight">
                  {monthNames[currentMonth]} {currentYear}
                </span>
              </div>
              <button onClick={handleNextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-700 hover:shadow-xs active:scale-90 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {(currentMonth !== 9 || currentYear !== 2026) && (
              <button onClick={handleResetToOct} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200/60 transition-colors">
                Today (Oct 2026)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Total: {stats.total}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {stats.approved} Approved
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 font-semibold border border-amber-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {stats.pending} Pending
            </span>
            {stats.changes > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-semibold border border-rose-200/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                {stats.changes} Changes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Calendar Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 pb-12">
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {calendarGrid.map((cell, idx) => {
            if (!cell.dayNumber) {
              return <div key={`empty-${idx}`} className="min-h-[110px] sm:min-h-[140px] rounded-2xl bg-slate-100/40 border border-dashed border-slate-200/60 p-2" />;
            }

            const hasPosts = cell.posts && cell.posts.length > 0;
            const isOct2 = cell.isSpecialDate;

            return (
              <div
                key={cell.dateKey}
                className={`min-h-[115px] sm:min-h-[145px] rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all border ${
                  isOct2
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300/60'
                    : hasPosts
                    ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
                    : 'bg-white/60 border-slate-200/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs sm:text-sm font-semibold rounded-lg w-6 h-6 flex items-center justify-center ${
                    isOct2 ? 'bg-amber-500 text-white font-bold' : cell.dayNumber === 2 ? 'bg-blue-600 text-white' : 'text-slate-800'
                  }`}>
                    {cell.dayNumber}
                  </span>
                  {isOct2 && (
                    <span className="text-[10px] font-bold tracking-tight text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md hidden sm:inline-block">
                      Gandhi Jayanti
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                  {cell.posts.map(post => {
                    const isApproved = post.status === 'Approved';
                    const isPending = post.status === 'Pending';
                    const isChanges = post.status === 'Changes Requested';

                    return (
                      <button
                        key={post.id}
                        onClick={() => {
                          setSelectedPost(post);
                          setActiveSlideIndex(0);
                        }}
                        className={`w-full text-left p-1.5 rounded-xl border transition-all text-xs group flex flex-col gap-1 active:scale-[0.98] ${
                          isApproved ? 'bg-emerald-50/90 border-emerald-200' : isPending ? 'bg-amber-50/90 border-amber-200' : 'bg-rose-50/90 border-rose-200'
                        }`}
                      >
                        <div className="relative w-full h-14 sm:h-16 rounded-lg overflow-hidden bg-slate-900">
                          {post.media_urls && post.media_urls[0] ? (
                            <img src={post.media_urls[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}

                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1">
                            {post.format === 'Reel' ? <Film className="w-2.5 h-2.5" /> : <Layers className="w-2.5 h-2.5" />}
                            <span>{post.format}</span>
                          </div>

                          <div className="absolute bottom-1 right-1">
                            {isApproved && <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"><Check className="w-2.5 h-2.5 stroke-[3]" /></span>}
                            {isPending && <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs text-[10px] font-bold">•</span>}
                            {isChanges && <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs"><AlertCircle className="w-2.5 h-2.5 stroke-[2.5]" /></span>}
                          </div>
                        </div>

                        <div className="px-0.5">
                          <p className="font-semibold text-[11px] sm:text-xs text-slate-900 truncate leading-tight">{post.title}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                            <span>{post.time}</span>
                            {post.remarks && post.remarks.length > 0 && (
                              <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                                <MessageSquare className="w-2.5 h-2.5" />
                                {post.remarks.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!isClientMode && (
                  <button
                    onClick={() => {
                      setPostDate(cell.dateKey);
                      setIsNewPostModalOpen(true);
                    }}
                    className="mt-1 opacity-0 hover:opacity-100 focus:opacity-100 w-full py-1 rounded-lg border border-dashed border-slate-300 text-slate-500 text-[11px] flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. Post Inspector & Remarks Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200">
                  {selectedPost.platform} • {selectedPost.format}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Scheduled: <strong className="text-slate-800">{selectedPost.date} at {selectedPost.time}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isClientMode && (
                  <button onClick={() => setDeleteConfirmPostId(selectedPost.id)} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setSelectedPost(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {deleteConfirmPostId && (
              <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between">
                <span className="text-rose-800 text-xs font-semibold">Delete this post from the cloud database permanently?</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDeleteConfirmPostId(null)} className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600">Cancel</button>
                  <button onClick={() => handleDeletePost(selectedPost.id)} className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 text-white">Confirm</button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-6 flex flex-col justify-between bg-slate-900 text-white">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center">
                  {selectedPost.media_urls && selectedPost.media_urls.length > 0 ? (
                    <img src={selectedPost.media_urls[activeSlideIndex] || selectedPost.media_urls[0]} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-slate-500" />
                  )}

                  {selectedPost.media_urls && selectedPost.media_urls.length > 1 && (
                    <>
                      <button onClick={() => setActiveSlideIndex(p => Math.max(0, p - 1))} disabled={activeSlideIndex === 0} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setActiveSlideIndex(p => Math.min(selectedPost.media_urls.length - 1, p + 1))} disabled={activeSlideIndex === selectedPost.media_urls.length - 1} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {selectedPost.drive_file_url && (
                  <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs">
                    <span className="text-slate-200">Asset stored in Google Drive</span>
                    <a href={selectedPost.drive_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 font-semibold flex items-center gap-1 underline">
                      <span>Open File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approval Status</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedPost.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : selectedPost.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedPost.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedPost.id, 'Approved')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border active:scale-95 transition-all ${
                        selectedPost.status === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedPost.id, 'Changes Requested')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border active:scale-95 transition-all ${
                        selectedPost.status === 'Changes Requested' ? 'bg-rose-600 text-white' : 'bg-white text-rose-700 border-rose-300'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedPost.title}</h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{selectedPost.caption}</p>
                </div>

                <div className="flex-1 flex flex-col pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Feedback & Remarks ({selectedPost.remarks?.length || 0})</span>
                  </h4>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 mb-3">
                    {selectedPost.remarks && selectedPost.remarks.length > 0 ? (
                      selectedPost.remarks.map(rem => (
                        <div key={rem.id} className={`p-2.5 rounded-xl text-xs ${rem.role === 'client' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className={rem.role === 'client' ? 'text-amber-900' : 'text-blue-900'}>{rem.author}</span>
                            <span className="text-[10px] text-slate-400">{rem.timestamp}</span>
                          </div>
                          <p className="text-slate-800">{rem.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2 italic">No remarks yet.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddRemark} className="flex gap-2">
                    <input
                      type="text"
                      value={newRemarkText}
                      onChange={(e) => setNewRemarkText(e.target.value)}
                      placeholder={isClientMode ? "Add your revision remark..." : "Add agency remark..."}
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                    />
                    <button type="submit" disabled={!newRemarkText.trim()} className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold disabled:opacity-40">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Client Roster Drawer */}
      {isRosterOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-r border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Client Workspaces</h2>
                <p className="text-xs text-slate-500">Live cloud database rosters</p>
              </div>
              <button onClick={() => setIsRosterOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {clients.map(client => {
                const isActive = client.id === activeClient.id;
                const count = posts.filter(p => p.client_id === client.id).length;

                return (
                  <div key={client.id} className={`p-3.5 rounded-2xl border ${isActive ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/10' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => { setActiveClientId(client.id); setIsRosterOpen(false); }} className="flex-1 flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-xl shrink-0">
                          {client.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{client.name}</h3>
                          <p className="text-xs text-slate-500">{client.category}</p>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {count} scheduled posts
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        <button onClick={() => { setActiveClientId(client.id); handleOpenEditDrive(); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClient(client.id, client.name)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/70">
              <button
                onClick={() => { setIsRosterOpen(false); setIsNewClientModalOpen(true); }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit G-Drive Folder Modal */}
      {isEditDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Google Drive Folder Sync</h2>
              <button onClick={() => setIsEditDriveModalOpen(false)} className="p-1 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveDriveSettings} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Drive Folder URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={editDriveUrl}
                  onChange={(e) => setEditDriveUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditDriveModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Save to Cloud</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add New Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Create New Client</h2>
              <button onClick={() => setIsNewClientModalOpen(false)} className="p-1 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateClient} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Avatar</label>
                  <input type="text" value={newClientAvatar} onChange={(e) => setNewClientAvatar(e.target.value)} className="w-full text-center text-lg px-2 py-1.5 rounded-xl bg-slate-100 border border-slate-200" />
                </div>
                <div className="col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Client Name</label>
                  <input type="text" required placeholder="e.g. PureEatiz Coffee" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input type="text" placeholder="e.g. FMCG" value={newClientCategory} onChange={(e) => setNewClientCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Drive Folder Link</label>
                <input type="url" placeholder="https://drive.google.com/drive/folders/..." value={newClientDriveUrl} onChange={(e) => setNewClientDriveUrl(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewClientModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Schedule Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Schedule Post for {activeClient.name}</h2>
                <p className="text-xs text-slate-500">Saves directly to your live database</p>
              </div>
              <button onClick={() => setIsNewPostModalOpen(false)} className="p-1 text-slate-400"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSchedulePost} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input type="date" required value={postDate} onChange={(e) => setPostDate(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input type="text" value={postTime} onChange={(e) => setPostTime(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                  <select value={postPlatform} onChange={(e) => setPostPlatform(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200">
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                    <option>YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Format</label>
                  <select value={postFormat} onChange={(e) => setPostFormat(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200">
                    <option>Carousel</option>
                    <option>Static</option>
                    <option>Reel</option>
                    <option>Story</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Upload Media</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 hover:border-blue-400 p-4 rounded-2xl text-center cursor-pointer bg-slate-50">
                  <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                  <p className="font-semibold text-slate-700">Click to select files</p>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleMediaUpload} className="hidden" />
                </div>

                {uploadedMediaFiles.length > 0 && (
                  <div className="flex items-center gap-2 mt-2 overflow-x-auto py-1">
                    {uploadedMediaFiles.map((src, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-300">
                        <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setUploadedMediaFiles(p => p.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Drive Asset Link (Optional)</label>
                <input type="url" placeholder="https://drive.google.com/file/d/..." value={postDriveFileUrl} onChange={(e) => setPostDriveFileUrl(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Post Title</label>
                <input type="text" required placeholder="e.g. Festival Special Offer" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Post Caption</label>
                <textarea rows="3" placeholder="Enter post caption..." value={postCaption} onChange={(e) => setPostCaption(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewPostModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">
                  {isSubmitting ? 'Saving to Database...' : 'Schedule Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
