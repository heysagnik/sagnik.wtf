import { Suspense } from 'react';
import HomePageContent from './HomePageContent';


// A minimal loading spinner for Suspense fallback
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          border: '2px solid #ddd',
          borderTop: '2px solid #333',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
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

