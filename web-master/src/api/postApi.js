import { firestore } from "firebase/app";
import constants from '../constants';
import moment from 'moment';
import _ from 'lodash';

export default {
  async getPosts(all = false, uid = null) {
    let query = firestore().collection(constants.COLLECTION.SHARED_EXPERIENCE)
    if (!all) query = query.where('status', '==', constants.STATUS.APPROVED)
    if (uid) query = query.where('createdBy.uid', '==', uid)
    const snapshot = await query.get()
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return _.orderBy(posts, ['createdAt'], ['desc']);
  },
  async addPost(data) {
    return await firestore().collection(constants.COLLECTION.SHARED_EXPERIENCE).doc().set({
      ...data,
      status: constants.STATUS.PENDING,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
      deletedAt: null
    })
  },
  async updatePost(id, data) {
    return await firestore().collection(constants.COLLECTION.SHARED_EXPERIENCE).doc(id).update({
      ...data,
      status: constants.STATUS.PENDING,
      updatedAt: moment().valueOf()
    })
  },
  async deletePost(id) {
    return await firestore().collection(constants.COLLECTION.SHARED_EXPERIENCE).doc(id).update({
      status: constants.STATUS.DELETED,
      deletedAt: moment().valueOf()
    })
  },
  async restorePost(id) {
    return await firestore().collection(constants.COLLECTION.SHARED_EXPERIENCE).doc(id).update({
      status: constants.STATUS.PENDING,
      deletedAt: null
    })
  },
};
