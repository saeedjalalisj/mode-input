import { HttpException } from '@nestjs/common';

const SendError = (msg, code) => {
  throw new HttpException(msg, code);
};

export { SendError };
