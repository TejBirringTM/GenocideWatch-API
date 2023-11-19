import { initializeApp, Credential } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import configs from '../configs';
import { credential } from 'firebase-admin';

const prvKey = configs.firebase.privateKey;
const app = initializeApp({
    credential: credential.cert(prvKey)
});
const auth = getAuth(app);

export default auth;
