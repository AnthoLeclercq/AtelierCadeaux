const { insertEnumValues } = require('./metaHelper.js');
const { indexData } = require('./elasticsearchDataHelper.js');

const functionName = process.argv[2];

/*
    This file must be call manually when we need to call a function.
    In a terminal : node callHelper.js <functionName>
*/
switch (functionName) {
    case "insertEnumValues":
        insertEnumValues();
        break;

    case "indexData":
        indexData();
        break;
    default:
        console.log("Unknow function : " + functionName);
}
