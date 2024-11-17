
export const baseUrl = "http://localhost:9999/"


export const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json',
  }
}