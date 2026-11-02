import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

/** Count of people (conversations) with unread messages for the logged-in user. */
export default function useUnreadChatPeople() {
       const { auth, chatUnreadPeople = 0, url } = usePage().props;
       const [unreadPeople, setUnreadPeople] = useState(() => Number(chatUnreadPeople || 0));

       useEffect(() => {
              setUnreadPeople(Number(chatUnreadPeople || 0));
       }, [chatUnreadPeople]);

       useEffect(() => {
              if (!auth?.user) {
                     setUnreadPeople(0);
                     return undefined;
              }

              let cancelled = false;
              const fetchUnread = async () => {
                     try {
                            const { data } = await axios.get('/chat/unread-count', {
                                   headers: { Accept: 'application/json' },
                            });
                            if (!cancelled) {
                                   setUnreadPeople(Number(data?.unread_people || 0));
                            }
                     } catch (error) {
                            console.warn('[chat unread]', error?.response?.status || error?.message || error);
                     }
              };

              fetchUnread();
              const interval = window.setInterval(fetchUnread, 15000);
              const onFocus = () => fetchUnread();
              window.addEventListener('focus', onFocus);
              return () => {
                     cancelled = true;
                     window.clearInterval(interval);
                     window.removeEventListener('focus', onFocus);
              };
       }, [auth?.user?.id, url]);

       return unreadPeople;
}
