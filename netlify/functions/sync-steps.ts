import { Handler } from "@netlify/functions";
import { getXataClient } from "../../src/xata";

const handler: Handler = async (event) => {
  if (event.headers["X-Secret"] !== process.env.SECRET) {
    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }

  const body = JSON.parse(event.body ?? "{}");

  const dates: string[] = body.steps.dates.split("\n");
  const values: string[] = body.steps.values.split("\n");

  const stepsToSync = values.map((value, i) => {
    return {
      value: Number(value),
      datetime: new Date(dates[i]),
    };
  });

  const xata = getXataClient();

  const recoredSteps = await xata.db.Steps.filter({
    $all: [
      { datetime: { $ge: new Date(stepsToSync[0].datetime) } },
      {
        datetime: {
          $le: new Date(stepsToSync[stepsToSync.length - 1].datetime),
        },
      },
    ],
  }).getAll();

  const unrecoredSteps = stepsToSync.filter((step) => {
    return !recoredSteps.find((recoredStep) => {
      return (
        recoredStep.datetime.getTime() === step.datetime.getTime() &&
        recoredStep.value === step.value
      );
    });
  });

  const newSteps = await xata.db.Steps.create(unrecoredSteps);

  return {
    statusCode: 200,
    body: JSON.stringify({ stepsToSync, recoredSteps, newSteps }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export { handler };
