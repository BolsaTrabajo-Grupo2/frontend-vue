import axios from 'axios'

let tokenEntero = '';
const userString = localStorage.getItem('user');

if (userString) {
  const user = JSON.parse(userString);
  tokenEntero = user.token;
}
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