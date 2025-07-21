const config = {
  mongodb: {
    url: 'mongodb://localhost/avt-news',
    databaseName: 'avt-news',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
