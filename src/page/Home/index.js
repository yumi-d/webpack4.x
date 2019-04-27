import React from 'react';
import './index.css'
import icon from './icon.jpg'
class Home extends React.Component {
    render(){
        return (
            <div className="test">Hello, world!!!
                <img src={icon} />
            </div>
        )
    }
}
export default Home;