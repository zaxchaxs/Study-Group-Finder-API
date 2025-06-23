export const PORT = process.env.PORT

export const JWT_SECRET_KEY = process.env.JWT_SECRET || "default-secret-key-bapak-tua-butut-antik"
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "kutanya malam dapatkah kau lihat perbedaan yang kau ada apa denganm u"

export const JWT_EXPIRED_TOkEN = process.env.JWT_ACCESS_TOKEN_EXPIRED || "7d"

export const MESSAGE_SECRET_KEY = process.env.MESSAGE_SECRET_KEY || "";
export const IV_LENGTH = Number(process.env.IV_LENGTH || 16)