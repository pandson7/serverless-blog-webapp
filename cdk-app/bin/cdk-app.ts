#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BlogPostingWebappStack } from '../lib/cdk-app-stack';

const app = new cdk.App();
new BlogPostingWebappStack(app, 'BlogPostingWebappStack-101720252116', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});