import React, { useState, useEffect } from 'react';
import { ScreenType, StudyTask } from '../../types/index.ts';
import {
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Search,
  Bell,
  Sparkles,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Compass,
  Building2,
  Layers,
  Tag,
  Share2,
  Trash2,
  QrCode,
  Award,
  Video,
  Navigation,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartCampusScreenProps {
  setActiveScreen: (screen: ScreenType) => void;
  onAddStudyTask?: (task: Omit<StudyTask, 'id'>) => void;
  onEarnXp?: (amount: number) => void;
}

export type CampusTab =
  | 'dashboard'
  | 'notices'
  | 'timetable'
  | 'rooms'
  | 'events'
  | 'lost-found'
  | 'profile';

export interface StudentProfile {
  name: string;
  course: string;
  semester: string;
  rollNo: string;
  email: string;
  bloodGroup: string;
  campusBranch: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  kind: 'academic' | 'events' | 'services';
  time: string;
  icon: string;
  isImportant?: boolean;
  isRead?: boolean;
}

export interface TimetableClass {
  id: string;
  time: string;
  title: string;
  type: 'Lecture' | 'Practical' | 'Tutorial';
  room: string;
  instructor?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
}

export interface LostFoundItem {
  id: string;
  kind: 'Lost' | 'Found';
  title: string;
  cat: 'Personal items' | 'Books & stationery' | 'Electronics' | 'Other';
  place: string;
  details: string;
  date: string;
  status: 'Open' | 'Reunited';
  contact?: string;
}

export interface CampusEventItem {
  id: string;
  title: string;
  category: 'Clubs' | 'Innovation' | 'Tech' | 'Cultural';
  dateStr: string;
  dayBadge: string;
  monthBadge: string;
  location: string;
  description: string;
  attendeesCount: number;
  isSaved?: boolean;
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Aanya Sharma',
  course: 'BCA',
  semester: 'Semester 2',
  rollNo: 'CGC-2024-BCA-104',
  email: 'aanya.sharma@cgc.edu.in',
  bloodGroup: 'B+',
  campusBranch: 'Jhanjeri, Mohali',
};

const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    title: 'DSA lab moved to Friday',
    description: 'For BCA Semester 2 · Practical in C-204 at 11:00 AM. Advance prep recommended.',
    kind: 'academic',
    time: '12 min ago',
    icon: '!',
    isImportant: true,
  },
  {
    id: 'n-2',
    title: 'Scholarship documents verified',
    description: 'Student services · Post-matric & merit-based documents approved. No action needed.',
    kind: 'services',
    time: '9:10 AM',
    icon: '✓',
  },
  {
    id: 'n-3',
    title: 'TechFest 2026 registrations open',
    description: 'Hackathon, Robot Wars, and Code-Sprint registrations close Thursday at the student desk.',
    kind: 'events',
    time: 'Yesterday',
    icon: '☆',
    isImportant: true,
  },
  {
    id: 'n-4',
    title: 'Mid-semester timetable published',
    description: 'BCA Semester 2 · Internal examinations begin on 9 November. Hall tickets available in portal.',
    kind: 'academic',
    time: 'Yesterday',
    icon: '▦',
  },
  {
    id: 'n-5',
    title: 'Campus Central Library extended hours',
    description: 'Reading halls in Block 2 will remain open till 10:00 PM for upcoming midterm evaluations.',
    kind: 'services',
    time: '2 days ago',
    icon: '📚',
  },
];

const DEFAULT_TIMETABLE: Record<string, TimetableClass[]> = {
  Monday: [
    { id: 'c-m1', time: '09:00 AM', title: 'Database Systems', type: 'Lecture', room: 'Block 1 · Room 104', instructor: 'Dr. R. Verma', day: 'Monday' },
    { id: 'c-m2', time: '10:30 AM', title: 'Web Development', type: 'Practical', room: 'Block 2 · Lab C-204', instructor: 'Prof. K. Singh', day: 'Monday' },
    { id: 'c-m3', time: '01:00 PM', title: 'Discrete Mathematics', type: 'Lecture', room: 'Block 1 · Room 112', instructor: 'Dr. P. Sharma', day: 'Monday' },
    { id: 'c-m4', time: '02:30 PM', title: 'Communication Skills', type: 'Lecture', room: 'Block 3 · Room 210', instructor: 'Ms. N. Kaur', day: 'Monday' },
  ],
  Tuesday: [
    { id: 'c-t1', time: '09:00 AM', title: 'Programming Fundamentals', type: 'Lecture', room: 'Block 1 · Room 201', instructor: 'Er. M. Gupta', day: 'Tuesday' },
    { id: 'c-t2', time: '11:00 AM', title: 'Web Development Lab', type: 'Practical', room: 'Block 2 · Lab C-204', instructor: 'Prof. K. Singh', day: 'Tuesday' },
    { id: 'c-t3', time: '02:00 PM', title: 'Operating Systems Overview', type: 'Lecture', room: 'Block 1 · Room 105', instructor: 'Dr. V. Malhotra', day: 'Tuesday' },
  ],
  Wednesday: [
    { id: 'c-w1', time: '10:00 AM', title: 'Database Systems Tutorial', type: 'Tutorial', room: 'Block 1 · Room 108', instructor: 'Dr. R. Verma', day: 'Wednesday' },
    { id: 'c-w2', time: '01:30 PM', title: 'Software Engineering Concepts', type: 'Lecture', room: 'Block 2 · Room 302', instructor: 'Prof. S. Joshi', day: 'Wednesday' },
    { id: 'c-w3', time: '03:00 PM', title: 'AI & Data Ethics Seminar', type: 'Lecture', room: 'Auditorium Hall B', instructor: 'Guest Speaker', day: 'Wednesday' },
  ],
  Thursday: [
    { id: 'c-th1', time: '09:00 AM', title: 'Programming Fundamentals Lab', type: 'Practical', room: 'Block 1 · Lab 102', instructor: 'Er. M. Gupta', day: 'Thursday' },
    { id: 'c-th2', time: '11:30 AM', title: 'Discrete Mathematics', type: 'Lecture', room: 'Block 1 · Room 112', instructor: 'Dr. P. Sharma', day: 'Thursday' },
    { id: 'c-th3', time: '02:00 PM', title: 'Computer Organization', type: 'Lecture', room: 'Block 3 · Room 204', instructor: 'Dr. H. Chawla', day: 'Thursday' },
  ],
  Friday: [
    { id: 'c-f1', time: '09:30 AM', title: 'Database Systems (Advanced SQL)', type: 'Lecture', room: 'Block 1 · Room 104', instructor: 'Dr. R. Verma', day: 'Friday' },
    { id: 'c-f2', time: '11:00 AM', title: 'DSA Practical Lab (Rescheduled)', type: 'Practical', room: 'Block 2 · Lab C-204', instructor: 'Prof. K. Singh', day: 'Friday' },
    { id: 'c-f3', time: '02:30 PM', title: 'Student Club & Project Mentoring', type: 'Tutorial', room: 'Incubation Hub', instructor: 'Mentors', day: 'Friday' },
  ],
};

