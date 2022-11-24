import { useState } from 'react'

const App = () => {
    const [items, setItems] = useState([])
    const [value, setValue] = useState('')

    const onAddItem = (e) => {
        setItems(items.concat({ text: value, id: new Date(), isCompleted: false }))
        setValue('')
    }

    const onDeleteItem = (id) => {
        const filteredItems = items.filter((i) => i.id !== id)
        setItems(filteredItems)
    }

    const onToggleKey = (id, key) => {
        const auxItems = items.map((i) => {
            if (i.id === id) {
                return { ...i, [key]: !i[key] }
            }
            return i
        })
        setItems(auxItems)
    }

    const onEditItem = (e, id) => {
        const auxItems = items.map((i) => {
            if (i.id === id) {
                return { ...i, text: e.target.value }
            }
            return i
        })
        setItems(auxItems)
    }

    const Item = ({ item: { id, text, isCompleted, isEdit } }) => (
        <li className="task">
            {isEdit ? <input type='text' onChange={(e) => onEditItem(e, id)} value={text} autoFocus></input> : <span>{text}</span>}
            <span style={{ color: isCompleted ? 'green' : 'red' }}>{isCompleted ? 'Done!' : 'To Do'}</span>
            <button onClick={() => onToggleKey(id, 'isEdit')}>{isEdit ? 'Accept' : 'Edit'}</button>
            <button onClick={() => onDeleteItem(id)}>Delete</button>
            <button onClick={() => onToggleKey(id, 'isCompleted')}>{isCompleted ? 'To Do' : 'Done'}</button>
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
                    {items.map((item) => <Item item={item} key={item.id} />)}
                </ul>
                : null
            }
        </div>
    )
}


export default App