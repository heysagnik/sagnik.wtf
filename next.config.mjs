/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'picsum.photos',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'cdn.dribbble.com',
      port: '',
      pathname: '/**',
    },
  {
    protocol: 'https',
    hostname: 'cdn.sanity.io',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'framerusercontent.com',
    port: '',
    pathname: '/**',
  }
],
  },
};

export default nextConfig;