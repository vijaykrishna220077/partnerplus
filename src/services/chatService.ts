import { ChatMessage } from '../types';
import { realtimeHub } from './db';

const CHAT_STORAGE_KEY = 'sahakari_live_chat_messages_v2';
const CHAT_CHANNEL_NAME = 'sahakari_live_chat_broadcast';

// Create BroadcastChannel for instant cross-tab synchronization
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHAT_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not available:', e);
  }
}

// Initial seed messages for realism
const INITIAL_SEED_MESSAGES: Record<string, ChatMessage[]> = {
  'bk-101': [
    {
      id: 'msg-seed-1',
      bookingId: 'bk-101',
      senderId: 'wrk-1',
      senderName: 'Murugan K.',
      senderRole: 'worker',
      text: 'Vanakkam! I have accepted your electrical service request. Carrying insulation tools and digital multimeter.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      read: true,
      quickReplyType: 'eta'
    },
    {
      id: 'msg-seed-2',
      bookingId: 'bk-101',
      senderId: 'cust-1',
      senderName: 'Rajesh Sharma',
      senderRole: 'customer',
      text: 'Thanks Murugan! The issue is with the main distribution box sparking during heavy load. Building is Green Heights, Flat 302 on 3rd floor.',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      read: true,
      quickReplyType: 'direction'
    },
    {
      id: 'msg-seed-3',
      bookingId: 'bk-101',
      senderId: 'wrk-1',
      senderName: 'Murugan K.',
      senderRole: 'worker',
      text: 'Understood sir. I have left the cooperative hub and will arrive in approximately 10 minutes.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: true,
      quickReplyType: 'eta'
    }
  ],
  'bk-102': [
    {
      id: 'msg-seed-4',
      bookingId: 'bk-102',
      senderId: 'wrk-2',
      senderName: 'Anitha S.',
      senderRole: 'worker',
      text: 'Hello! I am on the way for your plumbing line overhaul. Please confirm if the main water valve is accessible.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: true,
      quickReplyType: 'materials'
    },
    {
      id: 'msg-seed-5',
      bookingId: 'bk-102',
      senderId: 'cust-1',
      senderName: 'Rajesh Sharma',
      senderRole: 'customer',
      text: 'Yes Anitha, the overhead valve key is kept at the terrace entrance. Take your time.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: true,
      quickReplyType: 'general'
    }
  ]
};

import { logger } from '../utils/logger';

function getAllMessages(): Record<string, ChatMessage[]> {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_SEED_MESSAGES));
      return INITIAL_SEED_MESSAGES;
    }
    return JSON.parse(raw);
  } catch (err) {
    logger.warn('[ChatService] Error reading messages storage:', err);
    return INITIAL_SEED_MESSAGES;
  }
}

function saveAllMessages(data: Record<string, ChatMessage[]>): void {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to persist chat messages:', err);
  }
}

