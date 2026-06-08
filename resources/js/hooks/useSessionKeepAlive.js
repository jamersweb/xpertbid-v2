import { useEffect } from 'react';
import axios from 'axios';

export default function useSessionKeepAlive(enabled = false, intervalMs = 10 * 60 * 1000) {
       useEffect(() => {
              if (!enabled || typeof window === 'undefined') {
                     return;
              }

              let disposed = false;

              const ping = () => {
                     if (disposed) return;

                     axios.get(route('session.keepalive')).catch(() => {
                            // Ignore keepalive failures; the next user action will handle expiry.
                     });
              };

              const handleVisibilityChange = () => {
                     if (document.visibilityState === 'visible') {
                            ping();
                     }
              };

              ping();
              const timer = window.setInterval(ping, intervalMs);

              document.addEventListener('visibilitychange', handleVisibilityChange);
              window.addEventListener('focus', ping);

              return () => {
                     disposed = true;
                     window.clearInterval(timer);
                     document.removeEventListener('visibilitychange', handleVisibilityChange);
                     window.removeEventListener('focus', ping);
              };
       }, [enabled, intervalMs]);
}
