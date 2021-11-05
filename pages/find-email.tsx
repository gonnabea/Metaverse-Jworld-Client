import { NextPage } from "next";
import { useEffect } from "react";

const FindEmail:NextPage = () => {

    useEffect(() => {
        console.log("컴포넌트 마운트")
    }, [])

    return(
        <div>
            <h1>아이디 찾기</h1>
        </div>
    )
}

export default FindEmail;