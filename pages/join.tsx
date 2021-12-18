import { NextPage } from "next"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import PageTitle from "../components/PageTItle"
import SiteMark from "../components/SiteMark"
import { gql, useMutation, useQuery } from "@apollo/client";
import { validateEmail, validatePw } from "../config/regexChecks"


const JOIN = gql`
mutation {
  sayHello
}
`

const Join: NextPage = () => {

    const [inputs, setInputs] = useState({
      email: '',
      password: '',
      password2: '',
    });

    const joinSubmitBtn = useRef();


    useEffect(() => {
      console.log("컴포넌트 마운트");
      activateJoinBtn();
  }, [inputs])

    const handleJoinSubmit = () => {
      
    }

    const { email, password, password2 } = inputs;

    const onChange = (e) => {

      const { value, name, checked } = e.target;
      setInputs({
        ...inputs, // 기존의 input 객체를 복사한 뒤
        [name]: value, // name 키를 가진 값을 value 로 설정
      });
      
    }

    const activateJoinBtn = () => {
      console.log(inputs)
      if(validateEmail(email) && validatePw(password) && password === password2) {
        joinSubmitBtn.current.className = "w-4/6 self-center p-10 bg-black text-white text-2xl"
      }
      else {
        joinSubmitBtn.current.className = "w-4/6 self-center p-10 bg-gray-400 text-white text-2xl"
      }
  
    }
  
    return (
      <section>
      <SiteMark />
      <PageTitle title="JOIN" />
      <nav className="w-screen">
          <ul className="w-screen flex justify-center">
              <li className="p-6 w-2/6 text-center border-b-4 border-black"><Link href="/">LOGIN</Link></li>
              <li className="p-6 w-2/6 text-white text-center bg-black  "><Link href="/join">JOIN</Link></li>
          </ul>
      </nav>
      
      <form className="flex flex-col p-6" id="joinForm">
          <input onChange={onChange} name="email" className="border-2 w-4/6 p-6 self-center" type="email" required placeholder="아이디 또는 이메일" />
          <input onChange={onChange} name="password" className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호" />
          <input onChange={onChange} name="password2" className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호 확인" />

          <div className="self-center p-6">
          <input className="self-center" type="checkbox" /> <span className="self-center">약관 동의</span>
          </div>
          <input ref={joinSubmitBtn} className="w-4/6 self-center p-10 bg-black text-white text-2xl" type="submit" value="JOIN" />
      </form>
  
      <nav className="w-screen flex justify-center list-none">
      <li className="p-4 border-r-2 border-gray"><Link href="/find-email">아이디찾기</Link></li>
      <li className="p-4"><Link href="/find-password">비밀번호찾기</Link></li>
      </nav>
  
  </section>
    )
  }
  
  export default Join
  