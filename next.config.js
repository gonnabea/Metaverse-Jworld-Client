

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false

}

module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
}


module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
