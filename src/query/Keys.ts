interface Account {
  acc?: string
}

interface Database {
  db?: string
}

interface Collection {
  col?: string
}

interface Document {
  doc?: string
}

interface TablesDB {
  tdb?: string
}

interface Table {
  tbl?: string
}

interface Row {
  row?: string
}

interface Bucket {
  bucket?: string
}

interface FileResource {
  file?: string
}

interface Actionable {
  actionable?: string
}

interface Execution {
  exec?: string
}

interface Func {
  func?: string
}

interface Team {
  team?: string
}

interface Membership {
  membership?: string
}

interface Locale {
  locale?: string
}

interface Messaging {
  messaging?: string
}

interface Transaction {
  transaction?: string
}

export class Keys<T> {
  private keys: string[] = ['appwrite']
  private _type!: T

  private constructor() {}

  private static create<T>(...segments: string[]) {
    const k = new Keys<T>()
    k.keys.push(...segments)
    return k
  }

  static account() {
    return Keys.create<Account>('account')
  }

  static database(id?: string) {
    return id ? Keys.create<Database>('databases', id) : Keys.create<Database>('databases')
  }

  static tablesDB(id: string) {
    return Keys.create<TablesDB>('tablesdb', id)
  }

  static buckets() {
    return Keys.create<Bucket>('buckets')
  }

  static bucket(id: string) {
    return Keys.create<Bucket>('buckets', id)
  }

  static functions() {
    return Keys.create<Func>('functions')
  }

  static function(id: string) {
    return Keys.create<Func>('functions', id)
  }

  static teams() {
    return Keys.create<Team>('teams')
  }

  static team(id: string) {
    return Keys.create<Team>('teams', id)
  }

  static locale() {
    return Keys.create<Locale>('locale')
  }

  static messaging() {
    return Keys.create<Messaging>('messaging')
  }

  jwt(this: Keys<Account>) {
    this.keys.push('jwt')
    return this as unknown as Keys<Actionable>
  }

  anonymous(this: Keys<Account>) {
    this.keys.push('anonymous')
    return this as unknown as Keys<Actionable>
  }

  emailToken(this: Keys<Account>) {
    this.keys.push('emailToken')
    return this as unknown as Keys<Actionable>
  }

  emailVerification(this: Keys<Account>) {
    this.keys.push('emailVerification')
    return this as unknown as Keys<Actionable>
  }

  magicUrl(this: Keys<Account>) {
    this.keys.push('magicUrl')
    return this as unknown as Keys<Actionable>
  }

  mfaAuthenticator(this: Keys<Account>) {
    this.keys.push('mfaAuthenticator')
    return this as unknown as Keys<Actionable>
  }

  mfaChallenge(this: Keys<Account>) {
    this.keys.push('mfaChallenge')
    return this as unknown as Keys<Actionable>
  }

  mfaCodes(this: Keys<Account>) {
    this.keys.push('mfaCodes')
    return this as unknown as Keys<Actionable>
  }

  oauth2Token(this: Keys<Account>) {
    this.keys.push('oauth2Token')
    return this as unknown as Keys<Actionable>
  }

  phoneToken(this: Keys<Account>) {
    this.keys.push('phoneToken')
    return this as unknown as Keys<Actionable>
  }

  phoneVerification(this: Keys<Account>) {
    this.keys.push('phoneVerification')
    return this as unknown as Keys<Actionable>
  }

  pushTarget(this: Keys<Account>) {
    this.keys.push('pushTarget')
    return this as unknown as Keys<Actionable>
  }

  identity(this: Keys<Account>) {
    this.keys.push('identity')
    return this as unknown as Keys<Actionable>
  }

  prefs(this: Keys<Account>) {
    this.keys.push('prefs')
    return this as unknown as Keys<Actionable>
  }

  login(this: Keys<Account>) {
    this.keys.push('login')
    return this as unknown as Keys<Actionable>
  }

  signUp(this: Keys<Account>) {
    this.keys.push('signUp')
    return this as unknown as Keys<Actionable>
  }

  name(this: Keys<Account>) {
    this.keys.push('name')
    return this as unknown as Keys<Actionable>
  }

  email(this: Keys<Account>) {
    this.keys.push('email')
    return this as unknown as Keys<Actionable>
  }

  phone(this: Keys<Account>) {
    this.keys.push('phone')
    return this as unknown as Keys<Actionable>
  }

  password(this: Keys<Account>) {
    this.keys.push('password')
    return this as unknown as Keys<Actionable>
  }

  recovery(this: Keys<Account>) {
    this.keys.push('recovery')
    return this as unknown as Keys<Actionable>
  }

