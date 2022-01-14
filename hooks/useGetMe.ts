import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GETME } from "../apis/gql-queries/user";

    
// 로그인 된 유저 정보 가져오기
    const useGetMe = () => {

        const [jwtToken, setToken] = useState<string | null>()

        const [reqGetMe, {loading, error}] = useLazyQuery(GETME, {
            context: {
                headers: {
                    "Authorization":  "Bearer " + jwtToken
                }
            }
            
        })
        
        useEffect(() => {
            setToken(localStorage.getItem("jwt_token"))
        })
        if(reqGetMe)
            return [reqGetMe, loading]
        else {
            [null, null, console.log("유저 정보 불러오기 실패", error)]
        }

    }

export default useGetMe