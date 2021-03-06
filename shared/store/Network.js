import { observable, ObservableMap, toJS } from 'mobx';
import axios, { CancelToken } from 'axios';

/**
 * This store handles network requests.
 */
export default class Network {
  constructor({ network = {}, cookies = null }) {
    // Set history from state
    this.history.replace(network.history);

    this.cookies = cookies;
  }

  /**
   * Keep a history map of network requests for
   * throttling them.
   * @var {Map} The key is url.
   */
  @observable
  history = new ObservableMap();

  createCookieJar() {
    const jar = [];
    const cookies = this.cookies || {};

    Object.keys(cookies).forEach((key) => {
      const value = cookies[key];
      jar.push(`${key}=${value}`);
    });

    return jar.join('; ');
  }

  /**
   * Extended fetch method with credentials needed
   * to make http requests to the API.
   * @param {string} Url
   * @param {object} Options
   * @return {Promise}
   */
  fetch = (url, { maxAge = Infinity, force = false, ...rest } = {}) => {
    const { history } = this;

    if (!history.has(url)) {
      history.set(url, {});
    }

    // Get reference point to history item
    const item = history.get(url);

    // Return already running promise if available.
    // Unless force flag is in options.
    if (!force && item.promise && item.promise.then) {
      return item.promise;
    }

    // Return cache if still valid
    // Unless force flag is in options.
    if (!force && item.data) {
      const now = new Date().getTime();

      if ((now / 1000) - (item.ts / 1000) <= maxAge) {
        return Promise.resolve(toJS(item.data));
      }
    }

    // Adds cancel token
    // Store the cancel method in the `cancel` variable
    let cancel;

    const config = Object.assign({
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    }, rest);

    if (this.cookies) {
      config.headers = {};
      config.headers.Cookie = this.createCookieJar();
    }

    // Create a promisified callback function to be ran by p-retry.
    const promise = axios
      .get(url, config)
      .then((res) => {
        // Set timestamp and data to history cache
        item.ts = new Date().getTime();
        item.data = res.data;
        delete item.promise;
        return res.data;
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          // Nothing to do, really
        } else {
          // Delete promise so we know we're not running anything for this url anymore.
          delete item.promise;
          throw err;
        }
      });

    // Attach the cancel method to the promise
    promise.cancel = cancel;
    // Attach promise to history item for further use
    item.promise = promise;

    return promise;
  }
}
