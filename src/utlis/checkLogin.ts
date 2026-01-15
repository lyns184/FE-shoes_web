//Ham dung de kiem tra nguoi dung da dang nhap chua 
import Cookies from "js-cookie"
const checkLogin = () => {
    if (Cookies.get('accessToken')) return true 
    return false 
} 
export default checkLogin