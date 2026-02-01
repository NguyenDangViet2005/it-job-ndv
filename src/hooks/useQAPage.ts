import { useState, useEffect, useRef } from "react";
import { blogApi, companyApi } from "@/apis";
import { connectionApi } from "@/apis/connection.api";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePost";
import type { BlogResponse, Company } from "@/types/api.type";

export function useQAPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const { posts, loading, hasMore, loadMore, setPosts } = usePosts(
    user?.id || undefined,
    token,
  );

  const [loadingCommentsForPost, setLoadingCommentsForPost] = useState<
    number | null
  >(null);
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([]);
  const [followedCompanyIds, setFollowedCompanyIds] = useState<number[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const hasFetchedSideData = useRef(false);

  // Fetch side data
  useEffect(() => {
    const fetchSideData = async () => {
      if (hasFetchedSideData.current) return;
      hasFetchedSideData.current = true;

      try {
        // Fetch blogs
        const blogRes = await blogApi.getAll(1, 5);
        if (blogRes.data) {
          const blogData = Array.isArray(blogRes.data)
            ? blogRes.data
            : (blogRes.data as any).data || [];
          setBlogs(blogData);
        }

        // Fetch suggested companies
        const companyRes = await companyApi.getAll(1, 5);
        if (companyRes.data) {
          const companyData = Array.isArray(companyRes.data)
            ? companyRes.data
            : (companyRes.data as any).data || [];
          setSuggestedCompanies(companyData);
        }
        if (user && token) {
          const companyData = Array.isArray(companyRes.data)
            ? companyRes.data
            : (companyRes.data as any).data || [];

          const followedIds = companyData
            .filter((company: any) =>
              company.follows?.some((follow: any) => follow.userid === user.id),
            )
            .map((company: any) => company.id);

          setFollowedCompanyIds(followedIds);
        }

        // Fetch user connections
        if (user && token) {
          const connectionRes = await connectionApi.getUserConnections(
            user.id,
            1,
            100,
            token,
          );
          if (connectionRes.data) {
            setConnections(connectionRes.data);
          }
        }
      } catch (error) {
        console.error("Error fetching side data:", error);
      }
    };

    if (!authLoading && !hasFetchedSideData.current) {
      fetchSideData();
    }
  }, [authLoading, user, token]);

  // Scroll to top when content is ready
  useEffect(() => {
    if (!authLoading) {
      window.scrollTo(0, 0);
    }
  }, [authLoading]);

  return {
    user,
    token,
    isAuthenticated,
    authLoading,
    posts,
    loading,
    hasMore,
    loadMore,
    setPosts,
    loadingCommentsForPost,
    setLoadingCommentsForPost,
    blogs,
    suggestedCompanies,
    followedCompanyIds,
    connections,
  };
}
