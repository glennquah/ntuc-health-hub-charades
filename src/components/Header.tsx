import logo from '../../public/icons.svg'

const Header = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-8">
        <img src={logo} alt="Lai Lai Guess Guess!" width={400} height={200} />
      </div>
      <p className="text-xl text-center mb-2" style={{ color: '#40C0DF' }}>
        Where action speaks louder than words!
      </p>
      <p className="text-xl text-center mb-8" style={{ color: '#40C0DF' }}>
        Your multi-lingual charades game inspired by Singapore’s vibrant
        culture!
      </p>
    </div>
  )
}

export default Header
