/*import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 w-96 rounded-xl shadow-lg">
        <LoginForm />
        
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SigninPage";

function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">

        {showLogin ? (
          <LoginForm onSwitch={() => setShowLogin(false)} />
        ) : (
          <SignupForm onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    
  );
}

export default LoginPage;*/

/*import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SigninPage";

function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
        <div className="flex justify-center mb-6">
          
            <img src="/image/2.jpg" alt="Logo" className="h-40 w-40 mx-auto" />
            
        </div>
        {showLogin ? (
          <LoginForm onSwitch={() => setShowLogin(false)} />
        ) : (
          <SignupForm onSwitch={() => setShowLogin(true)} />
        )}
      </div>

    </div>
  );
}

export default LoginPage;*/

import LoginForm from "../../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <LoginForm />
    </div>
  );
  
}
export default LoginPage;


