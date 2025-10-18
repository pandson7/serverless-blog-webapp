import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class BlogPostingWebappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '101720252116';

    // DynamoDB Table
    const blogTable = new dynamodb.Table(this, `BlogPostsTable-${suffix}`, {
      tableName: `BlogPosts-${suffix}`,
      partitionKey: { name: 'postId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Lambda Functions
    const createPostFunction = new lambda.Function(this, `CreatePostFunction-${suffix}`, {
      functionName: `createBlogPost-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
        const { randomUUID } = require('crypto');

        const client = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          try {
            const body = JSON.parse(event.body);
            const { title, content, author, tags } = body;

            if (!title || !content || !author) {
              return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Title, content, and author are required' })
              };
            }

            const postId = randomUUID();
            const now = new Date().toISOString();

            const post = {
              postId,
              title,
              content,
              author,
              tags: tags || [],
              createdAt: now,
              updatedAt: now,
              status: 'published'
            };

            await docClient.send(new PutCommand({
              TableName: process.env.TABLE_NAME,
              Item: post
            }));

            return {
              statusCode: 201,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify(post)
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Internal server error' })
            };
          }
        };
      `),
      environment: {
        TABLE_NAME: blogTable.tableName
      }
    });

    const getPostsFunction = new lambda.Function(this, `GetPostsFunction-${suffix}`, {
      functionName: `getBlogPosts-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

        const client = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          try {
            const result = await docClient.send(new ScanCommand({
              TableName: process.env.TABLE_NAME,
              FilterExpression: '#status = :status',
              ExpressionAttributeNames: { '#status': 'status' },
              ExpressionAttributeValues: { ':status': 'published' }
            }));

            const posts = result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify(posts)
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Internal server error' })
            };
          }
        };
      `),
      environment: {
        TABLE_NAME: blogTable.tableName
      }
    });

    const getPostFunction = new lambda.Function(this, `GetPostFunction-${suffix}`, {
      functionName: `getBlogPost-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

        const client = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          try {
            const postId = event.pathParameters.id;

            const result = await docClient.send(new GetCommand({
              TableName: process.env.TABLE_NAME,
              Key: { postId }
            }));

            if (!result.Item) {
              return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Post not found' })
              };
            }

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify(result.Item)
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Internal server error' })
            };
          }
        };
      `),
      environment: {
        TABLE_NAME: blogTable.tableName
      }
    });

    const updatePostFunction = new lambda.Function(this, `UpdatePostFunction-${suffix}`, {
      functionName: `updateBlogPost-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

        const client = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          try {
            const postId = event.pathParameters.id;
            const body = JSON.parse(event.body);
            const { title, content, author, tags } = body;

            // Check if post exists
            const existing = await docClient.send(new GetCommand({
              TableName: process.env.TABLE_NAME,
              Key: { postId }
            }));

            if (!existing.Item) {
              return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Post not found' })
              };
            }

            const now = new Date().toISOString();

            const result = await docClient.send(new UpdateCommand({
              TableName: process.env.TABLE_NAME,
              Key: { postId },
              UpdateExpression: 'SET title = :title, content = :content, author = :author, tags = :tags, updatedAt = :updatedAt',
              ExpressionAttributeValues: {
                ':title': title,
                ':content': content,
                ':author': author,
                ':tags': tags || [],
                ':updatedAt': now
              },
              ReturnValues: 'ALL_NEW'
            }));

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify(result.Attributes)
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Internal server error' })
            };
          }
        };
      `),
      environment: {
        TABLE_NAME: blogTable.tableName
      }
    });

    const deletePostFunction = new lambda.Function(this, `DeletePostFunction-${suffix}`, {
      functionName: `deleteBlogPost-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

        const client = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          try {
            const postId = event.pathParameters.id;

            // Check if post exists
            const existing = await docClient.send(new GetCommand({
              TableName: process.env.TABLE_NAME,
              Key: { postId }
            }));

            if (!existing.Item) {
              return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Post not found' })
              };
            }

            await docClient.send(new DeleteCommand({
              TableName: process.env.TABLE_NAME,
              Key: { postId }
            }));

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ message: 'Post deleted successfully' })
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Internal server error' })
            };
          }
        };
      `),
      environment: {
        TABLE_NAME: blogTable.tableName
      }
    });

    // Grant DynamoDB permissions to Lambda functions
    blogTable.grantReadWriteData(createPostFunction);
    blogTable.grantReadData(getPostsFunction);
    blogTable.grantReadData(getPostFunction);
    blogTable.grantReadWriteData(updatePostFunction);
    blogTable.grantReadWriteData(deletePostFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, `BlogApi-${suffix}`, {
      restApiName: `blog-api-${suffix}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    const posts = api.root.addResource('posts');
    posts.addMethod('GET', new apigateway.LambdaIntegration(getPostsFunction));
    posts.addMethod('POST', new apigateway.LambdaIntegration(createPostFunction));

    const singlePost = posts.addResource('{id}');
    singlePost.addMethod('GET', new apigateway.LambdaIntegration(getPostFunction));
    singlePost.addMethod('PUT', new apigateway.LambdaIntegration(updatePostFunction));
    singlePost.addMethod('DELETE', new apigateway.LambdaIntegration(deletePostFunction));

    // S3 Bucket for frontend hosting
    const websiteBucket = new s3.Bucket(this, `WebsiteBucket-${suffix}`, {
      bucketName: `blog-webapp-${suffix}`,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html'
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, `Distribution-${suffix}`, {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Blog API URL'
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Website URL'
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name'
    });
  }
}