import { Keys } from './Keys'

console.log(Keys.account().key())
console.log(Keys.account().jwt().create())
console.log(Keys.database('dbId').key())
console.log(Keys.database('dbId').collection('colId').key())
console.log(Keys.locale().key())
console.log(Keys.team('teamId').memberships().key())
console.log(Keys.bucket('bucketId').files().key())
console.log(Keys.function('funcId').executions().key())
