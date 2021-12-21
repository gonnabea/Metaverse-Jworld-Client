import { ReactElement, useState } from "react"
import { JsxElement } from "typescript"

interface props {
    carpets?: ReactElement<any, any>,
    chairs?: ReactElement<any, any>
    lights?: ReactElement<any, any>
    electronics?: ReactElement<any, any>
}


const ModelInstallPop = ({ carpets, chairs, lights, electronics }:props) => {
    
    const categories = ["의자", "카페트", "탁자", "소파", "침대", "선반", "가전", "조명"]

    const [selectedCategory, setSelectedCategory] = useState("의자");

    const selectCategory = () => {
        switch (selectedCategory) {
            case "카페트":
                return carpets
                
            case "의자":
                return chairs

            case "조명":
                return lights

            case "가전":
                return electronics
        
            default:
                break;
        }
           
    }

    return (
        <div className="w-3/12 h-5/6 bg-black z-10 absolute top-0 right-0 opacity-90">
            <header className="text-white w-full flex">
                <ul className="w-full flex justify-around">
                    {
                        categories.map(category => {
                            if(category === selectedCategory) {
                                return <li className="text-lg font-bold cursor-pointer">{selectedCategory}</li>
                            }
                            
                            return <li onClick={() => setSelectedCategory(category)} className="cursor-pointer">{category}</li>

                        })
                    }

                </ul>
                
            </header>
            <section className="bg-blue-500 h-full">

             {selectCategory()}

                
            </section>

        </div>
    )
}

export default ModelInstallPop;