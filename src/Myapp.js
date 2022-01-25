import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import About from "./components/About";
import Navmenu from './components/Navmenu';
function Myapp() {
    const [navToggled, setNavtoggled] = useState(false);
    const [viewToggled, setViewportToggled] = useState("home");

    const handleNavToggle = () => {
        setNavtoggled(!navToggled);
    };
    const handleViewportToggle = (viewpage) => {
        console.log(viewpage)
        setViewportToggled(viewpage);
    };
    return (
        <>
            <Navmenu handleNavToggle={handleNavToggle} handleViewportToggle={(e) => handleViewportToggle(e)} />
            {
                viewToggled === "home" && <App />
            }

            {
                viewToggled === "about" && <About />
            }

        </>
    )
}
export default Myapp;