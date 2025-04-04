module.exports = {
  apps: [{
    name: 'buildconnect',
    script: 'server.js',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      JWT_SECRET: process.env.JWT_SECRET,
      CSRF_SECRET: process.env.CSRF_SECRET,
      DATABASE_URL: process.env.DATABASE_URL
    }
  }]
};