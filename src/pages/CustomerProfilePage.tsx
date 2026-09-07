import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ProfilePhotoUploader } from '../components/common/ProfilePhotoUploader';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Save, 
  LogOut, 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight,
  Sparkles,
  HeartHandshake,
  UserCheck,
  Edit3,
  Camera,
  X
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateUserProfile, logout, switchRole } = useAuth();
  const { currentLocation, city, openLocationPicker, addToast, bookings, lang, setLang, t } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || currentLocation || '',
    city: user?.city || city || 'Chennai'
  });

  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true,
    inApp: true
  });

  // Calculate statistics from customer's bookings
  const completedBookings = bookings.filter(b => b.status === 'service_completed');
  const activeBookings = bookings.filter(b => !['service_completed', 'cancelled', 'rejected'].includes(b.status));
  const totalSpent = completedBookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
  const totalWelfareFund = completedBookings.reduce((sum, b) => sum + (b.pricing?.cooperativeWelfareFund || 0), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast({
        type: 'warning',
        title: t("common.warning") || 'Validation Error',
        message: 'Name and Phone Number cannot be empty.'
      });
      return;
    }

    if (user) {
      updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim()
      });
      addToast({
        type: 'success',
        title: t("common.success") || 'Profile Updated',
        message: 'Your customer profile details have been saved successfully.'
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner & Profile Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white flex flex-col items-center justify-center border-4 border-white/20 shadow-lg relative group select-none">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-0.5 backdrop-blur-xs">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-blue-100 uppercase">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'CU'}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPhotoUploader(!showPhotoUploader)}
                className="absolute -top-1 -right-1 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full border-2 border-slate-900 shadow transition cursor-pointer"
                title={t("profile.updateCustomerPhoto") || "Change or take profile picture"}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900" title={t("profile.verifiedMember") || "Verified Customer"}>
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                  {user?.name || t("profile.valuedCustomer") || 'Valued Customer'}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  {t("profile.verifiedMember") || "Verified Household Member"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1 flex items-center gap-2">
                <span>{user?.email || 'customer@partnerplus.org'}</span>
                <span>•</span>
                <span>{user?.phone || '+91 98400 00000'}</span>
              </p>
              <div className="text-[11px] text-blue-300/80 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t("profile.memberSince") || "Member since"}: {user?.joinedDate || '2025'}</span>
                <span className="mx-1">•</span>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("profile.primaryCity") || "Primary City"}: <strong className="text-white">{city || 'Chennai'}</strong></span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-xs border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? (t("profile.cancelEdit") || 'Cancel Edit') : (t("profile.editProfile") || 'Edit Profile')}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-bold text-xs backdrop-blur-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              title={t("profile.logout") || "Logout"}
            >
              <LogOut className="w-4 h-4" />
              <span>{t("profile.logout") || "Logout"}</span>
            </button>
          </div>
        </div>
      </div>

      {showPhotoUploader && (
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-3xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("profile.updateCustomerPhoto") || "Update Customer Profile Picture"}</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPhotoUploader(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ProfilePhotoUploader
            currentPhotoUrl={user?.avatar}
            onPhotoSelected={(newUrl) => {
              updateUserProfile({ avatar: newUrl });
              addToast({
                type: 'success',
                title: t("common.success") || 'Profile Picture Updated!',
                message: 'Your new profile photo is saved and updated across PartnerPlus.'
              });
              setShowPhotoUploader(false);
            }}
            label="Take Live Camera Selfie or Choose File"
            required={false}
          />
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{t("profile.totalBookings") || "Total Bookings"}</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">{completedBookings.length} {t("profile.completed") || "completed"}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t("profile.activeServiceRequests") || "Active Service Requests"}</span>
          </div>
          <div className="text-2xl font-black text-amber-600">{activeBookings.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">{t("profile.inDispatchExecution") || "In dispatch & execution"}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>{t("profile.totalExpenditure") || "Total Expenditure"}</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">₹{totalSpent.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium">{t("profile.zeroCommissionMarkup") || "0% corporate commission markup"}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
          <div className="text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>{t("profile.artisanWelfareImpact") || "Artisan Welfare Impact"}</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{totalWelfareFund.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-800 font-medium">{t("profile.allocatedToPension") || "5% directly allocated to member pension"}</div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Editable Personal Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 font-display">{t("profile.personalDetails") || "Personal & Contact Details"}</h2>
                <p className="text-xs text-slate-500">{t("profile.manageProfileInfo") || "Manage your profile information and default service address"}</p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t("common.edit") || "Edit"}</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("profile.fullName") || "Full Name"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-hidden disabled:opacity-75 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("profile.phoneNumber") || "Phone Number"}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-hidden disabled:opacity-75 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("profile.emailAddress") || "Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-hidden disabled:opacity-75 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t("profile.cityMetroRegion") || "City / Metro Region"}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-hidden disabled:opacity-75 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t("profile.defaultAddress") || "Default Delivery / Service Address"}
                </label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-hidden disabled:opacity-75 disabled:cursor-not-allowed transition resize-none"
                  placeholder="Street, Landmark, Apartment / House No."
                />
              </div>

              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {t("common.cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t("profile.saveChanges") || "Save Changes"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Location & Service Area Settings */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">{t("profile.activeServiceLocation") || "Active Service Location"}</h3>
                <p className="text-xs text-slate-500">{t("profile.selectedLocationSub") || "Selected location used for artisan matching and distance calculations"}</p>
              </div>
              <button
                type="button"
                onClick={openLocationPicker}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t("profile.changeLocation") || "Change Location"}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentLocation}</div>
                  <div className="text-[11px] text-slate-500">Active Service Area • City: {city}</div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
                {t("profile.activeZone") || "Active Zone"}
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Preferences & Portal Switcher */}
        <div className="space-y-6">
          {/* Language & Notifications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{t("profile.languagePreference") || "Language Preference"}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                  lang === 'en'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                  lang === 'ta'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🇮🇳 தமிழ் (Tamil)
              </button>
            </div>

            <hr className="border-slate-100 my-4" />

            <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>{t("profile.notifications") || "Notifications"}</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                <span>{t("profile.smsDispatchUpdates") || "SMS Dispatch Updates"}</span>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                <span>{t("profile.whatsAppJobStatus") || "WhatsApp Job Status"}</span>
                <input
                  type="checkbox"
                  checked={notifications.whatsapp}
                  onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                <span>{t("profile.inAppAlerts") || "In-App Real-time Chat Alerts"}</span>
                <input
                  type="checkbox"
                  checked={notifications.inApp}
                  onChange={(e) => setNotifications({ ...notifications, inApp: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md">
                {t("profile.roleSwitcher") || "Role Switcher"}
              </span>
              <h3 className="text-base font-black text-white mt-2 font-display">{t("profile.switchPlatformPortal") || "Switch Platform Portal"}</h3>
              <p className="text-xs text-slate-300 mt-1">
                {t("profile.exploreAsArtisan") || "Explore the platform as an artisan, cooperative admin, or facility manager."}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => switchRole('worker')}
                className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-between cursor-pointer border border-white/10"
              >
                <span>{t("profile.workerPortal") || "Worker / Artisan Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => switchRole('cooperative_admin')}
                className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-between cursor-pointer border border-white/10"
              >
                <span>{t("profile.cooperativeAdminPortal") || "Cooperative Admin Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => switchRole('organization_admin')}
                className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-between cursor-pointer border border-white/10"
              >
                <span>{t("profile.organizationPortal") || "Organization / Bulk Hiring Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
