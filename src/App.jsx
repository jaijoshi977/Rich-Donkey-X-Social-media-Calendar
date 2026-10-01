import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  FolderOpen
} from 'lucide-react';

// Default initial clients with dedicated Google Drive folder structure
const INITIAL_CLIENTS = [
  {
    id: 'sarvam-solar',
    name: 'Sarvam Surya Solar',
    category: 'Renewable Energy & Solar EPC',
    avatar: '☀️',
    color: '#0284c7', // Sky Blue
    token: 'srvm_9021',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1sarvam-solar-assets-root',
    driveNotes: 'Primary folder for monthly creatives, reels, and Surya Ghar ad assets.'
  },
  {
    id: 'pure-eatiz',
    name: 'PureEatiz Coffee',
    category: 'Gourmet FMCG & Coffee',
    avatar: '☕',
    color: '#78350f', // Amber/Coffee
    token: 'pure_4412',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1pure-eatiz-coffee-creatives',
    driveNotes: 'Contains vertical 9:16 b-roll assets and packshots.'
  },
  {
    id: 'atul-bakery',
    name: 'Atul Bakery Franchise',
    category: 'Bakery & Retail QSR',
    avatar: '🥐',
    color: '#ea580c', // Orange
    token: 'atul_8834',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1atul-bakery-campaign-library',
    driveNotes: 'Festive promotion posters, Gujarati copy variations, and store display creatives.'
  },
  {
    id: 'supr-nutrition',
    name: 'SUPR Performance Lab',
    category: 'Health & Sports Nutrition',
    avatar: '⚡',
    color: '#10b981', // Emerald
    token: 'supr_2109',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1supr-protein-assets-vault',
    driveNotes: 'Fitness influencer collaborations, reels, and protein shaker promo creatives.'
  }
];

// Helper: Convert Google Drive sharing link to a direct embed preview link
const formatDrivePreviewUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  // Check if it's a Google Drive file link
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
  }
  return trimmed;
};

