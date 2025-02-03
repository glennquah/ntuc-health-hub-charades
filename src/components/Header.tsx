import logo from './../../public/ntuchealth.svg'

const Header = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-8">
        <img src={logo} alt="Lai Lai Guess Guess!" width={250} height={250} />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-center text-coffee-dark mb-8">
        Lai Lai Guess Guess!
      </h1>
    </div>
  )
}

export default Header
