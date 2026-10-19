import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  Sparkles,
  Type,
  Grid3X3,
  Image as ImageIcon,
  Check,
  MapPin,
  Clock,
  Music,
  Send,
  ArrowLeft,
  Sliders,
  Upload,
  Layers,
  Smile,
  Shield,
  Volume2,
  Trash2,
  Move,
} from 'lucide-react';

export interface StoryCameraOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishStory: (newStory: {
    gradient: string;
    imageUrl?: string;
    caption?: string;
    sticker?: string;
    musicTrack?: string;
    locationName?: string;
  }) => void;
  isDark: boolean;
}

const GRADIENT_PRESETS = [
  {
    id: 'shadow_neon',
    name: 'Shadow Magenta',
    gradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 40%, #8A2BE2 100%)',
  },
  {
    id: 'stealth_black',
    name: 'Stealth Noir',
    gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 50%, #0A0A0A 100%)',
  },
  {
    id: 'cyber_cyan',
    name: 'Cyber Horizon',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8A2BE2 100%)',
  },
  {
    id: 'pure_noir',
    name: 'Pure Obsidian',
    gradient: 'linear-gradient(180deg, #181818 0%, #101010 50%, #050505 100%)',
  },
  {
    id: 'amber_glow',
    name: 'Amber Eclipse',
    gradient: 'linear-gradient(145deg, #F59E0B 0%, #EA580C 50%, #7C2D12 100%)',
  },
];

const CAMERA_SCENES = [
  {
    id: 'studio_selfie',
    name: 'Designer Studio',
    subtitle: 'Ambient Magenta Rim',
    imageUrl: '/src/assets/images/avatar_mauricio_designer_1792313922880.jpg',
  },
  {
    id: 'cyber_art',
    name: 'Bio-Digital Art',
    subtitle: 'Crystalline Tendrils',
    imageUrl: '/src/assets/images/feed_art_biomorphic_1792313924712.jpg',
  },
  {
    id: 'brutalist_dusk',
    name: 'Brutalist Coast',
    subtitle: 'Blue Hour Architecture',
    imageUrl: '/src/assets/images/feed_art_brutalist_1792313925585.jpg',
  },
  {
    id: 'noir_exhibit',
    name: 'Noir Refraction',
    subtitle: 'Darkroom Volume',
    imageUrl: '/src/assets/images/shadow_artwork_one_1790311065756.jpg',
  },
  {
    id: 'shibuya_night',
    name: 'Shibuya Crossing',
    subtitle: 'Tokyo Cyber Node',
    imageUrl: '/src/assets/images/shadow_artwork_three_1790311086351.jpg',
  },
];

const FILTERS = [
  { id: 'normal', name: 'Normal', css: 'none' },
  { id: 'cyber', name: 'Cyber Glow', css: 'contrast(1.25) saturate(1.4) hue-rotate(15deg)' },
  { id: 'noir', name: 'Noir 35mm', css: 'grayscale(1) contrast(1.4) brightness(0.92)' },
  { id: 'chroma', name: 'Vivid Chroma', css: 'saturate(2.1) contrast(1.15)' },
  { id: 'amber', name: 'Golden Hour', css: 'sepia(0.4) saturate(1.5) contrast(1.1)' },
  { id: 'emerald', name: 'Matrix Emerald', css: 'hue-rotate(85deg) contrast(1.2) saturate(1.3)' },
];

const STICKER_PRESETS = [
  { id: 'shadow', icon: Sparkles, label: '#SHADOW · 24h' },
  { id: 'time', icon: Clock, label: '10:52 AM' },
  { id: 'location_shibuya', icon: MapPin, label: '📍 Shibuya Node • Tokyo' },
  { id: 'location_berlin', icon: MapPin, label: '📍 Shadow Lab • Berlin' },
  { id: 'music_harmonic', icon: Music, label: '♫ Mauricio • Harmonic Void' },
  { id: 'pawn_rank', icon: Shield, label: '♙ PAWN · Rank I' },
];

