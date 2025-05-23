Deployment:

1. Ensure that AWS CLI has been setup along with secret and access keys. To verify run command
   aws sts get-caller-identity

2. To build the package. Run command
   npm run build

3. To deploy using AWS CDK. Run command in following order
   cdk synth
   cdl bootstrap
   cdk deploy

   Make a note of the api endpoint url in the Outputs. Needed to make API calls using say Postman.

4. Replace <your_api_key> with your Open Weather Map API Key. Ensure to run the command AFTER EVERY cdk deploy to setup environmant variable.
   aws lambda update-function-configuration --function-name WeatherLambda --environment "Variables={OPEN_WEATHER_MAP_API_KEY=<your_api_key>}"

5. Make the API calls to the 2 endpoints by appending the url from above
   e.g GET '<url>/weather/Melbourne' for current weather
   e.g GET '<url>/weather/history/London?timestamp=1716809591' for historical weather. Make sure to pass timestamp query parameter.

Assumptions / Notes:

1. I am ignoring the Country. So city London might be in US or UK or somewhere else. Same goes for city of Melbourne. That is not accurate.

2. Best practice is to store the secrets in AWS Secrets Manager. I am saving here in an environment variable.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
