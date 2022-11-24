import * as ReactDOMClient from 'react-dom/client';
import App from './App'
import { initializeApp } from "firebase/app";

const app = initializeApp({
    apiKey: "AIzaSyDwET9DroVo0qggKtCr7g714khgyaet6Z4",
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
});

import './styles.css'

const container = document.getElementById('root')
const root = ReactDOMClient.createRoot(container)
root.render(<App />)