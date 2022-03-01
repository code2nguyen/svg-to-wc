import { loadConfig } from 'svgo';

export const getSvgoConfig = async (svgoConfig: any): Promise<string> => svgoConfig || (await loadConfig());
