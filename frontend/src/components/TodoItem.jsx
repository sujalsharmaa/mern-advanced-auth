const TodoItem = ({ todo, onToggleComplete, onDelete }) => {
    return (
        <div className='flex items-center justify-between p-2 border-b'>
            <div className='flex items-center'>
                <input
                    type='checkbox'
                    checked={todo.isCompleted}
                    onChange={() => onToggleComplete(todo._id)}
                />
                <span className={todo.isCompleted ? 'line-through ml-2 text-white' : 'ml-2 text-white'}>
                    {todo.title}
                </span>
            </div>
            <button onClick={() => onDelete(todo._id)} className='font-bold text-red-600'>
                Delete
            </button>
        </div>
    );
};

export default TodoItem;
