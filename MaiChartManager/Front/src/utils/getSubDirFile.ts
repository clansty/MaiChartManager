export default async (folderHandle: FileSystemDirectoryHandle, fileName: string) => {
  const pathParts = fileName.split('/');

  let dirHandle = folderHandle;
  for (let i = 0; i < pathParts.length - 1; i++) {
    dirHandle = await dirHandle.getDirectoryHandle(pathParts[i], {create: true});
  }
  return await dirHandle.getFileHandle(pathParts[pathParts.length - 1], {create: true});
}
