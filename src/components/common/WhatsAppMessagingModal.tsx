import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  History,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { whatsappService, WhatsAppMessageRecord, WhatsAppTemplateType } from '../../services/whatsappService';
import { useApp } from '../../context/AppContext';

interface WhatsAppMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientPhone?: string;
  recipientName?: string;
  bookingCode?: string;
  serviceName?: string;
  defaultMessage?: string;
}

export const WhatsAppMessagingModal: React.FC<WhatsAppMessagingModalProps> = ({
  isOpen,
  onClose,
  recipientPhone: initialPhone = '',
  recipientName: initialName = '',
  bookingCode = '',
  serviceName = '',
  defaultMessage = ''
}) => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'send' | 'logs'>('send');
  const [phone, setPhone] = useState<string>(initialPhone || '9876543210');
  const [recipientName, setRecipientName] = useState<string>(initialName || 'Valued User');
  const [customText, setCustomText] = useState<string>(
    defaultMessage || (bookingCode ? `Hello ${initialName || 'User'}, regarding PartnerPlus Booking #${bookingCode} (${serviceName || 'Service'}). Let's connect!` : '')
  );
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateType | 'CUSTOM'>('CUSTOM');
  const [logs, setLogs] = useState<WhatsAppMessageRecord[]>(() => whatsappService.getMessageLogs());

  if (!isOpen) return null;

  const handleLaunchWhatsAppWeb = () => {
    if (!phone) {
      addToast({ type: 'error', title: 'Phone Required', message: 'Please enter a valid phone number.' });
      return;
    }

    whatsappService.openWhatsAppChat(phone, customText, recipientName);
    setLogs(whatsappService.getMessageLogs());
    addToast({
      type: 'success',
      title: 'WhatsApp Chat Launched',
      message: `Opening direct WhatsApp conversation for ${recipientName} (${phone}).`
    });
  };

  const handleSendCloudApiNotification = async () => {
    if (!phone) {
      addToast({ type: 'error', title: 'Phone Required', message: 'Please enter a valid phone number.' });
      return;
    }

    try {
      if (selectedTemplate !== 'CUSTOM') {
        await whatsappService.sendTemplateNotification({
          template: selectedTemplate,
          recipientPhone: phone,
          recipientName,
          parameters: {
            bookingCode: bookingCode || 'BK-100',
            serviceName: serviceName || 'Cooperative Service',
            customerName: recipientName,
            workerName: 'Certified Artisan',
            totalAmount: 499
          }
        });
      } else {
        await whatsappService.sendDirectMessage(phone, customText, recipientName);
      }

      setLogs(whatsappService.getMessageLogs());
      addToast({
        type: 'success',
        title: 'WhatsApp Alert Dispatched',
        message: `Notification recorded and sent to ${recipientName} (${phone}).`
      });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Dispatch Error', message: 'Failed to dispatch WhatsApp alert.' });
    }
  };

  const handleTemplateSelect = (templateKey: WhatsAppTemplateType) => {
    setSelectedTemplate(templateKey);
    const rendered = whatsappService.sendTemplateNotification; // Triggers template preview
    switch (templateKey) {
      case 'BOOKING_CONFIRMED':
        setCustomText(`🤝 Hello ${recipientName}! Your service booking #${bookingCode || 'BK-100'} for ${serviceName || 'Service'} has been confirmed. Matching certified cooperative technicians...`);
        break;
      case 'WORKER_ASSIGNED':
        setCustomText(`🎉 Great news ${recipientName}! A certified worker has been assigned to your request #${bookingCode || 'BK-100'}.`);
        break;
      case 'WORKER_ON_THE_WAY':
        setCustomText(`🚨 ${recipientName}, your technician is on the way! Estimated ETA: 15 mins. Reference #${bookingCode || 'BK-100'}.`);
        break;
      case 'JOB_COMPLETED':
        setCustomText(`✅ ${recipientName}, your service #${bookingCode || 'BK-100'} is completed successfully! Thank you for choosing PartnerPlus.`);
        break;
      case 'INVOICE_CREATED':
        setCustomText(`📄 Hello ${recipientName}, your official PartnerPlus invoice for booking #${bookingCode || 'BK-100'} is ready.`);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between border-b border-[#128C7E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white leading-tight">
                  WhatsApp Messaging Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#25D366] text-slate-950">
                  Instant Link
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium mt-0.5">
                Send direct WhatsApp messages & multi-channel alerts to any user
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-xl hover:bg-[#128C7E] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-100 px-5 pt-3 border-b border-slate-200 flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('send')}
            className={`pb-2.5 px-4 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'send'
                ? 'border-[#128C7E] text-[#075E54] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLogs(whatsappService.getMessageLogs());
              setActiveTab('logs');
            }}
            className={`pb-2.5 px-4 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'border-[#128C7E] text-[#075E54] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>WhatsApp Logs ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'send' ? (
            <>
              {/* Recipient inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="User Name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#128C7E] outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                    Phone Number (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#128C7E] outline-hidden font-mono font-medium"
                  />
                </div>
              </div>

              {/* Template Quick Selector Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Quick Message Templates
                </span>
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect('BOOKING_CONFIRMED')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold text-[11px] transition cursor-pointer"
                  >
                    🤝 Booking Confirmed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect('WORKER_ASSIGNED')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 font-semibold text-[11px] transition cursor-pointer"
                  >
                    👤 Worker Assigned
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect('WORKER_ON_THE_WAY')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 font-semibold text-[11px] transition cursor-pointer"
                  >
                    🚗 Worker On The Way
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect('JOB_COMPLETED')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 font-semibold text-[11px] transition cursor-pointer"
                  >
                    ✅ Job Completed
                  </button>
                </div>
              </div>

              {/* Custom Message Box */}
              <div>
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setSelectedTemplate('CUSTOM');
                  }}
                  placeholder="Type your WhatsApp message..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#128C7E] outline-hidden text-xs text-slate-800 leading-relaxed font-sans"
                />
              </div>

              {/* Info Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-snug flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">WhatsApp Cloud API & Direct Link Enabled</span>
                  <span>Clicking <b>"Launch WhatsApp Chat"</b> opens the native WhatsApp app / Web chat directly with your pre-filled message.</span>
                </div>
              </div>
            </>
          ) : (
            /* Logs Tab */
            <div className="space-y-3">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{log.recipientName} ({log.recipientPhone})</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] leading-relaxed font-sans">
                      {log.messageBody}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        {log.templateName}
                      </span>
                      <span className="font-semibold text-slate-600">
                        Status: {log.status} ({log.mode})
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No WhatsApp logs recorded yet. Send a message to see live logs!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === 'send' && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleSendCloudApiNotification}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4 text-[#128C7E]" />
              <span>Record System Notification</span>
            </button>

            <button
              type="button"
              onClick={handleLaunchWhatsAppWeb}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch WhatsApp Chat →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
