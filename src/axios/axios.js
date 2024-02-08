import axios from 'axios'

const token = localStorage.getItem('usuario');

console.log(token)
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: false,
    headers: {
        Authorization: token,
    }
});

export default class APIService {
    constructor() {
    }
    modStudent(student) {
        return apiClient.put('/user/student/update/' + student.id, student)
    }
}