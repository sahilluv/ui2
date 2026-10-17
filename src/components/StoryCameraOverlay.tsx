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
} from 'lucide-react';

export interface StoryCameraOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishStory: (newStory: {
    gradient: string;
    imageUrl?: string;
    caption?: string;
    sticker?: string;
  }) => void;
  isDark: boolean;
}

const GRADIENT_PRESETS = [
  {
    id: 'stealth_black',
    name: 'Stealth Black',
    gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 50%, #0A0A0A 100%)',
  },
  {
    id: 'matte_obsidian',
    name: 'Matte Obsidian',
    gradient: 'linear-gradient(135deg, #222222 0%, #141414 50%, #000000 100%)',
  },
  {
    id: 'charcoal_noir',
    name: 'Charcoal Noir',
    gradient: 'linear-gradient(145deg, #282828 0%, #1A1A1A 50%, #0F0F0F 100%)',
  },
  {
    id: 'pure_noir',
    name: 'Pure Noir',
    gradient: 'linear-gradient(180deg, #181818 0%, #101010 50%, #050505 100%)',
  },
  {
    id: 'dark_graphite',
    name: 'Dark Graphite',
    gradient: 'linear-gradient(145deg, #303030 0%, #1F1F1F 50%, #121212 100%)',
  },
];

const FILTERS = [
  { id: 'normal', name: 'Normal', css: 'none' },
  { id: 'cyber', name: 'Cyber Glow', css: 'contrast(1.25) saturate(1.4) hue-rotate(15deg)' },
  { id: 'noir', name: 'Noir 35mm', css: 'grayscale(1) contrast(1.35) brightness(0.9)' },
  { id: 'chroma', name: 'Vivid Chroma', css: 'saturate(2) contrast(1.15)' },
  { id: 'amber', name: 'Golden Hour', css: 'sepia(0.4) saturate(1.5) contrast(1.1)' },
];

const STICKER_PRESETS = [
  { id: 'time', icon: Clock, label: '10:52 AM' },
  { id: 'shadow', icon: Sparkles, label: '#SHADOW · 24h' },
  { id: 'location', icon: MapPin, label: 'Tokyo, Shibuya' },
  { id: 'music', icon: Music, label: '♫ Cyber Horizon' },
];

