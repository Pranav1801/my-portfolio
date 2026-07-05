import { createContext, useContext } from 'react'

// go(path, targetId?) — provided by App; plays the overlay wipe, navigates,
// and optionally scrolls to #targetId once the new page is mounted.
export const TransitionContext = createContext(() => {})
export const useGo = () => useContext(TransitionContext)

export function TLink({ to, targetId, children, ...rest }) {
  const go = useGo()
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        e.preventDefault()
        go(to, targetId)
      }}
    >
      {children}
    </a>
  )
}
