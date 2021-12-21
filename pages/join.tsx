import { NextPage } from "next"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import PageTitle from "../components/PageTItle"
import SiteMark from "../components/SiteMark"
import { gql, useMutation, useQuery } from "@apollo/client";
import { validateEmail, validatePw } from "../config/regexChecks"


const JOIN = gql`
mutation join($email: String!, $nickname: String!, $password: String!, $password2: String!) {
  join(input:{email: $email, nickname: $nickname, password: $password, password2: $password2}) {
    ok,
    error
  }
}
`

const Join: NextPage = () => {

    const [inputs, setInputs] = useState({
      email: '',
      password: '',
      password2: '',
      nickname: '',
    });

    const joinSubmitBtn = useRef();
    
    
    useEffect(() => {
      console.log("컴포넌트 마운트");
      activateJoinBtn();
    }, [inputs])
    
    const { email, password, password2, nickname } = inputs;

    const [ reqJoin, { data, loading, error }] = useMutation(JOIN)

    // 회원가입 submit 버튼 눌렀을 시 API 요청
    const handleJoinSubmit = async(e) => {
      e.preventDefault();
      const {data, errors} = await reqJoin({ variables: {email, nickname, password, password2} });
      console.log(data, errors);
      
    }


    // input에 글자 입력 시 조건 실시간 체크
    const onChange = (e) => {

      const { value, name } = e.target;
      setInputs({
        ...inputs, // 기존의 input 객체를 복사한 뒤
        [name]: value, // name 키를 가진 값을 value 로 설정
      });
      
    }

    // 조건 만족 여부 실시간 확인용
    const activateJoinBtn = () => {
      console.log(inputs)
      if(validateEmail(email) && validatePw(password) && password === password2 && nickname.length >= 2 && nickname.length <= 10) {
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
      
      <form onSubmit={(e) => handleJoinSubmit(e, {email, password, password2, nickname})} className="flex flex-col p-6" id="joinForm">
          <input onChange={onChange} name="email" className="border-2 w-4/6 p-6 self-center" type="email" required placeholder="이메일" />
          <input onChange={onChange} name="nickname" className="border-2 w-4/6 p-6 self-center" type="string" required placeholder="닉네임 (2 ~ 10자)" />
          <input onChange={onChange} name="password" className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호 (영문, 숫자 , 특수문자 포함)" />
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
  