// Default sample posts for October 2026
const INITIAL_POSTS = [
  {
    id: 'post_1001',
    clientId: 'sarvam-solar',
    date: '2026-10-02',
    time: '10:00 AM',
    platform: 'Instagram',
    format: 'Carousel',
    title: 'Gandhi Jayanti • Clean Energy for Swachh Bharat',
    caption: 'Clean Energy, Self-reliant India. 🇮🇳 On this Gandhi Jayanti, switch to green solar electricity with PM Surya Ghar Yojana. Get up to ₹78,000 direct subsidy and zero power bills. Call Sarvam Surya Solar today for a free site audit!\n\n#GandhiJayanti #SolarEnergy #CleanEnergy #GujaratSolar #PMSuryaGhar',
    tags: ['#GandhiJayanti', '#SolarEnergy', '#CleanEnergy', '#GujaratSolar'],
    status: 'Approved',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80'
    ],
    driveFileUrl: '',
    remarks: [
      { id: 'rem_1', author: 'Sarvam Solar Team', role: 'client', text: 'Colors and subsidy breakdown look crystal clear! Approved for Oct 2nd.', timestamp: 'Yesterday, 4:15 PM' }
    ]
  },
  {
    id: 'post_1002',
    clientId: 'sarvam-solar',
    date: '2026-10-08',
    time: '06:30 PM',
    platform: 'Instagram',
    format: 'Reel',
    title: 'How an On-Grid Inverter Works in 30 Seconds',
    caption: 'Wondering where your solar power goes when you generate extra units? ⚡ Watch this quick breakdown of Net-Metering in Gujarat.\n\n#SolarInverter #NetMetering #RenewableEnergy #SaveElectricity',
    tags: ['#SolarInverter', '#NetMetering', '#RenewableEnergy'],
    status: 'Pending',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    driveFileUrl: '',
    remarks: [
      { id: 'rem_2', author: 'Agency Lead', role: 'agency', text: 'Voiceover is rendered in authentic Gujarati & Hindi accents. Please confirm audio balance.', timestamp: 'Oct 1, 11:30 AM' }
    ]
  },
  {
    id: 'post_1003',
    clientId: 'sarvam-solar',
    date: '2026-10-15',
    time: '11:00 AM',
    platform: 'LinkedIn',
    format: 'Static',
    title: 'Industrial Rooftop 150kW Case Study: Bharuch MIDC',
    caption: 'Saving ₹1.8 Lakhs every month for chemical manufacturing plants in Bharuch. Explore our turnkey rooftop installation specs.\n\n#IndustrialSolar #CommercialSolar #B2B #GujaratBusiness',
    tags: ['#IndustrialSolar', '#CommercialSolar', '#B2B'],
    status: 'Changes Requested',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80'
    ],
    driveFileUrl: '',
    remarks: [
      { id: 'rem_3', author: 'Sarvam Solar Team', role: 'client', text: 'Can we change the unit savings figure from 1.8 Lakhs to 1.95 Lakhs as per the final audit?', timestamp: 'Today, 9:20 AM' }
    ]
  },
  {
    id: 'post_2001',
    clientId: 'pure-eatiz',
    date: '2026-10-04',
    time: '08:00 AM',
    platform: 'Instagram',
    format: 'Static',
    title: 'Morning Brew Roast Series: Arabica Gold',
    caption: '100% single-estate shade-grown coffee beans, roasted to perfection. Start your October mornings with PureEatiz.\n\n#PureEatiz #SpecialtyCoffee #CoffeeLover #MorningRitual',
    tags: ['#PureEatiz', '#SpecialtyCoffee', '#CoffeeLover'],
    status: 'Approved',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
    ],
    driveFileUrl: '',
    remarks: []
  },
  {
    id: 'post_3001',
    clientId: 'atul-bakery',
    date: '2026-10-10',
    time: '04:00 PM',
    platform: 'Facebook',
    format: 'Carousel',
    title: 'Freshly Baked Weekend Special Cookies & Khari',
    caption: 'Warm chai with buttery crisp Khari! Available fresh at all Atul Bakery stores across Gujarat.\n\n#AtulBakery #BakeryGujarat #ChaiKhari #WeekendBites',
    tags: ['#AtulBakery', '#BakeryGujarat', '#ChaiKhari'],
    status: 'Approved',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
    ],
    driveFileUrl: '',
    remarks: []
  }
];

