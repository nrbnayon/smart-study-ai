/**
 * PM2 Ecosystem Configuration for Frontend (Next.js)
 * 
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 monit  # View real-time monitoring
 *   pm2 logs   # View logs
 */

module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      node_args: '--max-old-space-size=512',
      instances: 1,
      exec_mode: 'fork', // ✅ IMPORTANT: Do NOT use cluster for Next.js
      
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },

      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', '.next', '.git'],
      
      max_memory_restart: '1G', // Restart if exceeds 1GB
      max_cpu_usage: 85,
      
      kill_timeout: 8000,
      merge_logs: true,
      output: 'logs/frontend-out.log',
      error: 'logs/frontend-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      max_restarts: 10,
      min_uptime: 60000,
    }
  ],

  // Global settings
  deploy: {
    production: {
      user: 'root',
      host: 'bassport.tech',
      ref: 'origin/main',
      repo: 'https://github.com/nrbnayon/bass_port_pro_web.git',
      path: '/var/www/bass_port_pro_web',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying frontend to production"'
    }
  }
};
