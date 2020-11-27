export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  },
  jwtConstants: {
    jwtSecret: process.env.JWT_SECRET || 'test',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '3000'
  }
});
