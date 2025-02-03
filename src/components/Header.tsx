import logo from './../../public/ntuchealth.svg'

const Header = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-6">
        <img src={logo} alt="Lai Lai Guess Guess!" width={250} height={250} />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-center text-coffee-dark mb-4">
        Kampong Klash!
      </h1>
      <p className="text-xl text-center text-coffee-dark mb-8">
        Your multi-lingual charades game inspired by Singapore’s vibrant
        culture!
      </p>
    </div>
  )
}

export default Header
