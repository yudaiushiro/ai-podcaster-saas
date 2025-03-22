import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際のアプリでは、Supabaseなどから認証状態を取得
    // MVPではモックデータで表示
    const checkAuth = () => {
      // モックユーザー
      const mockUser: User = {
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
      };

      // ログイン状態をシミュレート
      const isLoggedIn = localStorage.getItem('mock_auth') === 'true';

      if (isLoggedIn) {
        setUser(mockUser);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // 実際のアプリでは、Supabaseなどで認証
    // MVPではモックデータでデモ
    try {
      // モックの認証チェック
      if (email && password) {
        localStorage.setItem('mock_auth', 'true');
        
        // モックユーザー
        const mockUser: User = {
          id: '1',
          name: 'テストユーザー',
          email,
        };

        setUser(mockUser);
        return { success: true };
      }
      return { success: false, error: '認証に失敗しました' };
    } catch (error) {
      return { success: false, error: '認証に失敗しました' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // 実際のアプリでは、Supabaseなどで登録
    // MVPではモックデータでデモ
    try {
      // モックの登録処理
      if (name && email && password) {
        localStorage.setItem('mock_auth', 'true');
        
        // モックユーザー
        const mockUser: User = {
          id: '1',
          name,
          email,
        };

        setUser(mockUser);
        return { success: true };
      }
      return { success: false, error: '登録に失敗しました' };
    } catch (error) {
      return { success: false, error: '登録に失敗しました' };
    }
  };

  const logout = async () => {
    // 実際のアプリでは、Supabaseなどでログアウト
    // MVPではモックデータでデモ
    localStorage.removeItem('mock_auth');
    setUser(null);
    return { success: true };
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
} 