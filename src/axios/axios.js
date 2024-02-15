import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API


export default class APIService {
    constructor(token) {
        this.apiClient = axios.create({
            baseURL: SERVER,
            withCredentials: false,
            headers: {
                Authorization: 'Bearer ' + token,
            }
        });
    }
    modStudent(student) {
        return this.apiClient.put('/user/student/update/' + student.id, student)
    }

    getOffers() {
        return this.apiClient.get('/offers')
    }
    getOffersPage(page) {
        return this.apiClient.get('/offers?page='+page)
    }
    modCompany(company) {
        return this.apiClient.put('/user/company/update/' + company.id, company)

    }
    addOffert(offert) {
        return this.apiClient.post('/offers', offert)
    }

    showOffer(id){
        return this.apiClient.get('/offers/' + id)
    }
    
    getCompany(cif){
        return this.apiClient.get('/companyCIF/'+ cif)
    }
    singup(idOffer){
        return this.apiClient.post('/apply',idOffer)
    }
    getStudent(email){
        return this.apiClient.get('/studentEmail/' + email)
    }
    getCompanyEmail(email){
        return this.apiClient.get('/companyEmail/'+ email)
    }
}