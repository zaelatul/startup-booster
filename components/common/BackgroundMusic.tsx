'use client';

import { useState, useRef } from 'react';
import { MusicalNoteIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log("재생 실패(브라우저 정책):", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex items-center group">
      {/* 실제 오디오 태그 */}
      <audio ref={audioRef} src="/bgm.mp3" loop />

      {/* 🎵 음악 버튼 */}
      <button
        onClick={toggleMusic}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10
          ${isPlaying ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200' : 'bg-white text-slate-400 hover:scale-105 border border-slate-200'}
        `}
      >
        {isPlaying ? (
          <MusicalNoteIcon className="w-6 h-6 animate-spin-slow" />
        ) : (
          <SpeakerXMarkIcon className="w-6 h-6" />
        )}
        
        {/* 재생 중일 때 파동 효과 */}
        {isPlaying && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
        )}
      </button>

      {/* 👇 [신규 추가] 유도 멘트 & 손가락 아이콘 (재생 안 할 때만 보임) */}
      {!isPlaying && (
        <div className="absolute left-14 flex items-center gap-2 w-max animate-fade-in cursor-pointer" onClick={toggleMusic}>
          
          {/* 1. 손가락 아이콘 (버튼을 콕콕 찌르는 애니메이션) */}
          <span className="text-2xl animate-poke filter drop-shadow-sm">👈</span>
          
          {/* 2. 텍스트 말풍선 */}
          <span className="bg-white/95 text-indigo-600 px-3 py-1.5 rounded-full shadow-md text-xs font-bold border border-indigo-100 flex items-center gap-1 hover:bg-indigo-50 transition-colors">
            기분 좋아지기 ✨
          </span>
        </div>
      )}

      {/* 스타일 정의 */}
      <style jsx>{`
        /* LP판처럼 천천히 도는 효과 */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        /* 👈 손가락이 버튼을 콕콕 찌르는 효과 (까딱까딱) */
        @keyframes poke {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); } /* 왼쪽으로 5px 찌름 */
        }
        .animate-poke {
          animation: poke 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}