/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow images from Cloudinary
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",  // Matches any request starting with /api/
        destination: "http://localhost:5000/api/:path*", // Forwards to backend
        // http://localhost:5000
      },
    ];
  },
};

export default nextConfig;
