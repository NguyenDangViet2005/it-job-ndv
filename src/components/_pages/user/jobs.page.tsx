"use client";

import { useEffect, useState } from "react";
import JobListSection from "@/components/sections/jobs/job-list.section";
import { jobApi, skillApi } from "@/apis";
import { HeroSection } from "@/components/features/hero.section";
import CompanyListSection from "@/components/sections/jobs/company-list.section";
import JobFilterToolbar from "@/components/sections/jobs/job-filter-toolbar.section";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Job } from "@/types";

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [skills, setSkills] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, selectedSkill, selectedCompany, debouncedSearchTerm, selectedJobType]);

  async function fetchSkills() {
    try {
      const response = await skillApi.getAll(1, 20);
      setSkills(response.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  }

  async function fetchJobs(page: number) {
    try {
      setLoading(true);

      let response;
      if (selectedCompany !== null) {
        response = await jobApi.getByCompany(selectedCompany, page, pageSize);
      } else if (selectedSkill === null) {
        response = await jobApi.getAll(page, pageSize);
      } else {
        response = await jobApi.getBySkill(selectedSkill, page, pageSize);
      }

      let filteredJobs = response.data || [];
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        filteredJobs = filteredJobs.filter(
          (job: Job) =>
            job.title?.toLowerCase().includes(term) ||
            job.description?.toLowerCase().includes(term) ||
            job.company?.name?.toLowerCase().includes(term)
        );
      }

      if (selectedJobType) {
        filteredJobs = filteredJobs.filter(
          (job: Job) =>
            job.type?.toLowerCase() === selectedJobType.toLowerCase()
        );
      }

      setJobs(filteredJobs);
      const calculatedTotalPages =
        response.totalPages || Math.ceil((response.totalItems || 0) / pageSize);
      setTotalPages(calculatedTotalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải công việc");
      setJobs([]); 
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  const handleSkillChange = (skillid: number | null) => {
    setSelectedSkill(skillid);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setSelectedCompany(null);
    setCurrentPage(1);
  };

  const handleCompanyChange = (companyid: number | null) => {
    setSelectedCompany(companyid);
    setSelectedSkill(null);
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
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="bg-card w-full border-t border-border mt-[-88px] relative z-10 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        {/* Breadcrumb Section */}
        <div className="bg-muted/30 border-b border-border py-2 px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">TRANG CHỦ</Link>
            <span>/</span>
            <span className="text-foreground">TÌM KIẾM VIỆC LÀM IT</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          {/* Header & Horizontal Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground tracking-tight uppercase">
                    Khám phá sự nghiệp <span className="text-primary">mơ ước</span>
                </h1>
                <p className="text-muted-foreground font-medium max-w-xl text-sm">
                    Kết nối bạn với những công ty công nghệ hàng đầu và những vị trí IT hứa hẹn nhất hiện nay.
                </p>
            </div>
            
            <div className="flex gap-3">
                <div className="bg-muted/50 dark:bg-muted/20 px-4 py-2 rounded-xl flex flex-col items-center">
                    <span className="text-primary font-semibold text-xl">{jobs.length}+</span>
                    <span className="text-[10px] text-muted-foreground uppercase">Việc mới</span>
                </div>
            </div>
          </div>

          {/* Horizontal Toolbar */}
          <JobFilterToolbar
            skills={skills}
            selectedSkill={selectedSkill}
            onSkillChange={handleSkillChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedJobType={selectedJobType}
            onJobTypeChange={handleJobTypeChange}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Aside: Company List Filter */}
            <aside className="lg:w-72 flex-shrink-0">
                <CompanyListSection
                  selectedCompanyId={selectedCompany}
                  onCompanyChange={handleCompanyChange}
                />
            </aside>

            {/* Main Content Area: Job List */}
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
