import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { collection, getDocs, addDoc, getFirestore, deleteDoc, doc } from "firebase/firestore";

import { FIRESTORE_CONFIG } from '../config/firestore.config'


import { Button, TextField, Typography, Stack, IconButton, Grid } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Save from '@mui/icons-material/Save';
import TaskAlt from '@mui/icons-material/TaskAlt';
import Done from '@mui/icons-material/Done';
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline';

// Initialize Firebase
const app = initializeApp(FIRESTORE_CONFIG);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const App = () => {
    const [items, setItems] = useState([])
    const [value, setValue] = useState('')

    const DEFAULT_ITEM = {
        text: value,
        timestamp: new Date(),
        isCompleted: false,
        isEdit: false
    }

    const getItemsFromDB = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "list_items"));
            const data = querySnapshot._snapshot.docChanges
            const parsedData = data.map((d) => ({
                isCompleted: d.doc.data.value.mapValue.fields.isCompleted.booleanValue,
                isEdit: d.doc.data.value.mapValue.fields.isEdit.booleanValue,
                text: d.doc.data.value.mapValue.fields.text.stringValue,
                timestamp: d.doc.data.value.mapValue.fields.timestamp.timestampValue,
                id: d.doc.key.path.segments[6]
            }))
            return parsedData
        } catch (e) { console.warn(e) }
    }

    const pushItemToDB = async (item) => {
        try {
            const docRef = await addDoc(collection(db, "list_items"), item);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    useEffect(() => {
        getItemsFromDB().then(parsedData => setItems(parsedData))
    }, [])

    const onAddItem = (e) => {
        setItems(items.concat(DEFAULT_ITEM))
        setValue('')
    }

    const onDeleteItem = async (timestamp, id) => {
        try {
            if (!!id) await deleteDoc(doc(db, "list_items", id))
            const filteredItems = items.filter((i) => i.timestamp !== timestamp)

            setItems(filteredItems)
        }
        catch (e) {
            alert("An error ocurred deleting the item: ", e)
            console.warn(e)
        }
    }

    const updateItem = () => {
        console.log('to update')
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

    const Item = ({ item: { timestamp, text, isCompleted, isEdit, id } }) => (
        <li className="task">
            <Grid container
                spacing={2}
                wrap="nowrap"
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-end">
                <Grid item md={10} xs={12} zeroMinWidth>
                    {isEdit
                        ? <TextField noWrap variant="standard" size="small" type='text' onChange={(e) => onEditItem(e, timestamp)} value={text} autoFocus />
                        : <Typography noWrap style={{ textDecoration: `${isCompleted ? 'line-through' : 'none'}` }} onClick={() => onToggleKey(timestamp, 'isEdit')}>
                            {text}
                        </Typography >}
                    <Typography style={{
                        color: isCompleted ? 'green' : 'red', textAlign: 'center'
                    }}>{isCompleted ? <TaskAlt /> : 'To Do'}</Typography >
                </Grid>
                <Grid item md={2} xs={12} zeroMinWidth>
                    <IconButton
                        disabled={isEdit}
                        tilte={isCompleted ? 'mark as to do' : 'mark is done'}
                        size="small"
                        variant="contained"
                        onClick={() => onToggleKey(timestamp, 'isCompleted')}>
                        {isCompleted ? <PauseCircleOutline /> : <Done />}
                    </IconButton>
                    <IconButton
                        title='Edit'
                        size="small"
                        onClick={() => onToggleKey(timestamp, 'isEdit')}>
                        {isEdit ? <Done /> : <Edit />}
                    </IconButton>
                    <IconButton
                        disabled={isEdit}
                        title='delete'
                        size="small"
                        variant="contained"
                        onClick={() => onDeleteItem(timestamp, id)}>
                        <Delete />
                    </IconButton>
                    <IconButton
                        disabled={isEdit}
                        title='save changes'
                        size="small"
                        variant="contained"
                        onClick={() => {
                            !!id
                                ? updateItem({ timestamp, text, isCompleted, isEdit, id })
                                : pushItemToDB({ timestamp, text, isCompleted, isEdit })
                        }}>{<Save />}
                    </IconButton>
                </Grid>
            </Grid>

        </li >
    )

    return (
        <div id="app-container">
            <Typography variant='h4' id='title' style={{ margin: '10px 0 30px', color: '#1976d2' }}>Today I will do:</Typography >
            <div style={{ margin: '10px 0 30px' }}>
                <form name="loginBox" target="#here" method="post" className="prompt">
                    <TextField placeholder="Today I want to..." size="small" type='text' value={value} onChange={(e) => setValue(e.target.value)} />
                    <Button variant="contained" disabled={value === ''} onClick={onAddItem}>add task</Button>
                    <input type="submit" style={{ position: "absolute", left: '-9999px' }} />
                </form>
            </div>
            {items
                ? <>
                    <ul>
                        {items.map((item) => <Item item={item} key={item.timestamp} />)}
                    </ul>
                    {/*    <Button onClick={() => setItemsToDB()}>Save</Button> */}
                </>
                : null
            }
        </div>
    )
}

export default App

// Bugs -> on edit value
// Hide firebase config
// tooltips
// mobile
// estilo
