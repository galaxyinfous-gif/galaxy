#!/bin/bash
# ============================================================
#  Migracao WordPress entre dominios no CyberPanel
#  Uso:  bash migrate-wp.sh
# ============================================================

set -e  # para na primeira falha

OLD_DOMAIN="tavareslandscape.com"
NEW_DOMAIN="tavareslandscaping.com"
OLD_PATH="/home/${OLD_DOMAIN}/public_html"
NEW_PATH="/home/${NEW_DOMAIN}/public_html"

echo ""
echo "=========================================="
echo " Migracao: ${OLD_DOMAIN} -> ${NEW_DOMAIN}"
echo "=========================================="
echo ""

# ---------- 1. Verificacoes basicas ----------
if [ ! -d "$OLD_PATH" ]; then
  echo "ERRO: pasta de origem nao existe: $OLD_PATH"
  exit 1
fi
if [ ! -d "$NEW_PATH" ]; then
  echo "ERRO: pasta de destino nao existe: $NEW_PATH"
  echo "Crie o site '${NEW_DOMAIN}' no CyberPanel antes de rodar este script."
  exit 1
fi
if [ ! -f "${OLD_PATH}/wp-config.php" ]; then
  echo "ERRO: ${OLD_PATH}/wp-config.php nao encontrado."
  exit 1
fi

# ---------- 2. Pega dados do banco ANTIGO ----------
echo ">> Lendo wp-config.php do site antigo..."
OLD_DB_NAME=$(grep "DB_NAME"     "${OLD_PATH}/wp-config.php" | cut -d "'" -f 4)
OLD_DB_USER=$(grep "DB_USER"     "${OLD_PATH}/wp-config.php" | cut -d "'" -f 4)
OLD_DB_PASS=$(grep "DB_PASSWORD" "${OLD_PATH}/wp-config.php" | cut -d "'" -f 4)
TABLE_PREFIX=$(grep "table_prefix" "${OLD_PATH}/wp-config.php" | cut -d "'" -f 2)
[ -z "$TABLE_PREFIX" ] && TABLE_PREFIX="wp_"

echo "   Banco antigo: $OLD_DB_NAME"
echo "   Prefixo tabelas: $TABLE_PREFIX"
echo ""

# ---------- 3. Pede dados do banco NOVO ----------
echo ">> ANTES DE CONTINUAR:"
echo "   Va no CyberPanel -> Databases -> Create Database"
echo "   Vincule ao site '${NEW_DOMAIN}' e anote os dados."
echo ""
read -p "Nome do banco NOVO: " NEW_DB_NAME
read -p "Usuario do banco NOVO: " NEW_DB_USER
read -s -p "Senha do banco NOVO: " NEW_DB_PASS
echo ""
echo ""

# ---------- 4. Senha do MySQL root ----------
MYSQL_ROOT_PASS=$(cat /etc/cyberpanel/mysqlPassword 2>/dev/null || echo "")
if [ -z "$MYSQL_ROOT_PASS" ]; then
  read -s -p "Senha do MySQL root: " MYSQL_ROOT_PASS
  echo ""
fi

# ---------- 5. Copia arquivos ----------
echo ">> Copiando arquivos..."
cp -a "${OLD_PATH}/." "${NEW_PATH}/"
echo "   OK"

# ---------- 6. Permissoes ----------
echo ">> Ajustando permissoes..."
NEW_USER=$(stat -c "%U" "$NEW_PATH")
NEW_GROUP=$(stat -c "%G" "$NEW_PATH")
chown -R "${NEW_USER}:${NEW_GROUP}" "$NEW_PATH"
find "$NEW_PATH" -type d -exec chmod 755 {} \;
find "$NEW_PATH" -type f -exec chmod 644 {} \;
chmod 600 "${NEW_PATH}/wp-config.php"
echo "   OK (dono: ${NEW_USER}:${NEW_GROUP})"

# ---------- 7. Dump e import do banco ----------
echo ">> Exportando banco antigo..."
mysqldump -u root -p"${MYSQL_ROOT_PASS}" "$OLD_DB_NAME" > /tmp/wp_migrate_dump.sql
echo "   OK"

echo ">> Importando no banco novo..."
mysql -u root -p"${MYSQL_ROOT_PASS}" "$NEW_DB_NAME" < /tmp/wp_migrate_dump.sql
rm /tmp/wp_migrate_dump.sql
echo "   OK"

# ---------- 8. Atualiza wp-config.php do site novo ----------
echo ">> Atualizando wp-config.php do site novo..."
WPCONF="${NEW_PATH}/wp-config.php"
sed -i "s/define( *'DB_NAME'.*/define('DB_NAME', '${NEW_DB_NAME}');/"     "$WPCONF"
sed -i "s/define( *'DB_USER'.*/define('DB_USER', '${NEW_DB_USER}');/"     "$WPCONF"
sed -i "s/define( *'DB_PASSWORD'.*/define('DB_PASSWORD', '${NEW_DB_PASS}');/" "$WPCONF"
echo "   OK"

# ---------- 9. Atualiza URLs no banco ----------
echo ">> Atualizando URLs no banco..."
mysql -u root -p"${MYSQL_ROOT_PASS}" "$NEW_DB_NAME" <<SQL
UPDATE ${TABLE_PREFIX}options SET option_value='https://${NEW_DOMAIN}' WHERE option_name='siteurl';
UPDATE ${TABLE_PREFIX}options SET option_value='https://${NEW_DOMAIN}' WHERE option_name='home';
UPDATE ${TABLE_PREFIX}posts    SET guid         = REPLACE(guid,         '${OLD_DOMAIN}', '${NEW_DOMAIN}');
UPDATE ${TABLE_PREFIX}posts    SET post_content = REPLACE(post_content, '${OLD_DOMAIN}', '${NEW_DOMAIN}');
UPDATE ${TABLE_PREFIX}postmeta SET meta_value   = REPLACE(meta_value,   '${OLD_DOMAIN}', '${NEW_DOMAIN}')
       WHERE meta_value NOT LIKE 'a:%' AND meta_value NOT LIKE 's:%';
SQL
echo "   OK"

# ---------- 10. Reinicia servicos ----------
echo ">> Reiniciando servicos..."
systemctl restart lsws    >/dev/null 2>&1 || service lsws restart
systemctl restart mariadb >/dev/null 2>&1 || systemctl restart mysql >/dev/null 2>&1 || true
echo "   OK"

# ---------- 11. Teste rapido ----------
echo ""
echo "=========================================="
echo " Migracao concluida!"
echo "=========================================="
echo ""
echo "Proximos passos manuais:"
echo "  1. CyberPanel -> Websites -> Manage (${NEW_DOMAIN}) -> SSL -> Issue SSL"
echo "  2. Abra https://${NEW_DOMAIN} no navegador"
echo "  3. Entre em /wp-admin com o mesmo login do site antigo"
echo "  4. Va em Settings -> Permalinks -> Save Changes"
echo ""
echo "Teste de resposta HTTP:"
curl -sI "https://${NEW_DOMAIN}" | head -n 1 || echo "  (curl falhou - SSL pode nao estar emitido ainda)"
echo ""
