import { Link } from "react-router-dom";
import squidEmoji from "./../images/squid.png";

export function Welcome(): JSX.Element {

    return (
        <div className={"bg-black py-96 text-center text-white font-squid"}>
            <img className={"h-12 inline-block"} src={squidEmoji} alt={"squid"}/>
            <h1 className={"text-3xl mt-4"}>WANNA JOIN THE GAME ANON ?</h1>
            <Link className={"mt-8 mx-2 p-4 border-2 inline-block"} to={"/home"}>Join</Link>
        </div>
    );
}