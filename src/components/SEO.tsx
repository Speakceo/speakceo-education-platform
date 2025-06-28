import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  courseData?: {
    name: string;
    provider: string;
    description: string;
    duration: string;
    price?: string;
  };
}

const defaultSEO = {
  title: 'SpeakCEO - Entrepreneurship Education for Young Minds',
  description: 'Transform your child into a future business leader with SpeakCEO\'s comprehensive 90-Day Young CEO Program. Interactive courses, live mentoring, and hands-on projects designed for ages 8-16.',
  keywords: [
    'young CEO program',
    'entrepreneurship for kids',
    'business education for children',
    'youth leadership training',
    'startup education for kids',
    'business courses for youth',
    'entrepreneurial skills for children',
    'kids business program',
    'online entrepreneurship course',
    'child business education'
  ],
  image: 'https://speakceo.ai/og-image.jpg',
  url: 'https://speakceo.ai',
  type: 'website' as const,
  author: 'SpeakCEO Team'
};

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = defaultSEO.type,
  author = defaultSEO.author,
  publishedTime,
  modifiedTime,
  courseData
}: SEOProps) {
  const siteTitle = `${title} | SpeakCEO`;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'SpeakCEO',
    description: defaultSEO.description,
    url: defaultSEO.url,
    logo: 'https://speakceo.ai/logo.png',
    sameAs: [
      'https://twitter.com/speakceo',
      'https://facebook.com/speakceo',
      'https://linkedin.com/company/speakceo',
      'https://instagram.com/speakceo'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SpeakCEO',
    url: defaultSEO.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultSEO.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const courseSchema = courseData ? {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseData.name,
    description: courseData.description,
    provider: {
      '@type': 'Organization',
      name: courseData.provider,
      sameAs: defaultSEO.url
    },
    timeRequired: courseData.duration,
    offers: courseData.price ? {
      '@type': 'Offer',
      price: courseData.price,
      priceCurrency: 'INR'
    } : undefined
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="language" content="en" />
      <meta name="theme-color" content="#4F46E5" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SpeakCEO" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@speakceo" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@speakceo" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {courseSchema && (
        <script type="application/ld+json">
          {JSON.stringify(courseSchema)}
        </script>
      )}
    </Helmet>
  );
} 