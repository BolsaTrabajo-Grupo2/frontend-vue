import axios from 'axios'

const token = JSON.parse(localStorage.getItem('user'));

console.log(token)
const apiClient = axios.create({
    baseURL: 'http://localhost/api',
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