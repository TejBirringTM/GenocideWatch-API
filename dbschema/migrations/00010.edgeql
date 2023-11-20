CREATE MIGRATION m1xgprutx6bt66wza6d7du6knqakhswbeah2d62zikbuvi4lrzkh6a
    ONTO m1oelufks6a3a57uvzh7fa4ktnowzq2yza4dgcpx4pfwoul2n6qreq
{
  ALTER SCALAR TYPE default::EvidenceType EXTENDING enum<`Direct Evidence: Photograph Footage`, `Direct Evidence: Film Footage`, `Direct Evidence: Audio Footage`, `Direct Evidence: Memo`, `Direct Evidence: Email`, `Direct Evidence: Social Media Post`, `Direct Evidence: Website Content`, `Direct Evidence: Interview`, `Direct Evidence: Witness Statement`, `Direct Evidence: Vlog`, `Direct Evidence: Other`, `Indirect Evidence: Report`, `Indirect Evidence: Research Paper`, `Indirect Evidence: Scientific Study`, `Indirect Evidence: Survey Data`, `Indirect Evidence: Expert Testimony`, `Indirect Evidence: Financial Record`, `Indirect Evidence: Medical Record`, `Indirect Evidence: Government Report`, `Indirect Evidence: Public Record`, `Indirect Evidence: Other`>;
};
