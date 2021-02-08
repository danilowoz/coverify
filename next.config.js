module.exports = {
  env: {
    GOOGLE_FIREBASE_CLIENT: process.env.GOOGLE_FIREBASE_CLIENT,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            replaceAttrValues: { '#000': 'currentColor' },
          },
        },
        'url-loader',
      ],
    })

    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif)$/i,
      use: 'url-loader',
    })

    return config
  },
}
