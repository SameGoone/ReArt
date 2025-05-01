type Post = {
    id: string
    body: string
    createdOn: string
    owner: Owner
}

type Owner = {
    displayName: string
    bio: string
    id: string
    userName: string
    normalizedUserName: string
    email: string
    normalizedEmail: string
    emailConfirmed: boolean
    passwordHash: string
    securityStamp: string
    concurrencyStamp: string
    phoneNumber: string
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean
    lockoutEnd: string
    lockoutEnabled: boolean
    accessFailedCount: number
}