export default function App() {
  // 1. Persistent state initialized from localStorage
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('agency_clients_v2');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('agency_posts_v2');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem('agency_clients_v2', JSON.stringify(clients));
    } catch (e) {
      console.error('Local storage save error:', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('agency_posts_v2', JSON.stringify(posts));
    } catch (e) {
      console.error('Local storage save error:', e);
    }
  }, [posts]);

  // 2. URL parsing for Client Magic Link Detection
  const [isClientMode, setIsClientMode] = useState(false);
  const [activeClientId, setActiveClientId] = useState('sarvam-solar');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientParam = params.get('client');
    const tokenParam = params.get('token');

    if (clientParam) {
      const target = clients.find(c => c.id === clientParam);
      if (target) {
        setActiveClientId(target.id);
        if (tokenParam === target.token) {
          setIsClientMode(true);
        }
      }
    }
  }, [clients]);

  const activeClient = useMemo(() => {
    return clients.find(c => c.id === activeClientId) || clients[0] || {
      id: 'default',
      name: 'Agency Portal',
      category: 'General',
      avatar: '📁',
      color: '#0284c7',
      driveFolderUrl: '',
      token: 'gen_0000'
    };
  }, [clients, activeClientId]);

  // 3. Month & Year Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Default: October 2026
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 = Jan, 9 = Oct

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleResetToOct = () => {
    setCurrentDate(new Date(2026, 9, 1));
  };

  // 4. Modal and Drawer states
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditDriveModalOpen, setIsEditDriveModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [newRemarkText, setNewRemarkText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState(null);

  // New Client Form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientCategory, setNewClientCategory] = useState('');
  const [newClientAvatar, setNewClientAvatar] = useState('🌟');
  const [newClientDriveUrl, setNewClientDriveUrl] = useState('');

  // Edit Drive Link Form state
  const [editDriveUrl, setEditDriveUrl] = useState('');
  const [editDriveNotes, setEditDriveNotes] = useState('');

  // Open Edit Drive modal with current client's data
  const handleOpenEditDrive = () => {
    setEditDriveUrl(activeClient.driveFolderUrl || '');
    setEditDriveNotes(activeClient.driveNotes || '');
    setIsEditDriveModalOpen(true);
  };

  const handleSaveDriveSettings = (e) => {
    e.preventDefault();
    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return {
          ...c,
          driveFolderUrl: editDriveUrl.trim(),
          driveNotes: editDriveNotes.trim()
        };
      }
      return c;
    }));
    setIsEditDriveModalOpen(false);
  };

  // Add new client handler
  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    const slug = newClientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `client-${Date.now()}`;
    const generatedToken = `${slug.slice(0, 4)}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newClient = {
      id: slug,
      name: newClientName.trim(),
      category: newClientCategory.trim() || 'Digital Marketing Client',
      avatar: newClientAvatar || '🎯',
      color: '#0284c7',
      token: generatedToken,
      driveFolderUrl: newClientDriveUrl.trim(),
      driveNotes: 'Primary Google Drive assets folder.'
    };

    setClients(prev => [...prev, newClient]);
    setActiveClientId(newClient.id);
    setIsNewClientModalOpen(false);
    setNewClientName('');
    setNewClientCategory('');
    setNewClientDriveUrl('');
  };

  // Delete client handler
  const handleDeleteClient = (clientIdToDelete, clientNameToDelete) => {
    if (clients.length <= 1) {
      alert("You need to keep at least one client in the workspace.");
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to remove "${clientNameToDelete}" and all their scheduled calendar posts?`);
    if (confirmDelete) {
      setClients(prev => prev.filter(c => c.id !== clientIdToDelete));
      setPosts(prev => prev.filter(p => p.clientId !== clientIdToDelete));
      if (activeClientId === clientIdToDelete) {
        const remaining = clients.filter(c => c.id !== clientIdToDelete);
        setActiveClientId(remaining[0].id);
      }
    }
  };

  // Post Scheduling Form State
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

  // File upload to Base64
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

  // Handle post creation
  const handleSchedulePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    // Use uploaded files or default placeholder
    const mediaList = uploadedMediaFiles.length > 0 
      ? uploadedMediaFiles 
      : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'];

    const tagsArray = postTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const newPostItem = {
      id: `post_${Date.now()}`,
      clientId: activeClient.id,
      date: postDate,
      time: postTime,
      platform: postPlatform,
      format: postFormat,
      title: postTitle.trim(),
      caption: postCaption.trim(),
      tags: tagsArray,
      status: 'Pending',
      mediaType: postFormat === 'Reel' ? 'video' : 'image',
      mediaUrls: mediaList,
      driveFileUrl: postDriveFileUrl.trim(),
      remarks: []
    };

    setPosts(prev => [newPostItem, ...prev]);
    setIsNewPostModalOpen(false);
    // Reset form
    setPostTitle('');
    setPostCaption('');
    setPostTags('');
    setPostDriveFileUrl('');
    setUploadedMediaFiles([]);
  };

  // Delete post handler
  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setSelectedPost(null);
    setDeleteConfirmPostId(null);
  };

  // Client Status Update (Approve / Reject)
  const handleUpdateStatus = (postId, newStatus) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Add Remark
  const handleAddRemark = (e) => {
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

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPost.id) {
        return { ...p, remarks: updatedRemarks };
      }
      return p;
    }));

    setSelectedPost(prev => ({ ...prev, remarks: updatedRemarks }));
    setNewRemarkText('');
  };

  // Copy Magic Link for active client
  const copyClientMagicLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const magicUrl = `${baseUrl}?client=${activeClient.id}&token=${activeClient.token}`;
    navigator.clipboard.writeText(magicUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Filter posts for active client
  const clientPosts = useMemo(() => {
    return posts.filter(p => p.clientId === activeClient.id);
  }, [posts, activeClient.id]);

  // Statistics for current month
  const stats = useMemo(() => {
    const total = clientPosts.length;
    const approved = clientPosts.filter(p => p.status === 'Approved').length;
    const pending = clientPosts.filter(p => p.status === 'Pending').length;
    const changes = clientPosts.filter(p => p.status === 'Changes Requested').length;
    return { total, approved, pending, changes };
  }, [clientPosts]);

  // Generate calendar days for the selected month/year
  const calendarGrid = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Empty lead cells for previous month padding
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false, dateKey: null });
    }

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

      const matchedPosts = clientPosts.filter(p => p.date === dateKey);

      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateKey,
        posts: matchedPosts,
        isSpecialDate: currentMonth === 9 && d === 2 // Oct 2nd highlight
      });
    }

    return days;
  }, [currentYear, currentMonth, clientPosts]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-sans antialiased flex flex-col">
      {/* ========================================================= */}
      {/* 1. TOP NAVIGATION / APPLE GLASS HEADER */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Client selector / Brand identity */}
          <div className="flex items-center gap-3">
            {isClientMode ? (
              // Client Mode: Fixed branding badge with no switching drawer
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center text-xl">
                  {activeClient.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-slate-900 text-base leading-tight tracking-tight">
                      {activeClient.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Client Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{activeClient.category}</p>
                </div>
              </div>
            ) : (
              // Agency Mode: Interactive Client Switcher Drawer button
              <button
                onClick={() => setIsRosterOpen(true)}
                className="group flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all text-left"
                title="Open Client Workspace Roster"
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-lg">
                  {activeClient.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 text-sm tracking-tight">
                      {activeClient.name}
                    </span>
                    <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Switch Client Roster</p>
                </div>
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2.5">
            {/* Dedicated Google Drive Root Folder Button */}
            {activeClient.driveFolderUrl ? (
              <a
                href={activeClient.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/80 active:scale-95 transition-all shadow-xs"
                title="Open client Google Drive folder"
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

            {/* Agency Mode Controls */}
            {!isClientMode && (
              <>
                {/* Copy Magic Link */}
                <button
                  onClick={copyClientMagicLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs active:scale-95 transition-all"
                  title="Copy direct client review link"
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

                {/* Schedule Post Button */}
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Post</span>
                </button>
              </>
            )}

            {/* In client mode, show a safe exit preview link */}
            {isClientMode && (
              <a
                href={window.location.pathname}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
              >
                Agency Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. SUB-HEADER: CALENDAR NAVIGATION & MONTH STATS */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Month selector navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-700 hover:shadow-xs active:scale-90 transition-all"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 text-center min-w-[140px]">
                <span className="font-semibold text-sm text-slate-900 tracking-tight">
                  {monthNames[currentMonth]} {currentYear}
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-700 hover:shadow-xs active:scale-90 transition-all"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick reset to Oct 2026 */}
            {(currentMonth !== 9 || currentYear !== 2026) && (
              <button
                onClick={handleResetToOct}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200/60 transition-colors"
              >
                Today (Oct 2026)
              </button>
            )}
          </div>

          {/* Real-time Status Badges */}
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

      {/* ========================================================= */}
      {/* 3. CALENDAR GRID (IOS 18 CLEAN CARDS) */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 pb-12">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* 7-column calendar grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {calendarGrid.map((cell, idx) => {
            if (!cell.dayNumber) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] sm:min-h-[140px] rounded-2xl bg-slate-100/40 border border-dashed border-slate-200/60 p-2"
                />
              );
            }

            const hasPosts = cell.posts && cell.posts.length > 0;
            const isOct2 = cell.isSpecialDate;

            return (
              <div
                key={cell.dateKey}
                className={`min-h-[115px] sm:min-h-[145px] rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 border ${
                  isOct2
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300/60'
                    : hasPosts
                    ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
                    : 'bg-white/60 border-slate-200/70 hover:bg-white'
                }`}
              >
                {/* Date header row inside cell */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs sm:text-sm font-semibold rounded-lg w-6 h-6 flex items-center justify-center ${
                      isOct2
                        ? 'bg-amber-500 text-white font-bold'
                        : cell.dayNumber === 2
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-800'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {isOct2 && (
                    <span className="text-[10px] font-bold tracking-tight text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md hidden sm:inline-block">
                      Gandhi Jayanti
                    </span>
                  )}
                </div>

                {/* Post Cards inside this date */}
                <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                  {cell.posts.map(post => {
                    // Status color styling
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
                          isApproved
                            ? 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-300'
                            : isPending
                            ? 'bg-amber-50/90 border-amber-200 hover:border-amber-300'
                            : 'bg-rose-50/90 border-rose-200 hover:border-rose-300'
                        }`}
                      >
                        {/* Media thumbnail + format pill */}
                        <div className="relative w-full h-14 sm:h-16 rounded-lg overflow-hidden bg-slate-900">
                          {post.mediaUrls && post.mediaUrls[0] ? (
                            <img
                              src={post.mediaUrls[0]}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}

                          {/* Media Type pill */}
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1">
                            {post.format === 'Reel' ? (
                              <Film className="w-2.5 h-2.5" />
                            ) : (
                              <Layers className="w-2.5 h-2.5" />
                            )}
                            <span>{post.format}</span>
                          </div>

                          {/* Status Indicator Icon */}
                          <div className="absolute bottom-1 right-1">
                            {isApproved && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                            {isPending && (
                              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs text-[10px] font-bold">
                                •
                              </span>
                            )}
                            {isChanges && (
                              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                                <AlertCircle className="w-2.5 h-2.5 stroke-[2.5]" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Remarks badge */}
                        <div className="px-0.5">
                          <p className="font-semibold text-[11px] sm:text-xs text-slate-900 truncate leading-tight">
                            {post.title}
                          </p>
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

                {/* Quick Add Post on this day in Agency Mode */}
                {!isClientMode && (
                  <button
                    onClick={() => {
                      setPostDate(cell.dateKey);
                      setIsNewPostModalOpen(true);
                    }}
                    className="mt-1 opacity-0 hover:opacity-100 focus:opacity-100 w-full py-1 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800 text-[11px] font-medium flex items-center justify-center gap-1 transition-opacity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================= */}
      {/* 4. POST INSPECTOR / APPROVAL & REMARKS MODAL */}
      {/* ========================================================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 shadow-2xs">
                  {selectedPost.platform} • {selectedPost.format}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Scheduled: <strong className="text-slate-800">{selectedPost.date} at {selectedPost.time}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Delete button in agency mode */}
                {!isClientMode && (
                  <button
                    onClick={() => setDeleteConfirmPostId(selectedPost.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Delete Confirmation Alert Banner */}
            {deleteConfirmPostId && (
              <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Are you sure you want to permanently delete this post from the calendar?</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteConfirmPostId(null)}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePost(selectedPost.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Left Creative Preview, Right Copy & Remarks */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Left Column: Visual Media Display */}
              <div className="p-6 flex flex-col justify-between bg-slate-900 text-white">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center shadow-inner">
                  {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 ? (
                    <img
                      src={selectedPost.mediaUrls[activeSlideIndex] || selectedPost.mediaUrls[0]}
                      alt="Creative Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                      <p className="text-xs">No media preview available</p>
                    </div>
                  )}

                  {/* Multi-slide carousel navigator */}
                  {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeSlideIndex === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/90"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveSlideIndex(prev => Math.min(selectedPost.mediaUrls.length - 1, prev + 1))}
                        disabled={activeSlideIndex === selectedPost.mediaUrls.length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                        {selectedPost.mediaUrls.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              i === activeSlideIndex ? 'w-4 bg-white' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Google Drive Link if attached */}
                {selectedPost.driveFileUrl && (
                  <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-200">Asset stored in Google Drive</span>
                    </div>
                    <a
                      href={selectedPost.driveFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-white font-semibold flex items-center gap-1 underline"
                    >
                      <span>Open Drive File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Copy, Details, Approval Buttons, Remarks */}
              <div className="p-6 flex flex-col justify-between space-y-6">
                
                {/* Status Bar & One-Click Approval */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Approval Status
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedPost.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedPost.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedPost.status}
                    </span>
                  </div>

                  {/* Actions (Approve / Reject) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedPost.id, 'Approved')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border active:scale-95 transition-all ${
                        selectedPost.status === 'Approved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Content</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedPost.id, 'Changes Requested')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border active:scale-95 transition-all ${
                        selectedPost.status === 'Changes Requested'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>
                  </div>
                </div>

                {/* Post Copy and Hashtags */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedPost.title}</h3>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedPost.caption}
                  </p>
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedPost.tags.map((tag, i) => (
                        <span key={i} className="text-[11px] text-blue-600 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remarks & Feedback Thread */}
                <div className="flex-1 flex flex-col pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Feedback & Remarks ({selectedPost.remarks?.length || 0})</span>
                    </h4>
                  </div>

                  {/* Comment list */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-3">
                    {selectedPost.remarks && selectedPost.remarks.length > 0 ? (
                      selectedPost.remarks.map(rem => (
                        <div
                          key={rem.id}
                          className={`p-2.5 rounded-xl text-xs ${
                            rem.role === 'client'
                              ? 'bg-amber-50/80 border border-amber-200/60'
                              : 'bg-blue-50/80 border border-blue-200/60'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className={rem.role === 'client' ? 'text-amber-900' : 'text-blue-900'}>
                              {rem.author}
                            </span>
                            <span className="text-[10px] text-slate-400">{rem.timestamp}</span>
                          </div>
                          <p className="text-slate-800 leading-normal">{rem.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-3 italic">
                        No remarks yet. Add suggestions or questions below.
                      </p>
                    )}
                  </div>

                  {/* Add Remark Form */}
                  <form onSubmit={handleAddRemark} className="flex gap-2">
                    <input
                      type="text"
                      value={newRemarkText}
                      onChange={(e) => setNewRemarkText(e.target.value)}
                      placeholder={isClientMode ? "Write your revision request or approval note..." : "Add agency internal remark..."}
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="submit"
                      disabled={!newRemarkText.trim()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 active:scale-95 transition-all"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. AGENCY ROSTER DRAWER (MANAGE CLIENTS & GOOGLE DRIVE) */}
      {/* ========================================================= */}
      {isRosterOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-r border-slate-200">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Client Workspaces</h2>
                <p className="text-xs text-slate-500">Switch or manage dedicated client calendars</p>
              </div>
              <button
                onClick={() => setIsRosterOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clients List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {clients.map(client => {
                const isActive = client.id === activeClient.id;
                const postCount = posts.filter(p => p.clientId === client.id).length;

                return (
                  <div
                    key={client.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/10'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Select Client button */}
                      <button
                        onClick={() => {
                          setActiveClientId(client.id);
                          setIsRosterOpen(false);
                        }}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-xl shrink-0">
                          {client.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                            {client.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{client.category}</p>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {postCount} scheduled posts
                          </span>
                        </div>
                      </button>

                      {/* Client Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setActiveClientId(client.id);
                            handleOpenEditDrive();
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Configure Google Drive link"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Remove Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Google Drive Status pill */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      {client.driveFolderUrl ? (
                        <a
                          href={client.driveFolderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <HardDrive className="w-3.5 h-3.5" />
                          <span>Google Drive Folder Active</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No Drive folder attached</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Client CTA */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70">
              <button
                onClick={() => {
                  setIsRosterOpen(false);
                  setIsNewClientModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. CONFIGURE GOOGLE DRIVE FOLDER MODAL */}
      {/* ========================================================= */}
      {isEditDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Google Drive Root Folder</h2>
                <p className="text-xs text-slate-500">Sync all creatives for {activeClient.name}</p>
              </div>
              <button
                onClick={() => setIsEditDriveModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDriveSettings} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Google Drive Folder Share URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={editDriveUrl}
                  onChange={(e) => setEditDriveUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Ensure the folder sharing permission in Google Drive is set to <strong>"Anyone with the link can view"</strong>.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Folder Notes / Guidelines</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Master folder containing 9:16 reels, PSDs, and approved exports"
                  value={editDriveNotes}
                  onChange={(e) => setEditDriveNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditDriveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Drive Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. ADD NEW CLIENT MODAL */}
      {/* ========================================================= */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Add New Client Account</h2>
                <p className="text-xs text-slate-500">Create an isolated workspace & calendar</p>
              </div>
              <button
                onClick={() => setIsNewClientModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Avatar</label>
                  <input
                    type="text"
                    value={newClientAvatar}
                    onChange={(e) => setNewClientAvatar(e.target.value)}
                    className="w-full text-center text-lg px-2 py-1.5 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Client Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Studio"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry / Category</label>
                <input
                  type="text"
                  placeholder="e.g. Retail, Real Estate, FMCG"
                  value={newClientCategory}
                  onChange={(e) => setNewClientCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Google Drive Assets Folder Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={newClientDriveUrl}
                  onChange={(e) => setNewClientDriveUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. SCHEDULE / UPLOAD NEW POST MODAL */}
      {/* ========================================================= */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Schedule Post for {activeClient.name}</h2>
                <p className="text-xs text-slate-500">Upload creative & set publication date</p>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSchedulePost} className="p-5 space-y-4 text-xs">
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    required
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* Platform & Format */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Social Channel</label>
                  <select
                    value={postPlatform}
                    onChange={(e) => setPostPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                  >
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                    <option>YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Creative Format</label>
                  <select
                    value={postFormat}
                    onChange={(e) => setPostFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                  >
                    <option>Carousel</option>
                    <option>Static</option>
                    <option>Reel</option>
                    <option>Story</option>
                  </select>
                </div>
              </div>

              {/* Media File Upload (Drag and Drop / Select) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Media Assets (Images / Carousel Slides)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 p-4 rounded-2xl text-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-colors"
                >
                  <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                  <p className="font-semibold text-slate-700">Click to upload images</p>
                  <p className="text-[11px] text-slate-400">PNG, JPG, WebP supported</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </div>

                {/* Previews of uploaded files */}
                {uploadedMediaFiles.length > 0 && (
                  <div className="flex items-center gap-2 mt-2 overflow-x-auto py-1">
                    {uploadedMediaFiles.map((src, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-300">
                        <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedMediaFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Google Drive Asset Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Google Drive Asset Link (Optional)</label>
                  {activeClient.driveFolderUrl && (
                    <a
                      href={activeClient.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FolderOpen className="w-3 h-3" />
                      <span>Browse {activeClient.name} Folder</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={postDriveFileUrl}
                  onChange={(e) => setPostDriveFileUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                />
              </div>

              {/* Title & Caption */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gandhi Jayanti Special Offer"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Post Caption & Copy</label>
                <textarea
                  rows="3"
                  placeholder="Enter the full ad copy, caption, and details..."
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hashtags (comma separated)</label>
                <input
                  type="text"
                  placeholder="#SolarPower, #CleanEnergy, #Gujarat"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
