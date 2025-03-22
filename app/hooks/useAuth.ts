import { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/db/client';

interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // セッションの確認
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('認証セッションの確認エラー:', error);
          setUser(null);
        } else if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name,
            avatar: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // 初期セッションチェック
    checkSession();
    
    // 認証状態変更のリスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name,
            avatar: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('ログインエラー:', error);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name,
          avatar: data.user.user_metadata?.avatar_url,
        });
        return { success: true };
      }
      
      return { success: false, error: 'ユーザー情報の取得に失敗しました' };
    } catch (error) {
      console.error('ログイン例外:', error);
      return { success: false, error: '認証処理中にエラーが発生しました' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) {
        console.error('登録エラー:', error);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // ユーザーレコードをusersテーブルに追加
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: name,
            },
          ]);
          
        if (insertError) {
          console.error('ユーザー情報の保存エラー:', insertError);
          return { success: false, error: 'ユーザー情報の保存に失敗しました' };
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'ユーザー登録に失敗しました' };
    } catch (error) {
      console.error('登録例外:', error);
      return { success: false, error: '登録処理中にエラーが発生しました' };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('ログアウトエラー:', error);
        return { success: false, error: error.message };
      }
      
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('ログアウト例外:', error);
      return { success: false, error: 'ログアウト処理中にエラーが発生しました' };
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
} 