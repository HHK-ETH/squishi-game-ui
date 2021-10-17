import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";

export async function fetchPlayers(squishiGame: Contract): Promise<string[]> {
    const events: any[] = await squishiGame.queryFilter(squishiGame.filters.Join(), 20051804, 20151803);
    return events.map((log: any) => {
        return log.args.player;
    });
}

export async function fetchPlayersWithHealth(squishiGame: Contract, addresses: string[]): Promise<any[]> {
    return Promise.all(addresses.map(async (address) => {
        return {
            address: address,
            health: await squishiGame.balanceOf(address),
            nextAction: parseInt(await squishiGame.lastActionTimestamp(address)) + 3600 - (new Date().getTime() / 1000)
        };
    }));
}

export async function fetchSquishiGameData(squishiGame: Contract) {
    const players: string[] = await fetchPlayers(squishiGame);
    return {
        players: await fetchPlayersWithHealth(squishiGame, players),
        endDate: await squishiGame.gameEnds(),
        hoursLeft: ((await squishiGame.gameEnds()).toNumber() - new Date().getTime() / 1000) / 3600,
        playerAmount: await squishiGame.players(),
        pot: await squishiGame.pot()
    }
}

export async function hit(squishiGame: Contract, account: string, target: string): Promise<any> {
    if (!(await squishiGame.isAlive(account)) || !(await squishiGame.isAlive(target))) {
        alert("You or target player is dead or did not join the game.");
        return null;
    }
    if (parseInt(await squishiGame.lastActionTimestamp(account)) + 3600 > (new Date().getTime() / 1000)) {
        alert("You need to rest.");
        return null;
    }
    return await squishiGame.hit(target);
}
export async function heal(squishiGame: Contract, account: string, target: string): Promise<any> {
    if (!(await squishiGame.isAlive(account)) || !(await squishiGame.isAlive(target))) {
        alert("You or target player is dead or did not join the game.");
        return null;
    }
    if (formatUnits(await squishiGame.balanceOf(target)) === "9.0" ) {
        alert("Already full healed.");
        return null;
    }
    if (parseInt(await squishiGame.lastActionTimestamp(account)) + 3600 > (new Date().getTime() / 1000)) {
        alert("You need to rest.");
        return null;
    }
    return await squishiGame.heal(target);
}