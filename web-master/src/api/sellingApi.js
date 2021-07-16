import { firestore } from "firebase/app";
import constants from '../constants';
import moment from 'moment';
import _ from 'lodash';

const ref = firestore().collection(constants.COLLECTION.SELLING);

export default {
  async getStuffs(all = false, uid = null) {
    let query = ref
    if (!all) query = query.where('status', '==', constants.STATUS.APPROVED)
    if (uid) query = ref.where('createdBy.uid', '==', uid)
    const snapshot = await query.get()
    const stuffs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return _.orderBy(stuffs, ['createdAt'], ['desc']);
  },
  async addStuff(data) {
    return await ref.doc().set({
      ...data,
      status: constants.STATUS.PENDING,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
      deletedAt: null
    })
  },
  async updateStuff(id, data) {
    return await ref.doc(id).update({
      ...data,
      status: constants.STATUS.PENDING,
      updatedAt: moment().valueOf()
    })
  },
  async hideStuff(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.HIDDEN,
      updatedAt: moment().valueOf()
    })
  },
  async deleteStuff(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.DELETED,
      deletedAt: moment().valueOf()
    })
  },
  async restoreStuff(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.PENDING,
      deletedAt: null
    })
  },
};
