import { apiCaller } from '@/utils/apiCaller';
import invariant from '@/utils/invariant';
import { isEmail } from '@/utils/isEmail';

const MAILCHIMP_URL = 'https://mailchimp-subscribe-kx654nxi2q-uc.a.run.app';

const subscribe = async (audienceId: string, email: string) => {
  invariant(isEmail(email), 'Invalid email');
  invariant(audienceId, 'audienceId is required');
  invariant(email, 'email is required');

  return await apiCaller.post(MAILCHIMP_URL, {
    email_address: email,
    list_id: audienceId,
  });
};

export default subscribe;
