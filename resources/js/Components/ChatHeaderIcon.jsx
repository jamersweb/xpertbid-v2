import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import useTranslate from '@/hooks/useTranslate';
import useUnreadChatPeople from '@/hooks/useUnreadChatPeople';

export default function ChatHeaderIcon() {
       const { t } = useTranslate();
       const unreadPeople = useUnreadChatPeople();

       return (
              <Link
                     href={route('chat.index')}
                     className="header-chat-icon-btn"
                     aria-label={t('Messages')}
                     title={t('Messages')}
              >
                     <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#23262F"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                     >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                     </svg>
                     {unreadPeople > 0 && (
                            <span className="header-chat-badge">
                                   {unreadPeople > 99 ? '99+' : unreadPeople}
                            </span>
                     )}
              </Link>
       );
}
