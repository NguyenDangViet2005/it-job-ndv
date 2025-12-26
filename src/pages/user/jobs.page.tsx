"use client";

import { useEffect, useState } from "react";
import JobFilterSidebar from "@/sections/user/job/job-filter-sidebar.section";
import JobListSection from "@/sections/user/job/job-list.section";
import { jobApi, skillApi } from "@/apis";
import type { JobResponse } from "@/types/api.type";
import { HeroSection } from "@/sections/user/common/hero.section";

const JobsPage = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [skills, setSkills] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, selectedSkill, searchTerm, selectedJobType]);

  async function fetchSkills() {
    try {
      const response = await skillApi.getAll(1, 20);
      setSkills(response.data);
    } catch (err) {
      console.error("❌ Error fetching skills:", err);
    }
  }

  async function fetchJobs(page: number) {
    try {
      setLoading(true);

      let response;
      if (selectedSkill === null) {
        response = await jobApi.getAll(page, pageSize);
      } else {
        response = await jobApi.getBySkill(selectedSkill, page, pageSize);
      }

      // Filter by search term if provided (client-side filtering)
      let filteredJobs = response.data;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredJobs = filteredJobs.filter(
          (job: JobResponse) =>
            job.title?.toLowerCase().includes(term) ||
            job.description?.toLowerCase().includes(term) ||
            job.company?.name?.toLowerCase().includes(term)
        );
      }

      // Filter by job type if provided (client-side filtering)
      if (selectedJobType) {
        filteredJobs = filteredJobs.filter(
          (job: JobResponse) => job.type?.toLowerCase() === selectedJobType.toLowerCase()
        );
      }

      setJobs(filteredJobs);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải công việc");
    } finally {
      setLoading(false);
    }
  }

  const handleSkillChange = (skillId: number | null) => {
    setSelectedSkill(skillId);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleJobTypeChange = (type: string | null) => {
    setSelectedJobType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with VantaGlobe */}
      <HeroSection/>

      {/* Main Content with rounded top */}
      <div className="bg-background w-full rounded-t-3xl border-t border-border/50 -mt-20 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Tìm kiếm công việc IT
            </h1>
            <p className="text-muted-foreground">
              Khám phá hàng nghìn cơ hội việc làm IT hấp dẫn từ các công ty hàng đầu
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filter - Sticky on desktop */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <JobFilterSidebar
                  skills={skills}
                  selectedSkill={selectedSkill}
                  onSkillChange={handleSkillChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  selectedJobType={selectedJobType}
                  onJobTypeChange={handleJobTypeChange}
                />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              <JobListSection
                jobs={jobs}
                loading={loading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
