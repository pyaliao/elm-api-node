module.exports = {
  apps: [
    {
      name: 'elm-api',
      script: 'index.js',
      watch: '.',
      env: {
        NODE_ENV: 'development',
        PORT: '3000'
      },
      env_production: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: '8001'
      }
    }
  ],
  deploy: {
    production: {
      user: 'root',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
