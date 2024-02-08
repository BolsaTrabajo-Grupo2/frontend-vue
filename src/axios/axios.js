import axios from 'axios'

const tokenEntero = JSON.parse(localStorage.getItem('user')).token;
const token = tokenEntero.split('|')[1]

console.log(token)
const apiClient = axios.create({
    baseURL: 'http://localhost/api',
    withCredentials: false,
    headers: {
        Authorization: 'Bearer ' + token,
    }
});

export default class APIService {
    constructor() {
    }
    modStudent(student) {
        console.log(student)
        return apiClient.put('/user/student/update/' + student.id, student)
    }
}