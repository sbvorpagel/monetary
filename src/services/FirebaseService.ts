import { firebaseDatabase } from '../utils/firebase';

export default class FirebaseService {
  static getDataList = (nodePath: string, callback: Function) => {

    const query = firebaseDatabase.ref(nodePath);

    query.on('value', (dataSnapshot) => {
      const snap = dataSnapshot.val();
      const newData: any = [];
      const keys = Object.keys(snap || {});
      keys.forEach((key) => {
        newData.push(snap[key]);
      });
      callback(newData);
    });

    return query;
  };

  static pushData = (node: string, objToSubmit: any) => {
    const ref = firebaseDatabase.ref(node).push();
    const id = ref.key;
    ref.set(objToSubmit);
    return id;
  };

  static remove = (id: string, node: string) => {
    return firebaseDatabase.ref(`${node}/${id}`).remove();
  };

  static getUniqueDataBy = (node: string, id: string, callback: Function) => {
    const ref = firebaseDatabase.ref(node + '/' + id);
    let newData: any = {};

    ref.once('value', (dataSnapshot) => {
      if (!dataSnapshot) {
        callback(null);
        return;
      }
      const snap = dataSnapshot.val();
      const keys = Object.keys(snap || {});
      keys.forEach((key) => {
        newData[key] = snap[key]
      });
    }).then(() => {
      callback(newData);
    });
  };

  static updateData = (id: string, node: string, obj: any) => {
    return firebaseDatabase.ref(`${node}/${id}`).set({ ...obj });
  };
}