  mfa(this: Keys<Account>) {
    this.keys.push('mfa')
    return this as unknown as Keys<Actionable>
  }

  status(this: Keys<Account>) {
    this.keys.push('status')
    return this as unknown as Keys<Actionable>
  }

  logs(this: Keys<Account>) {
    this.keys.push('logs')
    return this as unknown as Keys<Actionable>
  }

  verification(this: Keys<Account>) {
    this.keys.push('verification')
    return this as unknown as Keys<Actionable>
  }

  session(this: Keys<Account>, id?: string) {
    this.keys.push('sessions')
    if (id) this.keys.push(id)
    return this as unknown as Keys<Actionable>
  }

  sessions(this: Keys<Account>) {
    return [...this.keys, 'sessions'] as const
  }

  identities(this: Keys<Account>) {
    return [...this.keys, 'identities'] as const
  }

  mfaFactors(this: Keys<Account>) {
    return [...this.keys, 'mfaFactors'] as const
  }

  collections(this: Keys<Database>) {
    this.keys.push('collections')
    return this as unknown as Keys<Collection>
  }

  collection(this: Keys<Database>, id: string) {
    this.keys.push('collections', id)
    return this as unknown as Keys<Collection>
  }

  transactions(this: Keys<Database>) {
    this.keys.push('transactions')
    return this as unknown as Keys<Transaction>
  }

  transaction(this: Keys<Database>, id: string) {
    this.keys.push('transactions', id)
    return this as unknown as Keys<Transaction>
  }

  documents(this: Keys<Collection>) {
    this.keys.push('documents')
    return this as unknown as Keys<Actionable>
  }

  document(this: Keys<Collection>, id: string) {
    this.keys.push('documents', id)
    return this as unknown as Keys<Document>
  }

  operations(this: Keys<Transaction>) {
    this.keys.push('operations')
    return this as unknown as Keys<Actionable>
  }

  table(this: Keys<TablesDB>, id: string) {
    this.keys.push('table', id)
    return this as unknown as Keys<Table>
  }

  row(this: Keys<Table>, id: string) {
    this.keys.push('row', id)
    return this as unknown as Keys<Row>
  }

  files(this: Keys<Bucket>) {
    this.keys.push('files')
    return this as unknown as Keys<Actionable>
  }

  file(this: Keys<Bucket>, id: string) {
    this.keys.push('files', id)
    return this as unknown as Keys<FileResource>
  }

  executions(this: Keys<Func>) {
    this.keys.push('executions')
    return this as unknown as Keys<Actionable>
  }

  execution(this: Keys<Func>, id: string) {
    this.keys.push('executions', id)
    return this as unknown as Keys<Execution>
  }

  teamName(this: Keys<Team>) {
    this.keys.push('name')
    return this as unknown as Keys<Actionable>
  }

  teamPrefs(this: Keys<Team>) {
    this.keys.push('prefs')
    return this as unknown as Keys<Actionable>
  }

  memberships(this: Keys<Team>) {
    this.keys.push('memberships')
    return this as unknown as Keys<Actionable>
  }

  membership(this: Keys<Team>, id: string) {
    this.keys.push('memberships', id)
    return this as unknown as Keys<Membership>
  }

  membershipStatus(this: Keys<Team>) {
    this.keys.push('membershipStatus')
    return this as unknown as Keys<Actionable>
  }

  continents(this: Keys<Locale>) {
    return [...this.keys, 'continents'] as const
  }

  countries(this: Keys<Locale>) {
    return [...this.keys, 'countries'] as const
  }

  countriesEU(this: Keys<Locale>) {
    return [...this.keys, 'countriesEU'] as const
  }

  countriesPhones(this: Keys<Locale>) {
    return [...this.keys, 'countriesPhones'] as const
  }

  currencies(this: Keys<Locale>) {
    return [...this.keys, 'currencies'] as const
  }

  languages(this: Keys<Locale>) {
    return [...this.keys, 'languages'] as const
  }

  codes(this: Keys<Locale>) {
    return [...this.keys, 'codes'] as const
  }

  subscriber(this: Keys<Messaging>) {
    this.keys.push('subscriber')
    return this as unknown as Keys<Actionable>
  }

  create() {
    return [...this.keys, 'create'] as const
  }

  upsert() {
    return [...this.keys, 'upsert'] as const
  }

  update() {
    return [...this.keys, 'update'] as const
  }

  delete() {
    return [...this.keys, 'delete'] as const
  }

  key() {
    return [...this.keys] as const
  }
}
