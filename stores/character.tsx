import { makeVar } from "@apollo/client";
import { Chat } from "../components/threeComponents/streamWorldModels/wsPayloads";
import { characterStatus } from "../types/character";
import { XYZType } from "../types/common";
import { wsUser } from "../types/wsRoom";


export const applyCharacterStatus = makeVar<characterStatus>({  
    position: { x: 0, y: 0, z: 0 },
    rotateZ: 0
});

export const setCharacterPosition = (position: XYZType) => {
    applyCharacterStatus({
        ...applyCharacterStatus(),
        position
    })
}

export const setCharacterRotateZ = (rotateZ: number) => {
    applyCharacterStatus({
        ...applyCharacterStatus(),
        rotateZ
    })
}

// 타 유저 캐릭터 상태관리
export const applyOthersStatus = makeVar<characterStatus[]>(
[
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    {
        position: { x: 0, y: 0, z: 0 },
        rotateZ: 0
    },
    
]
);

export const setOthersPosition = ({position, index}: {position: XYZType, index: number}) => {
    applyOthersStatus()[index].position = position;

}

export const setOthersRotateZ = ({rotateZ, index}: {rotateZ: number, index: number}) => {
    applyOthersStatus()[index].rotateZ = rotateZ;

}

export const applyConnectedUser = makeVar<wsUser[]>([])

export const addConnectedUser = ({id, connectedRoomId}: wsUser) => {
    applyConnectedUser().push({id, connectedRoomId})
}

export const removeConnectedUser = (userId: number) => {

    // const removeUser = applyConnectedUser().filter(user => user.id != userId)
    applyConnectedUser().map((user, index) => {
        if(user.id === userId) {
            applyConnectedUser().splice(index, 1)
            
        }
    })

    applyConnectedUser(applyConnectedUser())

}