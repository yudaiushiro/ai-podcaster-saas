/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        "fluent-ffmpeg": false,
        "@ffmpeg-installer/ffmpeg": false,
        "@ffprobe-installer/ffprobe": false,
      };
    }
    // FFmpeg関連のパッケージを除外
    config.module.rules.push({
      test: /\.md$/,
      loader: "ignore-loader",
    });
    // FFmpeg関連のパッケージを除外
    config.module.rules.push({
      test: /@ffmpeg-installer\/ffmpeg/,
      loader: "ignore-loader",
    });
    config.module.rules.push({
      test: /@ffprobe-installer\/ffprobe/,
      loader: "ignore-loader",
    });
    // TypeScriptの型定義ファイルを処理
    config.module.rules.push({
      test: /\.d\.ts$/,
      loader: "ignore-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