const DEFAULT_EVENTS: CampusEventItem[] = [
  {
    id: 'ev-1',
    title: 'TechFest 2026: Apex Innovation',
    category: 'Tech',
    dateStr: '29 OCT 2026',
    dayBadge: '29',
    monthBadge: 'OCT',
    location: 'Main Auditorium & Open Amphitheatre',
    description: 'Flagship annual technology festival featuring 24-hr Hackathon, Robot Wars, Drone racing, and Industry Keynotes.',
    attendeesCount: 420,
    isSaved: true,
  },
  {
    id: 'ev-2',
    title: 'Student Club Meetup: AI & Web3 Guild',
    category: 'Clubs',
    dateStr: '02 NOV 2026',
    dayBadge: '02',
    monthBadge: 'NOV',
    location: 'Incubation Centre, Block 2',
    description: 'Hands-on session building decentralized apps and local LLM agents. Open to all semesters.',
    attendeesCount: 85,
    isSaved: false,
  },
  {
    id: 'ev-3',
    title: 'Campus Innovation Showcase & Startup Pitch',
    category: 'Innovation',
    dateStr: '08 NOV 2026',
    dayBadge: '08',
    monthBadge: 'NOV',
    location: 'Seminar Hall 1, Block 2',
    description: 'Present student prototypes to angel mentors and Chandigarh angel network investors with seed grants up to ₹2,50,000.',
    attendeesCount: 160,
    isSaved: false,
  },
  {
    id: 'ev-4',
    title: 'Virsa: Punjab Heritage & Cultural Night',
    category: 'Cultural',
    dateStr: '15 NOV 2026',
    dayBadge: '15',
    monthBadge: 'NOV',
    location: 'CGC Sports Stadium Grounds',
    description: 'Bhangra, Giddha, live musical performances, food trucks, and inter-college cultural showcase.',
    attendeesCount: 890,
    isSaved: false,
  },
];

const DEFAULT_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    kind: 'Lost',
    title: 'Lavender earbuds case (AirPods Pro)',
    cat: 'Electronics',
    place: 'Near Central Library steps',
    details: 'Matte lavender protective sleeve with a small anime sticker on the clasp. Missing since Tuesday 2 PM.',
    date: '2 hours ago',
    status: 'Open',
    contact: 'Drop at Security Block 1',
  },
  {
    id: 'lf-2',
    kind: 'Found',
    title: 'Blue steel insulated water bottle',
    cat: 'Personal items',
    place: 'Academic Block 2 · Lab C-204',
    details: 'Found on desk row 3 after the 10:30 AM Web Development practical. Currently with lab attendant.',
    date: 'Yesterday',
    status: 'Open',
    contact: 'Lab Attendant, C-204',
  },
  {
    id: 'lf-3',
    kind: 'Lost',
    title: 'Black hardcover engineering notebook',
    cat: 'Books & stationery',
    place: 'Cafeteria / Food Court',
    details: 'A5 dotted notebook with green elastic band containing discrete mathematics lecture summaries and diagrams.',
    date: '2 days ago',
    status: 'Open',
    contact: 'Roll No: CGC-2024-BCA-104',
  },
  {
    id: 'lf-4',
    kind: 'Found',
    title: 'Calculator (Casio fx-991EX)',
    cat: 'Electronics',
    place: 'Block 1 · Room 104',
    details: 'Found on chair in row 5 with initials "A.S." lightly inscribed on rear battery lid.',
    date: '3 days ago',
    status: 'Reunited',
    contact: 'Returned to owner',
  },
];

const CAMPUS_LOCATIONS: Record<
  string,
  {
    name: string;
    block: string;
    description: string;
    facilities: string[];
    walkTime: string;
    coordinatesText: string;
    tips: string;
  }
