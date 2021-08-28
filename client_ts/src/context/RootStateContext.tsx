import React from 'react';
import { Store } from '../store';

type RootStateContextValue = {
    store:Store
}

export const RootStateContext = React.createContext<RootStateContextValue>({} as RootStateContextValue);

const store = new Store();

export const RootStateProvider: React.FC<React.PropsWithChildren<{}>> = ({children})=>{
    return <RootStateContext.Provider value={{store}}>{children}</RootStateContext.Provider>
}

export const useRootStore = ()=> React.useContext(RootStateContext);