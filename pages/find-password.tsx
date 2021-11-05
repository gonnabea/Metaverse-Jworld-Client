import { NextPage } from "next";
import { useEffect } from "react";

const FindPassword:NextPage = () => {

    useEffect(() => {
        console.log("컴포넌트 마운트")
    }, [])

    return(
        <div>
            <h1>비밀번호 찾기</h1>
        </div>
    )
}

export default FindPassword;