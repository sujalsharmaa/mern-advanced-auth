import { create } from "zustand";
import axios from "axios";

const API_GATEWAY_URL =  "https://localhost:5003" || import.meta.env.VITE_API_GATEWAY_URL 
const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL || "/api/auth";
const API_TODOS_URL = import.meta.env.VITE_API_TODOS_URL || "/api/todos";

const API_URL = "https://auth-service:5000/api/auth" ||`${API_GATEWAY_URL}${API_AUTH_URL}`;
const TODO_API_URL = "https://todos-service:5001/todos/"||`${API_GATEWAY_URL}${API_TODOS_URL}`;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	// Authentication state and actions
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	token: null,

	// Todos state
	todos: [],
	todoError: null,
	todoLoading: false,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_AUTH_URL}/api/auth/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_AUTH_URL}/api/auth/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				token: response.data.token, // Assuming token comes from the response
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_AUTH_URL}/api/auth/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	// Todos Actions
	fetchTodos: async () => {
		set({ todoLoading: true, todoError: null });
		try {
			const response = await axios.get(`${API_TODOS_URL}/todos/`);
			set({ todos: response.data, todoLoading: false });
		} catch (error) {
			set({ todoError: "Failed to load todos", todoLoading: false });
		}
	},

	addTodo: async (task) => {
		set({ todoLoading: true, todoError: null });
		try {
			const response = await axios.post(`${API_TODOS_URL}/todos/`, { title: task });
			console.log("todo response=>",response.data.newTodo)
			set((state) => ({ todos: [...state.todos, response.data.newTodo], todoLoading: false }));
		} catch (error) {
			set({ todoError: "Failed to add todo", todoLoading: false });
			throw error;
		}
	},

	toggleComplete: async (id) => {
		set({ todoLoading: true, todoError: null });
		try {
			await axios.put(`${API_TODOS_URL}/todos/${id}`);
			set((state) => ({
				todos: state.todos.map((todo) =>
					todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
				),
				todoLoading: false,
			}));
		} catch (error) {
			set({ todoError: "Failed to toggle todo", todoLoading: false });
			throw error;
		}
	},

	deleteTodo: async (id) => {
		set({ todoLoading: true, todoError: null });
		try {
			await axios.delete(`${API_TODOS_URL}/todos/${id}`);
			set((state) => ({
				todos: state.todos.filter((todo) => todo._id !== id),
				todoLoading: false,
			}));
		} catch (error) {
			set({ todoError: "Failed to delete todo", todoLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_AUTH_URL}/api/auth/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_AUTH_URL}/api/auth/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_AUTH_URL}/api/auth/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
