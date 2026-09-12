"use client";
import { useEffect, useState } from "react";

type Photo = { id: string; url: string; altText?: string | null };

export default function Gallery({ photos, branchName }: { photos: Photo[]; branchName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="gallery-grid">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="gallery-thumb"
            onClick={() => setOpenIndex(i)}
            aria-label={`ดูรูปขยาย ${branchName} ที่ ${i + 1}`}
          >
            <img src={p.url} alt={p.altText || `${branchName} รูปที่ ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div className="lightbox-backdrop" onClick={() => setOpenIndex(null)}>
          <button className="lightbox-close" onClick={() => setOpenIndex(null)} aria-label="ปิด">
            ×
          </button>
          {photos.length > 1 && (
            <button
              className="lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
              }}
              aria-label="รูปก่อนหน้า"
            >
              ‹
            </button>
          )}
          <img
            className="lightbox-img"
            src={photos[openIndex].url}
            alt={photos[openIndex].altText || `${branchName} รูปที่ ${openIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button
              className="lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
              }}
              aria-label="รูปถัดไป"
            >
              ›
            </button>
          )}
          <div className="lightbox-count">
            {openIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
