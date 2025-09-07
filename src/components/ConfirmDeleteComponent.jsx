"use client"

import { useState } from 'react';
import { Trash } from 'react-feather';
import Modal from 'react-modal';

export default function ConfirmDeleteComponent({onDeleteConfirmed, color, message}) {

    const customStyles = {
        content: {
            top: 'calc(50% - 100px)',
            left: '25%',
            width: '50%',
            height: '200px',
            backgroundColor: 'lightgray',
            border: '1px solid black'
        }
    };
            
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = useState(false);
    return <>
        <Trash color={color} onClick={()=>setIsOpen(true)} />
        <Modal style={customStyles} isOpen={modalIsOpen} contentLabel="Really delete?">
        <h3>Confirm Deletion</h3>
        <p>{message || "Really delete?"}</p>
        <button onClick={() => {
            setIsOpen(false);
            onDeleteConfirmed();
        }}>Yes</button>
        <button onClick={()=>setIsOpen(false)}>No</button>
        </Modal>
        </>;
}
