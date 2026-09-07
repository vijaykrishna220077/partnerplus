import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, UserRole, Worker, ServiceItem, Booking, DemandForecastItem, ServiceCategory } from '../types';
import { translations, getTranslatedText, formatDate, formatNumber, formatCurrency } from '../i18n/translations';
import { mockServices, mockWorkers, mockBookings, mockDemandForecast } from '../data/mockData';
import { apiService, initDatabase } from '../services/apiService';
import { soundAndSpeech } from '../utils/soundAndSpeech';
import confetti from 'canvas-confetti';

export type TranslateFunction = {
  (pathOrKey: string, params?: Record<string, any>): string;
} & typeof translations['en'];

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'emergency';
  title: string;
  message: string;
}

interface AppContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: TranslateFunction;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  city: string;
  setCity: (city: string) => void;
  services: ServiceItem[];
  workers: Worker[];
  bookings: Booking[];
  demandForecasts: DemandForecastItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ServiceCategory | 'all';
  setSelectedCategory: (cat: ServiceCategory | 'all') => void;
  refreshData: () => Promise<void>;
  
  // Modals state
  selectedWorkerForProfile: Worker | null;
  openWorkerProfile: (worker: Worker) => void;
  closeWorkerProfile: () => void;

  selectedWorkerForBooking: Worker | null;
  selectedServiceForBooking: ServiceItem | null;
  isBookingOpen: boolean;
  openBooking: (worker?: Worker | null, service?: ServiceItem | null, isEmergency?: boolean) => void;
  closeBooking: () => void;

  activePaymentBooking: Booking | null;
  openPayment: (booking: Booking) => void;
  closePayment: () => void;

  activeTrackerBooking: Booking | null;
  openTracker: (booking: Booking) => void;
  closeTracker: () => void;

  activeInvoiceBooking: Booking | null;
  openInvoice: (booking: Booking) => void;
  closeInvoice: () => void;

  activeReviewBooking: Booking | null;
  openReview: (booking: Booking) => void;
  closeReview: () => void;

  activeQrBooking: Booking | null;
  openCompletionQr: (booking: Booking) => void;
  closeCompletionQr: () => void;

  activeChatBooking: Booking | null;
  activeChatRole: 'customer' | 'worker';
  openChat: (booking: Booking, role?: 'customer' | 'worker') => void;
  closeChat: () => void;

  isEmergencyOpen: boolean;
  openEmergency: () => void;
  closeEmergency: () => void;

  isLocationPickerOpen: boolean;
  openLocationPicker: () => void;
  closeLocationPicker: () => void;

  isWorkerRegisterOpen: boolean;
  openWorkerRegister: () => void;
  closeWorkerRegister: () => void;

  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('sahakari_lang') as LanguageCode;
    return saved || 'en';
  });

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem('sahakari_lang', newLang);
    soundAndSpeech.setLanguage(newLang, true);
  };

  useEffect(() => {
    soundAndSpeech.setLanguage(lang, false);
  }, []);
  const [role, setRole] = useState<UserRole>('customer');
  const [currentLocation, setCurrentLocation] = useState<string>('Anna Nagar, Chennai');
  const [city, setCity] = useState<string>('Chennai');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  const [services, setServices] = useState<ServiceItem[]>(mockServices);
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecastItem[]>(mockDemandForecast);

  // Modals
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<Worker | null>(null);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activePaymentBooking, setActivePaymentBooking] = useState<Booking | null>(null);
  const [activeTrackerBooking, setActiveTrackerBooking] = useState<Booking | null>(null);
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);
  const [activeReviewBooking, setActiveReviewBooking] = useState<Booking | null>(null);
  const [activeQrBooking, setActiveQrBooking] = useState<Booking | null>(null);
  const [activeChatBooking, setActiveChatBooking] = useState<Booking | null>(null);
  const [activeChatRole, setActiveChatRole] = useState<'customer' | 'worker'>('customer');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isWorkerRegisterOpen, setIsWorkerRegisterOpen] = useState(false);
  
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const translateFn = (pathOrKey: string, params?: Record<string, any>) => {
    return getTranslatedText(lang, pathOrKey, params);
  };
  const langDict = translations[lang] || translations.en;
  const t = Object.assign(translateFn, langDict) as TranslateFunction;

  const refreshData = async () => {
    try {
      const [sList, wList, bList] = await Promise.all([
        apiService.getServices(),
        apiService.getWorkers(),
        apiService.getBookings()
      ]);
      setServices(sList);
      setWorkers(wList);
      setBookings(bList);
    } catch (err) {
      console.error('Failed to load initial dataset', err);
    }
  };

  useEffect(() => {
    initDatabase();
    refreshData();
  }, []);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const openWorkerProfile = (worker: Worker) => {
    setSelectedWorkerForProfile(worker);
  };

  const closeWorkerProfile = () => {
    setSelectedWorkerForProfile(null);
  };

  const openBooking = (worker?: Worker | null, service?: ServiceItem | null, isEmergency?: boolean) => {
    setSelectedWorkerForBooking(worker || null);
    setSelectedServiceForBooking(service || null);
    if (isEmergency) {
      setIsEmergencyOpen(true);
    } else {
      setIsBookingOpen(true);
    }
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedWorkerForBooking(null);
    setSelectedServiceForBooking(null);
  };

  const openPayment = (booking: Booking) => {
    setActivePaymentBooking(booking);
  };

  const closePayment = () => {
    setActivePaymentBooking(null);
  };

  const openTracker = (booking: Booking) => {
    setActiveTrackerBooking(booking);
  };

  const closeTracker = () => {
    setActiveTrackerBooking(null);
  };

  const openInvoice = (booking: Booking) => {
    setActiveInvoiceBooking(booking);
  };

  const closeInvoice = () => {
    setActiveInvoiceBooking(null);
  };

  const openReview = (booking: Booking) => {
    setActiveReviewBooking(booking);
  };

  const closeReview = () => {
    setActiveReviewBooking(null);
  };

  const openCompletionQr = (booking: Booking) => {
    setActiveQrBooking(booking);
  };

  const closeCompletionQr = () => {
    setActiveQrBooking(null);
  };

  const openChat = (booking: Booking, role: 'customer' | 'worker' = 'customer') => {
    setActiveChatBooking(booking);
    setActiveChatRole(role);
  };

  const closeChat = () => {
    setActiveChatBooking(null);
  };

  const openEmergency = () => {
    setIsEmergencyOpen(true);
  };

  const closeEmergency = () => {
    setIsEmergencyOpen(false);
  };

  const openLocationPicker = () => {
    setIsLocationPickerOpen(true);
  };

  const closeLocationPicker = () => {
    setIsLocationPickerOpen(false);
  };

  const openWorkerRegister = () => {
    setIsWorkerRegisterOpen(true);
  };

  const closeWorkerRegister = () => {
    setIsWorkerRegisterOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        role,
        setRole,
        currentLocation,
        setCurrentLocation,
        city,
        setCity,
        services,
        workers,
        bookings,
        demandForecasts,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        refreshData,
        selectedWorkerForProfile,
        openWorkerProfile,
        closeWorkerProfile,
        selectedWorkerForBooking,
        selectedServiceForBooking,
        isBookingOpen,
        openBooking,
        closeBooking,
        activePaymentBooking,
        openPayment,
        closePayment,
        activeTrackerBooking,
        openTracker,
        closeTracker,
        activeInvoiceBooking,
        openInvoice,
        closeInvoice,
        activeReviewBooking,
        openReview,
        closeReview,
        activeQrBooking,
        openCompletionQr,
        closeCompletionQr,
        activeChatBooking,
        activeChatRole,
        openChat,
        closeChat,
        isEmergencyOpen,
        openEmergency,
        closeEmergency,
        isLocationPickerOpen,
        openLocationPicker,
        closeLocationPicker,
        isWorkerRegisterOpen,
        openWorkerRegister,
        closeWorkerRegister,
        toasts,
        addToast,
        removeToast,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useLanguage = () => {
  const { lang, setLang, t } = useApp();
  return {
    lang,
    setLang,
    t,
    formatDate: (date: Date | string) => formatDate(date, lang),
    formatNumber,
    formatCurrency,
  };
};
