import React from 'react';

/**
 * Embeds a YouTube live stream or VOD using the official iframe player.
 * `videoId` must be the 11-character ID (server-normalized).
 */
export default function YoutubeLiveEmbed({ videoId, title = 'Live stream' }) {
    if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
        return null;
    }

    const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;

    return (
        <div className="xb-youtube-embed rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-sm">
            <div className="ratio ratio-16x9" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                    title={title}
                    src={src}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                    }}
                />
            </div>
        </div>
    );
}
