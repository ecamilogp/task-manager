import { Notify } from 'quasar';
import NOTIFY_OPTIONS from '@/constants/notifyOptions';

/**
 * Function that receive a message and show
 * a quasar notify with positive color and the message.
 * @param type => Notify type
 * @param message => Notify message
 */
export function showNotify(
  type: 'positive' | 'negative',
  message: string,
  actions?: any[]
): void {
  Notify.create({
    ...NOTIFY_OPTIONS[type],
    message,
    actions,
    timeout: 1000,
  });
}

export default showNotify;
