const Item = require('../item');


class Air extends Item {
    constructor() {
        super({
            name: 'minecraft:air',
            id: 0,
            meta: 0,
            nbt: null,
            count: 0
        });
    }

}
module.exports = Air;
