import type { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import io, { Socket } from "socket.io-client";
import gql from 'graphql-tag';
import { Cache, useQuery, Resolver, makeVar, useReactiveVar, useLazyQuery } from '@apollo/client';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useRouter } from 'next/router';
import SiteMark from '../../components/SiteMark';
import { applyMe } from '../../stores/loggedUser';
import PageTitle from '../../components/common/PageTItle';



//   const GETME = gql`
//   query getMe {
//       getMe {
//         ok
//         error
//         user {
//             id
//             email
//             nickname
//         }
//       }
//     }
//   `

const GETROOMS = gql`
  query getAllMiniHompis {
    getAllMiniHompis {
          ok
          error
          miniHompis {
              id
              createdAt
              ownerId
          }
          hompisWithOwners
      }
  }
`



const MiniHompiLobby:NextPage = () => {
    const {me: { id: userId, nickname}} = useReactiveVar(applyMe);
    const router = useRouter()
    
 
    // const [reqGetMe, {loading, error}] = useLazyQuery(GETME, {
    //     context: {
    //         headers: {
    //             "Authorization":  "Bearer " + jwtToken
    //         }
    //     }
        
    // })

    const {data, loading, error} = useQuery(GETROOMS)
    

      
  
    
    useEffect(() => {
        
    }, [])
    
    return(
        <section className="w-screen h-screen overflow-x-hidden">
            <SiteMark bgColor={"bg-green-500"}/>
            <PageTitle title="Rooms" />

            <div className="grid justify-items-center lg:grid-cols-3 gap-4 md:grid-cols-2 pl-4 content-center">
                {data ? JSON.parse(data.getAllMiniHompis.hompisWithOwners).map(
                    ({miniHompi, owner}, key) => {
                        console.log(JSON.parse(data.getAllMiniHompis.hompisWithOwners))
                        return(
                            <a key={key} onClick={() => router.push({
                                pathname: `/mini_homepage/room/${miniHompi.id}`, 
                                query: {owner: owner?.nickname}})}  
                                className={`${miniHompi.ownerId === userId ? " text-black" : "bg-white text-black"} p-6 w-10/12 flex justify-around align-middle rounded-xl border-2 border-black hover:bg-black hover:text-white cursor-pointer`} >
                            {console.log(data)}
                            <div className="flex flex-col">

                            <cite className="text-2xl">{owner?.nickname}'s Room</cite>
                            <span className="text-2xl">{miniHompi.createdAt}</span>
                            </div>
                            {miniHompi.ownerId === userId ? <span className="text-white text-bold bg-green-500 rounded text-center w-4/12 h-6 relative right-0">★ MyRoom</span> : null}
                            
                            </a>
                        )
                    }
                ): null}
                </div>
            
            
            
            
        </section>
    )
}
// createdAt: "2021-10-09T21:10:47.885Z"
// creatorId: "5713908d-cdd5-4aae-926c-93191dce7dd5"
// id: "41a18566-3caa-48b3-bdc6-b57a7b41db95"
// roomName: "테스트"

export default MiniHompiLobby;

