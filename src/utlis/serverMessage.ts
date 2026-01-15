//Ham dung de lay message tu server 
const successMessage = (res: any) => {
    return res?.data?.message || res?.message || "Operation successful";
  };
  
const errorMessage = (e : any) => {
    const serverMessage =
    e?.response?.data?.message ||  // server trả về { message: '...' }
    e?.response?.data?.error ||    // server trả về { error: '...' }
    e?.message || "Something went wrong"
    return serverMessage
}
export {successMessage , errorMessage}