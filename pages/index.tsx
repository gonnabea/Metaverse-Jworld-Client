import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import WsConnect from '../multiplay/wsConnection';
import PageTitle from '../components/common/PageTItle';
import SiteMark from '../components/SiteMark';
import { validateEmail, validatePw } from '../config/regexChecks';
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from 'next/dist/client/router';
import { applyMe, setMe } from '../stores/loggedUser';

// query dog($breed:String!){ // query = dog($breed:String!) 선택
//   dog(breed:$breed){	// query 사용
//     id	// 반환받을 객체
//     displayImage
//   }
// }

const LOGIN = gql`
query login($email: String!, $password: String!){
  login(input:{email:$email, password:$password}) {
    ok
    token
    error
  }
}
`

const Login: NextPage = () => {

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  
  const router = useRouter();
  
  const loginSubmitBtn = useRef<HTMLInputElement>()
  
  const { email, password } = inputs;

  const { data, loading, error } = useQuery(LOGIN, {
    variables:{email, password}
  })

  const applyStore = useReactiveVar(applyMe);


  const handleLogin = (e) => {
    e.preventDefault();
    console.log(data)
    if(data) {
      const {login:{ ok, token }} = data;
        localStorage.setItem("jwt_token", token ); // 로컬 스토리지에 jwt 토큰 담기 (CSRF 공격에는 안전하고 XSS에는 취약)
        setMe(data); // 전역 상태관리

        router.push("/lobby")
    }
    else {
        alert("로그인 실패.")
    }
  }

  const onChange = (e) => {
    const { value, name, checked } = e.target;
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
    
  }
  
  const activateLoginBtn = () => {
    console.log(inputs)
    if(validateEmail(email) && validatePw(password)) {
      loginSubmitBtn.current.className = "w-4/6 self-center p-10 bg-black text-white text-2xl"
    }
    else {
      loginSubmitBtn.current.className = "w-4/6 self-center p-10 bg-gray-400 text-white text-2xl"
    }

  }


  
  useEffect(() => {
    console.log("컴포넌트 마운트");
    activateLoginBtn()
}, [inputs])

  return (
    <section>
    <SiteMark />
    <PageTitle title="LOGIN" />
    <nav className="w-screen">
        <ul className="w-screen flex justify-center">
            <li className="p-6 w-2/6 text-white bg-black text-center"><Link href="/">LOGIN</Link></li>
            <li className="p-6 w-2/6 text-center border-b-4 border-black"><Link href="/join">JOIN</Link></li>
        </ul>
    </nav>
    
    <form onSubmit={handleLogin} className="flex flex-col p-6" id="loginForm">
        <input onChange={onChange} name="email" className="border-2 w-4/6 p-6 self-center" type="email" required placeholder="이메일" />
        <input onChange={onChange} name="password" className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호" />
        <div className="self-center p-6">
        <input onChange={onChange} name="remember_user" className="self-center" type="checkbox" checked={false} /> <span className="self-center">로그인 상태 유지</span>
        </div>
        <input ref={loginSubmitBtn} className="w-4/6 self-center p-10 bg-gray-400 text-white text-2xl" type="submit" value="LOGIN" />
    </form>

    <nav className="w-screen flex justify-center list-none">
    <li className="p-4 border-r-2 border-gray"onClick={() => {
      localStorage.setItem("jwt_token", "");
    }}><Link href="/lobby">비회원 로그인</Link></li>
    <li className="p-4"><Link href="/find-password">비밀번호찾기</Link></li>
    </nav>

</section>
  )
}

export default Login
