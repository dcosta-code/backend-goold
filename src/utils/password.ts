import argon2 from "argon2";
import crypto from "crypto";

export const passwordUtils = {
  async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    return argon2.hash(password, {
      type: argon2.argon2id,
      salt,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  },

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  },
};
