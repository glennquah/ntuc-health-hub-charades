import logo from '../../public/Jamboreeicon.svg'

const Header = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-8">
        <img src={logo} alt="Lai Lai Guess Guess!" width={400} height={200} />
      </div>
      <p className="text-xl text-center text-coffee-dark mb-2">
        Where action speaks louder than words!
      </p>
      <p className="text-xl text-center text-coffee-dark mb-8">
        Your multi-lingual charades game inspired by Singapore’s vibrant
        culture!
      </p>
    </div>
  )
}

export default Header
