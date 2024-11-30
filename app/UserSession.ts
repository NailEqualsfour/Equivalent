import * as SecureStore from 'expo-secure-store';

function UserSession() {

    function setUserId(id: string) {
        SecureStore.setItem('userId', id)
    }
    function getUserId() {
        return SecureStore.getItem('userId')

    }
    return {
        setUserId,
        getUserId
    }
  
  }
  
  export default UserSession;