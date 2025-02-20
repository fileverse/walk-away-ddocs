import FileverseIcon from '../assets/fileverse.svg'
import { GithubIcon, ThreadIcon, DdocsIcon } from '../assets/icons'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-3 border-[#E8EBEC]">
      <div className="flex items-center">
        <img src={FileverseIcon} alt="Fileverse" />
      </div>

      <div className="flex items-center gap-1">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ThreadIcon />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <GithubIcon />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <DdocsIcon />
        </a>
      </div>
    </nav>
  )
}

export { Navbar }
