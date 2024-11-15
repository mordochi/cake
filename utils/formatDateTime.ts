import { dayjs } from '@/utils/dayjs';

const formatDateTime = (input: string) =>
  dayjs(input).format('YYYY/MM/DD HH:mm:ss');

export default formatDateTime;
