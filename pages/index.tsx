import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';
import { useEffect } from 'react';
import WsConnect from '../multiplay/wsConnection';
import PageTitle from '../components/common/PageTItle';
import SiteMark from '../components/common/SiteMark';
import { validateEmail, validatePw } from '../config/regexChecks';
import { gql, useLazyQuery, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from 'next/dist/client/router';
import { applyMe, setMe } from '../stores/loggedUser';
import { LOGIN } from '../apis/gql-queries/user';



const Login: NextPage = () => {

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  
  const router = useRouter();
  
  const loginSubmitBtn = useRef<HTMLInputElement>()
  
  const { email, password } = inputs;

  const [reqLogin, { data, loading, error }] = useLazyQuery(LOGIN, {
    variables:{loginInput: {email, password}}
  })



  const handleLogin = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!validateEmail(email) || !validatePw(password)) {
      alert("이메일, 비밀번호를 형식에 맞게 입력해주세요.")
      return null
    }
    const data = await reqLogin()
    console.log(data)
    if(data && data.data) {
      const { data: {login:{ ok, token, error }}} = data;

      if(ok === true) {
        localStorage.setItem("jwt_token", token ); // 로컬 스토리지에 jwt 토큰 담기 (CSRF 공격에는 안전하고 XSS에는 취약)
    
        
        router.push("/lobby")
      }
      else {
        alert(`로그인 실패: ${error.message}`)
      }
    }
    else {
        alert("로그인 실패, 이메일 또는 비밀번호를 다시 확인해주세요.")
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
      loginSubmitBtn.current.className = "w-4/6 self-center p-10 bg-black text-white text-2xl cursor-pointer"
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
    
    <form onSubmit={(e) => {handleLogin(e)}} className="flex flex-col p-6" id="loginForm">
        <input onChange={onChange} name="email" className="border-2 w-4/6 p-6 self-center" type="email" required placeholder="이메일" />
        <input onChange={onChange} name="password" className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호 (영문, 숫자, 특수문자 포함)" />
        <div className="self-center p-6">
        {/* <input onChange={onChange} name="remember_user" className="self-center" type="checkbox" checked={false} /> <span className="self-center">로그인 상태 유지</span> */}
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
