import React from "react";
import TableDisplay from "./TableDisplay";
import LoginForm from "./LoginForm";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

function Body(){
    return(
        <div>
            <TableDisplay collection_name={"user"}/>
            <TableDisplay collection_name={"posts"}/>
            <TableDisplay collection_name={"shares"}/>
            <TableDisplay collection_name={"comments"}/>
            <TableDisplay collection_name={"userProfile"}/>
            <br/>
            <br/>
            <LoginForm />
            <LoginPage />
            <RegisterPage />
        </div>
    )
}

export default Body;