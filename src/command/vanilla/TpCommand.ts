import CommandParameter, { CommandParameterType } from "../../network/type/CommandParameter";
import Player from "../../player";
import Command from "../";

export default class TpCommand extends Command {
    constructor() {
        super({ namespace: 'minecraft', name: 'tp', description: 'Teleports a player to a specified location' });

        this.parameters = [
            new Set(),
            new Set(),
            new Set(),
            new Set()
        ];

        this.parameters[0].add(new CommandParameter({
            name: 'target',
            type: CommandParameterType.Target,
            optional: false
        }));
        this.parameters[0].add(new CommandParameter({
            name: 'target',
            type: CommandParameterType.Target,
            optional: true
        }));

        this.parameters[1].add(new CommandParameter({
            name: 'target',
            type: CommandParameterType.Target,
            optional: true
        }));
        this.parameters[1].add(new CommandParameter({
            name: 'x',
            type: CommandParameterType.Value,
            optional: true
        }));
        this.parameters[1].add(new CommandParameter({
            name: 'y',
            type: CommandParameterType.Value,
            optional: true
        }));
        this.parameters[1].add(new CommandParameter({
            name: 'z',
            type: CommandParameterType.Value,
            optional: true
        }));

        this.parameters[2].add(new CommandParameter({
            name: 'target',
            type: CommandParameterType.Target,
            optional: true
        }));
        this.parameters[2].add(new CommandParameter({
            name: 'x',
            type: CommandParameterType.Value,
            optional: true
        }));
        this.parameters[2].add(new CommandParameter({
            name: 'z',
            type: CommandParameterType.Value,
            optional: true
        }));

        this.parameters[3].add(new CommandParameter({
            name: 'target',
            type: CommandParameterType.Target,
            optional: true
        }));
        this.parameters[3].add(new CommandParameter({
            name: 'y',
            type: CommandParameterType.Value,
            optional: true
        }));
    }

    public execute(sender: Player, args: Array<string>): void {
        // TODO: handle relative cords
        if (args.length <= 1) {
            return sender.sendMessage('§cYou have to specify <player> x y z.');
        }

        // TODO: handle only supplying x y, and relative teleport
        const player = sender.getServer().getPlayerByName(args[0]);
        if (!player) {
            sender.sendMessage(`§c${args[0]} is not online!`);
            return;
        }

        switch (args.length) {
            case 2:
                if (typeof args[1] === 'string') {
                    const target = sender.getServer().getPlayerByName(args[1]);
                    if (!target) {
                        sender.sendMessage(`§c${args[0]} is not online!`);
                        return;
                    }

                    player.x = target.x;
                    player.y = target.y;
                    player.z = target.z;
                } else {
                    player.y = args[1];
                }
                break;
            case 3:

                player.x = args[1];
                player.z = args[2];
                break;
            case 4:
                player.x = args[1];
                player.y = args[2];
                player.z = args[3];
                break;
        }

        player.broadcastMove(player);
        sender.sendMessage(`Teleported ${args[0]} to ${args.slice(1).join(' ')}`);
        return;
    }
}