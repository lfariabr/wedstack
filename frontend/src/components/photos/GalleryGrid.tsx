"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PHOTOS_PAGINATED, Photo } from "@/lib/graphql/photos";

export default function GalleryGrid() {
  const PAGE_SIZE = 24;
  const [offset, setOffset] = useState(0);
  const { data, loading, error, fetchMore } = useQuery(GET_PHOTOS_PAGINATED, {
    variables: { limit: PAGE_SIZE, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const photos: Photo[] = data?.photosPaginated?.photos ?? [];
  const total: number = data?.photosPaginated?.total ?? 0;
  const hasMore: boolean = data?.photosPaginated?.hasMore ?? false;

  const handleLoadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    await fetchMore({
      variables: { limit: PAGE_SIZE, offset: nextOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          photosPaginated: {
            ...fetchMoreResult.photosPaginated,
            photos: [...prev.photosPaginated.photos, ...fetchMoreResult.photosPaginated.photos],
          },
        };
      },
    });
    setOffset(nextOffset);
  };

  if (error) {
    return <div className="text-sm text-red-600">Failed to load photos: {error.message}</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((p) => (
          <figure key={p.id} className="relative group overflow-hidden rounded border border-neutral-200 bg-white">
            <img src={p.url} alt={p.uploaderName || "Guest photo"} className="w-full h-full object-cover aspect-square" />
            <figcaption className="absolute bottom-0 left-0 right-0 text-xs p-2 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition">
              {p.uploaderName || "Guest"} · {new Date(p.createdAt).toLocaleDateString()}
            </figcaption>
            <a
              href={p.url}
              download
              className="absolute top-2 right-2 text-[11px] px-2 py-1 rounded bg-white/90 hover:bg-white border border-neutral-200 shadow-sm"
              title="Download"
            >
              Download
            </a>
          </figure>
        ))}
      </div>

      <div className="flex items-center justify-center mt-6">
        {loading && photos.length === 0 ? (
          <span className="text-sm text-neutral-600">Loading...</span>
        ) : hasMore ? (
          <button onClick={handleLoadMore} className="px-4 py-2 rounded bg-black text-white">Load more</button>
        ) : (
          <span className="text-sm text-neutral-500">No more photos</span>
        )}
      </div>
    </div>
  );
}
