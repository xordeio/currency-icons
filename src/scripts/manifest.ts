import * as fs from 'fs';
import * as path from 'path';
import getSvgColors from 'get-svg-colors';
import { Manifest } from './interfaces/manifest';
import { Config } from './interfaces/config';
import axios from 'axios';
import { Coin } from './interfaces/coins';

const overrides = new Map([
	['VRSC', 'VerusCoin'],
	['GMR', 'Gimmer'],
	['NEXO', 'Nexo'],
	['GUSD', 'Gemini dollar'],
	['CALL', 'Capital'],
	['BOS', 'BOScoin'],
	['CIX', 'Cryptonetix'],
	['COQUI', 'COQUI Cash'],
	['DEEZ', 'DeezNuts'],
	['MZC', 'MAZA'],
	['CVC', 'Civic'],
	['BTM', 'Bitmark'],
	['GLXT', 'GLX Token'],
	['ONG', 'SoMee.Social'],
	['CC', 'CoinCollect'],
	['2GIVE', '2Give'],
	['BOOTY', 'Booty'],
	['PUNGO', 'Pungo Token'],
	['X', 'GLX Equity Token'],
	['AYWA', 'Aywa'],
	['CHAIN', 'Chainmakers'],
	['LPT', 'Livepeer Token'],
	['AUDR', 'AUDRamp'],
	['BAB', 'Bitcoin Cash ABC'],
	['BSV', 'BitcoinSV'],
	['GOLD', 'Dragonereum Gold'],
	['USDC', 'USD Coin'],
	['AEUR', 'Augmint Euro Token'],
	['BCIO', 'Blockchain.io'],
	['BEAM', 'Beam'],
	['BTT', 'BitTorrent'],
	['GRIN', 'Grin'],
	['ILK', 'Inlock Token'],
	['BTM', 'Bytom'],
	['D', 'Denarius'],
	['BTCD', 'BitcoinDark'],
	['CMT', 'Comet'],
	['CTR', 'Centra'],
	['HSR', 'HShare'],
	['ICN', 'Iconomi'],
	['IOST', 'IOStoken'],
	['PRL', 'Oyster'],
	['RCN', 'Rcoin'],
	['REN', 'Ren'],
	['RYO', 'Ryo Currency'],
	['SKY', 'Skycoin'],
	['XVC', 'Vcash'],
	['MATIC', 'Matic Network'],
	['AMPL', 'Ampleforth'],
	['DOT', 'Polkadot'],
	['KLOWN', 'Ether Clown'],
	['LEO', 'Unus Sed LEO'],
	['SAI', 'Single Collateral DAI'],
	['SIN', 'SINOVATE'],
	['YFI', 'yearn.finance'],
	['DAI', 'Dai'],
	['BAND', 'Band Protocol'],
	['BAL', 'Balancer'],
	['OMG', 'OMG Network'],
	['ARNX', 'Aeron'],
	['ALGO', 'Algorand'],
	['OXT', 'Orchid'],
	['REPV2', 'Augur'],
	['UNI', 'Uniswap'],
	['COMP', 'Compound'],
	['SOL', 'Solana'],
]);

const worker = async () => {
	const coins: Coin[] = (await axios.get('https://api.coingecko.com/api/v3/coins/list')).data;

	const manifestFilepath = './manifest.json';
	const manifest: Manifest = JSON.parse(fs.readFileSync(manifestFilepath).toString());

	const icons = manifest.icons.map((icon) => {
		const id = icon.symbol;
		const filename = `${id.toLowerCase()}.svg`;
		const svgPath = path.resolve(__dirname, '../svg/color/', filename);
		const svg = fs.readFileSync(svgPath, 'utf8');
		const fillColor = getSvgColors(svg).fills[0];

		if (!fillColor) {
			throw new Error(`Couldn't get color for \`${id}\``);
		}

		console.log('Processing', id.toUpperCase());

		return {
			symbol: id.toUpperCase(),
			name: overrides.get(id) || coins.find(c => c.symbol.toLowerCase() === id.toLowerCase())?.name || id,
			color: fillColor.hex().toLowerCase(),
		};
	});

	icons.sort((a, b) => a.symbol.localeCompare(b.symbol));

	const config: Config = JSON.parse(fs.readFileSync('config.json').toString());

	const data = JSON.stringify({ icons, sizes: config.sizes, types: config.types }, null, '\t') + '\n';

	console.log('Saving to', manifestFilepath);

	fs.writeFileSync(manifestFilepath, data);
}

worker().then(() => {
	console.log('Completed');
});
