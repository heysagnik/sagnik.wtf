import { Suspense } from 'react';
import HomePageContent from './HomePageContent';

const SPINNER_STYLES = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid #ddd',
    borderTop: '2px solid #333',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
} as const;

const KEYFRAMES = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function LoadingFallback() {
  return (
    <div style={SPINNER_STYLES.container}>
      <div style={SPINNER_STYLES.spinner} />
      <style>{KEYFRAMES}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageContent />
    </Suspense>
  );
}