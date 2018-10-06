import { get } from '@ember/object';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  secretDataPath: 'data.data',
  normalizeItems(payload) {
    let path = this.secretDataPath;
    // move response that is the contents of the secret from the dataPath
    // to `secret_data` so it will be `secretData` in the model
    payload.secret_data = get(payload, path);
    payload = Object.assign({}, payload, payload.data.metadata);
    delete payload.data;
    payload.path = payload.id;
    // return the payload if it's expecting a single object or wrap
    // it as an array if not
    return payload;
  },
  serialize(snapshot) {
    let data = {
      data: snapshot.attr('secretData'),
    };
    if (snapshot.attr('currentVersion')) {
      data.options = {
        cas: snapshot.attr('currentVerion'),
      };
    }

    return data;
  },
});
