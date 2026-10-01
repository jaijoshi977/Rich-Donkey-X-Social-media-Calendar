import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Share2, 
  Sparkles, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Youtube,
  Copy, 
  Check, 
  Layers, 
  Film, 
  Image as ImageIcon,
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  Upload, 
  Trash2, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  Play, 
  ArrowLeft,
  X,
  Search,
  Filter,
  CheckCheck,
  Eye,
  Sliders,
  CalendarDays
} from 'lucide-react';

const INITIAL_CLIENTS_DATA = [
  {
    id: 'client-sarvam',
    name: 'Sarvam Solar Energy',
    slug: 'sarvam-solar',
    avatar: '☀️',
    accentColor: '#FF9500',
    secretToken: 'srvm_9021',
    industry: 'Renewable CleanTech',
    posts: [
      {
        id: 'post-srv-1',
        year: 2026,
        month: 9, // 0-indexed: 9 = October
        day: 2,
        time: '10:00 AM',
        title: 'Gandhi Jayanti • Pledging Sustainable Gujarat',
        caption: '“The earth provides enough to satisfy every man\'s needs, but not every man\'s greed.” — Mahatma Gandhi 🌱\n\nThis Gandhi Jayanti, Sarvam Solar commits to expanding clean decentralized rooftop solar across Western India. Sustainable industrial independence starts with self-generated clean power. ☀️⚡',
        hashtags: '#GandhiJayanti #SarvamSolar #CleanEnergyGujarat #RooftopSolar #RenewableIndia',
        format: 'Static Post',
        platform: 'Instagram',
        status: 'Pending Approval',
        mediaType: 'image',
        mediaSlides: [
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: [
          {
            id: 'rem-srv-1',
            sender: 'Agency (Art Director)',
            role: 'agency',
            text: 'Used actual photography from our Vadodara industrial installation with Mahatma Gandhi\'s quote on earth stewardship.',
            timestamp: 'Oct 01, 11:30 AM'
          }
        ]
      },
      {
        id: 'post-srv-2',
        year: 2026,
        month: 9,
        day: 8,
        time: '03:45 PM',
        title: '68% Grid Cost Reduction • Textile Unit Case Study',
        caption: 'How a 500kW rooftop solar grid enabled a Surat textile manufacturing unit to achieve energy payback in less than 28 months. Swipe through the numbers breakdown! 📈⚡',
        hashtags: '#SolarROI #CleanTech #IndustrialSolar #B2BGrowth #GujaratEnergy',
        format: 'Carousel',
        platform: 'LinkedIn',
        status: 'Approved',
        mediaType: 'carousel',
        mediaSlides: [
          'https://images.unsplash.com/photo-1545209567-5b6510344b54?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: [
          {
            id: 'rem-srv-2',
            sender: 'Sarvam Solar (Client Lead)',
            role: 'client',
            text: 'Verified compliance certifications with the project engineers. Ready to publish!',
            timestamp: 'Oct 02, 04:10 PM'
          }
        ]
      },
      {
        id: 'post-srv-3',
        year: 2026,
        month: 9,
        day: 16,
        time: '06:00 PM',
        title: 'Photovoltaic Mythbuster Reel in 30 Seconds',
        caption: 'Do solar panels work on monsoon and overcast days? Watch our senior engineer bust the top 3 renewable myths! 🌦️⚡',
        hashtags: '#SolarMyths #EnergyEducation #CleanTechReels #SarvamExplains',
        format: 'Reel',
        platform: 'Instagram',
        status: 'Changes Requested',
        mediaType: 'video',
        mediaSlides: [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        ],
        remarks: [
          {
            id: 'rem-srv-3',
            sender: 'Sarvam Solar (Marketing Head)',
            role: 'client',
            text: 'Please swap the background music track with an ambient lo-fi track and adjust the logo watermark size.',
            timestamp: 'Oct 03, 09:15 AM'
          }
        ]
      },
      {
        id: 'post-srv-4',
        year: 2026,
        month: 10, // November 2026
        day: 12,
        time: '11:00 AM',
        title: 'Diwali Festive Light • Powered by Solar',
        caption: 'Illuminate homes with clean, self-sustaining green energy this festive season. Exclusive Diwali commercial installation benefits open now! 🪔✨',
        hashtags: '#Diwali2026 #GreenDiwali #SolarGlow #SustainableCelebrations',
        format: 'Static Post',
        platform: 'Instagram',
        status: 'Draft',
        mediaType: 'image',
        mediaSlides: [
          'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: []
      }
    ]
  },
  {
    id: 'client-pureatiz',
    name: 'PureEatiz Artisanal Roasters',
    slug: 'pure-eatiz',
    avatar: '☕',
    accentColor: '#8E5A36',
    secretToken: 'pure_7718',
    industry: 'Specialty Beverage & Cafe',
    posts: [
      {
        id: 'post-pe-1',
        year: 2026,
        month: 9,
        day: 2,
        time: '08:30 AM',
        title: 'Mindful Morning & Single-Estate Araku Brews',
        caption: 'Tranquil thoughts and slow artisanal brewing. Taking a mindful moment with freshly hand-roasted Arabica beans this Gandhi Jayanti. ☕🌿',
        hashtags: '#GandhiJayanti #MindfulBrews #SpecialtyCoffee #ArakuValley #PureEatiz',
        format: 'Static Post',
        platform: 'Instagram',
        status: 'Approved',
        mediaType: 'image',
        mediaSlides: [
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: [
          {
            id: 'rem-pe-1',
            sender: 'PureEatiz (Founder)',
            role: 'client',
            text: 'Love the minimalist styling and rich coffee tones. Looks stunning!',
            timestamp: 'Oct 01, 01:25 PM'
          }
        ]
      },
      {
        id: 'post-pe-2',
        year: 2026,
        month: 9,
        day: 14,
        time: '04:00 PM',
        title: 'Cold Brew vs Pour Over • Flavor Chemistry',
        caption: 'Acidity, extraction timing, and palate notes compared. Which brewing method matches your afternoon energy? 🧊☕',
        hashtags: '#CoffeeScience #ColdBrewSeason #PourOverCoffee #BaristaLife',
        format: 'Carousel',
        platform: 'Instagram',
        status: 'Pending Approval',
        mediaType: 'carousel',
        mediaSlides: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: []
      }
    ]
  },
  {
    id: 'client-atul',
    name: 'Atul Heritage Bakehouse',
    slug: 'atul-bakery',
    avatar: '🥐',
    accentColor: '#D97706',
    secretToken: 'atul_3419',
    industry: 'Artisanal Bakery & Patisserie',
    posts: [
      {
        id: 'post-at-1',
        year: 2026,
        month: 9,
        day: 2,
        time: '07:30 AM',
        title: 'Wholesome Simplicity • Traditional Sourdough',
        caption: 'Handcrafted with slow 36-hour wild yeast fermentation. Celebrating purity and honest nourishment on this national holiday. 🌾🥖',
        hashtags: '#HandcraftedBreads #SourdoughLovers #HeritageBakery #SimpleLiving',
        format: 'Static Post',
        platform: 'Instagram',
        status: 'Pending Approval',
        mediaType: 'image',
        mediaSlides: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: []
      }
    ]
  },
  {
    id: 'client-supr',
    name: 'SUPR Performance Lab',
    slug: 'supr-fitness',
    avatar: '⚡',
    accentColor: '#007AFF',
    secretToken: 'supr_5582',
    industry: 'Athletic Wear & Sports Science',
    posts: [
      {
        id: 'post-sp-1',
        year: 2026,
        month: 9,
        day: 5,
        time: '06:00 AM',
        title: 'Threshold Velocity Testing Series',
        caption: 'Biomechanics, cadence efficiency, and aerobic recovery. Engineered for elite distance runners aiming for personal records. 🏃‍♂️💨',
        hashtags: '#SUPRLab #SportsScience #MarathonTraining #CadenceEngineering',
        format: 'Static Post',
        platform: 'Instagram',
        status: 'Approved',
        mediaType: 'image',
        mediaSlides: [
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80'
        ],
        remarks: []
      }
    ]
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_CONFIG = {
  Approved: {
    label: 'Approved',
    bgBadge: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
    dot: 'bg-emerald-500',
    solid: 'bg-emerald-600 text-white'
  },
  'Pending Approval': {
    label: 'Pending Review',
    bgBadge: 'bg-amber-500/10 text-amber-900 border-amber-500/20',
    dot: 'bg-amber-500',
    solid: 'bg-amber-600 text-white'
  },
  'Changes Requested': {
    label: 'Needs Revision',
    bgBadge: 'bg-rose-500/10 text-rose-800 border-rose-500/20',
    dot: 'bg-rose-500',
    solid: 'bg-rose-600 text-white'
  },
  Draft: {
    label: 'Agency Draft',
    bgBadge: 'bg-slate-500/10 text-slate-800 border-slate-500/20',
    dot: 'bg-slate-400',
    solid: 'bg-slate-700 text-white'
  }
};

export default function App() {
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('agency_clients_v2');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS_DATA;
    } catch {
      return INITIAL_CLIENTS_DATA;
    }
  });

  // Dynamic Route / Client Link state
  const [isClientMode, setIsClientMode] = useState(false);
  const [clientSlugParam, setClientSlugParam] = useState(null);
  const [activeClientId, setActiveClientId] = useState('client-sarvam');

  // Multi-Month State (Defaults to October 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // 9 = October

  // UI Drawer & Modal State
  const [isClientsDrawerOpen, setIsClientsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Filters & Toast
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState('');

  // Native Upload state inside Create Post sheet
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // New Post Form Data
  const [formData, setFormData] = useState({
    day: 15,
    time: '11:00 AM',
    title: '',
    caption: '',
    hashtags: '#Growth #Marketing #BrandStory',
    format: 'Static Post',
    platform: 'Instagram'
  });

  useEffect(() => {
    try {
      localStorage.setItem('agency_clients_v2', JSON.stringify(clients));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [clients]);

  // Read URL query parameters to strictly enforce Client Mode if ?client=slug is detected
  useEffect(() => {
    const parseUrlParams = () => {
      const search = window.location.search;
      const hash = window.location.hash;
      const params = new URLSearchParams(search || (hash.includes('?') ? hash.split('?')[1] : ''));

      const clientParam = params.get('client');
      const tokenParam = params.get('token');

      if (clientParam) {
        const found = clients.find(c => c.slug === clientParam);
        if (found) {
          setActiveClientId(found.id);
          setIsClientMode(true);
          setClientSlugParam(clientParam);
          return;
        }
      }
      setIsClientMode(false);
    };

    parseUrlParams();
    window.addEventListener('popstate', parseUrlParams);
    return () => window.removeEventListener('popstate', parseUrlParams);
  }, [clients]);

  const activeClient = useMemo(() => {
    return clients.find(c => c.id === activeClientId) || clients[0];
  }, [clients, activeClientId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const handleJumpToOctober = () => {
    setCurrentYear(2026);
    setCurrentMonthIndex(9); // October
    showToast('Jumped to October 2026 Campaign Schedule');
  };

  const calendarGrid = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sunday
    const daysInThisMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

    const cells = [];

    // Preceding month filler days (greyed out)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        key: `prev-${daysInPrevMonth - i}`
      });
    }

    // Current month active days
    for (let day = 1; day <= daysInThisMonth; day++) {
      cells.push({
        dayNumber: day,
        isCurrentMonth: true,
        key: `current-${day}`
      });
    }

    // Trailing next month filler days to complete grid rows
    const remainder = cells.length % 7;
    if (remainder !== 0) {
      const nextMonthFillCount = 7 - remainder;
      for (let nextDay = 1; nextDay <= nextMonthFillCount; nextDay++) {
        cells.push({
          dayNumber: nextDay,
          isCurrentMonth: false,
          key: `next-${nextDay}`
        });
      }
    }

    return cells;
  }, [currentYear, currentMonthIndex]);

  const monthPosts = useMemo(() => {
    return activeClient.posts.filter(
      p => p.year === currentYear && p.month === currentMonthIndex
    );
  }, [activeClient, currentYear, currentMonthIndex]);

  const filteredMonthPosts = useMemo(() => {
    if (activeFilter === 'All') return monthPosts;
    if (activeFilter === 'Pending') return monthPosts.filter(p => p.status === 'Pending Approval');
    if (activeFilter === 'Approved') return monthPosts.filter(p => p.status === 'Approved');
    if (activeFilter === 'Changes') return monthPosts.filter(p => p.status === 'Changes Requested');
    return monthPosts;
  }, [monthPosts, activeFilter]);

  const stats = useMemo(() => {
    return {
      total: monthPosts.length,
      approved: monthPosts.filter(p => p.status === 'Approved').length,
      pending: monthPosts.filter(p => p.status === 'Pending Approval').length,
      changes: monthPosts.filter(p => p.status === 'Changes Requested').length
    };
  }, [monthPosts]);

  const handleFilesDropOrSelect = (fileList) => {
    const list = Array.from(fileList || []);
    if (!list.length) return;

    const newMediaItems = list.map(f => {
      const isVideo = f.type.startsWith('video/');
      const previewUrl = URL.createObjectURL(f);
      return {
        url: previewUrl,
        type: isVideo ? 'video' : 'image',
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
      };
    });

    setUploadedFiles(prev => [...prev, ...newMediaItems]);
    showToast(`Attached ${newMediaItems.length} media file(s)`);
  };

  const handleRemoveMediaFile = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSchedulePost = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.caption.trim()) {
      showToast('Please add a post title and caption');
      return;
    }

    const slides = uploadedFiles.length > 0
      ? uploadedFiles.map(f => f.url)
      : ['https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'];

    const hasVideo = uploadedFiles.some(f => f.type === 'video');
    const computedMediaType = hasVideo ? 'video' : (slides.length > 1 ? 'carousel' : 'image');

    const newPost = {
      id: 'post-' + Date.now(),
      year: currentYear,
      month: currentMonthIndex,
      day: parseInt(formData.day, 10),
      time: formData.time || '11:00 AM',
      title: formData.title.trim(),
      caption: formData.caption.trim(),
      hashtags: formData.hashtags.trim(),
      format: formData.format,
      platform: formData.platform,
      status: 'Pending Approval',
      mediaType: computedMediaType,
      mediaSlides: slides,
      remarks: [
        {
          id: 'rem-init-' + Date.now(),
          sender: 'Agency Production Lead',
          role: 'agency',
          text: `Scheduled creative asset on ${MONTH_NAMES[currentMonthIndex]} ${formData.day}. Ready for client review!`,
          timestamp: 'Just now'
        }
      ]
    };

    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return {
          ...c,
          posts: [...c.posts, newPost]
        };
      }
      return c;
    }));

    setIsNewPostModalOpen(false);
    setUploadedFiles([]);
    setFormData({
      day: 15,
      time: '11:00 AM',
      title: '',
      caption: '',
      hashtags: '#Marketing #CreativeStrategy #BrandStory',
      format: 'Static Post',
      platform: 'Instagram'
    });
    showToast(`Post scheduled for ${MONTH_NAMES[currentMonthIndex]} ${newPost.day}`);
  };

  const handleUpdateStatus = (postId, newStatus) => {
    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return {
          ...c,
          posts: c.posts.map(p => p.id === postId ? { ...p, status: newStatus } : p)
        };
      }
      return c;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Post status updated to "${newStatus}"`);
  };

  const handleAddRemark = (e) => {
    e.preventDefault();
    if (!newRemarkText.trim() || !selectedPost) return;

    const newRemark = {
      id: 'rem-' + Date.now(),
      sender: isClientMode ? `${activeClient.name} (Client)` : 'Agency Creative Director',
      role: isClientMode ? 'client' : 'agency',
      text: newRemarkText.trim(),
      timestamp: 'Just now'
    };

    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return {
          ...c,
          posts: c.posts.map(p => {
            if (p.id === selectedPost.id) {
              return {
                ...p,
                remarks: [...(p.remarks || []), newRemark]
              };
            }
            return p;
          })
        };
      }
      return c;
    }));

    setSelectedPost(prev => ({
      ...prev,
      remarks: [...(prev.remarks || []), newRemark]
    }));
    setNewRemarkText('');
    showToast('Feedback posted to discussion');
  };

  const generateClientMagicLink = (client) => {
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?client=${client.slug}&token=${client.secretToken}`;
  };

  const copyClientLink = (client) => {
    const link = generateClientMagicLink(client);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
    showToast(`Copied Client Magic Link for ${client.name}`);
  };

  const simulateOpenClientPortal = (client) => {
    // Switches application to client view mode directly
    setActiveClientId(client.id);
    setIsClientMode(true);
    setClientSlugParam(client.slug);
    setIsShareModalOpen(false);
    setIsClientsDrawerOpen(false);
    showToast(`Viewing in locked Client Review Portal for ${client.name}`);
  };

  const returnToAgencyDashboard = () => {
    setIsClientMode(false);
    setClientSlugParam(null);
    // clean url without page reload
    window.history.pushState({}, document.title, window.location.pathname);
    showToast('Restored Agency Workspace');
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-sans antialiased flex flex-col selection:bg-[#007AFF] selection:text-white">
      
      {/* iOS Floating Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-2xl text-white px-5 py-2.5 rounded-full shadow-2xl border border-white/10 text-xs font-semibold tracking-wide animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* iOS Cupertino Glass Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Header Left: Branding & Role Context */}
          <div className="flex items-center gap-3">
            {isClientMode ? (
              // Client Portal View: Clean brand banner with return badge for demonstration
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.08] shadow-xs flex items-center justify-center text-xl">
                  {activeClient.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold text-slate-900 tracking-tight">{activeClient.name}</h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                      Client Review Portal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Review, approve, and comment on upcoming social content</p>
                </div>
              </div>
            ) : (
              // Agency View: Hub trigger button to switch between any client
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsClientsDrawerOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.08] shadow-xs transition active:scale-98 group"
                >
                  <span className="text-lg">{activeClient.avatar}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{activeClient.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Switch Agency Client</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Header Center / Right Actions */}
          <div className="flex items-center gap-2.5">
            {isClientMode ? (
              // Client Mode: Notice + Quick Return To Agency Demo Button
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated Client Session</span>
                </div>

                {/* Back to Agency trigger so user can inspect both sides seamlessly */}
                <button
                  onClick={returnToAgencyDashboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Agency Workspace</span>
                </button>
              </div>
            ) : (
              // Agency Mode: Client Link Generator & Add Post
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-black/[0.08] text-xs font-semibold shadow-xs transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span className="hidden sm:inline">Copy Client Magic Link</span>
                  <span className="sm:hidden">Share</span>
                </button>

                <button
                  onClick={() => {
                    setUploadedFiles([]);
                    setIsNewPostModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Creative</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-5 flex-1 flex flex-col gap-4">
        
        {/* iOS Glass Controls Bar: Multi-Month Navigator & Status Filters */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 border border-black/[0.06] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3.5">
          
          {/* Month Switcher Navigation */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center bg-[#E5E5EA] p-1 rounded-2xl">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="w-8 h-8 rounded-xl bg-transparent hover:bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center transition shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-1 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#007AFF]" />
                <span className="text-sm font-bold text-slate-900 tracking-tight min-w-[130px] text-center">
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="w-8 h-8 rounded-xl bg-transparent hover:bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center transition shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick jump to October 2026 button if user navigated away */}
            {(currentMonthIndex !== 9 || currentYear !== 2026) && (
              <button
                onClick={handleJumpToOctober}
                className="text-[11px] font-bold text-[#007AFF] hover:underline px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200/50"
              >
                Return to Oct 2026
              </button>
            )}
          </div>

          {/* Quick Metrics & Segmented Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden lg:flex items-center gap-3 text-xs pr-2 border-r border-black/[0.06]">
              <span className="text-slate-500 font-medium">Scheduled: <strong className="text-slate-900">{stats.total}</strong></span>
              <span className="text-emerald-700 font-medium">Approved: <strong className="text-emerald-600">{stats.approved}</strong></span>
              <span className="text-amber-700 font-medium">Pending: <strong className="text-amber-600">{stats.pending}</strong></span>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center bg-[#E5E5EA] p-1 rounded-2xl gap-1 text-[11px] font-semibold">
              {['All', 'Pending', 'Approved', 'Changes'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    activeFilter === f
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'All' ? 'All Posts' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Month Calendar Viewport */}
        <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-3 sm:p-5 shadow-xl flex-1 flex flex-col">
          
          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {WEEKDAY_NAMES.map((name, idx) => (
              <div 
                key={name} 
                className={`py-1 text-xs font-bold tracking-tight uppercase ${
                  idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Month Days Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-2.5 flex-1 auto-rows-fr">
            {calendarGrid.map(cell => {
              // Only look for posts on active current month days
              const dayPosts = cell.isCurrentMonth
                ? filteredMonthPosts.filter(p => p.day === cell.dayNumber)
                : [];
              const hasPost = dayPosts.length > 0;
              const post = dayPosts[0];
              const isOct2Holiday = currentYear === 2026 && currentMonthIndex === 9 && cell.isCurrentMonth && cell.dayNumber === 2;

              if (!cell.isCurrentMonth) {
                // Dimmed cell for adjacent months
                return (
                  <div
                    key={cell.key}
                    className="min-h-[115px] sm:min-h-[145px] rounded-2xl p-2 bg-slate-100/40 border border-dashed border-slate-200/50 flex flex-col justify-start opacity-35 select-none"
                  >
                    <span className="text-xs font-semibold text-slate-400">{cell.dayNumber}</span>
                  </div>
                );
              }

              return (
                <div
                  key={cell.key}
                  onClick={() => {
                    if (post) {
                      setSelectedPost(post);
                      setCurrentSlideIndex(0);
                    } else if (!isClientMode) {
                      // Agency click on empty day opens scheduler
                      setFormData(prev => ({ ...prev, day: cell.dayNumber }));
                      setUploadedFiles([]);
                      setIsNewPostModalOpen(true);
                    }
                  }}
                  className={`min-h-[115px] sm:min-h-[145px] rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 relative group cursor-pointer ${
                    hasPost
                      ? 'bg-white border-2 border-black/[0.08] hover:border-[#007AFF] shadow-xs hover:shadow-md hover:-translate-y-0.5'
                      : 'bg-white/60 hover:bg-white border border-black/[0.04] hover:border-black/[0.1]'
                  } ${isOct2Holiday ? 'ring-2 ring-indigo-500/80 ring-offset-2 ring-offset-[#F2F2F7]' : ''}`}
                >
                  {/* Date Header */}
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-xl transition ${
                      isOct2Holiday
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : hasPost
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600'
                    }`}>
                      {cell.dayNumber}
                    </span>

                    {/* Gandhi Jayanti Label on Oct 2nd */}
                    {isOct2Holiday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 hidden sm:inline-block">
                        Gandhi Jayanti
                      </span>
                    )}

                    {/* Creative indicators */}
                    {hasPost && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        {post.mediaType === 'video' && <Film className="w-3 h-3 text-purple-600" />}
                        {post.mediaType === 'carousel' && <Layers className="w-3 h-3 text-blue-600" />}
                        {post.remarks?.length > 0 && (
                          <span className="flex items-center gap-0.5 text-slate-500">
                            <MessageSquare className="w-2.5 h-2.5 text-[#007AFF]" />
                            <span>{post.remarks.length}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Scheduled Creative Thumbnail Preview */}
                  {hasPost ? (
                    <div className="flex-1 flex flex-col justify-between mt-1.5">
                      <div className="relative w-full h-16 sm:h-20 rounded-xl overflow-hidden bg-slate-900 border border-black/[0.06]">
                        {post.mediaType === 'video' ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                            <video 
                              src={post.mediaSlides[0]} 
                              className="w-full h-full object-cover opacity-80"
                              muted
                              playsInline
                            />
                            <div className="absolute w-6 h-6 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={post.mediaSlides[0]} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[10px] text-white font-medium truncate w-full leading-tight">
                            {post.title}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg border ${STATUS_CONFIG[post.status].bgBadge}`}>
                          {post.status}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">{post.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 group-hover:text-[#007AFF] transition-colors">
                      {!isClientMode && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-semibold transition">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Footer Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-2 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Status Key:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pending Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Needs Revision</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            {isClientMode ? 'Client Review Mode' : `Agency Hub • ${activeClient.name}`}
          </div>
        </div>
      </main>

      {/* iOS Sliding Agency Clients Drawer (Agency side only) */}
      {isClientsDrawerOpen && !isClientMode && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-r border-black/[0.08] animate-in slide-in-from-left duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-black/[0.06] flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agency Clients Roster</h3>
                  <p className="text-[11px] text-slate-500">Switch or share content calendars</p>
                </div>
              </div>
              <button
                onClick={() => setIsClientsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Clients List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {clients.map(clientItem => {
                const isSelected = clientItem.id === activeClient.id;
                const postCount = clientItem.posts.length;

                return (
                  <div
                    key={clientItem.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#007AFF] shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-black/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{clientItem.avatar}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{clientItem.name}</h4>
                          <span className="text-[10px] text-slate-500">{clientItem.industry} • {postCount} post(s)</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#007AFF] text-white">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Action buttons inside each client card */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-black/[0.04]">
                      <button
                        onClick={() => {
                          setActiveClientId(clientItem.id);
                          setIsClientsDrawerOpen(false);
                          showToast(`Switched calendar to ${clientItem.name}`);
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition"
                      >
                        Open Workspace
                      </button>

                      <button
                        onClick={() => copyClientLink(clientItem)}
                        className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007AFF] text-xs font-semibold flex items-center gap-1 transition"
                        title="Copy direct magic link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </button>

                      <button
                        onClick={() => simulateOpenClientPortal(clientItem)}
                        className="py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition"
                        title="Simulate client portal view"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Client View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-black/[0.06] bg-slate-50 text-center text-xs text-slate-400">
              AgencyFlow Multi-Client Core Engine
            </div>
          </div>
        </div>
      )}

      {/* Share Client Magic Link Sheet */}
      {isShareModalOpen && !isClientMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/[0.08]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Client Review Magic Link</h3>
                  <p className="text-[11px] text-slate-500">Zero-login portal for {activeClient.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                When your client clicks this link, the app dynamically detects their identity and <strong>strictly locks into Client Review mode</strong>. They will only see their content calendar, approval buttons, and remark threads with no agency controls.
              </p>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Generated Client URL</label>
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-100 border border-black/[0.06]">
                  <span className="text-[11px] font-mono text-slate-600 truncate flex-1">
                    {generateClientMagicLink(activeClient)}
                  </span>
                  <button
                    onClick={() => copyClientLink(activeClient)}
                    className="bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition active:scale-95 shrink-0 flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Instant test client mode button */}
              <button
                onClick={() => simulateOpenClientPortal(activeClient)}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Test Client Experience Right Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Post Detail Bottom Sheet / Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-black/[0.08]"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center shadow-xs">
                  {selectedPost.platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                  {selectedPost.platform === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-600" />}
                  {selectedPost.platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-500" />}
                  {selectedPost.platform === 'Twitter' && <Twitter className="w-4 h-4 text-cyan-500" />}
                  {selectedPost.platform === 'YouTube' && <Youtube className="w-4 h-4 text-red-600" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{selectedPost.title}</h3>
                  <p className="text-[11px] text-slate-500">
                    {MONTH_NAMES[selectedPost.month]} {selectedPost.day}, {selectedPost.year} at {selectedPost.time} • {selectedPost.format}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[selectedPost.status].bgBadge}`}>
                  {selectedPost.status}
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sheet Content Columns */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.06]">
              
              {/* Media Player Column */}
              <div className="lg:col-span-6 p-5 sm:p-6 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>Creative Asset</span>
                    <span>
                      {selectedPost.mediaType === 'carousel' 
                        ? `Slide ${currentSlideIndex + 1} of ${selectedPost.mediaSlides.length}` 
                        : selectedPost.format}
                    </span>
                  </div>

                  {/* Device Media Frame */}
                  <div className="rounded-2xl overflow-hidden border border-black/[0.08] bg-black shadow-lg relative aspect-square flex items-center justify-center">
                    {selectedPost.mediaType === 'video' ? (
                      <video 
                        key={selectedPost.mediaSlides[0]}
                        src={selectedPost.mediaSlides[0]} 
                        controls 
                        autoPlay 
                        loop
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img 
                        src={selectedPost.mediaSlides[currentSlideIndex] || selectedPost.mediaSlides[0]} 
                        alt="Creative Asset" 
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Carousel Nav Arrows */}
                    {selectedPost.mediaSlides.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentSlideIndex === 0}
                          className="absolute left-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/80 transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCurrentSlideIndex(prev => Math.min(selectedPost.mediaSlides.length - 1, prev + 1))}
                          disabled={currentSlideIndex === selectedPost.mediaSlides.length - 1}
                          className="absolute right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/80 transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md">
                          {selectedPost.mediaSlides.map((_, i) => (
                            <span 
                              key={i} 
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                i === currentSlideIndex ? 'w-3 bg-white' : 'bg-white/50'
                              }`} 
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Client Approval Controls */}
                <div className="mt-5 p-3.5 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                    Client Approval Decision
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedPost.id, 'Approved')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-xs ${
                        selectedPost.status === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{selectedPost.status === 'Approved' ? 'Post Approved' : 'Approve Creative'}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedPost.id, 'Changes Requested')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-xs ${
                        selectedPost.status === 'Changes Requested'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-600 hover:text-white border border-rose-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Copy & Timeline Remarks Column */}
              <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between h-full bg-white">
                <div className="space-y-4">
                  {/* Caption */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Post Caption</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedPost.caption + '\n\n' + selectedPost.hashtags);
                          setCopiedCaption(true);
                          setTimeout(() => setCopiedCaption(false), 2000);
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#007AFF] hover:underline"
                      >
                        {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.06] text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-36 overflow-y-auto">
                      {selectedPost.caption}
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hashtags</span>
                    <div className="p-2 rounded-xl bg-slate-50 border border-black/[0.06] text-[11px] text-[#007AFF] font-mono">
                      {selectedPost.hashtags}
                    </div>
                  </div>

                  {/* Remarks Thread */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Client & Agency Discussion ({selectedPost.remarks?.length || 0})
                    </span>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {selectedPost.remarks && selectedPost.remarks.length > 0 ? (
                        selectedPost.remarks.map(rem => (
                          <div
                            key={rem.id}
                            className={`p-2.5 rounded-2xl border text-xs ${
                              rem.role === 'client'
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 ml-2'
                                : 'bg-slate-100 border-slate-200 text-slate-900 mr-2'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-[11px]">{rem.sender}</span>
                              <span className="text-[9px] text-slate-400">{rem.timestamp}</span>
                            </div>
                            <p className="text-slate-700 leading-normal">{rem.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                          No remarks recorded yet. Add comments below.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Send Remark Input */}
                <form onSubmit={handleAddRemark} className="mt-4 pt-3 border-t border-black/[0.06]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRemarkText}
                      onChange={e => setNewRemarkText(e.target.value)}
                      placeholder={isClientMode ? 'Add remark or revision notes...' : 'Reply to client feedback...'}
                      className="flex-1 bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40"
                    />
                    <button
                      type="submit"
                      disabled={!newRemarkText.trim()}
                      className="bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload & Schedule Creative Sheet (Agency side only) */}
      {isNewPostModalOpen && !isClientMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-md animate-in fade-in">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-black/[0.08]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upload & Schedule Creative</h3>
                <p className="text-[11px] text-slate-500">
                  Target: <strong>{activeClient.name}</strong> • {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </p>
              </div>
              <button 
                onClick={() => setIsNewPostModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSchedulePost} className="space-y-4 text-xs">
              
              {/* Native Drag and Drop Zone */}
              <div>
                <label className="text-slate-800 font-bold block mb-1.5">1. Media Assets (Images or Video)</label>
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFilesDropOrSelect(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-[#007AFF] bg-blue-50/50 scale-[0.99]' 
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    multiple 
                    accept="image/*,video/mp4,video/quicktime,video/webm" 
                    className="hidden" 
                    onChange={e => handleFilesDropOrSelect(e.target.files)}
                  />
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-black/[0.06] flex items-center justify-center mx-auto mb-2 text-[#007AFF]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-800 text-xs">
                    Drop images / MP4 videos here, or <span className="text-[#007AFF] underline">Browse</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Multi-slide Carousels, Static Posts, and Reels supported with zero server delay
                  </p>
                </div>

                {/* Uploaded media previews */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Attached Media ({uploadedFiles.length})
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {uploadedFiles.map((fileItem, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-black/[0.1] group">
                          {fileItem.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                              <Film className="w-6 h-6 text-purple-400" />
                            </div>
                          ) : (
                            <img src={fileItem.url} alt="Slide Preview" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveMediaFile(idx)}
                              className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center hover:scale-110 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 right-1 text-[8px] px-1 rounded bg-black/70 text-white font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Day & Publishing Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Day in {MONTH_NAMES[currentMonthIndex]} {currentYear}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={new Date(currentYear, currentMonthIndex + 1, 0).getDate()}
                    value={formData.day}
                    onChange={e => setFormData({ ...formData, day: e.target.value })}
                    className="w-full bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Publishing Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Platform & Format */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="YouTube">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Format Type</label>
                  <select
                    value={formData.format}
                    onChange={e => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Static Post">Single Post (1:1 / 4:5)</option>
                    <option value="Carousel">Multi-slide Carousel</option>
                    <option value="Reel">Reel / Video (9:16)</option>
                    <option value="Story">Story Format</option>
                  </select>
                </div>
              </div>

              {/* Post Title */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Post Title / Creative Hook</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sustainable Growth Campaign • Week 3"
                  className="w-full bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Post Caption */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Caption / Copy</label>
                <textarea
                  rows={3}
                  required
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Draft your social media copy here..."
                  className="w-full bg-slate-100 border border-black/[0.08] rounded-xl p-3 text-xs text-slate-800 leading-relaxed"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Hashtags</label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={e => setFormData({ ...formData, hashtags: e.target.value })}
                  placeholder="#Campaign #BrandStrategy"
                  className="w-full bg-slate-100 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-bold transition shadow-md shadow-blue-500/25 active:scale-95"
                >
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* iOS Cupertino Minimal Footer */}
      <footer className="mt-auto border-t border-black/[0.05] py-3 text-center text-[11px] text-slate-400">
        AgencyFlow OS • Multi-Client Content Operations & Approval Engine
      </footer>
    </div>
  );
}
