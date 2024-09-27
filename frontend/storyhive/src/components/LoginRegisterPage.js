import { useState } from "react";
import React from "react";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

function LoginRegisterPage(){
    const [login, setLogin] = useState(true);

    const handleClick = () => {
        setLogin(!login);
    }
    
    return(
        <div>
            {login ? <LoginPage onSwitchLoginClick={() => handleClick()} /> : <RegisterPage onSwitchLoginClick = {() => handleClick()} />}
        </div>
    )
}

export default LoginRegisterPage;