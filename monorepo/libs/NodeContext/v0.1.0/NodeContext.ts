import { createContext } from "react";

export default createContext<{ contextName: string, [x: string]: any }>({ contextName: '' })
