import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    // fix: handle node.js modules for md libs
    config.resolve.fallback = {
      ...config.resolve.fallback,
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
    };
    return config;
  },
};

export default nextConfig;
