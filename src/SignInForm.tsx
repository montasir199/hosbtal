import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useToast } from "./hooks/use-toast";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const signIn = useAction(api.auth.signIn);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "يرجى إدخال اسم المستخدم";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "يجب أن يكون اسم المستخدم 3 أحرف على الأقل";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "يرجى إدخال كلمة المرور";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ 
        provider: "username", 
        params: { username, password } 
      });
      toast({
        title: "مرحباً بك",
        description: "تم تسجيل الدخول بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى التحقق من اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            <h1 className="text-4xl font-bold mb-2">نظام إدارة العيادة</h1>
          </div>
          <p className="text-gray-600 text-lg">مرحباً بك في نظام إدارة العيادة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm backdrop-filter">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h2>
              <p className="text-gray-600">قم بتسجيل الدخول للوصول إلى النظام</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className={`input pl-10 ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="أدخل اسم المستخدم"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) {
                          setErrors({ ...errors, username: "" });
                        }
                      }}
                      disabled={isLoading}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.username}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className={`input pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: "" });
                        }
                      }}
                      disabled={isLoading}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className={`btn-primary w-full flex items-center justify-center relative ${
                    isLoading ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="opacity-0">تسجيل الدخول</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      تسجيل الدخول
                    </span>
                  )}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                    onClick={() => {
                      toast({
                        title: "قريباً",
                        description: "سيتم إضافة هذه الخاصية قريباً",
                      });
                    }}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
            <div className="text-center text-sm text-gray-600">
              <p>
                بحاجة إلى مساعدة؟{' '}
                <button 
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                  onClick={() => {
                    toast({
                      title: "المساعدة",
                      description: "يمكنك التواصل مع الدعم الفني للمساعدة",
                    });
                  }}
                >
                  تواصل معنا
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
