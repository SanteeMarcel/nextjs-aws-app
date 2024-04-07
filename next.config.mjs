/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`,
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
