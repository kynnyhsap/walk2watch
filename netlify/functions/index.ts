import { Handler } from '@netlify/functions'

const handler: Handler = async (event, context) => {
  const body = JSON.parse(event.body ?? '{}')

  const startDates = body.steps.startDates.split("\n")
  const endDates = body.steps.endDates.split("\n")
  const values = body.steps.values.split("\n")

  const steps = values.map((value, i) => {
    return {
      value,
      startDate: startDates[i],
      endDate: endDates[i],
    }
  })

  console.log(steps);

  return {
    statusCode: 200,
    body: JSON.stringify({ steps }),
  };
};

export { handler }
