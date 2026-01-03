import React from 'react';
import { DeviceStatus } from '../types';

interface StatusBadgeProps {
  status: DeviceStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case DeviceStatus.ONLINE:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
          ONLINE
        </span>
      );
    case DeviceStatus.OFFLINE:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
          OFFLINE
        </span>
      );
    case DeviceStatus.WARNING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
          ALERTA
        </span>
      );
    case DeviceStatus.MAINTENANCE:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
           <span className="w-2 h-2 mr-1 bg-gray-500 rounded-full"></span>
          MANUT
        </span>
      );
    default:
      return null;
  }
};