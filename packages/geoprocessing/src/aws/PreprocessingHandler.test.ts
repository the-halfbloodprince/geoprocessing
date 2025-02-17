import { PreprocessingHandler } from "./PreprocessingHandler";
import { ValidationError } from "../types";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

const feature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-119.87817764282225, 34.377870792354564],
        [-119.84384536743164, 34.377870792354564],
        [-119.84384536743164, 34.41229136345307],
        [-119.87817764282225, 34.41229136345307],
        [-119.87817764282225, 34.377870792354564],
      ],
    ],
  },
};

const simpleHandler = new PreprocessingHandler(
  async (feature) => {
    return feature;
  },
  {
    title: "handler",
    description: "description",
    timeout: 2,
    requiresProperties: [],
  }
);

test("Makes options available as an instance var", () => {
  expect(simpleHandler.options).toBeInstanceOf(Object);
  expect(simpleHandler.options.title).toBe("handler");
});

test("Returns successful output as geojson", async () => {
  const results = await simpleHandler.lambdaHandler(
    { body: JSON.stringify({ feature }), headers: {} } as APIGatewayProxyEvent,
    {} as Context
  );
  expect(results.statusCode).toBe(200);
  const body = JSON.parse(results.body);
  expect(body.data.type).toBe("Feature");
});

test("Rejects misshapen requests", async () => {
  const results = await simpleHandler.lambdaHandler(
    {
      body: JSON.stringify({ data: feature }),
      headers: {},
    } as APIGatewayProxyEvent,
    {} as Context
  );
  expect(results.statusCode).toBe(500);
  const body = JSON.parse(results.body);
  expect(body.status).toBe("error");
});

test("Returns validation errors", async () => {
  const handler = new PreprocessingHandler(
    async (feature) => {
      throw new ValidationError("Out of bounds");
    },
    {
      title: "handler",
      description: "description",
      timeout: 2,
      requiresProperties: [],
    }
  );
  const results = await handler.lambdaHandler(
    {
      body: JSON.stringify({ feature }),
      headers: {},
    } as APIGatewayProxyEvent,
    {} as Context
  );
  expect(results.statusCode).toBe(200);
  const body = JSON.parse(results.body);
  expect(body.status).toBe("validationError");
  expect(body.error).toBe("Out of bounds");
});

test("500 errors are returned to clients", async () => {
  const handler = new PreprocessingHandler(
    async (feature) => {
      throw new Error("I/O Error");
    },
    {
      title: "handler",
      description: "description",
      timeout: 2,
      requiresProperties: [],
    }
  );
  const results = await handler.lambdaHandler(
    {
      body: JSON.stringify({ feature }),
      headers: {},
    } as APIGatewayProxyEvent,
    {} as Context
  );
  expect(results.statusCode).toBe(500);
  const body = JSON.parse(results.body);
  expect(body.status).toBe("error");
  expect(body.error).toBe("I/O Error");
});
