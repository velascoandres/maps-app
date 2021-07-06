import React from 'react'

import { SocketProvider } from './context/SocketContext'
import { MapPage } from './pages/MapPage'


export const MapApp: React.FC = () => {
  return (
    <>
      <SocketProvider>
        <MapPage />
      </SocketProvider>
    </>
  )
}
