module.exports = {
  apps: [{
    name: 'dressme-backend',
    script: './dist/index.js',
    cwd: './backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Restart delay
    restart_delay: 4000,
    // Max restarts in 1 min
    max_restarts: 10,
    min_uptime: '10s'
  }]
};

