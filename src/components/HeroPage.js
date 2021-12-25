import { useSelector } from 'react-redux'

const HeroPage = () => {
    const isLogged = useSelector((state) => state.isLogged.value)
    const userInfo = useSelector((state) => state.userInfo.value)

    return (
        <div>
            <button onClick={() => {
                console.log(isLogged, "is logged?")
                console.log(userInfo, "Info of user")
            }}>Console log</button>
        </div>
    )
}

export default HeroPage