export const chatService = {
  // Retrieve all messages for a specific booking, with dynamic worker and customer name formatting
  getMessages(bookingId: string, workerName?: string, customerName?: string): ChatMessage[] {
    const all = getAllMessages();
    let list = all[bookingId];

    // If no messages exist yet for this booking, generate realistic initial conversation
    if (!list || list.length === 0) {
      const activeWorkerName = workerName || 'Assigned Artisan';
      const activeCustomerName = customerName || 'Customer';

      const dynamicInitial: ChatMessage[] = [
        {
          id: `msg-seed-1-${bookingId}`,
          bookingId,
          senderId: 'wrk-active',
          senderName: activeWorkerName,
          senderRole: 'worker',
          text: `Vanakkam! I am ${activeWorkerName}. I have accepted your service request. Carrying insulation tools and digital equipment.`,
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          read: true,
          quickReplyType: 'eta'
        },
        {
          id: `msg-seed-2-${bookingId}`,
          bookingId,
          senderId: 'cust-active',
          senderName: activeCustomerName,
          senderRole: 'customer',
          text: `Thanks ${activeWorkerName.split(' ')[0]}! Looking forward to your arrival. Please let me know when you reach near the main entrance.`,
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          read: true,
          quickReplyType: 'direction'
        },
        {
          id: `msg-seed-3-${bookingId}`,
          bookingId,
          senderId: 'wrk-active',
          senderName: activeWorkerName,
          senderRole: 'worker',
          text: `Understood! I am on the way and will arrive in approximately 10 minutes.`,
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          read: true,
          quickReplyType: 'eta'
        }
      ];

      all[bookingId] = dynamicInitial;
      saveAllMessages(all);
      list = dynamicInitial;
    }

    // Format sender names dynamically if custom names are passed
    if (workerName || customerName) {
      return list.map(msg => {
        if (msg.senderRole === 'worker' && workerName) {
          return { ...msg, senderName: workerName };
        }
        if (msg.senderRole === 'customer' && customerName) {
          return { ...msg, senderName: customerName };
        }
        return msg;
      });
    }

    return list;
  },

  // Send a new message
  sendMessage(params: {
    bookingId: string;
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'worker' | 'cooperative';
    text: string;
    quickReplyType?: 'eta' | 'arrival' | 'direction' | 'materials' | 'general';
    isVoiceNote?: boolean;
    locationShare?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  }): ChatMessage {
    const all = getAllMessages();
    const bookingList = all[params.bookingId] || [];

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingId: params.bookingId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      text: params.text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      quickReplyType: params.quickReplyType,
      isVoiceNote: params.isVoiceNote,
      locationShare: params.locationShare
    };

    all[params.bookingId] = [...bookingList, newMessage];
    saveAllMessages(all);

    // 1. Emit via local in-memory event bus
    realtimeHub.emit(`chat:${params.bookingId}`, all[params.bookingId]);
    realtimeHub.emit('chat:global', newMessage);

    // 2. Broadcast across tabs via BroadcastChannel
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'NEW_MESSAGE',
          bookingId: params.bookingId,
          message: newMessage
        });
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }

    return newMessage;
  },

  // Mark all unread messages in a booking as read by the current recipient
  markAllAsRead(bookingId: string, currentRole: 'customer' | 'worker'): void {
    const all = getAllMessages();
    const list = all[bookingId];
    if (!list || list.length === 0) return;

    let changed = false;
    const updated = list.map(m => {
      // If message was sent by the other party and is unread, mark read
      if (m.senderRole !== currentRole && !m.read) {
        changed = true;
        return { ...m, read: true };
      }
      return m;
    });

    if (changed) {
      all[bookingId] = updated;
      saveAllMessages(all);
      realtimeHub.emit(`chat:${bookingId}`, updated);
      realtimeHub.emit('chat:global_read', { bookingId, currentRole });

      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({
            type: 'MESSAGES_READ',
            bookingId,
            currentRole
          });
        } catch {
          // ignore
        }
      }
    }
  },

  // Count unread messages for a specific booking from the perspective of current role
  getUnreadCount(bookingId: string, currentRole: 'customer' | 'worker'): number {
    const messages = this.getMessages(bookingId);
    return messages.filter(m => m.senderRole !== currentRole && !m.read).length;
  },

  // Count total unread messages across all bookings for the role
  getTotalUnreadCount(currentRole: 'customer' | 'worker'): number {
    const all = getAllMessages();
    let count = 0;
    Object.values(all).forEach(list => {
      count += list.filter(m => m.senderRole !== currentRole && !m.read).length;
    });
    return count;
  },

  // Subscribe to real-time updates for a booking
  subscribe(bookingId: string, callback: (messages: ChatMessage[]) => void): () => void {
    // 1. In-memory listener
    const unsubscribeHub = realtimeHub.subscribe(`chat:${bookingId}`, (data) => {
      callback(data || []);
    });

    // 2. BroadcastChannel cross-tab listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data && event.data.bookingId === bookingId) {
        callback(this.getMessages(bookingId));
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }

    // 3. Storage event fallback for older or sandboxed contexts
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CHAT_STORAGE_KEY) {
        callback(this.getMessages(bookingId));
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribeHub();
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorage);
    };
  }
};
