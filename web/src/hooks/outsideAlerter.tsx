import { useEffect } from 'react'

interface IUseOutsideAlerterProps {
  ref: any
  callback: (data?: any) => void | Promise<void>
}

// Hook that alerts clicks outside of the passed ref
export const useOutsideAlerter = ({
  ref,
  callback
}: IUseOutsideAlerterProps): void => {
  useEffect(() => {
    const handleClickOutside = (event: any): void => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback, ref])
}
