import { ReactElement, useState } from "react"
import { JsxElement } from "typescript"

interface props {
    carpets?: ReactElement<any, any>,
    chairs?: ReactElement<any, any>
    lights?: ReactElement<any, any>
    electronics?: ReactElement<any, any>
    beauties?: ReactElement<any, any>
    writes?: ReactElement<any, any>
    furnitures?: ReactElement<any, any>
}


const ModelInstallPop = ({ carpets, chairs, lights, electronics, beauties, writes, furnitures }:props) => {
    
    const categories = ["카페트", "가구", "가전", "조명", "장식", "기록"]

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

            case "장식":
                return beauties

            case "기록":
                return writes

            case "가구" :
                return furnitures
            
        
            default:
                break;
        }
           
    }

    return (
        <div className="w-7/12 md:w-3/12 h-3/6 bg-black z-10 absolute top-12 right-0 opacity-90">
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
            <section className="bg-blue-300 h-full">

             {selectCategory()}

                
            </section>

        </div>
    )
}

export default ModelInstallPop;