import React from 'react'
import { AiFillGithub } from 'react-icons/ai'
import { BsLinkedin } from 'react-icons/bs'
import { FaLink } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <div className='footer'>
      <span className='name'>
        Topicsy made by -{' '}
        <a href='https://demofkd.netlify.app/' target='__blank'>
          Démo FKD
        </a>
      </span>
      <hr style={{ width: '90%' }} />
      <div className='iconContainer'>
        <a href='https://github.com/weshare237' target='__blank'>
          <AiFillGithub />
        </a>
        <a
          href='https://www.linkedin.com/in/fopa-kuete-duclair-85a758148/'
          target='__blank'
        >
          <BsLinkedin />
        </a>
        <a href='https://demofkd.netlify.app/' target='__blank'>
          <FaLink />
        </a>
      </div>
    </div>
  )
}

export default Footer
