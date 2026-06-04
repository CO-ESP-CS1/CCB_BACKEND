export const ADMIN_NOTIFICATIONS_MAX = 30;

export type AdminNotificationDto = {
  id: string;
  title: string;
  body: string;
  /** ISO 8601 — date/heure d'envoi programmé */
  scheduledAt: string;
  /** Route expo-router optionnelle (ex. /live, /annonce) */
  linkRoute?: string;
  active?: boolean;
  order?: number;
};

export type AdminNotificationsFileDto = {
  updatedAt?: string;
  notifications: AdminNotificationDto[];
};

export type AdminNotificationsResponseDto = {
  updatedAt: string | null;
  notifications: AdminNotificationDto[];
};
