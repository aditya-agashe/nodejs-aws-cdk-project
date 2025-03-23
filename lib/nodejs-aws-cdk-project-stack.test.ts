import { Template } from 'aws-cdk-lib/assertions';
import { WeatherApiCdkStack } from './nodejs-aws-cdk-project-stack';
import { App } from 'aws-cdk-lib';

describe('WeatherApiCdkStack', () => {
  const app = new App();
  const stack = new WeatherApiCdkStack(app, 'WeatherApiCdkStackTest');

  const template = Template.fromStack(stack);

  it('creates a Lambda function with the correct properties', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs20.x',
      Handler: 'handlers/weatherHandler.handler',
    });
  });

  it('creates an HTTP API gateway', () => {
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1);
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: 'WeatherService',
      Description: 'API service for fetching weather data.',
    });
  });

  it('adds routes to the HTTP API', () => {
    template.hasResource('AWS::ApiGatewayV2::Route', {
      Properties: {
        RouteKey: 'GET /weather/{city}',
      },
    });
  });

  it('creates a DynamoDB table with the correct properties', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'WeatherLogs',
      ProvisionedThroughput: {
        ReadCapacityUnits: 20,
        WriteCapacityUnits: 20,
      },
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
    });
  });

  it('grants the Lambda function write access to the DynamoDB table', () => {
    template.hasResource('AWS::IAM::Policy', {
      Properties: {
        PolicyDocument: {
          Statement: [
            {
              Action: ['dynamodb:BatchWriteItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem', 'dynamodb:DescribeTable'],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': ['WeatherLogsED81F592', 'Arn'],
                },
                { Ref: 'AWS::NoValue' },
              ],
            },
          ],
        },
      },
    });
  });

  it('outputs the API endpoint', () => {
    template.hasOutput('APIEndpoint', {
      Value: {
        'Fn::GetAtt': ['WeatherHttpApi200D6148', 'ApiEndpoint'],
      },
    });
  });
});
