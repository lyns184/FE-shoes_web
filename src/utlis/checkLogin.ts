//Ham dung de kiem tra nguoi dung da dang nhap chua 
import Token from './Token'
const checkLogin = () => {
    const token = Token.getAccessToken()
    if (token) return true 
    return false 
} 
export default checkLogin