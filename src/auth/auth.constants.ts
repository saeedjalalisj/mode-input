import configuration from '../config/configuration';

const config = configuration();

export const jwtConstants = {
  secret: config.jwtConstants.jwtSecret,
  expiresIn: config.jwtConstants.jwtExpiresIn,
};
