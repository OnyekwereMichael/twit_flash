/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow images from Cloudinary
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",  // Matches any request starting with /api/
        destination: "https://twit-flash-backend-1.onrender.com/api/:path*", // Forwards to backend
        // http://localhost:5000
      },
    ];
  },
};

export default nextConfig;
