"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
class NotificationService {
    _client;
    constructor() {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (!projectId || !clientEmail || !privateKey) {
            throw new Error("Missing Firebase environment variables");
        }
        const serviceAccount = {
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
        };
        this._client = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(serviceAccount),
        });
    }
    async sendNotification(token, title, body) {
        const res = await (0, messaging_1.getMessaging)(this._client).send({
            token,
            notification: {
                title,
                body,
            },
        });
        console.log(res);
    }
    async sendNotifications({ tokens, notification, }) {
        const res = await (0, messaging_1.getMessaging)(this._client).sendEachForMulticast({
            tokens,
            notification,
        });
        console.log(res);
    }
}
exports.default = new NotificationService();
