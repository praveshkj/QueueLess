/**
 * Formatting utilities for dates, times, and waiting times.
 */

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

export const formatWaitTime = (minutes) => {
  if (minutes === undefined || minutes === null) return '-';
  if (minutes <= 0) return 'Immediate / Next in line';
  if (minutes < 60) return `~${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `~${hours}h ${remainingMins}m`;
};
