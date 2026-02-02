"use client";

import React from "react";
import { Company } from "@/types/models/company.type";
import { CompanyDetailPageProps } from "@/types/page.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  MapPin,
  Globe,
  Calendar,
  Phone,
  Mail,
  Building2,
  Users,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ company }) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover Image */}
      <div className="h-48 md:h-80 w-full relative bg-muted overflow-hidden">
        {company.coverimage ? (
          <Image
            src={company.coverimage}
            alt={`${company.name} cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative -mt-16 md:-mt-24 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 md:h-48 md:w-48 border-[6px] border-background rounded-2xl shadow-xl bg-white">
                <AvatarImage
                  src={company.avatar}
                  alt={company.name}
                  className="object-contain p-2"
                />
                <AvatarFallback className="rounded-2xl text-4xl font-bold bg-primary/10 text-primary">
                  {company.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 pb-2 space-y-2 md:space-y-4 pt-12 md:pt-0">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                    {company.name}
                  </h1>
                  <Badge variant="secondary" className="h-6">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-blue-500" />
                    Verified
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm md:text-base">
                  {company.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{company.address}</span>
                    </div>
                  )}
                  {company.foundedyear && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Since {company.foundedyear}</span>
                    </div>
                  )}
                  {company.nationality && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 shrink-0" />
                      <span>{company.nationality}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="min-w-[120px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                  Follow
                </Button>
                <Button variant="outline" className="min-w-[120px]">
                  Write Review
                </Button>
                {company.website && (
                  <Button variant="secondary" asChild>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">About Us</h2>
                </div>
              
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="prose max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                    {company.description || "No description available for this company."}
                  </div>
                </CardContent>
              </Card>
            </section>

             {/* Jobs Preview (Placeholder for now) */}
             <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                         <BriefcaseIcon className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">Open Positions</h2>
                    </div>
                    <Button variant="link" className="text-primary p-0">View all jobs</Button>
                </div>
                <div className="p-8 border border-dashed rounded-lg text-center bg-muted/30">
                    <p className="text-muted-foreground">Jobs listing feature coming soon...</p>
                </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <Card className="shadow-md border-border/50">
              <CardHeader className="bg-muted/50 border-b pb-3">
                <CardTitle className="text-base font-semibold">
                  Company Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {company.hotline && (
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground font-medium uppercase">
                        Hotline
                      </span>
                      <p className="text-sm font-medium">{company.hotline}</p>
                    </div>
                  </div>
                )}

                {company.companyemail && (
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground font-medium uppercase">
                        Email
                      </span>
                      <p className="text-sm font-medium break-all">
                        {company.companyemail}
                      </p>
                    </div>
                  </div>
                )}

                {company.membersCount !== undefined && (
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground font-medium uppercase">
                        Company Size
                      </span>
                      <p className="text-sm font-medium">
                        {company.membersCount} Employees
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  }

export default CompanyDetailPage;
