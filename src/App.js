import React, { useState, useEffect } from 'react';
import Alert from './Alert'
import List from './List';

const getLocalStorage = () => {
    let list = localStorage.getItem('list');
    if (list) {
        return JSON.parse(localStorage.getItem('list'))
    } else {
        return []
    }
}

export const App = () => {
    const [name, setName] = useState('');
    const [list, setList] = useState(getLocalStorage());
    const [editing, setEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', msg: '' });
    const handleOnSubmit = (e) => {
        e.preventDefault();
        // console.log('hello');
        if (!name) {
            // setting empty-input alert
            showAlert(true, 'danger', 'please enter value')
        } else if (name && editing) {
            // dealing with edit
            setList(list.map((item) => {
                if (item.id === editID) {
                    return { ...item, title: name }
                }
                return item
            }));
            setName('')
            setEditID(null);
            setEditing(false);
            showAlert(true, 'success', 'value changed');
        } else {
            //  setting item-added alert
            showAlert(true, 'success', 'item added to the list')
            // Add functionality
            const newItem = { id: new Date().getTime().toString(), title: name };
            setList([...list, newItem])
            setName('');
        }
    }
    // Alert
    const showAlert = (show = false, type = '', msg = '') => {
        setAlert({ show, type, msg })
    }

    //  clear list functionality 
    const clearList = () => {
        showAlert(true, 'danger', 'empty list')
        setList([])
    }

    // remove item functionality
    const removeItem = (id) => {
        showAlert(true, 'danger', 'item removed')
        setList(list.filter((item) => item.id !== id))
    }

    // edit item functionality 
    const editItem = (id) => {
        const specificItem = list.find((item) => item.id === id)
        setEditing(true)
        setEditID(id)
        setName(specificItem.title)
    }

    // storing in local storage
    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(list))
    }, [list])

    return (
        <section className="section-center">
            <form onSubmit={handleOnSubmit} className='grocery-form'>
                {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
                <h3>grocery bud</h3>
                <div className="form-control">
                    <input type="text" value={name}
                        onChange={e => setName(e.target.value)} className="grocery" />
                    <button className="submit-btn" type='submit'>
                        {editing ? 'edit' : 'submit'}
                    </button>
                </div>
                <div className="grocery-container">
                    <List items={list} removeItem={removeItem} editItem={editItem} />
                </div>
            </form>
            <button className="clear-btn" onClick={clearList}>
                clear items
            </button>
        </section>
    )
}

export default App;