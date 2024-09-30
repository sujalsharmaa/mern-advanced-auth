import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggleComplete, onDelete }) => {
    if (todos.length === 0) return <p>No tasks available</p>;
    console.log(todos)
    return (
        <div className='m-4'>
            {todos.map((todo) => (
                <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TodoList;
