import { useState } from 'react';


const AddTodoForm = ({ onAdd }) => {
    const [task, setTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
      
        if (task.trim()) {
            onAdd(task);
            setTask('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex gap-2'>
            <input
                type='text'
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder='Add a new task'
                className='p-2 border rounded'
            />
            <button type='submit' className='p-2 bg-green-600 text-white rounded'>
                Add
            </button>
        </form>
    );
};

export default AddTodoForm;
