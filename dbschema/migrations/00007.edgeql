CREATE MIGRATION m1yuegl4wibc4mjh6dhqwfmagwup6rut73ozs6dcascdkbi6y7squq
    ONTO m1obz2qeh2worq7bdofb6yzwivxxrglomzzed5dj56af44qt7nfd2a
{
  ALTER SCALAR TYPE default::UserRole EXTENDING enum<Administrator, Editor, Contributor, User>;
};
