import { Handler } from '@netlify/functions'
import { getXataClient } from '../../src/xata'

const STEPS_TO_WATCHTIME_FACTOR = 5 * 60 // 1000 stesps = 5 minute
function calcWatchtimeLeft(totalSteps: number | null, totalWatchtime: number | null) {
  return Math.max(0, (totalSteps ?? 0) * STEPS_TO_WATCHTIME_FACTOR - (totalWatchtime ?? 0));
}

export const handler: Handler = async (event) => {
  const xata = getXataClient();

  const { aggs: { totalSteps } } = await xata.db.Steps.aggregate({ 
    totalSteps: { sum: { column: 'value' } }
  });
  const { aggs: { totalWatchtime } }= await xata.db.WatchTime.aggregate({ 
    totalWatchtime: { sum: { column: 'ms' } }
  });

  const watchtimeLeft = calcWatchtimeLeft(totalSteps, totalWatchtime); 

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body ?? '{}') as { ms: number, datetime: string }

    await xata.db.WatchTime.create({
      ms: Number(body.ms), 
      datetime: new Date(body.datetime) 
    })
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ watchtimeLeft }),
    headers: {
      'Content-Type': 'application/json',
    }
  };
};

