import { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const FIREBASE_CONFIG = {
    "type": "service_account",
    "projectId": "todolistsimone",
    "private_key_id": "a1a27427beea6a0759480742fe4ede6e4695155b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3+fAHt/Stxj5b\nzVMlVimj/vdEJiq/EXVzgMvNjVq89WPEnjYtAWNSvWYqUmYK57SrFQxxtJeBIUTg\nGqDCilKwzPCLUUODoJ5eHkggAjZKdJuXZmQC8Iuoi83oI4Kk3pe/sSIy9XnAj9Qc\n50O7fFdzCM6kBnRjpdANqBbMKAvXLGAKk6Bl/CadqroZp7c1IIp96vAoXvp16oC3\n8WqEyfeXVu93B7wDIwuiC7gEitZkzyeDFjClr5vwHV56n0/DUUm8OF8UkxuzhyOQ\n0J1r2VKeB7LJu/OzxUpEM79oDWt0sWXCIPnl41pNLFM+5QPRWuRuxQpWA2ihDBGu\nrpni8943AgMBAAECggEARi/1uVQeZi9z+dz25A8fmr+6QMcY1sUH3HVeC0DqxZ0O\nn2PGglv9swKr1+iQoodsPzqsATMm+64gEylFfIJ98pJ1EImDqtNbp8eAt6lwYe5j\nr5px/Ecd2MLhXrcxb8m19f1TcUKCXQriHtbB2eShjjLlduE5hQyst5ERhXifr8pI\nVIpV4nFZNOch+JL/5HxyJUbwHHKJzsGYSO1CF0ty5Tm8WMilGuzp22JzfYZwewsL\n9ThgHMrQ6KqXmQ9q3ofOPn3U3xnbdY6K1NbIEUWlObtbAsXJbEdayKN+U1tB90Yv\nPXrZvYq+WwoiiRDmbmExl6tpn6xCJOF9loUj0Vc8AQKBgQD6ygBg86hULV+NsM1E\nfIlm2vlFA3kHAD0KfJlnI6cQjncCOVyj3eVyzJIx7rJPciK77t/QUF+3/hIoIULM\nfIB9HDH3ucrvdBUcmCSZ927eQ6tDQTS9ugf6oLh+WJaBxoG8GmIAE7GpQfd0XRlQ\nz7qXpn6Yx3n9nY2mNb0UPYaiNwKBgQC7zIugLS0WIY1tElwgBq9JVtjbAzSS0OsI\nk8hTCHN3RkLa3zlfA4nw6BDGc/FWC/lHcq/EJWzULXnWLDzxDzin0ruWxFKsw2KF\nfZFLvHsOmWq/TcoLM5jcFOKxmojX1BQ/afksBMznv2rv0LKAS4JkZRHWfJLe1zQp\ndi6EbY6kAQKBgB16FrdOjE9wkdWenVHabW/4duoEsXoALiyIXqN/zkgk5poNUfU0\nxJ5MqzZRPwYVfT2nowjiGY4Pv+SVnDtauuN5p+ndHZwtgbm9rDeonJBlVcDu7hsK\nvZtYvrajBPW19lO8qh4mMnCZf1NfCfW0pNLkT+b3M0B6/0Y09MdnP+bbAoGAJJ8i\nqz2kCSjJ13c5F9W14OtapnrdibPL4YRQEEEZoyzEZMIbAfhCsgPPIaQCb/Etz00C\nEZHqwwWLOMSvraJ2PePOSPxH0wDW+YkfCFHc/V/VfTDCMaUCLgi0nEWyYcQtnqAf\nwwG8o4Skadect4ACEWnULKtmSKZWua8eKxziMAECgYA3IIzC5axK8tgp5fsRSUR1\nY/5ZbMwaa/T0StggxkHxIULLTQRe5lSdsO4t86/gnN2XA2Facn+wXdubQ4HMmP3u\n7xn7ArHZ8RWV6lvupdxS8E9SHJ91cdvSwsp53Ry/vMtq8c+kGgi1lwRvE9uYmeFj\nvrfjwE2ethKtaet33DuDMQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-asnzp@todolistsimone.iam.gserviceaccount.com",
    "client_id": "117066463371883539809",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-asnzp%40todolistsimone.iam.gserviceaccount.com"
}

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const App = () => {
    const [items, setItems] = useState([])
    const [value, setValue] = useState('')

    const DEFAULT_ITEM = { text: value, timestamp: new Date(), isCompleted: false, isEdit: false }

    const onAddItem = (e) => {
        setItems(items.concat(DEFAULT_ITEM))
        setValue('')
    }

    const onDeleteItem = (timestamp) => {
        const filteredItems = items.filter((i) => i.timestamp !== timestamp)
        setItems(filteredItems)
    }

    const onToggleKey = (timestamp, key) => {
        const auxItems = items.map((i) => {
            if (i.timestamp === timestamp) {
                return { ...i, [key]: !i[key] }
            }
            return i
        })
        setItems(auxItems)
    }

    const onEditItem = (e, timestamp) => {
        const auxItems = items.map((i) => {
            if (i.timestamp === timestamp) {
                return { ...i, text: e.target.value }
            }
            return i
        })
        setItems(auxItems)
    }

    const onSaveItems = {}

    const Item = ({ item: { timestamp, text, isCompleted, isEdit } }) => (
        <li className="task">
            {isEdit ? <input type='text' onChange={(e) => onEditItem(e, timestamp)} value={text} autoFocus></input> : <span>{text}</span>}
            <span style={{ color: isCompleted ? 'green' : 'red' }}>{isCompleted ? 'Done!' : 'To Do'}</span>
            <button onClick={() => onToggleKey(timestamp, 'isEdit')}>{isEdit ? 'Accept' : 'Edit'}</button>
            <button onClick={() => onDeleteItem(timestamp)}>Delete</button>
            <button onClick={() => onToggleKey(timestamp, 'isCompleted')}>{isCompleted ? 'To Do' : 'Done'}</button>
        </li>
    )

    return (
        <div id="app-container">
            <h1 id='title'>My ToDo App</h1>
            <div >
                <form name="loginBox" target="#here" method="post" className="prompt">
                    <input type='text' value={value} onChange={(e) => setValue(e.target.value)} />
                    <button disabled={value === ''} onClick={onAddItem}>add item</button>
                    <input type="submit" style={{ position: "absolute", left: '-9999px' }} />
                </form>
            </div>
            {items
                ? <ul>
                    {items.map((item) => <Item item={item} key={item.timestamp} />)}
                </ul>
                : null
            }
        </div>
    )
}


export default App