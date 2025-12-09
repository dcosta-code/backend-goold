import { Resend } from "resend";
import { env } from "./env";

const apiKey = env.resend.apiKey;
export const resend = new Resend(apiKey);
