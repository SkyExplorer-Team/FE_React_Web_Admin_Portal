import domainApi from '../config/domainApi';


const isTokenValid = async (token :string) => {
  
    try {
      const response = await fetch(`${domainApi}/api/v1/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // const data = await response.json();
        // localStorage.setItem('name', data.name);
        // localStorage.setItem('role', data.role);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  };
  
  export default isTokenValid;