import React from "react";
function ProfileButton({buttonText}){
    return(
        <button className="text-white text-[10px] bg-black px-4 py-2 rounded">
                {buttonText}
              </button>
    )
}

export default ProfileButton;