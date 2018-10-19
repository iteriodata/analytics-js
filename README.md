### javascript-tracker

### Local development

Install the project dependencies
```
npm install
```

Watches/lints/tests source code after change
````
npm run build:dev:watch
````


### Build deploy to cloudfronT

```shell
# update dependencies
$ npm install

# sets up a build folder
$ npm run build

# push build to S3 for Cloudfront distribution
$ aws s3 cp ./dist/i.min.js s3://${S3_BUCKET_NAME}/
$ aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths /i.min.js
```


### Tests

You need to test all functions before build.
To start a test run `npm run test:dev` having preinstalled browsers (Chrome, Opera, Safari).

To properly run tests on Safari execute the following command ([problem refference](https://github.com/karma-runner/karma-safari-launcher/issues/20)):

```shell
defaults write com.apple.Safari ApplePersistenceIgnoreState YES
```


#### End-to-end tests with nightwatch

Write your tests using http://nightwatchjs.org/ in tests/e2e folder.
```shell
# Install selenium-server-standalone to your system. For example use brew for Mac OS
$ brew install selenium-server-standalone

# run selenium server
$ npm run selenium

# run demo project - required for some tests (npm install should be executed inside to fetch dependencies)
$ npm run serve:demo

# run tests in separate cmd
$ npm run test:e2e
```
