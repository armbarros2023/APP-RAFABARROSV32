#!/bin/bash

# Script para verificar propagação DNS
# Clínica Rafael Barros

DOMAIN="clinica.iaaplicativos.com.br"
EXPECTED_IP="69.62.103.58"

echo "🔍 Verificando DNS para: $DOMAIN"
echo "IP esperado: $EXPECTED_IP"
echo ""

# Verificar DNS
echo "Consultando DNS..."
RESOLVED_IP=$(nslookup $DOMAIN 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)

if [ -z "$RESOLVED_IP" ]; then
    echo "❌ DNS ainda não propagado"
    echo ""
    echo "O domínio $DOMAIN ainda não resolve para nenhum IP."
    echo "Aguarde alguns minutos e tente novamente."
    echo ""
    echo "Para testar novamente, execute:"
    echo "  ./check-dns.sh"
    exit 1
fi

echo "✅ DNS resolvido para: $RESOLVED_IP"
echo ""

if [ "$RESOLVED_IP" == "$EXPECTED_IP" ]; then
    echo "🎉 SUCESSO! DNS configurado corretamente!"
    echo ""
    echo "Você pode prosseguir com o deploy:"
    echo "  ./deploy-clinica.sh"
else
    echo "⚠️  ATENÇÃO: IP diferente do esperado"
    echo "   Esperado: $EXPECTED_IP"
    echo "   Recebido: $RESOLVED_IP"
    echo ""
    echo "Verifique a configuração DNS no Registro.br"
fi
