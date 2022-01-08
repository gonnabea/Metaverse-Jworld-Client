const modelsUrl = "/3d_models"
const roomModelsUrl = "/3d_models/living_room_isometric_lowpoly/items"
const characterModelsUrl = "/3d_models/characters"
const miniHompiModelsUrl = "/3d_models/mini_hompi"

export const modelList = {
    book1: `${roomModelsUrl}/book_1.glb`,
    opened_book: `${roomModelsUrl}/opened_book.glb`,
    carpet_1: `${roomModelsUrl}/carpet_1.glb`,
    carpet_2: `${roomModelsUrl}/carpet_2.glb`,
    sofa: `${roomModelsUrl}/sofa.glb`,
    standing_lamp: `${roomModelsUrl}/standing_lamp.glb`,
    tv: `${roomModelsUrl}/tv.glb`,
    room_wall: `${roomModelsUrl}/room_wall.glb`,
    glass_1: `${roomModelsUrl}/glass_1.glb`,
    vase_1: `${roomModelsUrl}/vase_1.glb`,
    vase: `${modelsUrl}/vase.glb`,
    book_ani: `${modelsUrl}/note_book/scene.gltf`,
    curtain: `${modelsUrl}/curtain.glb`,
    frame: `${modelsUrl}/frame.glb`,
    lobby: `${modelsUrl}/streamWorld.glb`,
    screen: `${modelsUrl}/tv2.glb`,
    character: `${characterModelsUrl}/amy.glb`,
    amy: `${characterModelsUrl}/amy.glb`,
    frame1: `${miniHompiModelsUrl}/frame1.glb`,
    tv_2: `${miniHompiModelsUrl}/tv2.glb`,
    sofa_1: `${miniHompiModelsUrl}/sofa.glb`,
    table_1: `${miniHompiModelsUrl}/table_ronde/scene.gltf`,
    table_2: `${miniHompiModelsUrl}/table/scene.gltf`,
    table_3: `${miniHompiModelsUrl}/miniHompiModelsUrl/scene.gltf`,
    chair: `${modelsUrl}/chair.glb`,
    chair_2: `${miniHompiModelsUrl}/vitra_eames_plastic_chair/scene.gltf`,
    frame_2:`${miniHompiModelsUrl}/3d_architecture__photo_frame/scene.gltf`,
    tablelamp: `${miniHompiModelsUrl}/table_lamp/scene.gltf`,
}

export const modelListArr = [
    `${roomModelsUrl}/book_1.glb`,
    `${roomModelsUrl}/opened_book.glb`,
    `${roomModelsUrl}/carpet_1.glb`,
    `${roomModelsUrl}/carpet_2.glb`,
    `${roomModelsUrl}/sofa.glb`,
    `${roomModelsUrl}/standing_lamp.glb`,
    `${roomModelsUrl}/tv.glb`,
    `${roomModelsUrl}/room_wall.glb`,
    `${roomModelsUrl}/table_1.glb`,
    `${roomModelsUrl}/table_2.glb`,
    `${roomModelsUrl}/glass_1.glb`,
    `${roomModelsUrl}/vase_1.glb`,
]


export const AllModelsStatus = {
    carpet1: [
        {
            installed: false,
            scale: 0.3,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    carpet2: [
        {
            installed: false,
            scale: 0.3,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    tv: [
        {
            installed: false,
            scale: 0.3,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
    ],
    standingLamp: [
        {
            installed: false,
            scale: 0.3,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    vase: [
        {
            installed: false,
            scale: 0.1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    book: [
        {
            index: 0,
            installed: false,
            scale: 0.3,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
            imageUrl: ""
        }
    ],
    chair: [
        {
            installed: false,
            scale: 0.1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    curtain: [
        {
            installed: false,
            scale: 0.5,
            rotateY: "1",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    frame1: [
        {
            installed: false,
            scale: 1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
            imageUrl: "https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="
        }
    ],
    frame2: [
        {
            installed: false,
            scale: 0.1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
            imageUrl: "https://media.istockphoto.com/photos/metaverse-concept-metaverse-text-sitting-over-blue-technological-picture-id1352111641?b=1&k=20&m=1352111641&s=170667a&w=0&h=OcbdDklzABPmIV5H8gNUnpiO7QI7dulB3VkvjR4f00g="
        }
    ],
    table1: [
        {
            installed: false,
            scale: 0.05,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    tableLamp: [
        {
            installed: false,
            scale: 0.1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    sofa: [
        {
            installed: false,
            scale: 1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    chair2: [
        {
            installed: false,
            scale: 0.1,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
        }
    ],
    tv2: [
        {
            installed: false,
            scale: 10,
            rotateY: "0",
            isFocused: false,
            position: { x: 0, y: 0, z:0 },
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
    ]
}