import React from "react";
import TableDisplay from "./TableDisplay";
import LoginForm from "./LoginForm";

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
        </div>
    )
}

export default Body;