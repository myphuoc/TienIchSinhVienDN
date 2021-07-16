import { firestore } from "firebase/app";
import constants from '../constants';
import moment from 'moment';
import _ from 'lodash';

const ref = firestore().collection(constants.COLLECTION.HOSTEL);

export default {
  async getHostels(all = false, uid = null) {
    let query = ref
    if (!all) query = ref.where('status', '==', constants.STATUS.APPROVED)
    if (uid) query = ref.where('createdBy.uid', '==', uid)
    const snapshot = await query.get()
    const hostels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return _.orderBy(hostels, ['createdAt'], ['desc']);
  },
  async addHostel(data) {
    return await ref.doc().set({
      ...data,
      status: constants.STATUS.APPROVED,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
      deletedAt: null
    })
  },
  async updateHostel(id, data) {
    return await ref.doc(id).update({
      ...data,
      updatedAt: moment().valueOf()
    })
  },
  async hideHostel(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.HIDDEN,
      deletedAt: moment().valueOf()
    })
  },
  async deleteHostel(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.DELETED,
      deletedAt: moment().valueOf()
    })
  },
  async restoreHostel(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.PENDING,
      deletedAt: null
    })
  },
};
