import { createContext, useState, useContext, useEffect } from 'react';
import { useEmployee } from '@/hooks/hooks'
import { Employee } from '@/misc/types'

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  profile: Employee; // เพิ่มตรงนี้
  accessProfile: (accessToken: string, refreshToken: string) => void;
  fetchUserProfile: (username: string) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = () => {
  const { getEmployeeBy } = useEmployee()
  const [$profile, setProfile] = useState<Employee>({
    employee_id: '',
    employee_username: '',
    employee_password: '',
    employee_prefix: '',
    employee_firstname: '',
    employee_lastname: '',
    employee_email: '',
    employee_phone: '',
    employee_birthday: '',
    employee_gender: '',
    employee_address: '',
    employee_img: '',
    license_id: '',
  });
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token'));

  useEffect(() => {
    if (accessToken) {
      const username = localStorage.getItem('username');
      if (username) {
        fetchUserProfile(username);
      }
    }
  }, [accessToken]);

  const fetchUserProfile = async (username: string) => {
    try {
      const { docs: res } = await getEmployeeBy({
        match: {
          employee_username: username
        }
      })
      setProfile(res[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const accessProfile = (accessToken: string, refreshToken: string, username: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('username', username);
  };

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setAccessToken(null);
    setRefreshToken(null);
  };

  const logout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  return {
    accessToken,
    refreshToken,
    accessProfile,
    logout,
    fetchUserProfile,
    $profile,
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken
  };
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
