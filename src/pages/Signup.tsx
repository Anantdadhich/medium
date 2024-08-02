
import Qoute from '../component/Qoute'
import Auth from '../component/Auth'

const Signup = () => {
  return (
    <div>
       <div className='grid grid-cols-2'>
         <div>
    <Auth></Auth>
         </div>
        <div className='invisible md:visible'>
       <Qoute></Qoute>
        </div>
       </div>
    </div>
  )
}

export default Signup