> = {
  'block 1': {
    name: 'Academic Block 1 (Engineering & Tech)',
    block: 'Block 1',
    description: 'Core campus building hosting Computer Science, AI & Data Science departments, modern hardware labs, and seminar rooms.',
    facilities: ['CS Labs 101-106', 'Dean Academic Office', 'Faculty Cabins', 'Drinking Water & Restrooms'],
    walkTime: '2 min walk from Main Entrance Gate',
    coordinatesText: '30.6812° N, 76.6059° E',
    tips: 'Use Gate 1 for closest access to Ground Floor lecture theatres.',
  },
  'block 2': {
    name: 'Academic Block 2 (Management & Computer Applications)',
    block: 'Block 2',
    description: 'Home to BCA, MCA, and Management studies. Features the Advanced Web Lab C-204, Conference Halls, and Smart Classrooms.',
    facilities: ['Advanced Web Lab C-204', 'Management Library', 'Startup Incubation Centre', 'Digital Media Studio'],
    walkTime: '3 min walk from Main Gate via Central Lawn',
    coordinatesText: '30.6814° N, 76.6062° E',
    tips: 'Room C-204 is on the 2nd Floor, right wing near the eastern stairwell.',
  },
  'block 3': {
    name: 'Academic Block 3 (Basic Sciences & Humanities)',
    block: 'Block 3',
    description: 'Houses physics and chemistry research laboratories, lecture halls 201-215, and language communication labs.',
    facilities: ['Chemistry & Physics Labs', 'Language Lab', 'Auditorium Foyer', 'Student Advisory Desk'],
    walkTime: '4 min walk across Central Boulevard',
    coordinatesText: '30.6808° N, 76.6055° E',
    tips: 'Auditorium Hall B is accessible through the south ground floor entrance.',
  },
  library: {
    name: 'CGC Central Knowledge Library',
    block: 'Library Complex (Adjacent to Block 2)',
    description: 'Two-tier high-capacity library stocked with 45,000+ volumes, IEEE digital access terminals, reading carrels, and air-conditioned silence zones.',
    facilities: ['Quiet Study Pods', 'Digital e-Library Terminals', 'Photocopy & Printing Hub', 'Book Circulation Desk'],
    walkTime: '2 min walk from Block 1 or Block 2',
    coordinatesText: '30.6813° N, 76.6060° E',
    tips: 'Open Monday–Saturday 8:00 AM to 8:00 PM (extended to 10:00 PM during exam weeks).',
  },
  'food court': {
    name: 'Student Food Court & Campus Cafeteria',
    block: 'Central Amenities Zone',
    description: 'Dynamic campus hub serving multi-cuisine meals, Nescafe coffee bar, fresh juice counter, bakery, and open-air patio seating.',
    facilities: ['Main Dining Hall', 'Nescafe Espresso Bar', 'Subway & Snack Counter', 'Outdoor Courtyard'],
    walkTime: '3 min walk from Academic Blocks',
    coordinatesText: '30.6816° N, 76.6065° E',
    tips: 'Peak rush occurs between 12:30 PM and 1:30 PM. Order ahead using digital kiosks.',
  },
  hostel: {
    name: 'CGC Student Residences (Boys & Girls Hostels)',
    block: 'Residential Quadrant',
    description: 'Secure on-campus residential wings with 24/7 power backup, Wi-Fi connectivity, mess halls, gym, and recreation lounges.',
    facilities: ['Hostel Mess', 'Indoor Games Room', 'Laundry Services', '24/7 Security & Wardens'],
    walkTime: '5 min walk from Academic Quadrant',
    coordinatesText: '30.6820° N, 76.6050° E',
    tips: 'Visitor timings: 4:00 PM - 7:00 PM daily with biometric visitor entry.',
  },
  auditorium: {
    name: 'Main University Auditorium & Amphitheatre',
    block: 'Auditorium Complex',
    description: 'State-of-the-art 1,200-seat multi-tier auditorium equipped with Dolby acoustics and 4K digital projection for convocations and TechFest.',
    facilities: ['1,200 Seating Capacity', 'Green Rooms', 'Media Broadcast Booth', 'Open Air Amphitheatre'],
    walkTime: '3 min walk from Main Reception',
    coordinatesText: '30.6806° N, 76.6057° E',
    tips: 'Primary venue for TechFest 2026, convocations, and cultural fests.',
  },
};

