CREATE MIGRATION m1s6r5zmg73detdom47el64tmfs4emnvytxmoyokvtppy34ahyp64a
    ONTO m17id62tb4xkwv6yu54epkqmf3hef7owxknxjwl6xgxqvrwkzvfmrq
{
  ALTER TYPE default::OnlinePresence {
      CREATE PROPERTY telegram: std::str;
  };
};