export const StoryCameraOverlay: React.FC<StoryCameraOverlayProps> = ({
  isOpen,
  onClose,
  onPublishStory,
  isDark,
}) => {
  // Modes: 'camera' (live viewfinder) or 'gradient' (creative gradient canvas)
  const [mode, setMode] = useState<'camera' | 'gradient'>('camera');
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);

  // Camera Settings
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [showGrid, setShowGrid] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Capture State & Editor
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Story Customization
  const [captionText, setCaptionText] = useState('');
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionColor, setCaptionColor] = useState('#FFFFFF');
  const [activeSticker, setActiveSticker] = useState<string | null>('shadow');

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Camera when overlay opens in camera mode
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (mode === 'camera' && !capturedImage) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, mode, facingMode, capturedImage]);

  const startCamera = async () => {
    try {
      stopCamera();
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available');
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
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Live camera unavailable, switching to simulated creative viewfinder:', err);
      setIsCameraActive(false);
      setCameraError('Camera unavailable in preview frame. Using Simulated Viewfinder.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Flip camera between front/back
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Cycle Flash Mode
  const handleCycleFlash = () => {
    setFlashMode((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  };

  // Shutter Snap Action
  const handleCapturePhoto = () => {
    // Shutter Flash visual effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    if (isCameraActive && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // If front camera, mirror horizontal
          if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setCapturedImage(dataUrl);
          stopCamera();
          return;
        }
      } catch (e) {
        console.error('Failed to capture frame from video canvas:', e);
      }
    }

    // Fallback: capture current gradient preview as snapshot
    setCapturedImage('gradient_snapshot');
    stopCamera();
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setCapturedImage(event.target.result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Retake or discard capture
  const handleRetake = () => {
    setCapturedImage(null);
    setCaptionText('');
    setIsEditingCaption(false);
    if (mode === 'camera') {
      startCamera();
    }
  };

  // Final Publish to 24-Hour Story
  const handlePublish = () => {
    const currentGradient = GRADIENT_PRESETS[selectedGradientIndex].gradient;
    const finalImageUrl =
      capturedImage && capturedImage !== 'gradient_snapshot' ? capturedImage : undefined;

    onPublishStory({
      gradient: currentGradient,
      imageUrl: finalImageUrl,
      caption: captionText.trim() || undefined,
      sticker: activeSticker || undefined,
    });

    // Reset local state
    setCapturedImage(null);
    setCaptionText('');
    setIsEditingCaption(false);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  const currentGradient = GRADIENT_PRESETS[selectedGradientIndex].gradient;
  const currentFilter = FILTERS[selectedFilterIndex];

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Hidden File Input for Gallery Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Shutter White Flash Burst */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-200" />
      )}

      {/* ======================================================== */}
      {/* 1. TOP HEADER TOOLBAR                                    */}
      {/* ======================================================== */}
      <div className="absolute top-0 inset-x-0 z-30 pt-3 pb-2 px-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
          title="Exit Camera"
        >
          <X size={18} />
        </button>

        {/* Center Mode Switcher Capsule: Camera vs Gradient */}
        {!capturedImage && (
          <div className="flex items-center p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-bold">
            <button
              onClick={() => {
                setMode('camera');
                setCapturedImage(null);
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'camera'
                  ? 'bg-gradient-to-r from-[#7B52B9] to-[#5E3A89] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Camera size={12} />
              <span>Camera</span>
            </button>
            <button
              onClick={() => {
                setMode('gradient');
                stopCamera();
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'gradient'
                  ? 'bg-gradient-to-r from-[#7B52B9] to-[#5E3A89] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sparkles size={12} />
              <span>Gradient</span>
            </button>
          </div>
        )}

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          {mode === 'camera' && !capturedImage && (
            <>
              {/* Flash Toggle */}
              <button
                onClick={handleCycleFlash}
                className={`w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer ${
                  flashMode !== 'off' ? 'text-yellow-400' : 'text-white/80'
                }`}
                title={`Flash: ${flashMode.toUpperCase()}`}
              >
                {flashMode === 'off' ? <ZapOff size={15} /> : <Zap size={15} />}
              </button>

              {/* Grid 3x3 Toggle */}
              <button
                onClick={() => setShowGrid((prev) => !prev)}
                className={`w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer ${
                  showGrid ? 'text-[#D4C4EB] border-[#7B52B9]/50' : 'text-white/80'
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
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
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
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        {/* Mode A: Captured Image or Uploaded Image */}
        {capturedImage && capturedImage !== 'gradient_snapshot' ? (
          <img
            src={capturedImage}
            alt="Captured story"
            className="w-full h-full object-cover select-none"
            style={{ filter: currentFilter.css }}
          />
        ) : mode === 'camera' && isCameraActive ? (
          /* Mode B: Live Web Camera Stream */
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
        ) : (
          /* Mode C: Creative Gradient Backdrop (or Simulated Viewfinder) */
          <div
            className="w-full h-full flex flex-col items-center justify-center relative p-6 transition-all duration-500"
            style={{ background: currentGradient }}
          >
            {/* Subtle Viewfinder Grid & Focus Reticle Overlay */}
            {mode === 'camera' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Simulated Lens Focal Center */}
                <div className="w-24 h-24 rounded-full border border-white/25 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#7B52B9]/80 animate-ping" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                </div>

                {/* Cyber Corner Marks */}
                <div className="absolute top-16 left-6 w-5 h-5 border-t-2 border-l-2 border-white/40" />
                <div className="absolute top-16 right-6 w-5 h-5 border-t-2 border-r-2 border-white/40" />
                <div className="absolute bottom-24 left-6 w-5 h-5 border-b-2 border-l-2 border-white/40" />
                <div className="absolute bottom-24 right-6 w-5 h-5 border-b-2 border-r-2 border-white/40" />
              </div>
            )}

            {/* Central Watermark / Concept Typography */}
            <div className="text-center z-10 select-none pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 block mb-1">
                Shadow 24h Story
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
            <div className="border-r border-white/20" />
            <div className="border-r border-white/20" />
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
                  className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <IconComp size={13} className="text-[#D4C4EB]" />
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
            className="absolute bottom-28 left-6 right-6 z-20 text-center cursor-pointer active:scale-95 transition-transform"
          >
            <div className="inline-block px-4 py-2 rounded-2xl bg-black/55 backdrop-blur-md border border-white/20 shadow-2xl max-w-full">
              <p
                className="text-sm font-extrabold tracking-wide break-words"
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Story Text
              </span>
              <button
                onClick={() => setIsEditingCaption(false)}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7B52B9] to-[#5E3A89] hover:opacity-90 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-2">
              <textarea
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="Type your story thought..."
                rows={3}
                autoFocus
                className="w-full bg-transparent text-center text-lg font-black tracking-wide focus:outline-none placeholder-white/40 resize-none"
                style={{ color: captionColor }}
              />
            </div>

            {/* Color Palette for Text (Monochrome Black & Matt Black) */}
            <div className="flex items-center justify-center gap-3 pb-6">
              {['#FFFFFF', '#D4D4D4', '#888888', '#333333', '#1A1A1A', '#000000'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCaptionColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    captionColor === c ? 'scale-125 border-white ring-2 ring-neutral-400' : 'border-neutral-700'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM CONTROLS & PUBLISH TRAY                        */}
      {/* ======================================================== */}
      <div className="z-30 pb-5 pt-2 px-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-3">
        {/* Gradient Palette Swatches Selector (Visible in Gradient Mode or before capture) */}
        {!capturedImage && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            {GRADIENT_PRESETS.map((preset, idx) => {
              const isSelected = selectedGradientIndex === idx;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedGradientIndex(idx);
                    if (mode === 'camera') setMode('gradient');
                  }}
                  className={`w-9 h-9 rounded-[10px] shrink-0 border-2 transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'scale-110 border-white shadow-[0_0_12px_rgba(255,255,255,0.5)]'
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

        {/* Viewfinder Controls (Pre-Capture) */}
        {!capturedImage ? (
          <div className="flex items-center justify-between px-4 pt-1">
            {/* Gallery Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
              title="Upload photo from device"
            >
              <ImageIcon size={20} />
            </button>

            {/* Shutter Capture Button */}
            <button
              onClick={handleCapturePhoto}
              className="relative w-18 h-18 rounded-full border-4 border-white/90 p-1 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-2xl"
              title="Capture Story Photo"
            >
              <div
                className="w-full h-full rounded-full transition-all"
                style={{
                  background:
                    mode === 'gradient'
                      ? currentGradient
                      : 'linear-gradient(135deg, #7B52B9 0%, #FFFFFF 100%)',
                }}
              />
            </button>

            {/* Flip Camera Button */}
            <button
              onClick={handleFlipCamera}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
              title="Flip Camera"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        ) : (
          /* Post-Capture Editor Controls & Publish Tray */
          <div className="space-y-3">
            {/* Filter Swatches for captured image */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1">
              {FILTERS.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilterIndex(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedFilterIndex === idx
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {f.name}
                </button>
              ))}
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
                className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#7B52B9] via-[#8456C5] to-[#5E3A89] text-white text-xs font-extrabold shadow-xl hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <div
                  className="w-5 h-5 rounded-full p-[1px] shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #7B52B9 0%, #5E3A89 100%)',
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
