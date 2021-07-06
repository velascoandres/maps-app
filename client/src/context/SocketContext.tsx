import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket';
import { ISocketContext } from '../interfaces/socket-context.interface';


const initialContext = {
    online: false,
} as ISocketContext;


export const SocketContext: React.Context<ISocketContext> = createContext(initialContext);



export const SocketProvider: React.FC<{ children: JSX.Element }> = ({ children }: { children: JSX.Element }) => {

    const { socket, online } = useSocket('http://localhost:8100');

    return (
        <SocketContext.Provider value={{ socket, online }}>
            {children}
        </SocketContext.Provider>
    );
}