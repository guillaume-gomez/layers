import React, { useRef, useCallback, useContext } from 'react';

//https://codesandbox.io/s/mq5oy?file=/src/index.js:1615-1652

/*const context = React.createContext();

function useHover() {
  const ref = useRef()
  const setHovered = useContext(context)
  const onPointerOver = useCallback(() => setHovered(state => [...state, ref.current]), [])
  const onPointerOut = useCallback(() => setHovered(state => state.filter(mesh => mesh !== ref.current)), [])
  return { ref, onPointerOver, onPointerOut }
}*/