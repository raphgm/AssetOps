import QRCode from "qrcode";
import { db } from "../db";

export const scanPath = (token: string) => `/scan/${token}`;
export async function qrSvg(origin: string, token: string) {
  return QRCode.toString(`${origin}${scanPath(token)}`, { type: "svg", margin: 1, color: { dark: "#0a0b0d", light: "#ffffff" } });
}
/** Resolves a QR token to an asset (any org: caller must then verify tenant). */
export const assetByToken = (token: string) => db.asset.findUnique({ where: { qrToken: token }, include: { department: true, location: true, type: true } });
