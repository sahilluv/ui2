import React, { useEffect, useState, useRef } from 'react';

interface MangaArtworkProps {
  src: string;
  alt: string;
  className?: string;
  cropPercentTop?: number;
}

/**
 * MangaArtwork renders high-contrast black & white manga illustrations.
 * It uses an offscreen canvas to turn the outer surrounding white background
 * into transparent alpha while preserving the interior white clothes/armchair/skin
 * and crisp black ink outlines.
 */
export const MangaArtwork: React.FC<MangaArtworkProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setProcessedUrl(src);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // BFS Flood fill from perimeter to turn pure white background transparent
        // Threshold: pixels with R > 238, G > 238, B > 238
        const visited = new Uint8Array(w * h);
        const queue: number[] = [];

        // Push border pixels that are near-white
        const isNearWhite = (idx: number) => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          return r > 236 && g > 236 && b > 236;
        };

        // Top and bottom edges
        for (let x = 0; x < w; x++) {
          const topIdx = x;
          if (isNearWhite(topIdx)) {
            visited[topIdx] = 1;
            queue.push(topIdx);
          }
          const btmIdx = (h - 1) * w + x;
          if (isNearWhite(btmIdx)) {
            visited[btmIdx] = 1;
            queue.push(btmIdx);
          }
        }

        // Left and right edges
        for (let y = 0; y < h; y++) {
          const leftIdx = y * w;
          if (!visited[leftIdx] && isNearWhite(leftIdx)) {
            visited[leftIdx] = 1;
            queue.push(leftIdx);
          }
          const rightIdx = y * w + (w - 1);
          if (!visited[rightIdx] && isNearWhite(rightIdx)) {
            visited[rightIdx] = 1;
            queue.push(rightIdx);
          }
        }

        // Run BFS to flood-fill contiguous outer white areas
        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          // Make pixel transparent
          data[curr * 4 + 3] = 0;

          const cx = curr % w;
          const cy = Math.floor(curr / w);

          // 4-neighborhood
          if (cx > 0) {
            const next = curr - 1;
            if (!visited[next] && isNearWhite(next)) {
              visited[next] = 1;
              queue.push(next);
            }
          }
          if (cx < w - 1) {
            const next = curr + 1;
            if (!visited[next] && isNearWhite(next)) {
              visited[next] = 1;
              queue.push(next);
            }
          }
          if (cy > 0) {
            const next = curr - w;
            if (!visited[next] && isNearWhite(next)) {
              visited[next] = 1;
              queue.push(next);
            }
          }
          if (cy < h - 1) {
            const next = curr + w;
            if (!visited[next] && isNearWhite(next)) {
              visited[next] = 1;
              queue.push(next);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        if (!isCancelled) {
          setProcessedUrl(dataUrl);
        }
      } catch (err) {
        console.warn('Canvas flood-fill failed, falling back to original image', err);
        if (!isCancelled) {
          setProcessedUrl(src);
        }
      }
    };

    img.onerror = () => {
      if (!isCancelled) setProcessedUrl(src);
    };

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return (
    <img
      src={processedUrl || src}
      alt={alt}
      className={`select-none pointer-events-none object-contain ${className}`}
      loading="eager"
    />
  );
};
