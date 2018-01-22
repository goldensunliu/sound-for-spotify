import Spinner from '../components/spinner'

const LoadingFullScreen = () => (
    <div>
        <Spinner/>
        { /*language=CSS*/ }
        <style jsx>{`
            div {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `}</style>
    </div>
)

export default LoadingFullScreen