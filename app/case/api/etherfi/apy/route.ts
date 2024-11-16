import { apiCaller } from '@/utils/apiCaller'
import { tryExecuteRequest } from '@/utils/tryExecute'

export async function GET() {
  const apiUrl = `https://www.etherfi.bid/api/etherfi/apr`
  const [res, err] = await tryExecuteRequest(() => apiCaller.get(apiUrl))
  if (err) {
    return Response.json({ status: err.status })
  }
  return Response.json(res)
}
