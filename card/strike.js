
var strike = {
	id: "strike",
	title: "Strike",
	description: function () {
		return `Deals ${this.upgrade == 0 ? 6 : 9} damage.`
	},
	upgrade: 0,
	effect: {
		dmg: 6
	},
	upgradedEffect: {
		dmg: 9
	},
	baseCost: 1
}