# Notrello v2

Notrello v2 est une application moderne de gestion de tâches inspirée de Trello, construite avec les technologies suivantes :

- Next.js pour le frontend
- PayloadCMS pour le backend
- MongoDB pour la base de données
- TailwindCSS pour le style

## 🚀 Fonctionnalités actuelles

- Interface utilisateur moderne et responsive
- Gestion des utilisateurs avec authentification
- Système de gestion de médias intégré
- Architecture scalable et maintenable

## 🛠️ Installation

1. Clonez le repository :

```bash
git clone [URL_DU_REPO]
cd notrello-v2
```

2. Installez les dépendances :

```bash
pnpm install
```

3. Configurez les variables d'environnement en copiant le fichier d'exemple puis
   en renseignant les valeurs adaptées :

```bash
cp .env.example .env
```

Les variables à définir incluent notamment `PAYLOAD_SECRET`, `DATABASE_URI` et
`PAYLOAD_PUBLIC_SERVER_URL`.

4. Démarrez l'application en mode développement :

```bash
pnpm dev
```

L'application sera accessible à l'adresse : http://localhost:3000

## 🐳 Installation avec Docker

Pour une installation plus simple, vous pouvez utiliser Docker :

1. Configurez votre fichier `.env`
2. Lancez les conteneurs :

```bash
docker-compose up
```

## 🔮 Évolutions futures

### Court terme

- [ ] Implémentation du système de tableaux et de cartes
- [ ] Système de drag & drop pour les cartes
- [ ] Gestion des étiquettes et des couleurs
- [ ] Système de commentaires sur les cartes

### Moyen terme

- [ ] Intégration de notifications en temps réel
- [ ] Système de recherche avancée
- [ ] Export/Import de données
- [ ] Intégration avec des services externes (Google Calendar, etc.)

### Long terme

- [ ] Version mobile native
- [ ] Mode hors-ligne
- [ ] Tableaux de bord personnalisables
- [ ] API publique pour les intégrations

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
