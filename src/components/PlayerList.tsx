import { Contract } from "@ethersproject/contracts"
import { formatUnits } from "@ethersproject/units"
import { hit, heal, fetchSquishiGameData } from "../web3Helper"

export function PlayerList({players, squishiGameContract, account, setGameData}: {players: any[], squishiGameContract: Contract, account: string, setGameData: Function}): JSX.Element {

    async function update() {
        setGameData(await fetchSquishiGameData(squishiGameContract));
    }

    return (
        <div className="flex flex-col mx-24 mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Player
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Health
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-black divide-y divide-gray-200">
                        {
                            players.map((player) => {
                                let address = player.address;
                                if (address === account) address = address+' (you)'
                                return (
                                    <tr key={address}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatUnits(player.health)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={e => {
                                                async function execHit() {
                                                    const tx = await hit(squishiGameContract, account, address);
                                                    if (tx) {
                                                        await squishiGameContract.provider.waitForTransaction(tx.hash, 1);
                                                        await update();
                                                    }
                                                }
                                                execHit();
                                                }}>Attack</button>
                                             -- 
                                            <button onClick={e => {
                                                async function execHeal() {
                                                    const tx = await heal(squishiGameContract, account, address);
                                                    if (tx) {
                                                        await squishiGameContract.provider.waitForTransaction(tx.hash, 1);
                                                        await update();
                                                    }
                                                }
                                                execHeal();
                                                }}>Heal</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    )
}