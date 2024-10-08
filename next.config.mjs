/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const nextImageLoader = config.module.rules.find(
      ({ loader }) => loader === "next-image-loader"
    );

    config.module.rules.push({
      test: /wwe-portal.*\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i,
      type: "asset",
    });

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    if (nextImageLoader) nextImageLoader.exclude = /wwe-portal/i;

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
