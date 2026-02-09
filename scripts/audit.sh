#!/bin/bash

# Script d'audit automatisé du portfolio
# Lance les agents d'accessibilité, de revue de code et la checklist de déploiement

set -e  # Arrêter en cas d'erreur

# Configuration
REPORTS_DIR="reports"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Audit automatisé du portfolio           ║${NC}"
echo -e "${BLUE}║   Date: $DATE                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Créer le dossier de rapports si nécessaire
mkdir -p "$REPORTS_DIR"

# ====================================
# 1. Audit d'accessibilité
# ====================================
echo -e "${YELLOW}[1/3]${NC} Lancement de l'audit d'accessibilité..."
ACCESSIBILITY_REPORT="$REPORTS_DIR/${TIMESTAMP}_accessibility.txt"

claude -p "Lance un audit d'accessibilité complet du portfolio en suivant les instructions de .claude/agents/accessibility-checker.md. Produis un rapport détaillé avec score sur 10 et actions prioritaires." \
  --allowedTools "Read,Grep,Glob" \
  > "$ACCESSIBILITY_REPORT" 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Audit d'accessibilité terminé${NC}"
  echo "   Rapport: $ACCESSIBILITY_REPORT"
else
  echo -e "${RED}❌ Erreur lors de l'audit d'accessibilité${NC}"
fi
echo ""

# ====================================
# 2. Revue de code
# ====================================
echo -e "${YELLOW}[2/3]${NC} Lancement de la revue de code..."
CODE_REVIEW_REPORT="$REPORTS_DIR/${TIMESTAMP}_code-review.txt"

claude -p "Lance une revue de code complète du portfolio en suivant les instructions de .claude/agents/code-reviewer.md. Évalue HTML, CSS et JS sur les 4 axes (lisibilité, performance, maintenabilité, bonnes pratiques). Donne une note /10 par fichier et 3 refactorings prioritaires." \
  --allowedTools "Read,Grep,Glob" \
  > "$CODE_REVIEW_REPORT" 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Revue de code terminée${NC}"
  echo "   Rapport: $CODE_REVIEW_REPORT"
else
  echo -e "${RED}❌ Erreur lors de la revue de code${NC}"
fi
echo ""

# ====================================
# 3. Checklist de déploiement
# ====================================
echo -e "${YELLOW}[3/3]${NC} Lancement de la checklist de déploiement..."
DEPLOY_CHECKLIST_REPORT="$REPORTS_DIR/${TIMESTAMP}_deploy-checklist.txt"

claude -p "Lance la checklist de déploiement en mode check en suivant les instructions de .claude/skills/deploy-checklist/SKILL.md. Vérifie tous les points (fichiers, HTML, CSS, JS, performance, accessibilité) et produis un rapport OK/KO avec score." \
  --allowedTools "Read,Grep,Glob,Bash" \
  > "$DEPLOY_CHECKLIST_REPORT" 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Checklist de déploiement terminée${NC}"
  echo "   Rapport: $DEPLOY_CHECKLIST_REPORT"
else
  echo -e "${RED}❌ Erreur lors de la checklist de déploiement${NC}"
fi
echo ""

# ====================================
# Résumé final
# ====================================
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Résumé de l'audit                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Extraire les scores (approximatifs, selon le format des rapports)
echo "📊 Rapports générés :"
echo "   1. Accessibilité : $ACCESSIBILITY_REPORT"
echo "   2. Code review   : $CODE_REVIEW_REPORT"
echo "   3. Déploiement   : $DEPLOY_CHECKLIST_REPORT"
echo ""

# Tenter d'extraire les scores
echo "🎯 Scores approximatifs :"

# Score accessibilité (recherche "/10")
if [ -f "$ACCESSIBILITY_REPORT" ]; then
  ACCESSIBILITY_SCORE=$(grep -oP '\d+(\.\d+)?/10' "$ACCESSIBILITY_REPORT" | head -1 || echo "N/A")
  echo "   • Accessibilité : $ACCESSIBILITY_SCORE"
fi

# Score code review (recherche "/10")
if [ -f "$CODE_REVIEW_REPORT" ]; then
  CODE_REVIEW_SCORE=$(grep -oP '\d+(\.\d+)?/10' "$CODE_REVIEW_REPORT" | head -1 || echo "N/A")
  echo "   • Code review   : $CODE_REVIEW_SCORE"
fi

# Score checklist (recherche "XX/YY")
if [ -f "$DEPLOY_CHECKLIST_REPORT" ]; then
  DEPLOY_SCORE=$(grep -oP '\d+/\d+' "$DEPLOY_CHECKLIST_REPORT" | head -1 || echo "N/A")
  echo "   • Déploiement   : $DEPLOY_SCORE"
fi

echo ""
echo -e "${GREEN}✅ Audit terminé !${NC}"
echo ""
echo "💡 Conseil : Compare ces rapports avec les précédents dans $REPORTS_DIR/"
echo "   pour suivre l'évolution de la qualité du code."