export const StoryCameraOverlay: React.FC<StoryCameraOverlayProps> = ({
  isOpen,
  onClose,
  onPublishStory,
  isDark,
}) => {
  // Modes: 'camera' (live webcam or simulated viewfinder), 'gallery' (device upload / presets), 'gradient'
  const [mode, setMode] = useState<'camera' | 'gallery' | 'gradient'>('camera');
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Camera settings
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [showGrid, setShowGrid] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'idle' | 'prompting' | 'granted' | 'unavailable'>('idle');

  // Captured snapshot
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [screenTorch, setScreenTorch] = useState(false);

  // Story customization
  const [captionText, setCaptionText] = useState('');
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionColor, setCaptionColor] = useState('#FFFFFF');
  const [captionPosition, setCaptionPosition] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [activeSticker, setActiveSticker] = useState<string | null>('shadow');

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound effect / shutter click chime (web audio)
  const playShutterSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.14);
    } catch (_e) {
      // AudioContext not available in silent/restricted browser state
    }
  };

  // Start live webcam or mobile camera if available
  const startLiveCamera = async () => {
    try {
      stopLiveCamera();
      setCameraPermissionStatus('prompting');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API unavailable in current environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 720 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsLiveCameraActive(true);
      setCameraPermissionStatus('granted');
    } catch (_err) {
      setIsLiveCameraActive(false);
      setCameraPermissionStatus('unavailable');
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopLiveCamera();
      return;
    }

    if (mode === 'camera' && !capturedImage) {
      void startLiveCamera();
    }

    return () => {
      stopLiveCamera();
    };
  }, [isOpen, mode, facingMode, capturedImage]);

  // Flip camera between front/back
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Cycle Flash Mode
  const handleCycleFlash = () => {
    setFlashMode((prev) => {
      if (prev === 'off') {
        setScreenTorch(true);
        return 'on';
      }
      if (prev === 'on') {
        setScreenTorch(false);
        return 'auto';
      }
      setScreenTorch(false);
      return 'off';
    });
  };

  // Shutter Snap Action (captures canvas snapshot from live webcam OR simulated scene)
  const handleCapturePhoto = () => {
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 240);

    // Case 1: Live Webcam Stream
    if (isLiveCameraActive && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
          setCapturedImage(dataUrl);
          stopLiveCamera();
          return;
        }
      } catch (e) {
        console.warn('Could not snap live video canvas:', e);
      }
    }

    // Case 2: Simulated Studio Camera Scene
    const currentScene = CAMERA_SCENES[activeSceneIndex];
    if (mode === 'camera' && currentScene) {
      setCapturedImage(currentScene.imageUrl);
      stopLiveCamera();
      return;
    }

    // Case 3: Creative Gradient snapshot
    setCapturedImage('gradient_snapshot');
    stopLiveCamera();
  };

  // Handle local device file upload (camera roll / desktop file)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setCapturedImage(event.target.result);
          stopLiveCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select sample photo directly from camera tray
  const handleSelectSamplePhoto = (imgUrl: string) => {
    setCapturedImage(imgUrl);
    stopLiveCamera();
  };

  // Retake or discard capture
  const handleRetake = () => {
    setCapturedImage(null);
    setCaptionText('');
    setIsEditingCaption(false);
    if (mode === 'camera') {
      void startLiveCamera();
    }
  };

  // Publish to 24-Hour Story
  const handlePublish = () => {
    const currentGradient = GRADIENT_PRESETS[selectedGradientIndex].gradient;
    const finalImageUrl =
      capturedImage && capturedImage !== 'gradient_snapshot' ? capturedImage : undefined;

    const stickerObj = STICKER_PRESETS.find((s) => s.id === activeSticker);

    onPublishStory({
      gradient: currentGradient,
      imageUrl: finalImageUrl,
      caption: captionText.trim() || undefined,
      sticker: stickerObj?.label,
      musicTrack: stickerObj?.id === 'music_harmonic' ? 'Mauricio • Harmonic Void' : undefined,
      locationName: stickerObj?.id.startsWith('location_') ? stickerObj.label.replace('📍 ', '') : undefined,
    });

    // Reset local state
    setCapturedImage(null);
    setCaptionText('');
    setIsEditingCaption(false);
    stopLiveCamera();
    onClose();
  };

  if (!isOpen) return null;

  const currentGradient = GRADIENT_PRESETS[selectedGradientIndex].gradient;
  const currentFilter = FILTERS[selectedFilterIndex];
  const activeScene = CAMERA_SCENES[activeSceneIndex];

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Hidden File Input for Device Gallery / Camera Roll */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Screen Torch Flash (Simulated Ring-light on screen) */}
      {screenTorch && !capturedImage && (
        <div className="absolute inset-0 border-[16px] border-white/80 pointer-events-none z-40 transition-opacity" />
      )}

      {/* Shutter White Flash Burst */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-200" />
      )}

      {/* ======================================================== */}
      {/* 1. TOP HEADER TOOLBAR                                    */}
      {/* ======================================================== */}
      <div className="absolute top-0 inset-x-0 z-30 pt-3 pb-2 px-4 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        {/* Close Button */}
        <button
          onClick={() => {
            stopLiveCamera();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 active:scale-95 transition-all cursor-pointer shadow-md"
          title="Exit Story Camera"
        >
          <X size={18} />
        </button>

        {/* Center Mode Switcher Capsule: Camera vs Gallery vs Gradient */}
        {!capturedImage && (
          <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold shadow-lg">
            <button
              onClick={() => {
                setMode('camera');
                setCapturedImage(null);
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'camera'
                  ? 'bg-gradient-to-r from-[#FF0A78] to-[#8A2BE2] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Camera size={12} />
              <span>Camera</span>
            </button>

            <button
              onClick={() => {
                setMode('gallery');
                stopLiveCamera();
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'gallery'
                  ? 'bg-gradient-to-r from-[#FF0A78] to-[#8A2BE2] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Upload size={12} />
              <span>Upload</span>
            </button>

            <button
              onClick={() => {
                setMode('gradient');
                stopLiveCamera();
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'gradient'
                  ? 'bg-gradient-to-r from-[#FF0A78] to-[#8A2BE2] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sparkles size={12} />
              <span>Canvas</span>
            </button>
          </div>
        )}

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          {mode === 'camera' && !capturedImage && (
            <>
              {/* Flash / Ringlight Toggle */}
              <button
                onClick={handleCycleFlash}
                className={`w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  flashMode !== 'off' ? 'text-[#FF0A78] border-[#FF0A78]' : 'text-white/80'
                }`}
                title={`Torch: ${flashMode.toUpperCase()}`}
              >
                {flashMode === 'off' ? <ZapOff size={15} /> : <Zap size={15} className="fill-current" />}
              </button>

              {/* Grid 3x3 Toggle */}
              <button
                onClick={() => setShowGrid((prev) => !prev)}
                className={`w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  showGrid ? 'text-[#FF0A78] border-[#FF0A78]' : 'text-white/80'
                }`}
                title="Toggle Rule-of-Thirds Grid"
              >
                <Grid3X3 size={15} />
              </button>
            </>
          )}

          {/* Text Tool Toggle in Editor */}
          {capturedImage && (
            <button
              onClick={() => setIsEditingCaption(true)}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 active:scale-95 transition-all cursor-pointer shadow-md"
              title="Add Story Text"
            >
              <Type size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VIEWFINDER / CANVAS WORKSPACE                         */}
      {/* ======================================================== */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-[#0A0A0C]">
        {/* State A: Captured Image or Uploaded Photo */}
        {capturedImage && capturedImage !== 'gradient_snapshot' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Story Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none transition-all duration-300"
              style={{ filter: currentFilter.css }}
            />
            {/* Dark vignette overlay for caption & sticker contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
          </div>
        ) : mode === 'camera' && isLiveCameraActive ? (
          /* State B: Live Webcam Stream */
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-all ${
              facingMode === 'user' ? 'scale-x-[-1]' : ''
            }`}
            style={{ filter: currentFilter.css }}
          />
        ) : mode === 'camera' ? (
          /* State C: Simulated Live Studio Viewfinder */
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <img
              src={activeScene.imageUrl}
              alt={activeScene.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 select-none"
              style={{ filter: currentFilter.css }}
            />

            {/* Dark lens vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

            {/* Simulated Autofocus Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF0A78] animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              </div>

              {/* Cyber Reticle Corner Marks */}
              <div className="absolute top-16 left-6 w-5 h-5 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-16 right-6 w-5 h-5 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-32 left-6 w-5 h-5 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-32 right-6 w-5 h-5 border-b-2 border-r-2 border-white/50" />
            </div>

            {/* Viewfinder Status Capsule */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FF0A78] animate-pulse" />
              <span>Studio Viewfinder: {activeScene.name}</span>
            </div>
          </div>
        ) : mode === 'gallery' ? (
          /* State D: Photo Upload & Presets Hub */
          <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-[#16161A] to-[#0A0A0C]">
            <div className="max-w-xs space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-[#FF0A78]/50 hover:border-[#FF0A78] bg-white/5 hover:bg-white/10 p-6 rounded-3xl cursor-pointer transition-all flex flex-col items-center gap-3 shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF0A78] to-[#8A2BE2] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Upload size={26} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Upload from Device</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    Select any photo, portrait, or artwork file
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-[#FF0A78] text-white text-xs font-bold shadow-md hover:bg-[#E1306C]"
                >
                  Choose File
                </button>
              </div>

              {/* Sample Studio Presets Quick-Select */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-2">
                  Or select sample studio capture:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {CAMERA_SCENES.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => handleSelectSamplePhoto(scene.imageUrl)}
                      className="group relative h-20 rounded-xl overflow-hidden border border-white/15 hover:border-[#FF0A78] transition-all cursor-pointer"
                    >
                      <img
                        src={scene.imageUrl}
                        alt={scene.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-end p-1">
                        <span className="text-[9px] font-bold text-white leading-tight truncate">
                          {scene.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* State E: Creative Gradient Canvas */
          <div
            className="w-full h-full flex flex-col items-center justify-center relative p-6 transition-all duration-500"
            style={{ background: currentGradient }}
          >
            <div className="text-center z-10 select-none pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 block mb-1">
                Shadow 24h Story Canvas
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-lg">
                {GRADIENT_PRESETS[selectedGradientIndex].name}
              </h2>
            </div>
          </div>
        )}

        {/* Rule of Thirds Grid Overlay */}
        {showGrid && !capturedImage && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-20">
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div />
          </div>
        )}

        {/* Active Sticker Badge on Story */}
        {activeSticker && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 animate-in zoom-in-95 duration-200">
            {STICKER_PRESETS.map((stk) => {
              if (stk.id !== activeSticker) return null;
              const IconComp = stk.icon;
              return (
                <div
                  key={stk.id}
                  onClick={() => {
                    // Cycle next sticker
                    const currentIdx = STICKER_PRESETS.findIndex((s) => s.id === activeSticker);
                    const next = STICKER_PRESETS[(currentIdx + 1) % STICKER_PRESETS.length].id;
                    setActiveSticker(next);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <IconComp size={13} className="text-[#FF0A78]" />
                  <span>{stk.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Caption Overlay on Story */}
        {captionText && !isEditingCaption && (
          <div
            onClick={() => setIsEditingCaption(true)}
            className={`absolute left-6 right-6 z-20 text-center cursor-pointer active:scale-95 transition-transform ${
              captionPosition === 'top'
                ? 'top-28'
                : captionPosition === 'center'
                ? 'top-1/2 -translate-y-1/2'
                : 'bottom-28'
            }`}
          >
            <div className="inline-block px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/25 shadow-2xl max-w-full">
              <p
                className="text-sm font-extrabold tracking-wide break-words drop-shadow-md"
                style={{ color: captionColor }}
              >
                {captionText}
              </p>
            </div>
          </div>
        )}

        {/* Modal Caption Input Sheet */}
        {isEditingCaption && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xl p-5 flex flex-col justify-between animate-in fade-in duration-150">
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Story Caption
                </span>
                {/* Position Switcher */}
                <button
                  type="button"
                  onClick={() =>
                    setCaptionPosition((p) =>
                      p === 'bottom' ? 'center' : p === 'center' ? 'top' : 'bottom'
                    )
                  }
                  className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1"
                >
                  <Move size={10} />
                  <span>{captionPosition.toUpperCase()}</span>
                </button>
              </div>

              <button
                onClick={() => setIsEditingCaption(false)}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF0A78] to-[#8A2BE2] hover:opacity-95 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-2">
              <textarea
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="Write a thought or mood for your 24h story..."
                rows={3}
                autoFocus
                className="w-full bg-transparent text-center text-lg font-black tracking-wide focus:outline-none placeholder-white/40 resize-none drop-shadow-md"
                style={{ color: captionColor }}
              />
            </div>

            {/* Quick Mentions & Colors */}
            <div className="space-y-3 pb-6">
              {/* Mentions quick chips */}
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar">
                {['@maoo.lopez', '@elena.art', '@christian.lue', '@claire_d'].map((mention) => (
                  <button
                    key={mention}
                    onClick={() => setCaptionText((prev) => `${prev} ${mention}`.trim())}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    {mention}
                  </button>
                ))}
              </div>

              {/* Color Palette Chips */}
              <div className="flex items-center justify-center gap-3">
                {['#FFFFFF', '#FF0A78', '#8A2BE2', '#06B6D4', '#F59E0B', '#10B981', '#111111'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCaptionColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      captionColor === c ? 'scale-125 border-white ring-2 ring-white/50 shadow-md' : 'border-white/30'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM CONTROLS & PUBLISH TRAY                        */}
      {/* ======================================================== */}
      <div className="z-30 pb-5 pt-2 px-4 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-3">
        {/* Pre-Capture Scene & Gradient Switcher */}
        {!capturedImage && mode === 'camera' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            <span className="text-[10px] font-bold text-white/50 shrink-0 uppercase tracking-wider">
              Scenes:
            </span>
            {CAMERA_SCENES.map((scene, idx) => {
              const isSelected = activeSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#FF0A78] text-white border-[#FF0A78] shadow-md shadow-[#FF0A78]/30 scale-105'
                      : 'bg-black/60 text-white/70 hover:text-white border-white/15'
                  }`}
                >
                  <span>{scene.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Gradient Palette Swatches Selector (in Gradient Canvas Mode) */}
        {!capturedImage && mode === 'gradient' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            {GRADIENT_PRESETS.map((preset, idx) => {
              const isSelected = selectedGradientIndex === idx;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedGradientIndex(idx)}
                  className={`w-9 h-9 rounded-[10px] shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'scale-110 border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                  style={{ background: preset.gradient }}
                  title={preset.name}
                >
                  {isSelected && <Check size={14} className="text-white drop-shadow-md" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Viewfinder Capture Controls (Pre-Capture) */}
        {!capturedImage ? (
          <div className="flex items-center justify-between px-4 pt-1">
            {/* Gallery Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer shadow-lg"
              title="Upload photo from your device"
            >
              <ImageIcon size={20} />
            </button>

            {/* Shutter Capture Button */}
            <button
              onClick={handleCapturePhoto}
              className="relative w-18 h-18 rounded-full border-4 border-white/90 p-1 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105"
              title="Snap Story Photo"
            >
              <div
                className="w-full h-full rounded-full transition-all"
                style={{
                  background:
                    mode === 'gradient'
                      ? currentGradient
                      : 'linear-gradient(135deg, #FF0A78 0%, #E1306C 40%, #8A2BE2 100%)',
                }}
              />
            </button>

            {/* Flip Camera / Switch Scene Button */}
            <button
              onClick={() => {
                if (isLiveCameraActive) {
                  handleFlipCamera();
                } else {
                  setActiveSceneIndex((prev) => (prev + 1) % CAMERA_SCENES.length);
                }
              }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer shadow-lg"
              title="Flip Camera or Switch Scene"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        ) : (
          /* Post-Capture Editor Controls & Publish Tray */
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Filter Swatches Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1">
              {FILTERS.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilterIndex(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                    selectedFilterIndex === idx
                      ? 'bg-white text-black font-bold border-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:text-white border-white/15'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Sticker Swatches Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1">
              <button
                onClick={() => setActiveSticker(null)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer border ${
                  activeSticker === null
                    ? 'bg-white/20 text-white border-white/40'
                    : 'bg-white/5 text-white/50 border-white/10'
                }`}
              >
                No Sticker
              </button>
              {STICKER_PRESETS.map((stk) => {
                const Icon = stk.icon;
                const isSelected = activeSticker === stk.id;
                return (
                  <button
                    key={stk.id}
                    onClick={() => setActiveSticker(stk.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-[#FF0A78] text-white border-[#FF0A78] shadow-sm'
                        : 'bg-white/10 text-white/70 hover:text-white border-white/15'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{stk.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions: Retake vs Share to Your 24-hour Story */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {/* Retake Button */}
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Retake</span>
              </button>

              {/* Share to 24-Hour Story Button */}
              <button
                onClick={handlePublish}
                className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#FF0A78] via-[#E1306C] to-[#8A2BE2] text-white text-xs font-extrabold shadow-xl hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[#FF0A78]/25"
              >
                <div
                  className="w-5 h-5 rounded-full p-[1.5px] shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #FF0A78 0%, #8A2BE2 100%)',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white/30" />
                </div>
                <span>Share to Your Story (24h)</span>
                <Send size={13} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
