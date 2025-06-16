import mongoose from 'mongoose';

const chantierSchema = mongoose.Schema({
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
    longueur: { type: Number, default: 0 }, // Champ réel pour la longueur
    debut: { type: String, minLength: 2, maxLength: 150, required: true },
    fin: { type: String, minLength: 2, maxLength: 150, required: true },
   categorie: {
    type: String,
    enum: [
      'terrassement',
      'fondation',
      'nivellement',
      'drainage',
      'compactage',
      'géotextile',
      'profilage',
      'reprofilage',
      'buttage',
      'enrobé',
      'curage'
    ],
    required: true
  },
    description: { type: String, minLength: 10, maxLength: 1000, required: true },
    images: { type: [String], validate: (v) => Array.isArray(v) && v.length > 0 },
    uid: { type: String, required: true },
    uName: { type: String, required: true },
    uImage: { type: String, default: '' }
}, { timestamps: true });

const parsePK = (value) => {
    const km = parseInt(value.substring(2, value.indexOf('+')));
    const meters = parseInt(value.substring(value.indexOf('+') + 1));
    return (km * 1000) + meters;
};

const parseProfile = (value) => {
    const profileNumber = parseInt(value.substring(1));
    return profileNumber * 20;
};

chantierSchema.pre('save', function(next) {
    const debut = this.debut;
    const fin = this.fin;

    let debutMeters, finMeters;

    if (debut.startsWith('PK') && fin.startsWith('PK')) {
        debutMeters = parsePK(debut);
        finMeters = parsePK(fin);
    } else if (debut.startsWith('P') && fin.startsWith('P')) {
        debutMeters = parseProfile(debut);
        finMeters = parseProfile(fin);
    } else {
        this.longueur = 0;
        return next();
    }

    this.longueur = finMeters - debutMeters;
    next();
});

const Chantier = mongoose.model('chantiers', chantierSchema);

export default Chantier;
