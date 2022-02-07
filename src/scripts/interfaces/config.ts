export interface Size {
	size: number;
	label: string;
}

export type Sizes = Size[];

export interface Config {
	sizes: Sizes;
	types: string[];
	destDir: string;
}
