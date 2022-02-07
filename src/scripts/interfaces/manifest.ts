import { Sizes } from './config';

export interface Icon {
	symbol: string;
	name: string;
	color: string;
	file?: string;
}

export type Icons = Icon[];

export interface Manifest {
	icons: Icons,
	sizes: Sizes,
}
