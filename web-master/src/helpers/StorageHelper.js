import { storage } from 'firebase/app';
import 'firebase/storage';
import moment from 'moment';

const _buildFileName = (file) => {
  return `${moment().valueOf()}.${file.name.split('.').pop()}`
}

const _getChildFromUrl = (url) => {
  const path = url.substring(url.lastIndexOf('o/') + 2, url.indexOf('?'))
  return path.replace("%2F", "/")
}

export const destroy = async (urls = []) => {
  for (const url of urls) {
    await storage().ref().child(_getChildFromUrl(url)).delete()
  }
}

export const upload = async (files, folder) => {
  let paths = []
  if (files) {
    for (const file of files) {
      const ref = storage().ref().child(`${folder || 'unnamed'}/${_buildFileName(file)}`)
      await ref.put(file.originFileObj).catch(e => console.log("UPLOAD ERROR: ", e))
      const path = await ref.getDownloadURL()
      paths.push(path)
    }
  }
  return paths
}