import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract, providers } from "ethers";
import { useEffect, useState } from "react";
import { IGameData, SQUISHI_GAME_ABI, SQUISHI_GAME_ADDR, SUSHI_ERC20_ABI, SUSHI_ERC20_ADDR } from "../constant";
import { fetchSquishiGameData } from "../web3Helper";
import { PlayerList } from "./PlayerList";
import { Wallet } from "./Wallet";

export function Home(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [gameData, setGameData]: [gameDate: IGameData, setGameData: Function] = useState({
        players: [],
        endDate: BigNumber.from(0),
        hoursLeft: 0,
        playerAmount: BigNumber.from(0),
        pot: BigNumber.from(0)
    });
    const [squishiGameContract, setsquishiGameContract] = useState(new Contract(SQUISHI_GAME_ADDR, SQUISHI_GAME_ABI));
    const [joined, setJoined] = useState(true);

    useEffect(() => {
        async function fetchContract() {
            if (!active || chainId !== 137 || connector === undefined) {
                return;
            }
            const web3Provider = new providers.Web3Provider(await connector.getProvider());
            const contract = new Contract(SQUISHI_GAME_ADDR, SQUISHI_GAME_ABI, web3Provider);
            const contractWithSigner = contract.connect(web3Provider.getSigner());
            setsquishiGameContract(contractWithSigner);
            setGameData(await fetchSquishiGameData(contractWithSigner));
            if (!(await contractWithSigner.rip(account)) && !(await contractWithSigner.isAlive(account))) {
                setJoined(false);
            }
        }
        fetchContract();
    }, [active, chainId, connector]);

    if (!active || chainId !== 137 || account === undefined || account === null) {
        return (
            <>
                <div className={"bg-black py-96 text-center text-white"}>
                    <h1 className={"text-3xl font-squid"}>Connect your wallet and switch to Polygon network</h1>
                    <Wallet/>
                </div>
            </>
        );
    }

    return (
        <div className={"bg-black pt-48 pb-96 text-center text-white"}>
            <h1 className={"text-3xl mb-2 font-squid"}>Welcome to the Squishi Game</h1>
            <h2>The game ends in: {gameData.hoursLeft.toFixed(2)} hours</h2>
            <h2>Total pot: {formatUnits(gameData.pot)} SUSHI</h2>
            <h2>Amount of players: {gameData.playerAmount.toString()}</h2>

            {!joined && 
            <div className={"border-2 inline-block p-8 mt-4"}>
                <h1 className={"text-xl font-squid"}>WANNA JOIN THE GAME ANON ?</h1>
                <p>You need to approve the contract and 3 SUSHI to play.</p>
                <button className={"mt-2 mx-2 p-4 border-2 inline-block"} onClick={e => {
                    async function approve() {
                        if (connector === undefined) return;
                        const token = new Contract(SUSHI_ERC20_ADDR, SUSHI_ERC20_ABI);
                        const web3Provider = new providers.Web3Provider(await connector.getProvider());
                        const tokenWithSigner = token.connect(web3Provider.getSigner())
                        await tokenWithSigner.approve(SQUISHI_GAME_ADDR, 3 * (10 *18));
                    }
                    approve();
                }}>Approve</button>
                <button className={"mt-2 mx-2 p-4 border-2 inline-block"} onClick={e => {
                    async function join() {
                        await squishiGameContract.join();
                    }
                    join();
                }}>Join</button>
            </div>}

            <PlayerList players={gameData.players} squishiGameContract={squishiGameContract} account={account} setGameData={setGameData} />
        </div>
    )
}
