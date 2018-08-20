import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, attachment = :attachment, walkstart = :walkstart, walkend = :walkend, latitude = :latitude, longitude = :longitude, updated = :updated",
    ExpressionAttributeValues: {
      ":attachment": data.attachment ? data.attachment : null,
      ":content": data.content ? data.content : null,
      ":walkstart": data.walkstart ? data.walkstart : null,
      ":walkend": data.walkend ? data.walkend : null,
      ":latitude": data.latitude ? data.latitude : null,
      ":longitude": data.longitude ? data.longitude : null,
      ":updated": Date.now()
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
