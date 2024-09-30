import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Adjust the path as necessary
import AddTodoForm from '../components/AddTodoForm';
import TodoList from '../components/TodoList';
import { motion } from "framer-motion";

const DashboardPage = () => {
	const { todos, todoLoading, todoError, fetchTodos, addTodo, toggleComplete, deleteTodo,logout } = useAuthStore();

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	const handleLogout = () => {
		logout();
	};

	if (todoLoading) return <p>Loading...</p>;
	if (todoError) return <p>{todoError}</p>;

	return (
		<div className='p-4'>
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleLogout}
				className='py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
			>
				Logout
			</motion.button>
			<h1 className='text-2xl font-bold text-white m-7'>Todo Lists</h1>
			<AddTodoForm onAdd={addTodo} />
			<TodoList todos={todos} onToggleComplete={toggleComplete} onDelete={deleteTodo} />
		</div>
	);
};

export default DashboardPage;
