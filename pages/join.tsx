import { NextPage } from "next"
import Link from "next/link"
import { useEffect } from "react"
import PageTitle from "../components/PageTItle"
import SiteMark from "../components/SiteMark"

const Join: NextPage = () => {


    useEffect(() => {
      console.log("컴포넌트 마운트")
  }, [])
  
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
          <input className="border-2 w-4/6 p-6 self-center" type="email" required placeholder="아이디 또는 이메일" />
          <input className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호" />
          <input className="border-2 w-4/6 p-6 self-center" type="password" required placeholder="비밀번호 확인" />

          <div className="self-center p-6">
          <input className="self-center" type="checkbox" /> <span className="self-center">약관 동의</span>
          </div>
          <input className="w-4/6 self-center p-10 bg-black text-white text-2xl" type="submit" value="JOIN" />
      </form>
  
      <nav className="w-screen flex justify-center list-none">
      <li className="p-4 border-r-2 border-gray"><Link href="/find-email">아이디찾기</Link></li>
      <li className="p-4"><Link href="/find-password">비밀번호찾기</Link></li>
      </nav>
  
  </section>
    )
  }
  
  export default Join
  