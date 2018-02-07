import Spinner from '../components/spinner'
import { SoundBar } from './Brand'

const LoadingFullScreen = () => (
    <div className="root">
        <div className="bars">
            <SoundBar/>
            <SoundBar/>
            <SoundBar/>
            <SoundBar/>
            <SoundBar/>
        </div>
        { /*language=CSS*/ }
        <style jsx>{`
            .root {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                flex: 1;
            }
            .bars {
                display: flex;
                align-items: flex-end;
                height: 4em;
            }
        `}</style>
    </div>
)

export default LoadingFullScreen