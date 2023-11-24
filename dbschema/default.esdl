module default {
    scalar type ContentType extending enum<Image, Video, Audio, Document, Dataset>;
    scalar type UserRole extending enum<Administrator, Editor, Contributor, User>;
    scalar type IncidentType extending enum<
        'Forced Labour',
        'Cyberattack and Espionage',
        'Surveillance',
        'Verbal and Psychological Aggression',
        'Vandalism',
        'Sabotage and Arson',
        'Environment Destruction',
        'Civil Infrastructure Destruction',
        'Assault',
        'Armed Assault',
        'Firearm Assault',
        'Military Assault',
        'Missile Strike and Bombardment',
        'Chemical and Biological Attack',
        'Torture',
        'Sexual Violence',
        'Desecration and Destruction of Heritage Site',
        'Detention, Abduction, and Kidnapping',
        'Dispossession, Theft, Robbery, and Extortion'
    >;

    #
    abstract type Base {
        notes: str;
        tags: array<str>;
    }

    #
    type GenocideContext extending Base {
        required slug: str;
        required name: str;
        mapDefaultGeoCoord: tuple<lat: float32, lng: float32>;
        mapDefaultZoom: int16;
        multi link testimonies := .<context[is Evidence];
        nTestimonies := count(__source__.testimonies);
    }

    #
    scalar type EvidenceType extending enum<
        'Direct Evidence: Photograph Footage', 
        'Direct Evidence: Film Footage', 
        'Direct Evidence: Audio Footage', 
        'Direct Evidence: Memo', 
        'Direct Evidence: Email',
        'Direct Evidence: Social Media Post', 
        'Direct Evidence: Website Content',
        'Direct Evidence: Interview', 
        'Direct Evidence: Witness Statement',
        'Direct Evidence: Vlog', 
        'Direct Evidence: Other', 
        'Indirect Evidence: Report',
        'Indirect Evidence: Research Paper',
        'Indirect Evidence: Scientific Study',
        'Indirect Evidence: Survey Data',
        'Indirect Evidence: Expert Testimony',
        'Indirect Evidence: Financial Record',
        'Indirect Evidence: Medical Record',
        'Indirect Evidence: Government Report',
        'Indirect Evidence: Public Record',
        'Indirect Evidence: Other'
    >;

    # 
    type Evidence extending Base {
        # information about the uploaded evidence file
        required contentURL: str;
        required contentType: ContentType;
        required contentHash: str;
        # context that the evidence pertains to
        required context: GenocideContext;
        # information about the evidence
        required title: str;
        required evidenceType: EvidenceType;
        required incidentType: array<IncidentType>;
        # geospatial info
        dateTime: datetime;
        geoCoord: tuple<lat: float32, lng: float32>;
        # contributors
        multi authors: Individual;
        multi individualPublishers: Individual;
        multi organisationalPublishers: Organisation;
    }
    
    # Contributors
    abstract type OnlinePresence {
        linkedIn: str;
        instagram: str;
        facebook: str;
        twitter: str;
        website: str;
        email: str;
        rumble: str;
        locals: str;
        patreon: str;
        telegram: str;
    }

    #
    type Individual extending Base, OnlinePresence {
        required name: str;
        multi link authored := .<authors[is Evidence];
        multi link published := .<individualPublishers[is Evidence];
        nAuthored := count(__source__.authored);
        nPublished := count(__source__.published);
    }

    #
    type Organisation extending Base, OnlinePresence {
        required name: str;
        multi link published := .<organisationalPublishers[is Evidence];
        nPublished := count(__source__.published);
    }

    #
    type User extending Individual {
        overloaded required email: str;
        required role: UserRole;
        awaitingDeletion: bool;
    }
}
