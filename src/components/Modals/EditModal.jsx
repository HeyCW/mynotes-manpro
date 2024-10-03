import { ImCross } from "react-icons/im";
import BlueButton from "../BlueButton";
import { useState } from "react";

const EditModal = ({ note, onClose, onEdit }) => {
    const [editName, setEditName] = useState(note.name);
    const handleEdit = async () => {
        await onEdit(note, editName);
        onClose();
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-50 flex justify-center items-center">
            <div className="bg-white w-1/3 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-xl font-bold">Edit Note</h1>
                    <ImCross onClick={onClose}/>
                </div>
                <div className="w-full">
                    <input type="text" value={editName} onChange={(event)=>setEditName(event.target.value)} className="border border-gray-300 rounded p-2 w-full" />
                    <div className="w-full flex justify-center mt-10">
                        <BlueButton width={'w-full'} handleClick={handleEdit}>Edit</BlueButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
