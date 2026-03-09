import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onPlay?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, onTimeUpdate, onPlay }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const onTimeUpdateRef = useRef(onTimeUpdate);
    onTimeUpdateRef.current = onTimeUpdate;

    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

    useEffect(() => {
        const video = videoRef.current;
        if (!video || isYouTube) return;

        const handleTimeUpdate = () => {
            if (onTimeUpdateRef.current) {
                onTimeUpdateRef.current(video.currentTime, video.duration);
            }
        };

        const handlePlay = () => {
            if (onPlay) onPlay();
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);

        // Reset error on source change
        setErrorMsg(null);

        if (Hls.isSupported()) {
            const hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch((e: Error) => {
                    console.warn('Autoplay prevented:', e);
                });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setErrorMsg(`Playback Error: ${data.type}`);
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('play', handlePlay);
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
        } else {
            setErrorMsg("Your browser does not support HLS playback.");
        }

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
        };
    }, [src]);

    if (isYouTube) {
        return (
            <div className="w-full h-full bg-black">
                <iframe
                    src={src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
            {errorMsg && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    padding: '10px', background: 'rgba(255,0,0,0.7)', color: 'white', zIndex: 10
                }}>
                    {errorMsg}
                </div>
            )}
            <video
                ref={videoRef}
                controls
                playsInline
                poster={poster}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </div>
    );
};

export default VideoPlayer;
