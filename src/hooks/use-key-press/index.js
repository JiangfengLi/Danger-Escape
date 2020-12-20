import { useEffect } from "react";

export default function useKeyPress(fn){
    useEffect(() => {
        //console.log("useKeyPress! ");
        window.addEventListener("keydown", fn)
        return () => window.removeEventListener("keydown", fn);
    }, [fn]);
}