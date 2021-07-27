import http from './http-common';
import ITaskData from '../types/task';

class TasksDataService {
    async getAll() {
        const { data } = await http.get("/tasks");
        return data;
    }

    async get(id: string) {
        const { data } = await http.get(`/tasks/${id}`);
        return data;
    }

    async create(task: ITaskData) {
        const { data } = await http.post("/tasks", task);
        return data;
    }

    async update(task: ITaskData, id: any) {
        const { data } = await http.put(`/tasks/${id}`, task);
        return data;
    }

    async delete(id: any) {
        const { data } = await http.delete(`/tasks/${id}`);
        return data;
    }
}

export default new TasksDataService();
