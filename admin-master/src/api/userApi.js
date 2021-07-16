import firebase, { firestore } from "firebase/app";
import constants from '../constants';
import moment from 'moment';
import _ from 'lodash';

const ref = firestore().collection(constants.COLLECTION.USER);

export default {
  async getUsers(uid = null) {
    let query = ref
    if (uid) query = ref.where('createdBy.uid', '==', uid)
    const snapshot = await query.get()
    const hostels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return _.orderBy(hostels, ['createdAt'], ['desc']);
  },
  async addUser({ fullname, email, phoneNumber, password, isAdmin }) {
    const { user } = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return await ref.doc(user.uid).set({
      uid: user.uid,
      fullname,
      email,
      phoneNumber,
      isAdmin,
      isActive: true,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
      deletedAt: null
    })
  },
  async updateUser(id, data) {
    return await ref.doc(id).update({
      ...data,
      updatedAt: moment().valueOf()
    })
  },
  async banUser(id) {
    return await ref.doc(id).update({
      isActive: false,
      deletedAt: moment().valueOf()
    })
  },
  async restoreUser(id) {
    return await ref.doc(id).update({
      isActive: true,
      deletedAt: null
    })
  },
};
