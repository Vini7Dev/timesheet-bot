module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@configs': ['./src/configs'],
          '@jobs': ['./src/jobs'],
          '@modules': ['./src/modules'],
          '@shared': ['./src/shared'],
          '@utils': ['./src/utils'],
        },
        extensions: ['.js', '.ts'],
      }
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
}
