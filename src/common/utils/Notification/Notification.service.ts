import {
  initializeApp,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";

import { getMessaging } from "firebase-admin/messaging";

class NotificationService {
  private _client: App;

  constructor() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing Firebase environment variables"
      );
    }

    const serviceAccount: ServiceAccount = {
      projectId,
      clientEmail,
privateKey: privateKey.replace(/\\n/g, "\n"),
    };

    this._client = initializeApp({
      credential: cert(serviceAccount),
    });
  }

  async sendNotification(
    token: string,
    title: string,
    body: string
  ) {
    const res = await getMessaging(this._client).send({
      token,
      notification: {
        title,
        body,
      },
    });

    console.log(res);
  }

  async sendNotifications({
    tokens,
    notification,
  }: {
    tokens: string[];
    notification: {
      title: string;
      body: string;
    };
  }) {
    const res = await getMessaging(this._client).sendEachForMulticast({
      tokens,
      notification,
    });

    console.log(res);
  }
}

export default new NotificationService();