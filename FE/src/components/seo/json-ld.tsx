import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface JobSchemaOptions {
  title: string;
  description: string;
  datePosted?: string;
  validThrough?: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  employmentType?: string;
}

export function createJobPostingSchema(options: JobSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: options.title,
    description: options.description,
    datePosted: options.datePosted || new Date().toISOString(),
    validThrough: options.validThrough,
    employmentType: options.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: options.companyName,
      logo: options.companyLogo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: options.location || "Việt Nam",
        addressCountry: "VN",
      },
    },
  };
}

export interface ArticleSchemaOptions {
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
}

export function createArticleSchema(options: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    description: options.description,
    image: options.image,
    datePublished: options.datePublished || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: options.authorName || "IT Job Editor",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
