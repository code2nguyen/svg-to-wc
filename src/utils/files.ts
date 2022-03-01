import fg from 'fast-glob';

export async function getFilePaths(srcFiles: string[]) {
  const filePaths: string[] = await fg(srcFiles);
  return filePaths;
}
