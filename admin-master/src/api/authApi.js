import { firestore, auth } from "firebase/app";

const ref = firestore().collection('users');

export default {
  async updateProfile(uid, data) {
    let isExist = false
    await ref.doc(uid).get().then(snapshot => { isExist = snapshot.exists })
    if (isExist) return await ref.doc(uid).update({ ...data })
    return await ref.doc(uid).set({ ...data })
  },
  async changePassword(oldPassword, newPassword) {
    const user = auth().currentUser
    const credential = auth.EmailAuthProvider.credential(user.email, oldPassword)
    await user.reauthenticateWithCredential(credential)
      .then(async () => {
        return await user.updatePassword(newPassword)
      })
      .catch(() => {
        return Promise.reject({ message: 'Mật khẩu hiện tại không chính xác!' })
      })
  },
};
