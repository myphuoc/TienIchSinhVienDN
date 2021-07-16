import { firestore } from "firebase/app";
import constants from '../constants';
import moment from 'moment';
import _ from 'lodash';

const ref = firestore().collection(constants.COLLECTION.SHARED_EXPERIENCE);

export default {
  async getPosts(all = false, uid = null) {
    let query = ref
    if (!all) query = query.where('status', '==', constants.STATUS.APPROVED)
    if (uid) query = query.where('createdBy.uid', '==', uid)
    const snapshot = await query.get()
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return _.orderBy(posts, ['createdAt'], ['desc']);
  },
  async addPost(data) {
    return await ref.doc().set({
      ...data,
      status: constants.STATUS.APPROVED,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
      deletedAt: null
    })
  },
  async updatePost(id, data) {
    return await ref.doc(id).update({
      ...data,
      updatedAt: moment().valueOf()
    })
  },
  async deletePost(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.DELETED,
      deletedAt: moment().valueOf()
    })
  },
  async restorePost(id) {
    return await ref.doc(id).update({
      status: constants.STATUS.PENDING,
      deletedAt: null
    })
  },
};
