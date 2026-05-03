import type { TranslationKeys } from './en';

export const fr: TranslationKeys = {
  app: { name: 'FB Admin', tagline: 'Plateforme d\'Opérations Entreprise' },
  nav: {
    dashboard: 'Tableau de Bord', users: 'Utilisateurs', products: 'Produits', orders: 'Commandes',
    categories: 'Catégories', notifications: 'Notifications', auditLogs: 'Journal d\'Audit',
    settings: 'Paramètres', analytics: 'Analytique',
  },
  auth: {
    signIn: 'Connexion', signOut: 'Déconnexion', email: 'Adresse e-mail', password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi', forgotPassword: 'Mot de passe oublié ?', login: 'Se Connecter',
    loginSubtitle: 'Entrez vos identifiants pour accéder à la plateforme',
    forgotTitle: 'Réinitialiser le Mot de Passe', forgotSubtitle: 'Entrez votre e-mail pour recevoir un lien de réinitialisation',
    sendReset: 'Envoyer le Lien', backToLogin: 'Retour à la Connexion',
    resetTitle: 'Nouveau Mot de Passe', resetSubtitle: 'Entrez votre nouveau mot de passe ci-dessous',
    resetButton: 'Réinitialiser', resetSuccess: 'Mot de passe réinitialisé avec succès',
    forgotSuccess: 'Lien de réinitialisation envoyé à votre e-mail',
    invalidCredentials: 'E-mail ou mot de passe invalide',
    newPassword: 'Nouveau Mot de Passe', confirmPassword: 'Confirmer le Mot de Passe',
  },
  dashboard: {
    title: 'Tableau de Bord', totalRevenue: 'Revenu Total', totalOrders: 'Total Commandes',
    totalUsers: 'Total Utilisateurs', totalProducts: 'Total Produits', revenueChart: 'Tendance des Revenus',
    ordersByStatus: 'Commandes par Statut', visitors: 'Visiteurs', recentOrders: 'Commandes Récentes',
    topProducts: 'Meilleurs Produits', conversionRate: 'Taux de Conversion', avgOrderValue: 'Valeur Moyenne',
    salesGrowth: 'Croissance des Ventes', refundRate: 'Taux de Remboursement', revenueByRegion: 'Revenu par Région',
    last30Days: '30 derniers jours', last7Days: '7 derniers jours', last90Days: '90 derniers jours',
  },
  users: {
    title: 'Utilisateurs', search: 'Rechercher des utilisateurs...', addUser: 'Ajouter un Utilisateur',
    editUser: 'Modifier l\'Utilisateur', name: 'Nom', email: 'E-mail', role: 'Rôle',
    department: 'Département', status: 'Statut', actions: 'Actions',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
  },
  products: {
    title: 'Produits', search: 'Rechercher des produits...', addProduct: 'Ajouter un Produit',
    editProduct: 'Modifier le Produit', name: 'Nom', sku: 'SKU', price: 'Prix', stock: 'Stock',
    rating: 'Note', status: 'Statut', category: 'Catégorie', description: 'Description',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
    lowStockAlert: 'Alerte Stock Bas', outOfStock: 'Rupture de Stock',
  },
  orders: {
    title: 'Commandes', search: 'Rechercher des commandes...', orderId: 'ID Commande',
    customer: 'Client', status: 'Statut', payment: 'Paiement', total: 'Total', date: 'Date',
    all: 'Toutes', pending: 'En Attente', processing: 'En Traitement', shipped: 'Expédiée',
    delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
    orderDetails: 'Détails de la Commande', timeline: 'Chronologie', updateStatus: 'Modifier le Statut',
  },
  settings: {
    title: 'Paramètres', general: 'Général', appearance: 'Apparence', security: 'Sécurité',
    notifications: 'Notifications', branding: 'Marque', language: 'Langue',
    theme: 'Thème', dark: 'Sombre', light: 'Clair', system: 'Système',
    companyName: 'Nom de l\'Entreprise', companyLogo: 'Logo de l\'Entreprise', timezone: 'Fuseau Horaire',
    currency: 'Devise', save: 'Enregistrer', saved: 'Paramètres enregistrés avec succès',
  },
  common: {
    save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', add: 'Ajouter',
    search: 'Rechercher...', noResults: 'Aucun résultat trouvé', loading: 'Chargement...',
    confirm: 'Confirmer', yes: 'Oui', no: 'Non', close: 'Fermer', actions: 'Actions',
    export: 'Exporter', import: 'Importer', filter: 'Filtrer', refresh: 'Actualiser',
    viewAll: 'Voir Tout', back: 'Retour', next: 'Suivant', previous: 'Précédent',
  },
};
