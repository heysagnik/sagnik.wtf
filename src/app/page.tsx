import { Suspense } from 'react';
import HomePageContent from './HomePageContent';


// A simple loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', backgroundColor: 'black' }}>
      Loading...
    </div>
  );
}

export default function Home() {
  // All client-specific hooks (useState, useEffect, useSearchParams) have been moved to HomePageContent.tsx
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageContent />
    </Suspense>
  );
}

