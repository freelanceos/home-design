import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminName, setAdminName] = useState("فريق الدعم");
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateAdminName = (newName: string) => {
    setAdminName(newName);
    localStorage.setItem('admin_nickname', newName);
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (!adminSession) {
        navigate('/admin-login');
        return;
      }

      try {
        const session = JSON.parse(adminSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
          localStorage.removeItem('admin_session');
          navigate('/admin-login');
          return;
        }

        setIsAuthenticated(true);
        // Load saved nickname or default to support team
        const savedNickname = localStorage.getItem('admin_nickname');
        setAdminName(savedNickname || "فريق الدعم");
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('admin_session');
        navigate('/admin-login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
    navigate('/admin-login');
  };

  return {
    isAuthenticated,
    isCheckingAuth,
    adminName,
    setAdminName: updateAdminName,
    handleLogout
  };
};