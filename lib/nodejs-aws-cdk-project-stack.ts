import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class WeatherApiCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Lambda function
    const weatherLambda = new lambda.Function(this, 'WeatherLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/weatherHandler.handler',
      code: lambda.Code.fromAsset('dist'),
    });

    // Create the HTTP API
    const api = new apigateway.HttpApi(this, 'WeatherHttpApi', {
      apiName: 'WeatherService',
      description: 'API service for fetching weather data.',
    });

    // Add routes to the API
    api.addRoutes({
      path: '/weather/{city}',
      methods: [apigateway.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration('WeatherLambdaIntegration', weatherLambda),
    });

    // Create the DynamoDB table
    const table = new dynamodb.Table(this, 'WeatherLogs', {
      tableName: 'WeatherLogs',
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 20,
      writeCapacity: 20,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Grant the Lambda function permissions to write to the DynamoDB table
    table.grantWriteData(weatherLambda);

    // Output the API endpoint
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.apiEndpoint,
    });
  }
}
