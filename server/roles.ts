export type UserRole =      |
        "Administrator"     |   // everything
        "Editor/Reviewer"   |   // allows delete
        "Contributor"       |   // no delete
        "User"              |   // read only if signed in
        "Public"            ;   // no need to sign in

// function allow(route: UserRole, request: UserRole) : boolean {

// }
