'use client';

// import NewsSection from '@/components/page/home/news-section';
import Hero from '@/components/page/home/hero';
import UrlForm from '@/components/page/home/url-form';
import Example from '@/components/page/home/example';
import { useState } from 'react';
export default function Home() {
  const [url, setUrl] = useState('');
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}

      <div className="mb-8">
        <UrlForm url={url} />
      </div>

      {/* News Section 
      <NewsSection />
      */}
      <Example setUrl={setUrl} />
    </main>
  );
}