export const SmartCampusScreen: React.FC<SmartCampusScreenProps> = ({
  setActiveScreen,
  onAddStudyTask,
  onEarnXp,
}) => {
  // Navigation sub-tab
  const [activeTab, setActiveTab] = useState<CampusTab>('dashboard');

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('smart-campus-cgc-profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Profile editing form state
  const [editProfileForm, setEditProfileForm] = useState<StudentProfile>(profile);
  const [profileToast, setProfileToast] = useState<string | null>(null);

  // Global search inside Smart Campus
  const [searchQuery, setSearchQuery] = useState('');

  // Notices state
  const [notices, setNotices] = useState<NoticeItem[]>(DEFAULT_NOTICES);
  const [noticeFilter, setNoticeFilter] = useState<'all' | 'academic' | 'events' | 'services'>('all');

  // Timetable state
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [timetable, setTimetable] = useState<Record<string, TimetableClass[]>>(() => {
    try {
      const saved = localStorage.getItem('smart-campus-cgc-timetable');
      return saved ? JSON.parse(saved) : DEFAULT_TIMETABLE;
    } catch {
      return DEFAULT_TIMETABLE;
    }
  });
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassForm, setNewClassForm] = useState<Omit<TimetableClass, 'id'>>({
    time: '09:00 AM',
    title: '',
    type: 'Lecture',
    room: 'Block 1 · Room 104',
    instructor: '',
    day: 'Monday',
  });

  // Campus Navigator / Room Finder state
  const [roomQuery, setRoomQuery] = useState('Block 2');
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<typeof CAMPUS_LOCATIONS['block 2']>(
    CAMPUS_LOCATIONS['block 2']
  );

  // Events state
  const [events, setEvents] = useState<CampusEventItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart-campus-cgc-events');
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');
  const [eventToast, setEventToast] = useState<string | null>(null);

  // Lost & Found state
  const [lostFoundList, setLostFoundList] = useState<LostFoundItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart-campus-cgc-lf');
      return saved ? JSON.parse(saved) : DEFAULT_LOST_FOUND;
    } catch {
      return DEFAULT_LOST_FOUND;
    }
  });
  const [lfFilter, setLfFilter] = useState<'all' | 'Lost' | 'Found'>('all');
  const [showAddLfModal, setShowAddLfModal] = useState(false);
  const [newLfItem, setNewLfItem] = useState({
    kind: 'Lost' as 'Lost' | 'Found',
    title: '',
    cat: 'Personal items' as 'Personal items' | 'Books & stationery' | 'Electronics' | 'Other',
    place: '',
    details: '',
    contact: '',
  });

  // Sync profile edits to localStorage
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editProfileForm);
    localStorage.setItem('smart-campus-cgc-profile', JSON.stringify(editProfileForm));
    setProfileToast('Profile updated & synchronized across all smart campus modules!');
    setTimeout(() => setProfileToast(null), 3500);
  };

  // Sync timetable edits to localStorage
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.title.trim()) return;

    const newClass: TimetableClass = {
      id: `c-${Date.now()}`,
      ...newClassForm,
    };

    const updated = {
      ...timetable,
      [newClassForm.day]: [...(timetable[newClassForm.day] || []), newClass],
    };

    setTimetable(updated);
    localStorage.setItem('smart-campus-cgc-timetable', JSON.stringify(updated));
    setShowAddClassModal(false);
    setNewClassForm({
      time: '09:00 AM',
      title: '',
      type: 'Lecture',
      room: 'Block 1 · Room 104',
      instructor: '',
      day: selectedDay as any,
    });
  };

  const handleSyncClassToPlanner = (c: TimetableClass) => {
    if (onAddStudyTask) {
      onAddStudyTask({
        title: `${c.title} (${c.type})`,
        subtitle: `${c.room} · Scheduled class session`,
        tag: 'Scheduled',
        dueDate: `Today ${c.time}`,
        xpReward: 120,
        completed: false,
      });
      if (onEarnXp) onEarnXp(50);
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.8 } });
      setProfileToast(`Class "${c.title}" added to your Focus Study Planner (+50 XP)!`);
      setTimeout(() => setProfileToast(null), 3000);
    }
  };

  // Handle Event RSVP toggle
  const handleToggleEvent = (eventId: string) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        const nextSaved = !ev.isSaved;
        if (nextSaved) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          setEventToast(`RSVP Confirmed for "${ev.title}"! Pass stored in your profile.`);
        } else {
          setEventToast(`RSVP removed for "${ev.title}".`);
        }
        return {
          ...ev,
          isSaved: nextSaved,
          attendeesCount: nextSaved ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
        };
      }
      return ev;
    });

    setEvents(updated);
    localStorage.setItem('smart-campus-cgc-events', JSON.stringify(updated));
    setTimeout(() => setEventToast(null), 3500);
  };

  // Handle Lost & Found submission
  const handleAddLostFound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLfItem.title.trim() || !newLfItem.place.trim()) return;

    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      kind: newLfItem.kind,
      title: newLfItem.title.trim(),
      cat: newLfItem.cat,
      place: newLfItem.place.trim(),
      details: newLfItem.details.trim() || 'No additional details provided.',
      date: 'Just now',
      status: 'Open',
      contact: newLfItem.contact.trim() || `Student Desk / ${profile.rollNo}`,
    };

    const updated = [newItem, ...lostFoundList];
    setLostFoundList(updated);
    localStorage.setItem('smart-campus-cgc-lf', JSON.stringify(updated));
    setShowAddLfModal(false);
    setNewLfItem({
      kind: 'Lost',
      title: '',
      cat: 'Personal items',
      place: '',
      details: '',
      contact: '',
    });
    setProfileToast('Item listing broadcasted to the campus lost & found network!');
    setTimeout(() => setProfileToast(null), 3000);
  };

  const handleResolveLostFound = (id: string) => {
    const updated = lostFoundList.map((item) =>
      item.id === id ? { ...item, status: 'Reunited' as const } : item
    );
    setLostFoundList(updated);
    localStorage.setItem('smart-campus-cgc-lf', JSON.stringify(updated));
  };

  // Resolve room query
  const handleResolvePlace = (query: string) => {
    setRoomQuery(query);
    const q = query.toLowerCase().trim();
    let foundKey = Object.keys(CAMPUS_LOCATIONS).find((key) => q.includes(key));
    if (!foundKey) {
      if (q.includes('c-204') || q.includes('bca') || q.includes('lab c')) {
        foundKey = 'block 2';
      } else if (q.includes('chem') || q.includes('physics') || q.includes('science')) {
        foundKey = 'block 3';
      } else if (q.includes('cs') || q.includes('comp') || q.includes('eng')) {
        foundKey = 'block 1';
      } else if (q.includes('book') || q.includes('reading') || q.includes('study')) {
        foundKey = 'library';
      } else if (q.includes('cafe') || q.includes('food') || q.includes('lunch') || q.includes('coffee')) {
        foundKey = 'food court';
      } else if (q.includes('hostel') || q.includes('room') || q.includes('dorm')) {
        foundKey = 'hostel';
      } else if (q.includes('audi') || q.includes('techfest') || q.includes('event')) {
        foundKey = 'auditorium';
      }
    }

    if (foundKey && CAMPUS_LOCATIONS[foundKey]) {
      setSelectedPlaceInfo(CAMPUS_LOCATIONS[foundKey]);
    } else {
      // Default fallback
      setSelectedPlaceInfo({
        name: `Custom Location: ${query}`,
        block: 'Campus Vicinity (Jhanjeri)',
        description: `Campus location matching "${query}". Please check the digital directory board at Main Block 1.`,
        facilities: ['Information Desk', 'Campus Map Kiosk'],
        walkTime: '3-5 min walk from Main Quadrangle',
        coordinatesText: '30.68114° N, 76.60584° E',
        tips: 'Ask any campus security personnel or consult the Academic Block 1 reception.',
      });
    }
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase();
    if (q.includes('notice') || q.includes('lab moved') || q.includes('scholarship')) {
      setActiveTab('notices');
    } else if (q.includes('class') || q.includes('timetable') || q.includes('monday') || q.includes('schedule')) {
      setActiveTab('timetable');
    } else if (q.includes('lost') || q.includes('found') || q.includes('bottle') || q.includes('earbuds')) {
      setActiveTab('lost-found');
    } else if (q.includes('event') || q.includes('techfest') || q.includes('showcase')) {
      setActiveTab('events');
    } else {
      setActiveTab('rooms');
      handleResolvePlace(searchQuery);
    }
  };

  // Filtered lists
  const filteredNotices = notices.filter((n) => {
    if (noticeFilter !== 'all' && n.kind !== noticeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredLostFound = lostFoundList.filter((item) => {
    if (lfFilter !== 'all' && item.kind !== lfFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.place.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredEvents = events.filter((ev) => {
    if (eventCategoryFilter !== 'All' && ev.category !== eventCategoryFilter) return false;
    return true;
  });

  const todayClasses = timetable['Monday'] || [];

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto">
      {/* Toast Alert Notification */}
      {profileToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#162138] border border-cyan-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{profileToast}</span>
        </div>
      )}

      {eventToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#281b3d] border border-purple-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium">{eventToast}</span>
        </div>
      )}

      {/* Top Smart Campus Header Bar with Search & Profile Pill */}
      <div className="bg-[#121626]/90 border border-[#2b274c]/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Campus Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7050d8] via-[#a855f7] to-[#ec4899] flex items-center justify-center text-white font-bold shadow-md shadow-purple-900/30">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base text-white tracking-tight">
                CGC Smart Campus
              </h2>
              <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                Jhanjeri, Mohali
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {profile.course} · {profile.semester} · {profile.rollNo}
            </p>
          </div>
        </div>

        {/* Global Smart Search Bar */}
        <form
          onSubmit={handleGlobalSearchSubmit}
          className="relative flex-1 max-w-md w-full"
        >
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices, classes, rooms (e.g. Block 2, C-204)..."
            className="w-full bg-[#0c101d] border border-[#2e2b4d] rounded-xl pl-9 pr-14 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400/80 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-purple-600 hover:bg-purple-500 text-white font-medium px-2 py-1 rounded-md transition-colors"
          >
            Find ↵
          </button>
        </form>

        {/* Quick Profile Mini Card */}
        <button
          onClick={() => setActiveTab('profile')}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1b1c32] hover:bg-[#252545] border border-[#37345b] text-left transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {profile.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-slate-200 block leading-tight">
              {profile.name}
            </span>
            <span className="text-[10px] text-purple-300 font-mono">Digital ID Active</span>
          </div>
        </button>
      </div>

      {/* Hero Banner: Campus Life, Connected (Matches attached prototype) */}
      <div className="relative min-h-[175px] sm:min-h-[195px] rounded-2xl overflow-hidden border border-[#402766] p-5 sm:p-7 flex flex-col justify-end text-white shadow-xl">
        {/* Background Image with Fallback Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://www.cgcuniversity.in/frontend/images/campus-life/banner-mobilee.webp"
            alt="CGC University Mohali campus"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#211136]/95 via-[#391854]/85 to-[#822a61]/65 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c1a] via-transparent to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded">
                CGC UNIVERSITY · JHANJERI, MOHALI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-300 font-mono font-medium">SESSION 2025-26</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              Campus life, connected.
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 mt-1 max-w-lg leading-relaxed">
              Your official, student-friendly front door for daily classes, room finder, notices, TechFest 2026, and campus lost & found.
            </p>
          </div>

          {/* Official University Facility & Media Links */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.cgcuniversity.in/campus-facilities"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/40 text-purple-200 flex items-center gap-1.5 backdrop-blur-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
              <span>Campus Facilities</span>
            </a>
            <a
              href="https://www.youtube.com/watch?v=T8ErI_JKfvo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-900/50 hover:bg-pink-800/70 border border-pink-400/40 text-pink-200 flex items-center gap-1.5 backdrop-blur-md transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-pink-300" />
              <span>Campus Life Video</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tab Navigation Menu (Sub-nav) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#2a2948]">
        {[
          { id: 'dashboard', label: 'Overview', icon: Layers },
          { id: 'notices', label: 'Campus Notices', icon: Bell, badge: `${notices.length}` },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'rooms', label: 'Find a Place & Map', icon: Compass },
          { id: 'events', label: 'Events & TechFest', icon: Sparkles, badge: 'Live' },
          { id: 'lost-found', label: 'Lost & Found', icon: Tag, badge: `${lostFoundList.filter((i) => i.status === 'Open').length}` },
          { id: 'profile', label: 'Digital ID Pass', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CampusTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-[#7050d8] to-[#b04fdf] text-white shadow-md shadow-purple-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1b30]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================================= */}
      {/* TAB 1: OVERVIEW / DASHBOARD (MATCHING PROTOTYPE) */}
      {/* ========================================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Greeting & Subheading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                Good morning, {profile.name.split(' ')[0]} 👋
              </h2>
              <p className="text-xs text-slate-400">
                Here’s what’s scheduled and happening across CGC University today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-purple-300 bg-purple-950/70 border border-purple-700/50 px-2.5 py-1 rounded-lg">
                📍 CGC JHANJERI, MOHALI
              </span>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setActiveTab('timetable')}
              className="bg-[#121528] hover:bg-[#171b33] border border-[#28274d] hover:border-purple-500/40 rounded-2xl p-4 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium">Classes today</span>
                <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-white my-1 font-mono">{todayClasses.length}</div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span>Next class at {todayClasses[1]?.time || '10:30 AM'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('notices')}
              className="bg-[#121528] hover:bg-[#171b33] border border-[#28274d] hover:border-purple-500/40 rounded-2xl p-4 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium">New notices</span>
                <Bell className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-white my-1 font-mono">
                {notices.filter((n) => n.isImportant).length}
              </div>
              <div className="text-[11px] text-purple-300 font-medium flex items-center gap-1">
                <span>2 urgent for your semester</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('events')}
              className="bg-[#121528] hover:bg-[#171b33] border border-[#28274d] hover:border-purple-500/40 rounded-2xl p-4 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium">Upcoming events</span>
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-white my-1 font-mono">
                {events.length}
              </div>
              <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                <span>TechFest 2026 in 3 days</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* 2-Column Grid: For You Notices & Today's Timetable */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Notices Panel */}
            <div className="lg:col-span-6 bg-[#111424] border border-[#262744] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#21233d] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <h3 className="font-heading font-bold text-white text-sm">For you</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <span>All notices</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => setActiveTab('notices')}
                      className="p-3 rounded-xl bg-[#171a2e]/70 hover:bg-[#1d213b] border border-[#2c2d4a]/60 flex items-start gap-3 cursor-pointer transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {notice.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-100 truncate">
                            {notice.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                            {notice.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {notice.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#21233d] flex items-center justify-between text-xs text-slate-400">
                <span>Filter by course: {profile.course}</span>
                <span className="text-purple-400 font-medium">Updated 12m ago</span>
              </div>
            </div>

            {/* Today's Timetable Panel */}
            <div className="lg:col-span-6 bg-[#111424] border border-[#262744] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#21233d] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h3 className="font-heading font-bold text-white text-sm">Today’s timetable</h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-700/50 px-2 py-0.5 rounded">
                    Monday Schedule
                  </span>
                </div>

                <div className="space-y-3">
                  {todayClasses.map((cls, idx) => (
                    <div
                      key={cls.id}
                      className="relative pl-4 border-l-2 border-purple-500/50 hover:border-cyan-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-purple-400 font-bold">
                          {cls.time}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                            cls.type === 'Practical'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {cls.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 mt-0.5">{cls.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{cls.room}</span>
                        {idx === 1 && (
                          <span className="text-[10px] text-amber-400 font-semibold animate-pulse">
                            ● Rescheduled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#21233d] flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Full weekly timetable</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    handleSyncClassToPlanner(todayClasses[0]);
                  }}
                  className="text-[11px] text-purple-300 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 px-2.5 py-1 rounded-lg font-medium transition-colors"
                >
                  + Add to Focus Planner
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Quick Map Links & Featured TechFest Event */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Campus Mini Map Locator */}
            <div className="md:col-span-6 bg-[#111424] border border-[#262744] rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <h3 className="font-heading font-bold text-white text-sm">Campus map</h3>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('rooms');
                    handleResolvePlace('block 2');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  <span>Open room finder</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { name: 'Library', query: 'library' },
                  { name: 'Academic blocks', query: 'block 2', active: true },
                  { name: 'Food court', query: 'food court' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab('rooms');
                      handleResolvePlace(item.query);
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                      item.active
                        ? 'bg-gradient-to-br from-[#7050d8] to-[#9333ea] text-white shadow-md'
                        : 'bg-[#181a2e] hover:bg-[#20233d] text-slate-300 border border-[#2d2f4d]'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-400">
                Need to navigate to Room C-204 or Block 1? Use the OpenStreetMap campus locator with verified building paths.
              </p>
            </div>

            {/* Coming Up Event */}
            <div className="md:col-span-6 bg-[#111424] border border-[#262744] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="font-heading font-bold text-white text-sm">Coming up</h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                    29 OCT
                  </span>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-gradient-to-r from-[#1e1430] to-[#171329] border border-purple-500/30">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/40 flex flex-col items-center justify-center text-purple-200 font-bold flex-shrink-0">
                    <span className="text-base leading-none">29</span>
                    <span className="text-[9px] uppercase tracking-wider text-purple-300">OCT</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">TechFest 2026: Apex Innovation</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Main auditorium & grounds · Hackathon, Drone racing & Robotics
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-emerald-400 font-medium">● Free Registration Open</span>
                      <span className="text-[10px] text-slate-400 font-mono">420+ students RSVPed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#21233d] flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('events')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Explore all campus events →
                </button>
                <button
                  onClick={() => handleToggleEvent('ev-1')}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1 rounded-lg transition-colors"
                >
                  {events.find((e) => e.id === 'ev-1')?.isSaved ? '✓ Saved' : 'Save Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* TAB 2: CAMPUS NOTICES */}
      {/* ========================================================================================= */}
      {activeTab === 'notices' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                Campus notices
              </h2>
              <p className="text-xs text-slate-400">
                Official circulars and academic updates filtered for your course ({profile.course}) and semester ({profile.semester}).
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All updates' },
              { id: 'academic', label: 'Academic' },
              { id: 'events', label: 'Events' },
              { id: 'services', label: 'Student services' },
            ].map((f) => {
              const isOn = noticeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setNoticeFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isOn
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-[#15192c] hover:bg-[#1d223c] text-slate-300 border border-[#2b2d4b]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Notices List */}
          <div className="bg-[#111424] border border-[#262744] rounded-2xl overflow-hidden shadow-xl divide-y divide-[#21233d]">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 hover:bg-[#171a2e] transition-colors flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {notice.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{notice.title}</h4>
                        {notice.isImportant && (
                          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                            Action Required
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{notice.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notice.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-purple-300 font-medium">
                      <span className="capitalize font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-700/40">
                        #{notice.kind}
                      </span>
                      <span>Verified by Registrar Office</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notices found in this category or matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* TAB 3: TIMETABLE */}
      {/* ========================================================================================= */}
      {activeTab === 'timetable' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                My timetable
              </h2>
              <p className="text-xs text-slate-400">
                Choose a weekday to inspect class timings, lecture theatres, and lab schedules for {profile.course}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                aria-label="Choose weekday"
                className="bg-[#14182b] border border-[#2f3154] text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>

              <button
                onClick={() => setShowAddClassModal(true)}
                className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-2 rounded-xl transition-colors shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Class</span>
              </button>
            </div>
          </div>

          {/* Timetable Table Card */}
          <div className="bg-[#111424] border border-[#262744] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-[#15192c] border-b border-[#242642] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Class & Subject</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Room & Block</th>
                    <th className="py-3 px-4 text-right">Synergy Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2038] text-xs">
                  {(timetable[selectedDay] || []).length > 0 ? (
                    (timetable[selectedDay] || []).map((row) => (
                      <tr key={row.id} className="hover:bg-[#161a2e]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-300">
                          {row.time}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-white block font-heading">{row.title}</strong>
                          <span className="text-[11px] text-slate-400">
                            {row.instructor || `${selectedDay} Session`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              row.type === 'Practical'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : row.type === 'Tutorial'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">{row.room}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleSyncClassToPlanner(row)}
                            className="text-[11px] text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 px-2.5 py-1 rounded-lg font-medium transition-colors"
                          >
                            Sync to Focus Planner (+50 XP)
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No classes scheduled for {selectedDay}. You can add one using the button above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#0d101e] border-t border-[#21233d] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Schedule content matches official CGC University Academic Almanac 2025-26.
              </span>
              <button
                onClick={() => {
                  setTimetable(DEFAULT_TIMETABLE);
                  localStorage.removeItem('smart-campus-cgc-timetable');
                  setProfileToast('Reset timetable to official default!');
                  setTimeout(() => setProfileToast(null), 3000);
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                Reset to default
              </button>
            </div>
          </div>

          {/* Modal to Add Class */}
          {showAddClassModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#121629] border border-[#34355a] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-white">Add Class Session</h3>
                  <button
                    onClick={() => setShowAddClassModal(false)}
                    className="text-slate-400 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddClass} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Subject / Course Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artificial Intelligence & ML"
                      value={newClassForm.title}
                      onChange={(e) => setNewClassForm({ ...newClassForm, title: e.target.value })}
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Day</label>
                      <select
                        value={newClassForm.day}
                        onChange={(e) => setNewClassForm({ ...newClassForm, day: e.target.value as any })}
                        className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Type</label>
                      <select
                        value={newClassForm.type}
                        onChange={(e) => setNewClassForm({ ...newClassForm, type: e.target.value as any })}
                        className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Lecture">Lecture</option>
                        <option value="Practical">Practical</option>
                        <option value="Tutorial">Tutorial</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Time</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 11:30 AM"
                        value={newClassForm.time}
                        onChange={(e) => setNewClassForm({ ...newClassForm, time: e.target.value })}
                        className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Room / Lab</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Block 2 · C-204"
                        value={newClassForm.room}
                        onChange={(e) => setNewClassForm({ ...newClassForm, room: e.target.value })}
                        className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Instructor (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. A. K. Verma"
                      value={newClassForm.instructor || ''}
                      onChange={(e) =>
                        setNewClassForm({ ...newClassForm, instructor: e.target.value })
                      }
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddClassModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30"
                    >
                      Save Class
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================================= */}
      {/* TAB 4: FIND A PLACE & CAMPUS NAVIGATOR */}
      {/* ========================================================================================= */}
      {activeTab === 'rooms' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                Find your room & campus places
              </h2>
              <p className="text-xs text-slate-400">
                Explore CGC University Jhanjeri campus map, building blocks, labs, and walking directions.
              </p>
            </div>
          </div>

          {/* Quick preset selector buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { label: 'Block 1', q: 'block 1' },
              { label: 'Block 2 (BCA / Labs)', q: 'block 2' },
              { label: 'Block 3 (Sciences)', q: 'block 3' },
              { label: 'Central Library', q: 'library' },
              { label: 'Food Court & Cafe', q: 'food court' },
              { label: 'Hostel Wings', q: 'hostel' },
              { label: 'Main Auditorium', q: 'auditorium' },
            ].map((preset) => (
              <button
                key={preset.q}
                onClick={() => handleResolvePlace(preset.q)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  roomQuery.toLowerCase().includes(preset.q)
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-[#15192c] hover:bg-[#1d223c] text-slate-300 border border-[#2b2d4b]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* 2-Column Map Layout: Interactive OpenStreetMap & Location Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* OpenStreetMap Embed */}
            <div className="lg:col-span-7 bg-[#111424] border border-[#262744] rounded-2xl p-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-400" />
                    <h3 className="font-heading font-bold text-white text-sm">
                      OpenStreetMap · CGC Jhanjeri Vicinity
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    GPS 30.68114, 76.60584
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#2b2d4d] relative aspect-[4/3] sm:aspect-[16/10] bg-[#0c101d]">
                  <iframe
                    title="OpenStreetMap CGC University Mohali"
                    loading="lazy"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=76.5980%2C30.6765%2C76.6138%2C30.6865&layer=mapnik&marker=30.68114%2C76.60584"
                    className="w-full h-full border-0 filter contrast-105"
                  />
                  {/* Floating active marker pin badge */}
                  <div className="absolute top-3 left-3 bg-[#111424]/90 backdrop-blur-md border border-purple-500/50 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                    <span>CGC University Campus Pin</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#21233d] flex items-center justify-between text-xs text-slate-400">
                <span>Map data © OpenStreetMap contributors</span>
                <a
                  href="https://www.openstreetmap.org/?mlat=30.68114&mlon=76.60584#map=16/30.68114/76.60584"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  <span>Open Fullscreen Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Resolved Destination Card & Route Info */}
            <div className="lg:col-span-5 bg-[#111424] border border-[#262744] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Destination Guide</span>
                </div>
                <h3 className="font-heading font-black text-xl text-white">
                  {selectedPlaceInfo.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedPlaceInfo.description}
                </p>

                {/* Key Walking and Route Details */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#171a2e] border border-[#292c4a] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated Walking Time:</span>
                    <span className="font-semibold text-emerald-400 font-mono">
                      {selectedPlaceInfo.walkTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">GPS Reference:</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {selectedPlaceInfo.coordinatesText}
                    </span>
                  </div>
                </div>

                {/* Facilities inside building */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Facilities Located Here:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlaceInfo.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="text-[11px] bg-purple-950/60 text-purple-300 border border-purple-700/40 px-2.5 py-1 rounded-lg"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Indoor Navigation Tip */}
                <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                  <div className="font-bold flex items-center gap-1.5 mb-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Indoor Navigation Tip</span>
                  </div>
                  <p className="text-[11px] text-purple-200/90">{selectedPlaceInfo.tips}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#21233d] flex items-center justify-between">
                <a
                  href="https://www.cgcuniversity.in/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Official CGC Address & Contact ↗
                </a>
                <button
                  onClick={() => {
                    setRoomQuery('C-204');
                    handleResolvePlace('block 2');
                  }}
                  className="text-xs bg-[#1f223a] hover:bg-[#282b4a] text-slate-200 px-3 py-1.5 rounded-lg font-medium border border-[#393b61]"
                >
                  Find Lab C-204
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* TAB 5: CAMPUS EVENTS & TECHFEST */}
      {/* ========================================================================================= */}
      {activeTab === 'events' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                Campus events & TechFest 2026
              </h2>
              <p className="text-xs text-slate-400">
                Hackathons, student club meetups, startup showcases, and cultural celebrations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['All', 'Tech', 'Clubs', 'Innovation', 'Cultural'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEventCategoryFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    eventCategoryFilter === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-[#15192c] hover:bg-[#1d223c] text-slate-300 border border-[#2b2d4b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#111424] border border-[#262744] hover:border-purple-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex flex-col items-center justify-center text-purple-200 font-bold flex-shrink-0">
                        <span className="text-base leading-none">{ev.dayBadge}</span>
                        <span className="text-[9px] uppercase tracking-wider text-purple-300">
                          {ev.monthBadge}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                          {ev.category} Event
                        </span>
                        <h3 className="font-heading font-bold text-white text-base leading-snug">
                          {ev.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {ev.description}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{ev.dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#21233d] flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-medium">
                    👥 {ev.attendeesCount} Registered
                  </span>
                  <button
                    onClick={() => handleToggleEvent(ev.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
                      ev.isSaved
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30'
                    }`}
                  >
                    {ev.isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pass Confirmed</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save & RSVP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* TAB 6: LOST & FOUND BOARD */}
      {/* ========================================================================================= */}
      {activeTab === 'lost-found' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                  Lost & Found ✦
                </h2>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-bold">
                  CAMPUS RECOVERY NETWORK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Campus finds, reunited. Post a lost item or help fellow CGC students retrieve theirs.
              </p>
            </div>

            <button
              onClick={() => setShowAddLfModal(true)}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Post Lost or Found Item</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'Everything' },
              { id: 'Lost', label: 'Lost Items' },
              { id: 'Found', label: 'Found Items' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setLfFilter(f.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                  lfFilter === f.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#15192c] hover:bg-[#1d223c] text-slate-300 border border-[#2b2d4b]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Lost & Found Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLostFound.map((item) => (
              <div
                key={item.id}
                className={`bg-[#111424] border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all ${
                  item.status === 'Reunited'
                    ? 'border-emerald-500/30 opacity-75'
                    : item.kind === 'Lost'
                    ? 'border-pink-500/40 hover:border-pink-400'
                    : 'border-cyan-500/40 hover:border-cyan-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        item.kind === 'Lost'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {item.kind.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>

                  <h3 className="font-heading font-bold text-white text-sm leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-2 text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{item.place}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 truncate">{item.cat}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#161a2e]/60 p-2.5 rounded-xl border border-[#242742]">
                    {item.details}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#21233d] flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    Contact: {item.contact}
                  </span>

                  {item.status === 'Reunited' ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Reunited</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolveLostFound(item.id)}
                      className="text-[10px] bg-[#1a2033] hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-[#2b3350] hover:border-emerald-500/40 px-2 py-1 rounded-lg font-medium transition-colors"
                    >
                      Mark Reunited
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Post Lost or Found */}
          {showAddLfModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#121629] border border-[#34355a] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-white">Post to Board</h3>
                  <button
                    onClick={() => setShowAddLfModal(false)}
                    className="text-slate-400 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddLostFound} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Report Type
                      </label>
                      <select
                        value={newLfItem.kind}
                        onChange={(e) =>
                          setNewLfItem({ ...newLfItem, kind: e.target.value as any })
                        }
                        className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Lost">Lost Item</option>
                        <option value="Found">Found Item</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={newLfItem.cat}
                        onChange={(e) =>
                          setNewLfItem({ ...newLfItem, cat: e.target.value as any })
                        }
                        className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Personal items">Personal items</option>
                        <option value="Books & stationery">Books & stationery</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Blue water bottle, Casio calculator"
                      value={newLfItem.title}
                      onChange={(e) => setNewLfItem({ ...newLfItem, title: e.target.value })}
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Campus Location / Where?
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Library 2nd floor, Academic Block 2"
                      value={newLfItem.place}
                      onChange={(e) => setNewLfItem({ ...newLfItem, place: e.target.value })}
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Details / Identifying Features
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Color, brand, stickers, keyrings, specific condition..."
                      value={newLfItem.details}
                      onChange={(e) => setNewLfItem({ ...newLfItem, details: e.target.value })}
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Drop-off / Contact Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Left with Block 1 Security Guard"
                      value={newLfItem.contact}
                      onChange={(e) => setNewLfItem({ ...newLfItem, contact: e.target.value })}
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal">
                    Privacy reminder: Do not post phone numbers, student login passwords, or private room keys.
                  </p>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddLfModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30"
                    >
                      Publish Item to Board
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================================= */}
      {/* TAB 7: STUDENT PROFILE & DIGITAL ID PASS */}
      {/* ========================================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                Student Profile & Digital ID Pass
              </h2>
              <p className="text-xs text-slate-400">
                Personalize your student identity. Changes instantly reflect across your timetable, notices, and smart greeting.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Realistic Smart Campus Digital ID Pass Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-3xl p-5 bg-gradient-to-b from-[#21163a] via-[#161226] to-[#0c0a17] border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
                {/* Holographic shimmer effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top: University Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/30 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      CGC
                    </div>
                    <div>
                      <div className="font-heading font-black text-xs text-white tracking-tight leading-none">
                        CGC UNIVERSITY
                      </div>
                      <div className="text-[9px] text-purple-300 font-medium">Jhanjeri, Mohali</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    DIGITAL VERIFIED
                  </span>
                </div>

                {/* Student Photo & Vital Details */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-lg flex-shrink-0">
                    <div className="w-full h-full bg-[#110e1f] rounded-[14px] flex items-center justify-center text-white font-black text-2xl font-heading">
                      {profile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-white">{profile.name}</h3>
                    <p className="text-xs text-purple-300 font-semibold">{profile.course}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{profile.semester}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                      ID: {profile.rollNo}
                    </span>
                  </div>
                </div>

                {/* Additional ID Fields */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#110f21] p-3 rounded-xl border border-purple-500/20 mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email</span>
                    <span className="text-slate-200 font-mono text-[10px] truncate block">
                      {profile.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Group</span>
                    <span className="text-pink-300 font-bold">{profile.bloodGroup}</span>
                  </div>
                </div>

                {/* QR Barcode Simulator */}
                <div className="bg-white p-2.5 rounded-xl flex flex-col items-center justify-center">
                  <div className="flex items-center justify-between w-full px-2 text-[9px] text-slate-800 font-mono font-bold mb-1">
                    <span>NFC SMART CAMPUS ACCESS</span>
                    <span>PASS: VALID 2026</span>
                  </div>
                  {/* High visual simulated barcode */}
                  <div className="w-full h-8 flex items-center justify-center gap-[2px]">
                    {[4, 2, 6, 3, 1, 5, 2, 4, 3, 6, 2, 1, 4, 3, 5, 2, 4, 1, 3, 6, 2, 4, 3].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: `${(i % 3) + 2}px`,
                            height: `${18 + (h % 3) * 4}px`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted local biometric student pass</span>
              </div>
            </div>

            {/* Profile Editing Form */}
            <div className="lg:col-span-7 bg-[#111424] border border-[#262744] rounded-2xl p-5 shadow-xl">
              <h3 className="font-heading font-bold text-base text-white mb-1">Edit Student Details</h3>
              <p className="text-xs text-slate-400 mb-4">
                Update your student name, enrolled course, or semester. Data persists in this browser.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.name}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, name: e.target.value })
                    }
                    className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Degree / Course
                    </label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.course}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, course: e.target.value })
                      }
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Semester
                    </label>
                    <select
                      value={editProfileForm.semester}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, semester: e.target.value })
                      }
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                      <option value="Semester 7">Semester 7</option>
                      <option value="Semester 8">Semester 8</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Roll / Registration No
                    </label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.rollNo}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, rollNo: e.target.value })
                      }
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={editProfileForm.bloodGroup}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, bloodGroup: e.target.value })
                      }
                      className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Student University Email
                  </label>
                  <input
                    type="email"
                    value={editProfileForm.email}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, email: e.target.value })
                    }
                    className="w-full bg-[#0b0e1b] border border-[#2b2d4b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfileForm(DEFAULT_PROFILE);
                      setProfile(DEFAULT_PROFILE);
                      localStorage.setItem('smart-campus-cgc-profile', JSON.stringify(DEFAULT_PROFILE));
                      setProfileToast('Reset profile to default (Aanya Sharma)!');
                      setTimeout(() => setProfileToast(null), 3000);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300 underline"
                  >
                    Reset to Default
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30"
                  >
                    Save & Update Pass
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
