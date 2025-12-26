import { useState, useEffect, useCallback, useRef } from "react";
import { postApi } from "@/apis/post.api";
import { userApi } from "@/apis/user.api";
import { interactionApi } from "@/apis/interaction.api";
import type {
  FullPostResponse,
  AttachmentResponse,
  CommentResponse,
} from "@/types/api.type";

// Hook để load posts với infinite scroll
// Token và currentUserId được truyền từ useAuth() của component cha
export function usePosts(
  currentUserId?: number,
  token?: string | null,
  initialPageSize: number = 10
) {
  const [posts, setPosts] = useState<FullPostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (pageNumber: number, reset: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await postApi.getAll(
          pageNumber,
          initialPageSize,
          currentUserId,
          token || undefined
        );

        if (reset) {
          setPosts(response.data as unknown as FullPostResponse[]);
        } else {
          setPosts((prev) => [
            ...prev,
            ...(response.data as unknown as FullPostResponse[]),
          ]);
        }

        setHasMore(pageNumber < response.totalPages);
        setPage(pageNumber);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [initialPageSize, token, currentUserId]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPosts(page + 1);
    }
  }, [hasMore, loading, page, loadPosts]);

  const refresh = useCallback(() => {
    setPage(1);
    loadPosts(1, true);
  }, [loadPosts]);

  // Initial load
  useEffect(() => {
    loadPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, token]);

  return { posts, loading, hasMore, error, loadMore, refresh, setPosts };
}

// Hook để load user posts
export function useUserPosts(
  targetUserId: number,
  currentUserId?: number,
  token?: string | null,
  initialPageSize: number = 10
) {
  const [posts, setPosts] = useState<FullPostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (pageNumber: number, reset: boolean = false) => {
      if (!targetUserId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await postApi.getByUser(
          targetUserId,
          pageNumber,
          initialPageSize,
          currentUserId,
          token || undefined
        );

        if (reset) {
          setPosts(response.data as unknown as FullPostResponse[]);
        } else {
          setPosts((prev) => [
            ...prev,
            ...(response.data as unknown as FullPostResponse[]),
          ]);
        }

        setHasMore(pageNumber < response.totalPages);
        setPage(pageNumber);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [targetUserId, initialPageSize, token, currentUserId]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPosts(page + 1);
    }
  }, [hasMore, loading, page, loadPosts]);

  const refresh = useCallback(() => {
    setPage(1);
    loadPosts(1, true);
  }, [loadPosts]);

  useEffect(() => {
    if (targetUserId) {
      loadPosts(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, currentUserId, token]);

  return { posts, loading, hasMore, error, loadMore, refresh, setPosts };
}

// Hook để load user media
export function useUserMedia(
  targetUserId: number,
  token?: string | null,
  initialPageSize: number = 6
) {
  const [media, setMedia] = useState<AttachmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadMedia = useCallback(
    async (pageNumber: number, reset: boolean = false) => {
      if (!targetUserId) return;

      setLoading(true);

      try {
        const response = await userApi.getMedia(
          targetUserId,
          pageNumber,
          initialPageSize,
          token || undefined
        );

        if (reset) {
          setMedia(response.data);
        } else {
          setMedia((prev) => [...prev, ...response.data]);
        }

        setTotalItems(response.totalItems);
        setHasMore(pageNumber < response.totalPages);
        setPage(pageNumber);
      } catch (err: any) {
        console.error("Failed to load media:", err);
      } finally {
        setLoading(false);
      }
    },
    [targetUserId, initialPageSize, token]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMedia(page + 1);
    }
  }, [hasMore, loading, page, loadMedia]);

  useEffect(() => {
    if (targetUserId) {
      loadMedia(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, token]);

  return { media, loading, hasMore, totalItems, loadMore };
}

// Hook để load comments với pagination
export function useComments(
  postId: number,
  token?: string | null,
  initialPageSize: number = 10
) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadComments = useCallback(
    async (pageNumber: number, reset: boolean = false) => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await interactionApi.getComments(
          postId,
          pageNumber,
          initialPageSize,
          token || undefined
        );

        if (reset) {
          setComments(response.data);
        } else {
          setComments((prev) => [...prev, ...response.data]);
        }

        setHasMore(pageNumber < response.totalPages);
        setPage(pageNumber);
      } catch (err: any) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading, postId, initialPageSize, token]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadComments(page + 1);
    }
  }, [hasMore, loading, page, loadComments]);

  const refresh = useCallback(() => {
    setPage(1);
    loadComments(1, true);
  }, [loadComments]);

  return { comments, loading, hasMore, loadMore, refresh, setComments };
}

// Hook để infinite scroll
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  loading: boolean,
  threshold: number = 100
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, callback, threshold]
  );

  return loadMoreRef;
}
