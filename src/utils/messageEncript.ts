import crypto from "crypto";
import { IV_LENGTH, MESSAGE_SECRET_KEY } from "../data/envData";

export function encryptText(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH as number);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(MESSAGE_SECRET_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function decryptText(encryptedText: string) {
  const [ivHex, content] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(MESSAGE_SECRET_KEY, "hex"), iv);
  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
