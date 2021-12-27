
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'


const HeroPage = () => {
    const currentUserInfo = useSelector((state) => state.userInfo.value)
    return (
        <div>
            Hero Page
            <Link to='/profile/xjzq1s9kEZSzB1omYTsxKwuLnk33'  >Ivan Mukoed</Link>
            <Link to='/profile/RAkQG1u0V0TdLSCa9iLzryDPcT02'  >acesoft</Link>
            <button onClick={() => console.log(currentUserInfo)}>Info from redux about user</button>
        </div>
    )
}

export default HeroPage
