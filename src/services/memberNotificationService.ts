import type { MemberNotification } from '../types';
import { requireSupabase } from './supabaseClient';

type NotificationRow = {
  id: string;
  member_id: string;
  notification_type: MemberNotification['notificationType'];
  created_at: string;
  read_at: string | null;
};

const mapNotification = (row: NotificationRow): MemberNotification => ({
  id: row.id,
  memberId: row.member_id,
  notificationType: row.notification_type,
  createdAt: row.created_at,
  readAt: row.read_at ?? undefined,
});

export const memberNotificationService = {
  async listRecent(limit = 12): Promise<MemberNotification[]> {
    const { data, error } = await requireSupabase()
      .from('member_notifications')
      .select('id,member_id,notification_type,created_at,read_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Could not load notifications: ${error.message}`);
    return ((data ?? []) as NotificationRow[]).map(mapNotification);
  },

  async unreadCount(): Promise<number> {
    const { count, error } = await requireSupabase()
      .from('member_notifications')
      .select('id', { count: 'exact', head: true })
      .is('read_at', null);
    if (error) throw new Error(`Could not load unread notification count: ${error.message}`);
    return count ?? 0;
  },

  async markRead(notificationId: string): Promise<void> {
    const { error } = await requireSupabase().rpc('mark_member_notification_read', {
      p_notification_id: notificationId,
    });
    if (error) throw new Error(`Could not mark notification as read: ${error.message}`);
  },

  subscribe(userId: string, onChange: () => void): () => void {
    const client = requireSupabase();
    const channel = client
      .channel(`member-notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'member_notifications',
        filter: `recipient_user_id=eq.${userId}`,
      }, onChange)
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Live notifications are unavailable; the inbox will refresh periodically.');
        }
      });
    return () => { void client.removeChannel(channel); };
  },
};
