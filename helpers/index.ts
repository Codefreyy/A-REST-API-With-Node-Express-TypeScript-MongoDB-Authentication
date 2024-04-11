import crypto from 'crypto';

const SECRET = 'joy-secret';

export const random = () => crypto.randomBytes(128).toString('base64');

// this line of code takes a 'salt' and a 'password', generates an HMAC based on the 'sha256' hash algorithm, updates this HMAC with a predefined SECRET constant, and then returns the hexadecimal representation of this HMAC.
export const authentication = (salt: string, password: string) => crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
