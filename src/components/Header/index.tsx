import Img from 'next/image'

export function Header() {
  return(
    <header>
      <div>
        <Img src="/images/logo.svg" alt="Logo" />
      </div>
    </header>
  )
}