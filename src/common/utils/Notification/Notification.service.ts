
import { readFileSync } from 'fs';
import path from 'path';
import { initializeApp, cert, App } from "firebase-admin/app";
import { getMessaging } from 'firebase-admin/messaging';
class NotificationService{

private _serviceAccount = JSON.parse(readFileSync(path.resolve("./socialmedia-a7578-firebase-adminsdk-fbsvc-0727dfe211.json"))as unknown as string );

private _client: App;
constructor(){
  this._client = initializeApp({
    credential: cert(this._serviceAccount)
});


}


async sendNotification(token: string,title: string,body: string) {
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
export default new NotificationService()