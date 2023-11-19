export type UserRole =      |
        "Administrator"     |   // everything
        "Editor"            |   // allows delete
        "Contributor"       |   // no delete
        "User"              |   // read only if signed in
        "Public"            ;   // no need to sign in
